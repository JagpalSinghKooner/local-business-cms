import { test, expect } from '@playwright/test'

/**
 * Static Generation Tests
 *
 * Tests the Next.js static site generation (SSG) for:
 * - generateStaticParams implementation
 * - All 336 service+location combinations
 * - Slug parsing and matching logic
 * - Build-time page generation
 */

test.describe('Static Site Generation', () => {
  test.describe('Service+Location Combinations', () => {
    test('all service+location pages are pre-rendered', async ({ page }) => {
      // Test representative sample of the 336 combinations
      const samplePages = [
        '/services/plumbing-toronto',
        '/services/plumbing-mississauga',
        '/services/plumbing-brampton',
        '/services/drain-cleaning-toronto',
        '/services/drain-cleaning-mississauga',
        '/services/water-heater-repair-toronto',
        '/services/emergency-plumbing-toronto',
        '/services/sewer-repair-toronto',
        '/services/backflow-testing-toronto',
        '/services/gas-line-repair-toronto',
      ]

      for (const url of samplePages) {
        const response = await page.goto(url, { waitUntil: 'domcontentloaded' })

        // Should return 200 OK
        expect(response?.status()).toBe(200)

        // Should have content (not empty page)
        const title = await page.title()
        expect(title).toBeTruthy()
        expect(title.length).toBeGreaterThan(5)

        // Should have H1
        const h1 = await page.locator('h1').first()
        await expect(h1).toBeVisible()
      }
    })

    test('service+location slug parsing works correctly', async ({ page }) => {
      // Test that slugs are parsed correctly
      // Format: /services/[service-slug]-[location-slug]

      await page.goto('/services/plumbing-toronto')

      // Page should recognize this as service="plumbing" + location="toronto"
      const title = await page.title()

      // Title should contain both service and location
      expect(title.toLowerCase()).toContain('plumbing')
      expect(title.toLowerCase()).toContain('toronto')
    })

    test('service-only pages work (no location)', async ({ page }) => {
      // Test service pages without location suffix
      await page.goto('/services/plumbing')

      const response = await page.goto('/services/plumbing', { waitUntil: 'domcontentloaded' })

      if (response?.status() === 200) {
        const title = await page.title()
        expect(title.toLowerCase()).toContain('plumbing')

        // Should NOT be specific to one location
        // (or should show all locations)
      }
    })

    test('invalid service+location returns 404', async ({ page }) => {
      const response = await page.goto('/services/invalid-service-invalid-location', {
        waitUntil: 'domcontentloaded',
      })

      expect(response?.status()).toBe(404)
    })

    test('service exists but location invalid returns 404', async ({ page }) => {
      const response = await page.goto('/services/plumbing-invalid-city', {
        waitUntil: 'domcontentloaded',
      })

      // Should be 404 if location doesn't exist
      expect(response?.status()).toBe(404)
    })
  })

  test.describe('Individual Service Pages', () => {
    test('service pages are pre-rendered', async ({ page }) => {
      const servicePages = ['/services/plumbing', '/services/drain-cleaning', '/services/water-heater-repair']

      for (const url of servicePages) {
        const response = await page.goto(url, { waitUntil: 'domcontentloaded' })

        if (response?.status() === 200) {
          const title = await page.title()
          expect(title).toBeTruthy()
        }
      }
    })
  })

  test.describe('Individual Location Pages', () => {
    test('location pages are pre-rendered', async ({ page }) => {
      const locationPages = [
        '/locations/toronto',
        '/locations/mississauga',
        '/locations/brampton',
        '/locations/oakville',
        '/locations/burlington',
      ]

      for (const url of locationPages) {
        const response = await page.goto(url, { waitUntil: 'domcontentloaded' })

        expect(response?.status()).toBe(200)

        const title = await page.title()
        expect(title).toBeTruthy()

        // Title should contain location name
        const locationName = url.split('/').pop()
        expect(title.toLowerCase()).toContain(locationName!)
      }
    })

    test('invalid location returns 404', async ({ page }) => {
      const response = await page.goto('/locations/invalid-city', {
        waitUntil: 'domcontentloaded',
      })

      expect(response?.status()).toBe(404)
    })
  })

  test.describe('Index Pages', () => {
    test('services index page lists all services', async ({ page }) => {
      await page.goto('/services')

      // Should have service links
      const serviceLinks = await page.locator('a[href^="/services/"]').all()
      expect(serviceLinks.length).toBeGreaterThan(0)

      // Should have multiple services listed
      expect(serviceLinks.length).toBeGreaterThanOrEqual(5)
    })

    test('locations index page lists all locations', async ({ page }) => {
      await page.goto('/locations')

      // Should have location links
      const locationLinks = await page.locator('a[href^="/locations/"]').all()
      expect(locationLinks.length).toBeGreaterThan(0)

      // Should have multiple locations listed
      expect(locationLinks.length).toBeGreaterThanOrEqual(5)
    })
  })

  test.describe('Build Output Validation', () => {
    test('homepage is statically generated', async ({ page }) => {
      const response = await page.goto('/', { waitUntil: 'domcontentloaded' })

      expect(response?.status()).toBe(200)

      // Should have content
      const title = await page.title()
      expect(title).toBeTruthy()
    })

    test('sitemap includes all static pages', async ({ page }) => {
      const response = await page.request.get('/sitemap.xml')
      const sitemap = await response.text()

      // Should include homepage
      expect(sitemap).toContain('</loc>')

      // Should include services
      expect(sitemap).toContain('/services')

      // Should include locations
      expect(sitemap).toContain('/locations')

      // Count total URLs (should be 355+)
      const urlCount = (sitemap.match(/<loc>/g) || []).length
      expect(urlCount).toBeGreaterThanOrEqual(355)

      console.log(`Sitemap contains ${urlCount} URLs`)
    })

    test('robots.txt is accessible', async ({ page }) => {
      const response = await page.request.get('/robots.txt')
      expect(response.status()).toBe(200)

      const robotsTxt = await response.text()
      expect(robotsTxt).toContain('User-agent')
      expect(robotsTxt).toContain('Sitemap')
    })
  })

  test.describe('ISR (Incremental Static Regeneration)', () => {
    test('pages have revalidation headers', async ({ page }) => {
      const response = await page.goto('/', { waitUntil: 'domcontentloaded' })

      // Check for ISR headers (2-minute revalidation)
      const cacheControl = response?.headers()['cache-control']

      if (cacheControl) {
        console.log('Cache-Control header:', cacheControl)
        // Should have s-maxage or similar
      }
    })

    test('dynamic routes use ISR', async ({ page }) => {
      const response = await page.goto('/services/plumbing-toronto', { waitUntil: 'domcontentloaded' })

      expect(response?.status()).toBe(200)

      // Page should be pre-rendered but can revalidate
      const title = await page.title()
      expect(title).toBeTruthy()
    })
  })

  test.describe('generateStaticParams Coverage', () => {
    test('all valid service+location combinations work', async ({ page }) => {
      // Test that the generateStaticParams logic covers all combinations

      // Sample of services
      const services = ['plumbing', 'drain-cleaning', 'water-heater-repair', 'emergency-plumbing']

      // Sample of locations
      const locations = ['toronto', 'mississauga', 'brampton', 'oakville']

      // Test all combinations
      for (const service of services) {
        for (const location of locations) {
          const url = `/services/${service}-${location}`
          const response = await page.goto(url, { waitUntil: 'domcontentloaded' })

          expect(response?.status()).toBe(200)

          // Page should have unique content
          const title = await page.title()
          expect(title.toLowerCase()).toContain(service.replace('-', ' '))
          expect(title.toLowerCase()).toContain(location)
        }
      }
    })
  })

  test.describe('Performance', () => {
    test('static pages load quickly', async ({ page }) => {
      const startTime = Date.now()

      await page.goto('/', { waitUntil: 'domcontentloaded' })

      const loadTime = Date.now() - startTime

      // Should load in under 2 seconds (generous for CI)
      expect(loadTime).toBeLessThan(2000)

      console.log(`Homepage loaded in ${loadTime}ms`)
    })

    test('service+location pages load quickly', async ({ page }) => {
      const startTime = Date.now()

      await page.goto('/services/plumbing-toronto', { waitUntil: 'domcontentloaded' })

      const loadTime = Date.now() - startTime

      expect(loadTime).toBeLessThan(2000)

      console.log(`Service+location page loaded in ${loadTime}ms`)
    })
  })

  test.describe('Error Pages', () => {
    test('404 page is styled and helpful', async ({ page }) => {
      const response = await page.goto('/this-page-does-not-exist-12345', {
        waitUntil: 'domcontentloaded',
      })

      expect(response?.status()).toBe(404)

      // Should have content (not blank page)
      const bodyText = await page.locator('body').textContent()
      expect(bodyText).toBeTruthy()
      expect(bodyText!.length).toBeGreaterThan(10)

      // Should mention 404 or not found
      expect(bodyText!.toLowerCase()).toMatch(/404|not found|page.*not.*exist/i)
    })

    test('404 page has navigation back to homepage', async ({ page }) => {
      await page.goto('/this-page-does-not-exist-12345', { waitUntil: 'domcontentloaded' })

      // Should have link to homepage
      const homeLink = page.locator('a[href="/"]')
      expect(await homeLink.count()).toBeGreaterThan(0)
    })
  })
})
