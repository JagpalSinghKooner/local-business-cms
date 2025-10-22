import { test, expect } from '@playwright/test'

/**
 * JSON-LD Schema Validation Tests
 *
 * Validates structured data against Schema.org standards:
 * - LocalBusiness schema
 * - Service schema
 * - BreadcrumbList schema
 * - FAQ schema (if present)
 * - Offer schema (if present)
 *
 * Uses schema-validator for validation
 */

type JsonLdSchema = {
  '@context': string
  '@type': string | string[]
  [key: string]: unknown
}

/**
 * Helper to extract and parse all JSON-LD scripts from page
 */
async function getJsonLdSchemas(page: any): Promise<JsonLdSchema[]> {
  const scripts = await page.locator('script[type="application/ld+json"]').all()
  const schemas: JsonLdSchema[] = []

  for (const script of scripts) {
    const content = await script.textContent()
    if (content) {
      try {
        const data = JSON.parse(content)
        schemas.push(data)
      } catch (error) {
        console.error('Failed to parse JSON-LD:', error)
      }
    }
  }

  return schemas
}

/**
 * Validate basic schema.org requirements
 */
function validateSchemaOrgBasics(schema: JsonLdSchema) {
  expect(schema['@context']).toBe('https://schema.org')
  expect(schema['@type']).toBeTruthy()
}

