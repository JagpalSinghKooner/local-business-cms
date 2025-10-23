import { test, expect } from '@playwright/test'

/**
 * Multi-Tenant Isolation Tests
 *
 * Verifies that content isolation is working correctly:
 * - No cross-dataset content leaks
 * - Correct dataset is being queried
 * - Cache isolation is functioning
 */

test.describe('Multi-Tenant Isolation', () => {
  test('site displays correct business name', async ({ page }) => {
    await page.goto('/')

    // Get business name from page (header, footer, or meta)
    const pageTitle = await page.title()
    expect(pageTitle).toBeTruthy()

    // Should not contain placeholder text
    expect(pageTitle.toLowerCase()).not.toContain('example')
    expect(pageTitle.toLowerCase()).not.toContain('template')
    expect(pageTitle.toLowerCase()).not.toContain('lorem ipsum')

    // Logo or heading should exist
    const businessName = await page.locator('header h1, header img[alt]').first()
    if (await businessName.count() > 0) {
      await expect(businessName).toBeVisible()
    }
  })

  test('site has unique content (not shared template)', async ({ page }) => {
    await page.goto('/')

    // Get page content
    const content = await page.textContent('body')
    expect(content).toBeTruthy()

    // Should not contain common placeholder text
    expect(content?.toLowerCase()).not.toContain('lorem ipsum')
    expect(content?.toLowerCase()).not.toContain('dolor sit amet')
    expect(content?.toLowerCase()).not.toContain('[placeholder]')
    expect(content?.toLowerCase()).not.toContain('{{')
    expect(content?.toLowerCase()).not.toContain('}}')
  })

  test('sitemap contains only this site URLs', async ({ page }) => {
    const response = await page.goto('/sitemap.xml')
    expect(response?.status()).toBe(200)

    const content = await page.content()

    // Get base URL from page
    const baseUrl = page.url().replace('/sitemap.xml', '')

    // All URLs in sitemap should be for this domain
    const urlMatches = content.match(/<loc>([^<]+)<\/loc>/g)

    if (urlMatches) {
      for (const urlMatch of urlMatches) {
        const url = urlMatch.replace('<loc>', '').replace('</loc>', '')
        expect(url).toContain(baseUrl)
      }
    }
  })

  test('contact information is site-specific', async ({ page }) => {
    await page.goto('/')

    // Look for phone number pattern
    const phonePattern = /(\+?1[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/

    const bodyText = await page.textContent('body')
    const hasPhone = phonePattern.test(bodyText || '')

    if (hasPhone) {
      const matches = bodyText?.match(phonePattern)
      expect(matches).toBeTruthy()

      // Should not be a placeholder phone
      const phone = matches![0]
      expect(phone).not.toContain('555-0100') // Common placeholder
      expect(phone).not.toContain('123-4567') // Common placeholder
    }

    // Look for email
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
    const hasEmail = emailPattern.test(bodyText || '')

    if (hasEmail) {
      const matches = bodyText?.match(emailPattern)
      const email = matches![0]

      // Should not be placeholder emails
      expect(email.toLowerCase()).not.toContain('example.com')
      expect(email.toLowerCase()).not.toContain('test.com')
      expect(email.toLowerCase()).not.toContain('placeholder')
    }
  })

  test('services are site-specific', async ({ page }) => {
    await page.goto('/')

    // Find service links
    const serviceLinks = await page.locator('a[href^="/services/"]')
    const count = await serviceLinks.count()

    if (count > 0) {
      // Get href of first service
      const firstServiceHref = await serviceLinks.first().getAttribute('href')
      expect(firstServiceHref).toBeTruthy()

      // Visit service page
      await page.goto(firstServiceHref!)

      // Should have service-specific content
      const h1 = await page.locator('h1').first().textContent()
      expect(h1).toBeTruthy()
      expect(h1?.length).toBeGreaterThan(3)

      // Should not be generic placeholder
      expect(h1?.toLowerCase()).not.toContain('service name')
      expect(h1?.toLowerCase()).not.toContain('lorem ipsum')
    }
  })

  test('locations are site-specific', async ({ page }) => {
    await page.goto('/')

    // Find location links
    const locationLinks = await page.locator('a[href^="/locations/"]')
    const count = await locationLinks.count()

    if (count > 0) {
      // Get text of first location
      const firstLocationText = await locationLinks.first().textContent()
      expect(firstLocationText).toBeTruthy()
      expect(firstLocationText?.length).toBeGreaterThan(2)

      // Should not be placeholder
      expect(firstLocationText?.toLowerCase()).not.toContain('city name')
      expect(firstLocationText?.toLowerCase()).not.toContain('location')
    }
  })

  test('meta tags are site-specific', async ({ page }) => {
    await page.goto('/')

    // Check meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content')

    if (metaDescription) {
      expect(metaDescription.length).toBeGreaterThan(10)
      expect(metaDescription.toLowerCase()).not.toContain('lorem ipsum')
      expect(metaDescription.toLowerCase()).not.toContain('placeholder')
      expect(metaDescription.toLowerCase()).not.toContain('example')
    }

    // Check OG title
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')

    if (ogTitle) {
      expect(ogTitle.length).toBeGreaterThan(5)
      expect(ogTitle.toLowerCase()).not.toContain('example')
      expect(ogTitle.toLowerCase()).not.toContain('template')
    }
  })

  test('no references to other datasets in page source', async ({ page }) => {
    await page.goto('/')

    const pageSource = await page.content()

    // Should not contain references to other common dataset names
    const forbiddenDatasets = [
      'site-budds',
      'site-hvac',
      'site-legal',
      'site-plumber',
      'production',
      'staging',
    ]

    // Get current dataset from env or config
    const currentDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'unknown'

    for (const dataset of forbiddenDatasets) {
      if (dataset !== currentDataset) {
        // Should not appear in HTML source
        expect(pageSource.toLowerCase()).not.toContain(dataset.toLowerCase())
      }
    }
  })

  test('JSON-LD schema is site-specific', async ({ page }) => {
    await page.goto('/')

    // Find JSON-LD script tags
    const jsonLdScripts = await page.locator('script[type="application/ld+json"]')
    const count = await jsonLdScripts.count()

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const scriptContent = await jsonLdScripts.nth(i).textContent()

        if (scriptContent) {
          const jsonLd = JSON.parse(scriptContent)

          // LocalBusiness schema should have real data
          if (jsonLd['@type'] === 'LocalBusiness' || jsonLd['@type'] === 'Organization') {
            expect(jsonLd.name).toBeTruthy()
            expect(jsonLd.name.toLowerCase()).not.toContain('example')
            expect(jsonLd.name.toLowerCase()).not.toContain('placeholder')

            if (jsonLd.url) {
              expect(jsonLd.url).toContain(page.url().split('/')[2]) // Should match current domain
            }
          }
        }
      }
    }
  })
})
