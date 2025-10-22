import { test, expect } from '@playwright/test'

/**
 * Visual Regression Tests - Components
 *
 * Screenshot-based testing for visual consistency:
 * - Hero section variants
 * - All section types
 * - Navigation (desktop & mobile)
 * - Footer
 * - Forms
 *
 * Run with: pnpm test:visual
 * Update baselines: pnpm test:visual -- --update-snapshots
 */

test.describe('Visual Regression - Components', () => {
  test.describe('Hero Section', () => {
    test('hero split variant', async ({ page }) => {
      await page.goto('/')

      const hero = page.locator('section').first()
      await expect(hero).toBeVisible()

      // Take screenshot of hero section
      await expect(hero).toHaveScreenshot('hero-split.png', {
        maxDiffPixels: 100, // Allow small rendering differences
      })
    })

    test.skip('hero background variant', async ({ page }) => {
      // Navigate to page with background hero
      // (Skip if no page has this variant)
      await page.goto('/page-with-background-hero')

      const hero = page.locator('section[data-variant="background"]').first()

      if ((await hero.count()) > 0) {
        await expect(hero).toHaveScreenshot('hero-background.png')
      }
    })

    test.skip('hero centered variant', async ({ page }) => {
      // Navigate to page with centered hero
      await page.goto('/page-with-centered-hero')

      const hero = page.locator('section[data-variant="centered"]').first()

      if ((await hero.count()) > 0) {
        await expect(hero).toHaveScreenshot('hero-centered.png')
      }
    })
  })

  test.describe('Navigation', () => {
    test('desktop header', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 })
      await page.goto('/')

      const header = page.locator('header')
      await expect(header).toBeVisible()

      await expect(header).toHaveScreenshot('header-desktop.png')
    })

    test('desktop mega menu', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 })
      await page.goto('/')

      // Hover over Services to open mega menu
      const servicesNav = page.locator('nav a:has-text("Services"), nav button:has-text("Services")').first()

      if ((await servicesNav.count()) > 0) {
        await servicesNav.hover()
        await page.waitForTimeout(500) // Wait for menu to open

        // Screenshot the open mega menu
        const megaMenu = page.locator('.mega-menu, [role="menu"]').first()

        if ((await megaMenu.count()) > 0) {
          await expect(megaMenu).toHaveScreenshot('mega-menu-desktop.png')
        }
      }
    })

    test('mobile header collapsed', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')

      const header = page.locator('header')
      await expect(header).toBeVisible()

      await expect(header).toHaveScreenshot('header-mobile-collapsed.png')
    })

    test('mobile menu expanded', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')

      // Click hamburger menu
      const menuButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"], .hamburger').first()

      if ((await menuButton.count()) > 0) {
        await menuButton.click()
        await page.waitForTimeout(300) // Animation delay

        // Screenshot expanded mobile menu
        const mobileMenu = page.locator('nav[aria-label="Mobile"], .mobile-menu, [role="dialog"]').first()

        if ((await mobileMenu.count()) > 0) {
          await expect(mobileMenu).toHaveScreenshot('mobile-menu-expanded.png')
        }
      }
    })
  })

  test.describe('Footer', () => {
    test('desktop footer', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 })
      await page.goto('/')

      const footer = page.locator('footer')
      await expect(footer).toBeVisible()

      await expect(footer).toHaveScreenshot('footer-desktop.png')
    })

    test('mobile footer', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')

      const footer = page.locator('footer')
      await expect(footer).toBeVisible()

      await expect(footer).toHaveScreenshot('footer-mobile.png')
    })
  })

  test.describe('Section Components', () => {
    test.skip('features section', async ({ page }) => {
      await page.goto('/')

      const featuresSection = page.locator('section:has-text("Features")').first()

      if ((await featuresSection.count()) > 0) {
        await expect(featuresSection).toHaveScreenshot('section-features.png')
      }
    })

    test.skip('testimonials section', async ({ page }) => {
      await page.goto('/')

      const testimonialsSection = page.locator('section:has-text("Testimonials"), section:has-text("Reviews")').first()

      if ((await testimonialsSection.count()) > 0) {
        await expect(testimonialsSection).toHaveScreenshot('section-testimonials.png')
      }
    })

    test.skip('contact form section', async ({ page }) => {
      await page.goto('/')

      const contactSection = page.locator('section:has(form), section:has-text("Contact")').first()

      if ((await contactSection.count()) > 0) {
        await expect(contactSection).toHaveScreenshot('section-contact-form.png')
      }
    })

    test.skip('gallery section', async ({ page }) => {
      await page.goto('/')

      const gallerySection = page.locator('section:has-text("Gallery")').first()

      if ((await gallerySection.count()) > 0) {
        await expect(gallerySection).toHaveScreenshot('section-gallery.png', {
          maxDiffPixels: 200, // Images may load differently
        })
      }
    })
  })

  test.describe('Service Cards', () => {
    test('service cards grid', async ({ page }) => {
      await page.goto('/services')

      const servicesGrid = page.locator('section:has(a[href^="/services/"])').first()

      if ((await servicesGrid.count()) > 0) {
        await expect(servicesGrid).toHaveScreenshot('services-grid.png', {
          maxDiffPixels: 150,
        })
      }
    })

    test.skip('individual service card', async ({ page }) => {
      await page.goto('/services')

      const firstCard = page.locator('a[href^="/services/"], article, .service-card').first()

      if ((await firstCard.count()) > 0) {
        await expect(firstCard).toHaveScreenshot('service-card-single.png')
      }
    })
  })

  test.describe('Location Cards', () => {
    test('locations grid', async ({ page }) => {
      await page.goto('/locations')

      const locationsGrid = page.locator('section:has(a[href^="/locations/"])').first()

      if ((await locationsGrid.count()) > 0) {
        await expect(locationsGrid).toHaveScreenshot('locations-grid.png', {
          maxDiffPixels: 150,
        })
      }
    })
  })

  test.describe('Forms', () => {
    test.skip('lead capture form', async ({ page }) => {
      await page.goto('/')

      const form = page.locator('form').first()

      if ((await form.count()) > 0) {
        await expect(form).toHaveScreenshot('form-lead-capture.png')
      }
    })

    test.skip('form with validation errors', async ({ page }) => {
      await page.goto('/')

      const form = page.locator('form').first()

      if ((await form.count()) > 0) {
        // Submit empty form to trigger validation
        const submitButton = form.locator('button[type="submit"]')
        await submitButton.click()

        await page.waitForTimeout(500)

        // Screenshot form with errors
        await expect(form).toHaveScreenshot('form-with-errors.png')
      }
    })
  })

  test.describe('Buttons & CTAs', () => {
    test.skip('primary CTA button', async ({ page }) => {
      await page.goto('/')

      const primaryButton = page.locator('button.primary, a.button-primary, [data-variant="primary"]').first()

      if ((await primaryButton.count()) > 0) {
        await expect(primaryButton).toHaveScreenshot('button-primary.png')
      }
    })

    test.skip('secondary CTA button', async ({ page }) => {
      await page.goto('/')

      const secondaryButton = page.locator('button.secondary, a.button-secondary, [data-variant="secondary"]').first()

      if ((await secondaryButton.count()) > 0) {
        await expect(secondaryButton).toHaveScreenshot('button-secondary.png')
      }
    })
  })

  test.describe('Full Page Screenshots', () => {
    test('homepage full page', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 })
      await page.goto('/')

      // Full page screenshot
      await expect(page).toHaveScreenshot('page-homepage-full.png', {
        fullPage: true,
        maxDiffPixels: 500,
      })
    })

    test('services page full', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 })
      await page.goto('/services')

      await expect(page).toHaveScreenshot('page-services-full.png', {
        fullPage: true,
        maxDiffPixels: 500,
      })
    })

    test('service+location page full', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 })
      await page.goto('/services/plumbing-toronto')

      await expect(page).toHaveScreenshot('page-service-location-full.png', {
        fullPage: true,
        maxDiffPixels: 500,
      })
    })
  })
})
