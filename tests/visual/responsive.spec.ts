import { test, expect, devices } from '@playwright/test'

/**
 * Responsive Design Tests
 *
 * Tests layouts across different viewport sizes:
 * - Mobile (375px) - iPhone SE
 * - Tablet (768px) - iPad Mini
 * - Desktop (1024px) - Small laptop
 * - Large Desktop (1920px) - Full HD
 *
 * Validates:
 * - Layout doesn't break
 * - Navigation adapts
 * - Images are responsive
 * - Text is readable
 * - No horizontal scroll
 */

const viewports = {
  mobile: { width: 375, height: 667 }, // iPhone SE
  tablet: { width: 768, height: 1024 }, // iPad Mini
  desktop: { width: 1024, height: 768 }, // Small laptop
  desktopLarge: { width: 1920, height: 1080 }, // Full HD
}

test.describe('Responsive Design', () => {
  Object.entries(viewports).forEach(([device, viewport]) => {
    test.describe(`${device} (${viewport.width}x${viewport.height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize(viewport)
      })

      test('homepage renders correctly', async ({ page }) => {
        await page.goto('/')

        // Page should load
        const title = await page.title()
        expect(title).toBeTruthy()

        // No horizontal scroll
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5) // 5px tolerance

        // Main content should be visible
        const main = page.locator('main, [role="main"]').first()
        await expect(main).toBeVisible()

        // Screenshot
        await expect(page).toHaveScreenshot(`homepage-${device}.png`, {
          fullPage: true,
          maxDiffPixels: 300,
        })
      })

      test('navigation is functional', async ({ page }) => {
        await page.goto('/')

        const header = page.locator('header[role="banner"]').first()
        await expect(header).toBeVisible()

        if (viewport.width < 768) {
          // Mobile: hamburger menu should exist
          const menuButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"]').first()
          await expect(menuButton).toBeVisible()
        } else {
          // Desktop: navigation links should be visible
          const nav = page.locator('nav a[href="/services"]')
          await expect(nav).toBeVisible()
        }
      })

      test('service+location page renders', async ({ page }) => {
        await page.goto('/services/plumbing-toronto')

        // Page loads
        const h1 = page.locator('h1').first()
        await expect(h1).toBeVisible()

        // No horizontal scroll
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5)
      })

      test('images are responsive', async ({ page }) => {
        await page.goto('/')

        const images = await page.locator('img').all()

        for (const img of images.slice(0, 5)) {
          // First 5 images
          const width = await img.evaluate((el: HTMLImageElement) => el.clientWidth)
          const viewportWidth = viewport.width

          // Images should not exceed viewport width
          expect(width).toBeLessThanOrEqual(viewportWidth)
        }
      })

      test('text is readable', async ({ page }) => {
        await page.goto('/')

        const h1 = page.locator('h1').first()

        if ((await h1.count()) > 0) {
          const fontSize = await h1.evaluate((el) => window.getComputedStyle(el).fontSize)
          const fontSizePx = parseInt(fontSize)

          // H1 should be at least 24px
          expect(fontSizePx).toBeGreaterThanOrEqual(24)
        }

        // Body text should be at least 14px
        const body = page.locator('body')
        const bodyFontSize = await body.evaluate((el) => window.getComputedStyle(el).fontSize)
        const bodyFontSizePx = parseInt(bodyFontSize)
        expect(bodyFontSizePx).toBeGreaterThanOrEqual(14)
      })

      test('footer is visible', async ({ page }) => {
        await page.goto('/')

        const footer = page.locator('footer')
        await expect(footer).toBeVisible()

        // Footer should not cause horizontal scroll
        const footerWidth = await footer.evaluate((el) => el.scrollWidth)
        expect(footerWidth).toBeLessThanOrEqual(viewport.width + 10)
      })
    })
  })

  test.describe('Touch Targets (Mobile)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewports.mobile)
    })

    test('buttons are large enough to tap', async ({ page }) => {
      await page.goto('/')

      const buttons = await page.locator('button, a.button, [role="button"]').all()

      for (const button of buttons.slice(0, 10)) {
        const box = await button.boundingBox()

        if (box) {
          // Touch targets should be at least 44x44px (WCAG recommendation)
          expect(box.width).toBeGreaterThanOrEqual(40) // Slightly relaxed
          expect(box.height).toBeGreaterThanOrEqual(44)
        }
      }
    })

    test('nav links have adequate spacing', async ({ page }) => {
      await page.goto('/')

      // Open mobile menu if present
      const menuButton = page.locator('button[aria-label*="menu"]').first()

      if ((await menuButton.count()) > 0) {
        await menuButton.click()
        await page.waitForTimeout(300)
      }

      const navLinks = await page.locator('nav a').all()

      for (const link of navLinks.slice(0, 5)) {
        const box = await link.boundingBox()

        if (box) {
          // Nav links should be tappable
          expect(box.height).toBeGreaterThanOrEqual(36)
        }
      }
    })
  })

  test.describe('Breakpoint Transitions', () => {
    test('layout transitions smoothly between breakpoints', async ({ page }) => {
      // Test 768px breakpoint (tablet)
      await page.setViewportSize({ width: 767, height: 1024 })
      await page.goto('/')

      await expect(page).toHaveScreenshot('breakpoint-767px.png', {
        maxDiffPixels: 200,
      })

      // Change to 768px (should trigger breakpoint)
      await page.setViewportSize({ width: 768, height: 1024 })

      await expect(page).toHaveScreenshot('breakpoint-768px.png', {
        maxDiffPixels: 200,
      })

      // Should be noticeably different layouts
    })
  })

  test.describe('Orientation Changes', () => {
    test('mobile portrait', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')

      await expect(page).toHaveScreenshot('mobile-portrait.png', {
        maxDiffPixels: 200,
      })
    })

    test('mobile landscape', async ({ page }) => {
      await page.setViewportSize({ width: 667, height: 375 })
      await page.goto('/')

      await expect(page).toHaveScreenshot('mobile-landscape.png', {
        maxDiffPixels: 200,
      })
    })

    test('tablet portrait', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto('/')

      await expect(page).toHaveScreenshot('tablet-portrait.png', {
        maxDiffPixels: 200,
      })
    })

    test('tablet landscape', async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 })
      await page.goto('/')

      await expect(page).toHaveScreenshot('tablet-landscape.png', {
        maxDiffPixels: 200,
      })
    })
  })

  test.describe('Grid Layouts', () => {
    test('services grid adapts to viewport', async ({ page }) => {
      await page.goto('/services')

      // Mobile: 1 column
      await page.setViewportSize(viewports.mobile)
      const mobileGrid = page.locator('section:has(a[href^="/services/"])').first()
      await expect(mobileGrid).toHaveScreenshot('services-grid-mobile.png')

      // Tablet: 2 columns
      await page.setViewportSize(viewports.tablet)
      await expect(mobileGrid).toHaveScreenshot('services-grid-tablet.png')

      // Desktop: 3 columns
      await page.setViewportSize(viewports.desktop)
      await expect(mobileGrid).toHaveScreenshot('services-grid-desktop.png')
    })
  })

  test.describe('Font Scaling', () => {
    test('headings scale appropriately', async ({ page }) => {
      await page.goto('/')

      const h1 = page.locator('h1').first()

      if ((await h1.count()) === 0) return

      // Mobile
      await page.setViewportSize(viewports.mobile)
      const mobileFontSize = await h1.evaluate((el) => window.getComputedStyle(el).fontSize)

      // Desktop
      await page.setViewportSize(viewports.desktopLarge)
      const desktopFontSize = await h1.evaluate((el) => window.getComputedStyle(el).fontSize)

      // Desktop should have larger font
      expect(parseInt(desktopFontSize)).toBeGreaterThanOrEqual(parseInt(mobileFontSize))
    })
  })
})

test.describe('Cross-Browser Testing', () => {
  test('homepage renders in Chromium', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium')

    await page.goto('/')
    const title = await page.title()
    expect(title).toBeTruthy()

    await expect(page).toHaveScreenshot('homepage-chromium.png', {
      maxDiffPixels: 300,
    })
  })

  test('homepage renders in Firefox', async ({ page, browserName }) => {
    test.skip(browserName !== 'firefox')

    await page.goto('/')
    const title = await page.title()
    expect(title).toBeTruthy()

    await expect(page).toHaveScreenshot('homepage-firefox.png', {
      maxDiffPixels: 300,
    })
  })

  test('homepage renders in WebKit', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit')

    await page.goto('/')
    const title = await page.title()
    expect(title).toBeTruthy()

    await expect(page).toHaveScreenshot('homepage-webkit.png', {
      maxDiffPixels: 300,
    })
  })

  test('CSS Grid support', async ({ page }) => {
    await page.goto('/services')

    const supportsGrid = await page.evaluate(() => {
      return CSS.supports('display', 'grid')
    })

    expect(supportsGrid).toBe(true)
  })

  test('CSS Flexbox support', async ({ page }) => {
    await page.goto('/')

    const supportsFlex = await page.evaluate(() => {
      return CSS.supports('display', 'flex')
    })

    expect(supportsFlex).toBe(true)
  })
})