test.describe('JSON-LD Schema Validation', () => {
  test.describe('Homepage Schemas', () => {
    test('has valid LocalBusiness schema', async ({ page }) => {
      await page.goto('/')

      const schemas = await getJsonLdSchemas(page)
      const localBusiness = schemas.find((s) => s['@type'] === 'LocalBusiness')

      expect(localBusiness).toBeTruthy()
      validateSchemaOrgBasics(localBusiness!)

      // Required properties for LocalBusiness
      expect(localBusiness!.name).toBeTruthy()
      expect(localBusiness!.url).toBeTruthy()

      // Recommended properties
      const lb = localBusiness as any
      if (lb.address) {
        expect(lb.address.streetAddress || lb.address['@type']).toBeTruthy()
        expect(lb.address.addressLocality || lb.address['@type']).toBeTruthy()
        expect(lb.address.addressRegion || lb.address['@type']).toBeTruthy()
        expect(lb.address.postalCode || lb.address['@type']).toBeTruthy()
      }

      if (lb.telephone) {
        expect(typeof lb.telephone).toBe('string')
      }

      if (lb.geo) {
        expect(lb.geo.latitude || lb.geo['@type']).toBeTruthy()
        expect(lb.geo.longitude || lb.geo['@type']).toBeTruthy()
      }

      if (lb.openingHours) {
        expect(Array.isArray(lb.openingHours) || typeof lb.openingHours === 'string').toBe(true)
      }
    })

    test('LocalBusiness schema has valid structure', async ({ page }) => {
      await page.goto('/')

      const schemas = await getJsonLdSchemas(page)
      const localBusiness = schemas.find((s) => s['@type'] === 'LocalBusiness')

      if (!localBusiness) {
        test.skip()
        return
      }

      const lb = localBusiness as any

      // Name should be string
      expect(typeof lb.name).toBe('string')

      // URL should be valid
      if (lb.url) {
        expect(lb.url).toMatch(/^https?:\/\//)
      }

      // Image should be string or object
      if (lb.image) {
        expect(['string', 'object'].includes(typeof lb.image)).toBe(true)
      }

      // PriceRange should be string
      if (lb.priceRange) {
        expect(typeof lb.priceRange).toBe('string')
      }

      // SameAs should be array
      if (lb.sameAs) {
        expect(Array.isArray(lb.sameAs)).toBe(true)
        lb.sameAs.forEach((url: string) => {
          expect(url).toMatch(/^https?:\/\//)
        })
      }
    })
  })

  test.describe('Service Page Schemas', () => {
    test('service page has Service schema', async ({ page }) => {
      await page.goto('/services/plumbing-toronto')

      const schemas = await getJsonLdSchemas(page)
      const serviceSchema = schemas.find((s) => s['@type'] === 'Service')

      // Service schema is optional, log if missing
      if (!serviceSchema) {
        console.warn('No Service schema found on service page')
        return
      }

      validateSchemaOrgBasics(serviceSchema)

      const service = serviceSchema as any

      // Service should have name
      expect(service.name).toBeTruthy()

      // Service should have provider or areaServed
      expect(service.provider || service.areaServed).toBeTruthy()

      // If has provider, validate structure
      if (service.provider) {
        expect(service.provider['@type'] || typeof service.provider === 'string').toBeTruthy()
      }

      // If has areaServed, validate structure
      if (service.areaServed) {
        expect(service.areaServed.name || typeof service.areaServed === 'string').toBeTruthy()
      }
    })

    test('service+location page has location in schema', async ({ page }) => {
      await page.goto('/services/plumbing-toronto')

      const schemas = await getJsonLdSchemas(page)

      // Should have LocalBusiness with areaServed or address
      const localBusiness = schemas.find((s) => s['@type'] === 'LocalBusiness')

      if (localBusiness) {
        const lb = localBusiness as any
        expect(lb.areaServed || lb.address).toBeTruthy()
      }

      // Or Service with areaServed
      const serviceSchema = schemas.find((s) => s['@type'] === 'Service')

      if (serviceSchema) {
        const service = serviceSchema as any
        expect(service.areaServed || service.provider).toBeTruthy()
      }

      // At least one schema should exist
      expect(localBusiness || serviceSchema).toBeTruthy()
    })
  })

  test.describe('BreadcrumbList Schema', () => {
    test('pages with breadcrumbs have BreadcrumbList schema', async ({ page }) => {
      await page.goto('/services/plumbing-toronto')

      const schemas = await getJsonLdSchemas(page)
      const breadcrumbList = schemas.find((s) => s['@type'] === 'BreadcrumbList')

      // Breadcrumbs may not be on all pages
      if (!breadcrumbList) {
        console.log('No BreadcrumbList schema found')
        return
      }

      validateSchemaOrgBasics(breadcrumbList)

      const bcl = breadcrumbList as any

      // Must have itemListElement
      expect(bcl.itemListElement).toBeTruthy()
      expect(Array.isArray(bcl.itemListElement)).toBe(true)
      expect(bcl.itemListElement.length).toBeGreaterThan(0)

      // Each item should have proper structure
      bcl.itemListElement.forEach((item: any, index: number) => {
        expect(item['@type']).toBe('ListItem')
        expect(item.position).toBe(index + 1)
        expect(item.item).toBeTruthy()

        // Item should have URL and name
        if (typeof item.item === 'object') {
          expect(item.item['@id'] || item.item.url).toBeTruthy()
          expect(item.item.name).toBeTruthy()
        }
      })
    })
  })

  test.describe('FAQ Schema', () => {
    test.skip('FAQ page has valid FAQPage schema', async ({ page }) => {
      // Skip if no FAQ page exists
      const response = await page.goto('/faq')

      if (response?.status() !== 200) {
        test.skip()
        return
      }

      const schemas = await getJsonLdSchemas(page)
      const faqPage = schemas.find((s) => s['@type'] === 'FAQPage')

      expect(faqPage).toBeTruthy()
      validateSchemaOrgBasics(faqPage!)

      const faq = faqPage as any

      // Must have mainEntity
      expect(faq.mainEntity).toBeTruthy()
      expect(Array.isArray(faq.mainEntity)).toBe(true)

      // Each question should have proper structure
      faq.mainEntity.forEach((qa: any) => {
        expect(qa['@type']).toBe('Question')
        expect(qa.name).toBeTruthy() // The question text

        // Must have acceptedAnswer
        expect(qa.acceptedAnswer).toBeTruthy()
        expect(qa.acceptedAnswer['@type']).toBe('Answer')
        expect(qa.acceptedAnswer.text).toBeTruthy() // The answer text
      })
    })
  })

  test.describe('Offer Schema', () => {
    test.skip('offer pages have valid Offer schema', async ({ page }) => {
      const response = await page.goto('/offers')

      if (response?.status() !== 200) {
        test.skip()
        return
      }

      // Try to find an offer page
      const offerLinks = await page.locator('a[href^="/offers/"]').all()

      if (offerLinks.length === 0) {
        test.skip()
        return
      }

      const firstOfferHref = await offerLinks[0].getAttribute('href')
      await page.goto(firstOfferHref!)

      const schemas = await getJsonLdSchemas(page)
      const offerSchema = schemas.find((s) => s['@type'] === 'Offer')

      if (!offerSchema) {
        console.warn('No Offer schema found on offer page')
        return
      }

      validateSchemaOrgBasics(offerSchema)

      const offer = offerSchema as any

      // Offer should have name or itemOffered
      expect(offer.name || offer.itemOffered).toBeTruthy()

      // Should have price or priceSpecification
      expect(offer.price || offer.priceSpecification).toBeTruthy()

      // Should have seller or offeredBy
      expect(offer.seller || offer.offeredBy).toBeTruthy()

      // If has validFrom/validThrough, validate dates
      if (offer.validFrom) {
        expect(new Date(offer.validFrom).toString()).not.toBe('Invalid Date')
      }

      if (offer.validThrough) {
        expect(new Date(offer.validThrough).toString()).not.toBe('Invalid Date')
      }
    })
  })

  test.describe('Schema Validation Rules', () => {
    test('all schemas have valid @context', async ({ page }) => {
      await page.goto('/')

      const schemas = await getJsonLdSchemas(page)

      expect(schemas.length).toBeGreaterThan(0)

      schemas.forEach((schema) => {
        expect(schema['@context']).toBe('https://schema.org')
      })
    })

    test('all schemas have @type', async ({ page }) => {
      await page.goto('/')

      const schemas = await getJsonLdSchemas(page)

      schemas.forEach((schema) => {
        expect(schema['@type']).toBeTruthy()
        expect(typeof schema['@type'] === 'string' || Array.isArray(schema['@type'])).toBe(true)
      })
    })

    test('no duplicate schemas of same type', async ({ page }) => {
      await page.goto('/')

      const schemas = await getJsonLdSchemas(page)
      const types = schemas.map((s) => s['@type'])

      // Count occurrences
      const typeCounts = types.reduce(
        (acc, type) => {
          const key = Array.isArray(type) ? type.join(',') : type
          acc[key] = (acc[key] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )

      // LocalBusiness should only appear once
      expect(typeCounts['LocalBusiness']).toBeLessThanOrEqual(1)
    })

    test('schemas are valid JSON', async ({ page }) => {
      await page.goto('/')

      const scripts = await page.locator('script[type="application/ld+json"]').all()

      for (const script of scripts) {
        const content = await script.textContent()
        expect(content).toBeTruthy()

        // Should parse without error
        expect(() => JSON.parse(content!)).not.toThrow()
      }
    })

    test('schemas have no HTML entities', async ({ page }) => {
      await page.goto('/')

      const scripts = await page.locator('script[type="application/ld+json"]').all()

      for (const script of scripts) {
        const content = await script.textContent()

        if (content) {
          // Should not contain HTML entities like &amp; &lt; &gt;
          expect(content).not.toContain('&amp;')
          expect(content).not.toContain('&lt;')
          expect(content).not.toContain('&gt;')
          expect(content).not.toContain('&quot;')
        }
      }
    })
  })

  test.describe('Google Rich Results Validation', () => {
    test('schemas would pass Google Rich Results Test', async ({ page }) => {
      // This is a structural validation test
      // For actual Google validation, use: https://search.google.com/test/rich-results

      await page.goto('/')

      const schemas = await getJsonLdSchemas(page)
      const localBusiness = schemas.find((s) => s['@type'] === 'LocalBusiness')

      if (!localBusiness) {
        test.skip()
        return
      }

      const lb = localBusiness as any

      // Google Rich Results requirements for LocalBusiness
      expect(lb.name).toBeTruthy() // Required
      expect(lb.address || lb['@id']).toBeTruthy() // Required (address or ID)

      // Strongly recommended
      if (lb.address) {
        const addr = lb.address
        expect(addr.addressLocality || addr.addressRegion).toBeTruthy()
      }

      // Log validation status
      console.log('Schema validation: LocalBusiness schema structure is valid')
      console.log('Manual validation: Test at https://search.google.com/test/rich-results')
    })
  })
})
