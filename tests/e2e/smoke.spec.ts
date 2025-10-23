import { test, expect } from '@playwright/test'

test.describe('E2E Smoke Tests', () => {
  test('Homepage loads successfully', async ({ page }) => {
    await page.goto('/')

    // Should have a heading
    const heading = page.locator('h1').first()
    await expect(heading).toBeVisible()

    // Should have navigation
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
  })

  test('Services page loads successfully', async ({ page }) => {
    await page.goto('/services')

    await expect(page.locator('h1')).toBeVisible()

    // Check for services list or content
    const main = page.locator('main')
    await expect(main).toBeVisible()
  })

  test('Mobile navigation works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Click mobile menu button (usually has aria-label or button with icon)
    const menuButton = page
      .locator('button[aria-label*="menu"], button[aria-label*="Menu"]')
      .first()
    if ((await menuButton.count()) > 0) {
      await menuButton.click()

      // Mobile menu should be visible
      await page.waitForTimeout(300) // Allow animation
      const mobileNav = page.locator('nav, [role="navigation"]')
      await expect(mobileNav).toBeVisible()
    }
  })
})
