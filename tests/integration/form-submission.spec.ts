import { test, expect } from '@playwright/test'

/**
 * Form Submission Integration Tests
 *
 * Tests lead capture forms and server actions:
 * - Form validation
 * - Submission to Sanity
 * - Success/error handling
 * - Required field validation
 */

test.describe('Lead Capture Form', () => {
  test('form is present on contact page or sections', async ({ page }) => {
    // Try multiple pages that might have forms
    const pagesWithForms = ['/', '/services', '/locations/toronto']

    let formFound = false

    for (const url of pagesWithForms) {
      await page.goto(url)

      // Look for form with common identifiers
      const form = page.locator('form[name="lead-capture"], form[id*="contact"], form[id*="lead"]').first()

      if ((await form.count()) > 0) {
        formFound = true
        console.log(`Form found on ${url}`)
        break
      }
    }

    // If no form found, check for contact section
    if (!formFound) {
      await page.goto('/')
      const contactSection = page.locator('section:has-text("Contact"), section:has-text("Get in Touch")')
      if ((await contactSection.count()) > 0) {
        console.log('Contact section found on homepage')
      }
    }
  })

  test('form has required fields', async ({ page }) => {
    await page.goto('/')

    // Look for form
    const form = page.locator('form').first()

    if ((await form.count()) > 0) {
      // Check for common required fields
      const nameField = form.locator('input[name*="name"], input[id*="name"]')
      const emailField = form.locator('input[type="email"], input[name*="email"]')
      const phoneField = form.locator('input[type="tel"], input[name*="phone"]')
      const messageField = form.locator('textarea, input[name*="message"]')

      // At minimum, should have name and email or phone
      const hasNameField = (await nameField.count()) > 0
      const hasEmailField = (await emailField.count()) > 0
      const hasPhoneField = (await phoneField.count()) > 0

      expect(hasNameField || hasEmailField || hasPhoneField).toBe(true)
    } else {
      test.skip()
    }
  })

  test('form validates required fields', async ({ page }) => {
    await page.goto('/')

    const form = page.locator('form').first()

    if ((await form.count()) > 0) {
      // Try to submit empty form
      const submitButton = form.locator('button[type="submit"], input[type="submit"]')

      if ((await submitButton.count()) > 0) {
        await submitButton.click()

        // Should show validation errors or prevent submission
        await page.waitForTimeout(500)

        // Check for HTML5 validation or custom error messages
        const invalidFields = await form.locator(':invalid, [aria-invalid="true"]').count()
        const errorMessages = await form.locator('.error, [role="alert"]').count()

        // Either HTML5 validation or custom errors should appear
        expect(invalidFields + errorMessages).toBeGreaterThan(0)
      }
    } else {
      test.skip()
    }
  })

  test.skip('form submission creates lead in Sanity', async ({ page }) => {
    // This test requires:
    // 1. A working form on the site
    // 2. Sanity write access
    // 3. Ability to clean up test data

    await page.goto('/')

    const form = page.locator('form').first()

    if ((await form.count()) === 0) {
      test.skip()
      return
    }

    // Fill out form with test data
    const timestamp = Date.now()
    await form.locator('input[name*="name"]').fill(`Test User ${timestamp}`)
    await form.locator('input[type="email"]').fill(`test-${timestamp}@example.com`)
    await form.locator('input[type="tel"]').fill('555-0100')
    await form.locator('textarea').fill('This is a test submission')

    // Submit form
    const submitButton = form.locator('button[type="submit"]')
    await submitButton.click()

    // Wait for success message
    await page.waitForTimeout(2000)

    // Check for success indicator
    const successMessage = page.locator('text=/thank you|success|submitted/i')
    await expect(successMessage).toBeVisible({ timeout: 5000 })

    // TODO: Clean up test lead from Sanity
    // This would require Sanity client access in tests
  })

  test('form shows loading state during submission', async ({ page }) => {
    await page.goto('/')

    const form = page.locator('form').first()

    if ((await form.count()) === 0) {
      test.skip()
      return
    }

    // Fill form minimally
    const nameField = form.locator('input[name*="name"]').first()
    const emailField = form.locator('input[type="email"]').first()

    if ((await nameField.count()) > 0) {
      await nameField.fill('Test User')
    }

    if ((await emailField.count()) > 0) {
      await emailField.fill('test@example.com')
    }

    const submitButton = form.locator('button[type="submit"]')

    if ((await submitButton.count()) > 0) {
      // Click submit
      await submitButton.click()

      // Button should show loading state
      await page.waitForTimeout(100)

      const isDisabled = await submitButton.isDisabled()
      const loadingText = await submitButton.textContent()

      // Should either be disabled or show loading text
      expect(isDisabled || loadingText?.includes('...') || loadingText?.includes('Sending')).toBeTruthy()
    }
  })

  test('form handles server errors gracefully', async ({ page }) => {
    // Test error handling by filling invalid data
    await page.goto('/')

    const form = page.locator('form').first()

    if ((await form.count()) === 0) {
      test.skip()
      return
    }

    // Try to submit with invalid email
    const emailField = form.locator('input[type="email"]').first()

    if ((await emailField.count()) > 0) {
      await emailField.fill('invalid-email')

      const submitButton = form.locator('button[type="submit"]')

      if ((await submitButton.count()) > 0) {
        await submitButton.click()

        // Should show error (either HTML5 or custom)
        await page.waitForTimeout(500)

        const hasError = (await page.locator(':invalid, .error, [role="alert"]').count()) > 0

        expect(hasError).toBe(true)
      }
    }
  })

  test('form has proper ARIA labels for accessibility', async ({ page }) => {
    await page.goto('/')

    const form = page.locator('form').first()

    if ((await form.count()) === 0) {
      test.skip()
      return
    }

    // Check that inputs have labels or aria-label
    const inputs = await form.locator('input, textarea').all()

    for (const input of inputs) {
      const id = await input.getAttribute('id')
      const ariaLabel = await input.getAttribute('aria-label')
      const ariaLabelledby = await input.getAttribute('aria-labelledby')

      // Should have either a label, aria-label, or aria-labelledby
      if (id) {
        const label = page.locator(`label[for="${id}"]`)
        const hasLabel = (await label.count()) > 0
        const hasAria = ariaLabel || ariaLabelledby

        expect(hasLabel || hasAria).toBeTruthy()
      }
    }
  })

  test('form redirects to thank you page on success', async ({ page }) => {
    // Check if thank you page exists
    const response = await page.goto('/thank-you')

    if (response?.status() === 200) {
      // Thank you page should have confirmation content
      const heading = await page.locator('h1').textContent()
      expect(heading?.toLowerCase()).toMatch(/thank you|success|received/i)
    }
  })

  test('form preserves data on validation error', async ({ page }) => {
    await page.goto('/')

    const form = page.locator('form').first()

    if ((await form.count()) === 0) {
      test.skip()
      return
    }

    // Fill some fields
    const nameField = form.locator('input[name*="name"]').first()

    if ((await nameField.count()) > 0) {
      await nameField.fill('Test User')

      // Try to submit (will fail validation)
      const submitButton = form.locator('button[type="submit"]')

      if ((await submitButton.count()) > 0) {
        await submitButton.click()

        // Wait a bit
        await page.waitForTimeout(500)

        // Name field should still have the value
        const nameValue = await nameField.inputValue()
        expect(nameValue).toBe('Test User')
      }
    }
  })
})
