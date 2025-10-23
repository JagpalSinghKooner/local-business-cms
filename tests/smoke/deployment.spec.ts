import { test, expect } from '@playwright/test'

/**
 * Deployment Smoke Tests
 *
 * Fast, critical tests that verify the site is functioning after deployment.
 * These tests should complete in < 2 minutes.
 */

test.describe('Deployment Smoke Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' })

    // Should return 200 OK
    expect(response?.status()).toBe(200)

    // Should have a title
    const title = await page.title()
    expect(title).toBeTruthy()
    expect(title.length).toBeGreaterThan(5)

    // Should have H1
    const h1 = await page.locator('h1').first()
    await expect(h1).toBeVisible()
  })

  test('navigation menu renders', async ({ page }) => {
    await page.goto('/')

    // Should have header
    const header = await page.locator('header')
    await expect(header).toBeVisible()

    // Should have logo or business name
    const logo = await page.locator('header img, header h1, header a[href="/"]')
    await expect(logo.first()).toBeVisible()

    // Should have navigation links
    const navLinks = await page.locator('nav a')
    const count = await navLinks.count()
    expect(count).toBeGreaterThan(0)
  })

  test('footer renders with contact info', async ({ page }) => {
    await page.goto('/')

    // Should have footer
    const footer = await page.locator('footer')
    await expect(footer).toBeVisible()

    // Footer should have some content
    const footerText = await footer.textContent()
    expect(footerText?.length).toBeGreaterThan(10)
  })

  test('service pages are accessible', async ({ page }) => {
    await page.goto('/')

    // Find a service link
    const serviceLink = await page.locator('a[href^="/services/"]').first()

    if (await serviceLink.count() > 0) {
      const href = await serviceLink.getAttribute('href')
      expect(href).toBeTruthy()

      // Navigate to service page
      const response = await page.goto(href!)
      expect(response?.status()).toBe(200)

      // Should have H1
      const h1 = await page.locator('h1').first()
      await expect(h1).toBeVisible()
    } else {
      console.warn('No service links found on homepage')
    }
  })

  test('location pages are accessible', async ({ page }) => {
    await page.goto('/')

    // Find a location link
    const locationLink = await page.locator('a[href^="/locations/"]').first()

    if (await locationLink.count() > 0) {
      const href = await locationLink.getAttribute('href')
      expect(href).toBeTruthy()

      // Navigate to location page
      const response = await page.goto(href!)
      expect(response?.status()).toBe(200)

      // Should have H1
      const h1 = await page.locator('h1').first()
      await expect(h1).toBeVisible()
    } else {
      console.warn('No location links found on homepage')
    }
  })

  test('sitemap.xml is accessible', async ({ page }) => {
    const response = await page.goto('/sitemap.xml')
    expect(response?.status()).toBe(200)

    const content = await page.content()
    expect(content).toContain('<?xml')
    expect(content).toContain('<urlset')
    expect(content).toContain('</urlset>')
  })

  test('robots.txt is accessible', async ({ page }) => {
    const response = await page.goto('/robots.txt')
    expect(response?.status()).toBe(200)

    const content = await page.textContent('body')
    expect(content).toContain('User-agent')
    expect(content).toContain('Sitemap')
  })

  test('contact form is present', async ({ page }) => {
    await page.goto('/')

    // Look for contact form on homepage or contact page
    let form = await page.locator('form').first()

    if ((await form.count()) === 0) {
      // Try navigating to contact page
      const contactLink = await page.locator('a[href*="contact"]').first()
      if (await contactLink.count() > 0) {
        await contactLink.click()
        await page.waitForLoadState('domcontentloaded')
        form = await page.locator('form').first()
      }
    }

    if ((await form.count()) > 0) {
      await expect(form).toBeVisible()

      // Should have input fields
      const inputs = await form.locator('input, textarea')
      expect(await inputs.count()).toBeGreaterThan(0)

      // Should have submit button
      const submit = await form.locator('button[type="submit"], input[type="submit"]')
      await expect(submit.first()).toBeVisible()
    } else {
      console.warn('No contact form found')
    }
  })

  test('no console errors on homepage', async ({ page }) => {
    const errors: string[] = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Filter out known/acceptable errors
    const criticalErrors = errors.filter((error) => {
      // Ignore third-party tracking errors
      if (error.includes('google') || error.includes('facebook')) return false
      // Ignore CSS warnings
      if (error.includes('Stylesheet')) return false
      return true
    })

    expect(criticalErrors).toHaveLength(0)
  })

  test('images load correctly', async ({ page }) => {
    await page.goto('/')

    // Find all images
    const images = await page.locator('img')
    const count = await images.count()

    if (count > 0) {
      // Check first few images
      for (let i = 0; i < Math.min(3, count); i++) {
        const img = images.nth(i)
        const src = await img.getAttribute('src')

        if (src && !src.startsWith('data:')) {
          // Image should have loaded
          const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth)
          expect(naturalWidth).toBeGreaterThan(0)
        }
      }
    }
  })

  test('page is responsive (mobile viewport)', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/')

    // Should still have visible header
    const header = await page.locator('header')
    await expect(header).toBeVisible()

    // Should have mobile menu (hamburger or visible nav)
    const mobileMenu = await page.locator('button[aria-label*="menu" i], button[aria-label*="navigation" i]')
    const navLinks = await page.locator('nav a')

    const hasMobileMenu = (await mobileMenu.count()) > 0
    const hasVisibleNav = (await navLinks.count()) > 0

    expect(hasMobileMenu || hasVisibleNav).toBe(true)
  })
})
