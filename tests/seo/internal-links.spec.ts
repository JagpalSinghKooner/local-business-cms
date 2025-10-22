import { test, expect } from '@playwright/test'

/**
 * Internal Link Audit Tests
 *
 * Validates that internal links are:
 * - Not broken (404s)
 * - Properly formatted (no trailing slashes, correct domains)
 * - Cross-linking services and locations effectively
 */

test.describe('Internal Link Audit', () => {
  test('homepage has no broken internal links', async ({ page }) => {
    await page.goto('/')

    // Get all internal links
    const links = await page.locator('a[href^="/"]').all()
    expect(links.length).toBeGreaterThan(0)

    const brokenLinks: string[] = []

    for (const link of links.slice(0, 20)) {
      // Test first 20 links to avoid timeout
      const href = await link.getAttribute('href')
      if (!href) continue

      // Skip external links, anchors, and special routes
      if (
        href.startsWith('http') ||
        href.startsWith('#') ||
        href.includes('/api/') ||
        href.includes('/studio')
      ) {
        continue
      }

      const response = await page.request.get(href)
      if (response.status() !== 200) {
        brokenLinks.push(`${href} (${response.status()})`)
      }
    }

    expect(brokenLinks).toEqual([])
  })

  test('services index page links to all service categories', async ({ page }) => {
    await page.goto('/services')

    // Should have service category links
    const serviceCategoryLinks = await page.locator('a[href^="/services/"]').all()
    expect(serviceCategoryLinks.length).toBeGreaterThan(0)

    // Verify a few category links work
    const firstCategoryHref = await serviceCategoryLinks[0].getAttribute('href')
    if (firstCategoryHref) {
      const response = await page.request.get(firstCategoryHref)
      expect(response.status()).toBe(200)
    }
  })

  test('locations index page links to all locations', async ({ page }) => {
    await page.goto('/locations')

    // Should have location links
    const locationLinks = await page.locator('a[href^="/locations/"]').all()
    expect(locationLinks.length).toBeGreaterThan(0)

    // Verify a location link works
    const firstLocationHref = await locationLinks[0].getAttribute('href')
    if (firstLocationHref) {
      const response = await page.request.get(firstLocationHref)
      expect(response.status()).toBe(200)
    }
  })

  test('service+location page links to related services and locations', async ({ page }) => {
    await page.goto('/services/plumbing-toronto')

    // Get all internal links
    const internalLinks = await page.locator('a[href^="/"]').all()
    const hrefs = await Promise.all(internalLinks.map((link) => link.getAttribute('href')))

    // Should link to services index
    expect(hrefs.some((href) => href === '/services')).toBe(true)

    // Should link to locations index or specific locations
    expect(hrefs.some((href) => href?.startsWith('/locations'))).toBe(true)

    // May link to related services (same location, different service)
    const relatedServiceLinks = hrefs.filter((href) => href?.includes('/services/') && href.includes('-toronto'))
    console.log(`Found ${relatedServiceLinks.length} related service links in Toronto`)
  })

  test('navigation header contains essential links', async ({ page }) => {
    await page.goto('/')

    // Header should exist
    const header = page.locator('header')
    await expect(header).toBeVisible()

    // Should link to services
    const servicesLink = header.locator('a[href="/services"]')
    await expect(servicesLink).toBeVisible()

    // Should link to locations
    const locationsLink = header.locator('a[href="/locations"]')
    await expect(locationsLink).toBeVisible()

    // Logo should link to homepage
    const logoLink = header.locator('a[href="/"]')
    await expect(logoLink).toBeVisible()
  })

  test('footer contains valid internal links', async ({ page }) => {
    await page.goto('/')

    const footer = page.locator('footer')
    await expect(footer).toBeVisible()

    // Get all footer links
    const footerLinks = await footer.locator('a[href^="/"]').all()

    const brokenLinks: string[] = []

    for (const link of footerLinks.slice(0, 10)) {
      // Test first 10
      const href = await link.getAttribute('href')
      if (!href || href.startsWith('#') || href.includes('/studio')) continue

      const response = await page.request.get(href)
      if (response.status() !== 200) {
        brokenLinks.push(`${href} (${response.status()})`)
      }
    }

    expect(brokenLinks).toEqual([])
  })

  test('internal links have no trailing slashes', async ({ page }) => {
    await page.goto('/')

    const links = await page.locator('a[href^="/"]').all()
    const hrefs = await Promise.all(links.map((link) => link.getAttribute('href')))

    const linksWithTrailingSlash = hrefs.filter(
      (href) => href && href.length > 1 && href.endsWith('/') && !href.includes('?')
    )

    // Root "/" is allowed, but "/services/" is not
    const invalidLinks = linksWithTrailingSlash.filter((href) => href !== '/')

    expect(invalidLinks).toEqual([])
  })

  test('mega menu navigation links work', async ({ page }) => {
    await page.goto('/')

    // Hover over Services to open mega menu
    const servicesNav = page.locator('nav a:has-text("Services"), nav button:has-text("Services")').first()

    if ((await servicesNav.count()) > 0) {
      await servicesNav.hover()

      // Wait for mega menu to appear
      await page.waitForTimeout(500)

      // Get mega menu links
      const megaMenuLinks = await page.locator('.mega-menu a[href^="/services/"], [role="menu"] a[href^="/services/"]').all()

      if (megaMenuLinks.length > 0) {
        // Test first few links
        for (const link of megaMenuLinks.slice(0, 5)) {
          const href = await link.getAttribute('href')
          if (href) {
            const response = await page.request.get(href)
            expect(response.status()).toBe(200)
          }
        }
      }
    }
  })

  test('sitemap.xml contains all major routes', async ({ page }) => {
    const response = await page.request.get('/sitemap.xml')
    expect(response.status()).toBe(200)

    const sitemapXml = await response.text()

    // Should contain homepage
    expect(sitemapXml).toContain('<loc>')
    expect(sitemapXml).toContain('/</loc>')

    // Should contain services
    expect(sitemapXml).toContain('/services</loc>')

    // Should contain locations
    expect(sitemapXml).toContain('/locations</loc>')

    // Should contain service+location combinations
    expect(sitemapXml).toContain('/services/')

    // Count total URLs (should be 355+)
    const urlCount = (sitemapXml.match(/<loc>/g) || []).length
    expect(urlCount).toBeGreaterThanOrEqual(355)
  })

  test('breadcrumb navigation has valid links', async ({ page }) => {
    await page.goto('/services/plumbing-toronto')

    // Look for breadcrumb navigation
    const breadcrumbs = page.locator('nav[aria-label="Breadcrumb"], .breadcrumb, [itemtype*="BreadcrumbList"]')

    if ((await breadcrumbs.count()) > 0) {
      const breadcrumbLinks = await breadcrumbs.locator('a').all()

      for (const link of breadcrumbLinks) {
        const href = await link.getAttribute('href')
        if (href && href.startsWith('/')) {
          const response = await page.request.get(href)
          expect(response.status()).toBe(200)
        }
      }
    }
  })

  test('cross-linking: services link to locations and vice versa', async ({ page }) => {
    // Test service page links to locations
    await page.goto('/services/plumbing-toronto')
    const servicePageLinks = await page.locator('a[href^="/locations"]').all()
    expect(servicePageLinks.length).toBeGreaterThan(0)

    // Test location page links to services
    await page.goto('/locations/toronto')
    const locationPageLinks = await page.locator('a[href^="/services"]').all()
    expect(locationPageLinks.length).toBeGreaterThan(0)
  })
})
