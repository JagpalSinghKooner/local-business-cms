import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/writeClient'
import { validateServiceLocationCreate, SchemaValidationError } from '@/lib/sanity/schema-validators'

interface ServiceRecord {
  _id: string
  title: string
  slug: { current: string }
}

interface LocationRecord {
  _id: string
  city: string
  slug: { current: string }
}

/**
 * API Route: Auto-generate serviceLocation documents
 *
 * Called by:
 * 1. Document actions when service/location is published
 * 2. Bulk generation script
 * 3. Manual trigger from Studio
 *
 * Query params:
 * - mode: 'single' (one service/location) or 'bulk' (all combinations)
 * - serviceId: specific service to generate (for single mode)
 * - locationId: specific location to generate (for single mode)
 */
export async function POST(request: NextRequest) {
  try {
    const { mode, serviceId, locationId } = await request.json()

    if (mode === 'single') {
      if (!serviceId && !locationId) {
        return NextResponse.json(
          { error: 'serviceId or locationId required for single mode' },
          { status: 400 }
        )
      }

      // Generate for one service across all locations OR one location across all services
      const result = await generateSingleBatch(serviceId, locationId)
      return NextResponse.json(result)
    }

    if (mode === 'bulk') {
      // Generate for ALL services x locations
      const result = await generateBulk()
      return NextResponse.json(result)
    }

    return NextResponse.json(
      { error: 'Invalid mode. Use "single" or "bulk"' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error generating serviceLocations:', error)
    return NextResponse.json(
      { error: 'Failed to generate serviceLocations', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * Generate serviceLocations for a specific service or location
 */
async function generateSingleBatch(
  serviceId?: string,
  locationId?: string
): Promise<{ created: number; skipped: number; errors: string[] }> {
  const errors: string[] = []
  let created = 0
  let skipped = 0

  if (!writeClient) {
    errors.push('Write client is not initialized')
    return { created, skipped, errors }
  }

  try {
    // Fetch services and locations
    const services: ServiceRecord[] = serviceId
      ? await writeClient.fetch(`*[_type == "service" && _id == $id]{ _id, title, slug }`, {
          id: serviceId,
        })
      : await writeClient.fetch(`*[_type == "service"]{ _id, title, slug }`)

    const locations: LocationRecord[] = locationId
      ? await writeClient.fetch(`*[_type == "location" && _id == $id]{ _id, city, slug }`, {
          id: locationId,
        })
      : await writeClient.fetch(`*[_type == "location"]{ _id, city, slug }`)

    // Generate all combinations
    for (const service of services) {
      for (const location of locations) {
        if (!service.slug?.current || !location.slug?.current) {
          errors.push(`Missing slug: ${service.title} or ${location.city}`)
          continue
        }

        const slug = `${service.slug.current}-${location.slug.current}`

        // Check if already exists
        const existing = await writeClient.fetch(
          `*[_type == "serviceLocation" && slug.current == $slug][0]`,
          { slug }
        )

        if (existing) {
          skipped++
          continue
        }

        // Create new serviceLocation document with validation
        try {
          const documentData = {
            _type: 'serviceLocation' as const,
            title: `${service.title} in ${location.city}`,
            slug: { _type: 'slug' as const, current: slug },
            service: { _type: 'reference' as const, _ref: service._id },
            location: { _type: 'reference' as const, _ref: location._id },
            contentSource: 'inherit' as const,
            publishedAt: new Date().toISOString(),
          }

          // Enterprise validation: Ensure document matches schema
          const validatedData = validateServiceLocationCreate(documentData)

          await writeClient.create(validatedData)
          created++
        } catch (validationError) {
          if (validationError instanceof SchemaValidationError) {
            errors.push(`Validation failed for ${slug}: ${JSON.stringify(validationError.toJSON())}`)
            continue
          }
          throw validationError
        }
      }
    }

    return { created, skipped, errors }
  } catch (error) {
    errors.push(`Fatal error: ${String(error)}`)
    return { created, skipped, errors }
  }
}

/**
 * Generate ALL serviceLocation combinations (bulk mode)
 */
async function generateBulk(): Promise<{
  created: number
  skipped: number
  errors: string[]
}> {
  return generateSingleBatch() // No filters = all combinations
}
