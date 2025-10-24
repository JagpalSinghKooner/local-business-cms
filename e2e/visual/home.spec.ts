import { test, expect } from '@playwright/test'

test.describe('Visual: Home', () => {
  test('desktop baseline', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('home-desktop.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    })
  })

  test('mobile baseline', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('home-mobile.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    })
  })
})
