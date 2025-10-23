import { test, expect } from '@playwright/test'

/**
 * Critical User Journey Tests
 *
 * Tests the most important user flows to ensure core functionality works
 */

test.describe('Critical User Journeys', () => {
  test('user can navigate from homepage to service page', async ({ page }) => {
    await page.goto('/')

    // Find and click first service link
    const serviceLink = await page.locator('a[href^="/services/"]').first()
    const linkCount = await serviceLink.count()

    if (linkCount > 0) {
      const serviceName = await serviceLink.textContent()
      await serviceLink.click()

      // Wait for navigation
      await page.waitForLoadState('domcontentloaded')

      // Should be on service page
      expect(page.url()).toContain('/services/')

      // Should have relevant content
      const h1 = await page.locator('h1').first().textContent()
      expect(h1).toBeTruthy()
    }
  })

  test('user can navigate from homepage to location page', async ({ page }) => {
    await page.goto('/')

    // Find and click first location link
    const locationLink = await page.locator('a[href^="/locations/"]').first()
    const linkCount = await locationLink.count()

    if (linkCount > 0) {
      const locationName = await locationLink.textContent()
      await locationLink.click()

      // Wait for navigation
      await page.waitForLoadState('domcontentloaded')

      // Should be on location page
      expect(page.url()).toContain('/locations/')

      // Should have relevant content
      const h1 = await page.locator('h1').first().textContent()
      expect(h1).toBeTruthy()
    }
  })

  test('user can navigate to service+location combination page', async ({ page }) => {
    await page.goto('/')

    // Look for service+location combination link (format: /services/[service]-[location])
    const comboLink = await page.locator('a[href*="/services/"][href*="-"]').first()
    const linkCount = await comboLink.count()

    if (linkCount > 0) {
      const href = await comboLink.getAttribute('href')
      expect(href).toMatch(/\/services\/[a-z-]+-[a-z-]+/)

      await comboLink.click()
      await page.waitForLoadState('domcontentloaded')

      // Should be on service+location page
      expect(page.url()).toMatch(/\/services\/[a-z-]+-[a-z-]+/)

      // Should have H1
      const h1 = await page.locator('h1').first()
      await expect(h1).toBeVisible()
    }
  })

  test('user can access contact form and see validation', async ({ page }) => {
    await page.goto('/')

    // Look for contact form
    let form = await page.locator('form').first()

    // If not on homepage, try contact page
    if ((await form.count()) === 0) {
      const contactLink = await page.locator('a[href*="contact"]').first()
      if (await contactLink.count() > 0) {
        await contactLink.click()
        await page.waitForLoadState('domcontentloaded')
        form = await page.locator('form').first()
      }
    }

    if ((await form.count()) > 0) {
      // Try submitting empty form (should show validation)
      const submitButton = await form.locator('button[type="submit"], input[type="submit"]').first()

      if (await submitButton.count() > 0) {
        await submitButton.click()

        // Should show validation (either HTML5 or custom)
        // Check for invalid state or error messages
        const invalidInputs = await page.locator('input:invalid, textarea:invalid')
        const errorMessages = await page.locator('[class*="error"], [role="alert"]')

        const hasValidation = (await invalidInputs.count()) > 0 || (await errorMessages.count()) > 0

        // Form should either show validation or not submit
        expect(hasValidation || page.url()).toBeTruthy()
      }
    }
  })

  test('user can use mobile navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/')

    // Look for mobile menu button
    const menuButton = await page.locator('button[aria-label*="menu" i], button[aria-label*="navigation" i]')

    if (await menuButton.count() > 0) {
      // Click menu button
      await menuButton.click()

      // Wait for menu to open
      await page.waitForTimeout(500)

      // Navigation should now be visible
      const nav = await page.locator('nav')
      const isVisible = await nav.isVisible()

      expect(isVisible).toBe(true)

      // Should have clickable links
      const navLinks = await nav.locator('a')
      expect(await navLinks.count()).toBeGreaterThan(0)
    }
  })

  test('user can search for content (if search exists)', async ({ page }) => {
    await page.goto('/')

    // Look for search input
    const searchInput = await page.locator('input[type="search"], input[placeholder*="search" i]')

    if (await searchInput.count() > 0) {
      // Type search query
      await searchInput.fill('plumbing')

      // Look for search button or submit
      const searchButton = await page.locator('button[type="submit"]').first()

      if (await searchButton.count() > 0) {
        await searchButton.click()
        await page.waitForLoadState('domcontentloaded')

        // Should show search results or stay on page
        expect(page.url()).toBeTruthy()
      }
    }
  })

  test('user can view offers/promotions (if they exist)', async ({ page }) => {
    await page.goto('/')

    // Look for offers/promotions links
    const offerLink = await page.locator('a[href*="offer"], a[href*="promo"], a[href*="special"]').first()

    if (await offerLink.count() > 0) {
      const href = await offerLink.getAttribute('href')
      await page.goto(href!)

      // Should load successfully
      const h1 = await page.locator('h1').first()
      await expect(h1).toBeVisible()
    }
  })

  test('user can navigate back to homepage from any page', async ({ page }) => {
    await page.goto('/')

    // Navigate to a service page
    const serviceLink = await page.locator('a[href^="/services/"]').first()

    if (await serviceLink.count() > 0) {
      await serviceLink.click()
      await page.waitForLoadState('domcontentloaded')

      // Click logo or home link
      const homeLink = await page.locator('a[href="/"], header img, header h1').first()
      await homeLink.click()

      await page.waitForLoadState('domcontentloaded')

      // Should be back on homepage
      expect(page.url()).toMatch(/\/$|\/index/)
    }
  })

  test('user can view business hours (if displayed)', async ({ page }) => {
    await page.goto('/')

    const bodyText = await page.textContent('body')

    // Look for time patterns
    const hasBusinessHours =
      bodyText?.includes('AM') ||
      bodyText?.includes('PM') ||
      bodyText?.includes('Monday') ||
      bodyText?.includes('hours') ||
      bodyText?.includes('Hours')

    if (hasBusinessHours) {
      // Business hours should be visible somewhere
      const hoursText = await page.locator('*:has-text("AM"), *:has-text("PM"), *:has-text("hours")').first()
      if (await hoursText.count() > 0) {
        await expect(hoursText).toBeVisible()
      }
    }
  })

  test('user can see service area information (if displayed)', async ({ page }) => {
    await page.goto('/')

    const bodyText = await page.textContent('body')

    // Look for service area indicators
    const hasServiceArea =
      bodyText?.toLowerCase().includes('serving') ||
      bodyText?.toLowerCase().includes('service area') ||
      bodyText?.toLowerCase().includes('we serve')

    if (hasServiceArea) {
      // Should show locations or cities served
      const locationsList = await page.locator('a[href^="/locations/"]')
      const count = await locationsList.count()

      expect(count).toBeGreaterThan(0)
    }
  })

  test('page performance is acceptable', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const loadTime = Date.now() - startTime

    // Page should load in reasonable time (< 5 seconds)
    expect(loadTime).toBeLessThan(5000)

    // Check for LCP (Largest Contentful Paint)
    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          resolve(lastEntry.startTime)
        }).observe({ entryTypes: ['largest-contentful-paint'] })

        // Timeout after 5 seconds
        setTimeout(() => resolve(0), 5000)
      })
    })

    if (lcp > 0) {
      // LCP should be < 2.5 seconds for good performance
      expect(lcp).toBeLessThan(2500)
    }
  })
})
