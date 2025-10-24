#!/usr/bin/env tsx
/**
 * Bulk Generation Script: ServiceLocation Documents
 *
 * Generates ALL possible service+location combinations for existing data.
 * Run this once after implementing the serviceLocation feature to backfill.
 *
 * Usage:
 *   pnpm tsx scripts/generate-all-service-locations.ts
 *   pnpm tsx scripts/generate-all-service-locations.ts --dry-run
 */

import { writeClient } from '../src/sanity/writeClient'

interface ServiceRecord {
  _id: string
  title: string
  slug: { current: string }
}

interface LocationRecord {
  _id: string
  city: string
  state: string
  slug: { current: string }
}

async function generateAllServiceLocations(dryRun = false) {
  console.log('🔄 Fetching services and locations...\n')

  if (!writeClient) {
    throw new Error('Write client is not initialized')
  }

  // Fetch all services and locations
  const services: ServiceRecord[] = await writeClient.fetch(
    `*[_type == "service" && defined(slug.current)]{ _id, title, slug }`
  )

  const locations: LocationRecord[] = await writeClient.fetch(
    `*[_type == "location" && defined(slug.current)]{ _id, city, state, slug }`
  )

  console.log(`✓ Found ${services.length} services`)
  console.log(`✓ Found ${locations.length} locations`)
  console.log(`→ Will generate ${services.length * locations.length} combinations\n`)

  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No documents will be created\n')
  }

  let created = 0
  let skipped = 0
  const errors: string[] = []

  // Generate all combinations
  for (const service of services) {
    for (const location of locations) {
      if (!service.slug?.current || !location.slug?.current) {
        errors.push(`❌ Missing slug: ${service.title} or ${location.city}`)
        continue
      }

      const slug = `${service.slug.current}-${location.slug.current}`
      const title = `${service.title} in ${location.city}`

      // Check if already exists
      const existing = await writeClient.fetch(
        `*[_type == "serviceLocation" && slug.current == $slug][0]._id`,
        { slug }
      )

      if (existing) {
        console.log(`⏭️  Skipped: ${title} (already exists)`)
        skipped++
        continue
      }

      if (dryRun) {
        console.log(`✓ Would create: ${title}`)
        created++
        continue
      }

      // Create new serviceLocation document
      try {
        await writeClient.create({
          _type: 'serviceLocation',
          title,
          slug: { _type: 'slug', current: slug },
          service: { _type: 'reference', _ref: service._id },
          location: { _type: 'reference', _ref: location._id },
          contentSource: 'inherit', // Default to inherit content from service
          publishedAt: new Date().toISOString(),
        })

        console.log(`✅ Created: ${title}`)
        created++
      } catch (error) {
        errors.push(`❌ Failed to create ${title}: ${String(error)}`)
      }
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 GENERATION SUMMARY')
  console.log('='.repeat(60))
  console.log(`✅ Created: ${created}`)
  console.log(`⏭️  Skipped: ${skipped}`)
  console.log(`❌ Errors: ${errors.length}`)

  if (errors.length > 0) {
    console.log('\n❌ ERRORS:')
    errors.forEach((err) => console.log(`  ${err}`))
  }

  if (dryRun) {
    console.log('\n💡 Run without --dry-run to create documents')
  } else {
    console.log('\n✅ Bulk generation complete!')
  }
}

// Parse CLI args
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')

// Run
generateAllServiceLocations(dryRun).catch((error) => {
  console.error('💥 Fatal error:', error)
  process.exit(1)
})
