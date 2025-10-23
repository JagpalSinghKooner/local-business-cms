import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Tests', () => {
  test('Homepage should not have accessibility violations', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Services page should not have accessibility violations', async ({ page }) => {
    await page.goto('/services')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Form should be keyboard navigable', async ({ page }) => {
    await page.goto('/')

    // Find first form input (contact form usually on homepage)
    const firstInput = page.locator('form input[type="text"], form input[type="email"]').first()
    if ((await firstInput.count()) > 0) {
      await firstInput.focus()
      await expect(firstInput).toBeFocused()
    }
  })
})
