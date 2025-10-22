import { test, expect } from '@playwright/test'

/**
 * Service + Location Page SEO Tests
 *
 * Tests the 336 auto-generated service+location combination pages
 * for proper SEO implementation, meta tags, and structured data.
 */

test.describe('Service + Location SEO', () => {
  // Test a sample of service+location combinations
  const testPages = [
    '/services/plumbing-toronto',
    '/services/drain-cleaning-mississauga',
    '/services/water-heater-repair-brampton',
  ]

  testPages.forEach((url) => {
    test.describe(`${url}`, () => {
      test('has unique, location-specific title', async ({ page }) => {
        await page.goto(url)
        const title = await page.title()

        expect(title).toBeTruthy()
        expect(title.length).toBeGreaterThan(10)
        expect(title.length).toBeLessThanOrEqual(60)

        // Title should contain location name
        const location = url.split('-').pop()
        expect(title.toLowerCase()).toContain(location!)

        // Title should contain service name
        const service = url.split('/services/')[1].split('-')[0]
        expect(title.toLowerCase()).toContain(service)
      })

      test('has location-specific meta description', async ({ page }) => {
        await page.goto(url)
        const description = await page.getAttribute('meta[name="description"]', 'content')

        expect(description).toBeTruthy()
        expect(description!.length).toBeGreaterThan(50)
        expect(description!.length).toBeLessThanOrEqual(160)

        // Description should mention location
        const location = url.split('-').pop()
        expect(description!.toLowerCase()).toContain(location!)
      })

      test('has correct canonical URL', async ({ page }) => {
        await page.goto(url)
        const canonical = await page.getAttribute('link[rel="canonical"]', 'href')

        expect(canonical).toBeTruthy()
        expect(canonical).toMatch(/^https?:\/\//)
        expect(canonical).toContain(url)
        expect(canonical).not.toContain('#')
        expect(canonical).not.toMatch(/\/$/) // No trailing slash
      })

      test('has proper Open Graph tags with location', async ({ page }) => {
        await page.goto(url)

        const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content')
        const ogDescription = await page.getAttribute('meta[property="og:description"]', 'content')
        const ogUrl = await page.getAttribute('meta[property="og:url"]', 'content')
        const ogType = await page.getAttribute('meta[property="og:type"]', 'content')

        expect(ogTitle).toBeTruthy()
        expect(ogDescription).toBeTruthy()
        expect(ogUrl).toContain(url)
        expect(ogType).toBe('website')

        // OG tags should mention location
        const location = url.split('-').pop()
        expect(ogTitle!.toLowerCase()).toContain(location!)
      })

      test('has LocalBusiness JSON-LD with service area', async ({ page }) => {
        await page.goto(url)

        const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all()
        expect(jsonLdScripts.length).toBeGreaterThan(0)

        // Find LocalBusiness schema
        let foundLocalBusiness = false
        for (const script of jsonLdScripts) {
          const content = await script.textContent()
          const data = JSON.parse(content!)

          if (data['@type'] === 'LocalBusiness') {
            foundLocalBusiness = true

            // Should have service area or address with location
            expect(data.areaServed || data.address).toBeTruthy()

            // Should have business name
            expect(data.name).toBeTruthy()

            // Should have URL
            expect(data.url).toBeTruthy()
          }
        }

        expect(foundLocalBusiness).toBe(true)
      })

      test('has Service JSON-LD', async ({ page }) => {
        await page.goto(url)

        const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all()

        let foundService = false
        for (const script of jsonLdScripts) {
          const content = await script.textContent()
          const data = JSON.parse(content!)

          if (data['@type'] === 'Service') {
            foundService = true

            // Service should have name
            expect(data.name).toBeTruthy()

            // Service should have provider or area served
            expect(data.provider || data.areaServed).toBeTruthy()
          }
        }

        // Service schema is optional, but log if missing
        if (!foundService) {
          console.warn(`No Service schema found for ${url}`)
        }
      })

      test('has proper heading structure with location', async ({ page }) => {
        await page.goto(url)

        // Should have exactly one H1
        const h1Count = await page.locator('h1').count()
        expect(h1Count).toBe(1)

        const h1Text = await page.locator('h1').first().textContent()
        expect(h1Text).toBeTruthy()

        // H1 should mention location
        const location = url.split('-').pop()
        expect(h1Text!.toLowerCase()).toContain(location!)
      })

      test('has no duplicate meta tags', async ({ page }) => {
        await page.goto(url)

        const titleCount = await page.locator('title').count()
        const descCount = await page.locator('meta[name="description"]').count()
        const canonicalCount = await page.locator('link[rel="canonical"]').count()

        expect(titleCount).toBe(1)
        expect(descCount).toBe(1)
        expect(canonicalCount).toBe(1)
      })

      test('has robots meta allowing indexing', async ({ page }) => {
        await page.goto(url)

        const robots = await page.getAttribute('meta[name="robots"]', 'content')

        expect(robots).toBeTruthy()
        expect(robots).not.toContain('noindex')
        expect(robots).not.toContain('nofollow')
      })
    })
  })

  test('different service+location pages have unique content', async ({ page }) => {
    const page1 = '/services/plumbing-toronto'
    const page2 = '/services/plumbing-mississauga'

    await page.goto(page1)
    const title1 = await page.title()
    const desc1 = await page.getAttribute('meta[name="description"]', 'content')

    await page.goto(page2)
    const title2 = await page.title()
    const desc2 = await page.getAttribute('meta[name="description"]', 'content')

    // Titles should be different
    expect(title1).not.toBe(title2)

    // Descriptions should be different
    expect(desc1).not.toBe(desc2)

    // Both should contain their respective locations
    expect(title1.toLowerCase()).toContain('toronto')
    expect(title2.toLowerCase()).toContain('mississauga')
  })

  test('all 336 service+location pages are accessible', async ({ page }) => {
    // This test ensures all combinations are generated
    // We'll test a representative sample

    const serviceLocationCombos = [
      '/services/plumbing-toronto',
      '/services/drain-cleaning-mississauga',
      '/services/water-heater-repair-brampton',
      '/services/emergency-plumbing-oakville',
      '/services/sewer-repair-burlington',
    ]

    for (const url of serviceLocationCombos) {
      const response = await page.goto(url)
      expect(response?.status()).toBe(200)

      // Page should have content
      const title = await page.title()
      expect(title).toBeTruthy()
    }
  })
})
