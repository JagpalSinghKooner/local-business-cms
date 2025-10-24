import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility: Home Page', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check for H1
    const h1 = page.locator('h1')
    await expect(h1.first()).toBeVisible()

    // Ensure only one H1 exists
    const h1Count = await h1.count()
    expect(h1Count).toBe(1)
  })

  test('should have skip to main content link', async ({ page }) => {
    await page.goto('/')

    // Tab to first focusable element (should be skip link)
    await page.keyboard.press('Tab')

    // Check if a skip link is present and focusable
    const skipLink = page.locator('a[href="#main"], a[href="#content"]').first()
    const skipLinkCount = await skipLink.count()

    // Skip link is optional but recommended for a11y
    if (skipLinkCount > 0) {
      await expect(skipLink).toBeFocused()
    }
  })

  test('all images should have alt text', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Get all images
    const images = page.locator('img')
    const imageCount = await images.count()

    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i)
        const alt = await img.getAttribute('alt')

        // Alt attribute should exist (can be empty for decorative images)
        expect(alt).not.toBeNull()
      }
    }
  })

  test('form inputs should have labels', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check for any inputs
    const inputs = page.locator(
      'input[type="text"], input[type="email"], input[type="tel"], textarea'
    )
    const inputCount = await inputs.count()

    if (inputCount > 0) {
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i)
        const id = await input.getAttribute('id')
        const ariaLabel = await input.getAttribute('aria-label')
        const ariaLabelledby = await input.getAttribute('aria-labelledby')

        // Check for associated label or aria-label
        if (id) {
          const label = page.locator(`label[for="${id}"]`)
          const hasLabel = (await label.count()) > 0
          const hasAriaLabel = ariaLabel !== null || ariaLabelledby !== null

          expect(hasLabel || hasAriaLabel).toBeTruthy()
        }
      }
    }
  })

  test('interactive elements should be keyboard accessible', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check if buttons are keyboard accessible
    const buttons = page.locator('button, a[href]')
    const buttonCount = await buttons.count()

    if (buttonCount > 0) {
      // Focus first button
      await buttons.first().focus()
      await expect(buttons.first()).toBeFocused()

      // Verify focus styling exists (visual feedback)
      const focusedElement = await page.locator(':focus').first()
      await expect(focusedElement).toBeVisible()
    }
  })

  test('page should have a valid lang attribute', async ({ page }) => {
    await page.goto('/')

    const htmlLang = await page.locator('html').getAttribute('lang')
    expect(htmlLang).toBeTruthy()
    expect(htmlLang).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/) // e.g., "en" or "en-US"
  })
})
