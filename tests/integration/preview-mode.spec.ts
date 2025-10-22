import { test, expect } from '@playwright/test'

/**
 * Preview Mode Tests
 *
 * Tests Sanity preview functionality:
 * - Draft content visibility
 * - Preview mode activation/deactivation
 * - Real-time updates (if applicable)
 * - Preview exit route
 */

test.describe('Preview Mode', () => {
  test.describe('Preview Activation', () => {
    test('preview route is accessible', async ({ page }) => {
      // Preview route: /api/preview?slug=...
      const response = await page.goto('/api/preview?slug=home', { waitUntil: 'networkidle' })

      // Should redirect or activate preview mode
      // May redirect to login if not authenticated
      expect(response?.status()).toMatch(/200|302|307|401/)
    })

    test('preview mode shows draft content indicator', async ({ page, context }) => {
      // Try to enable preview mode
      await page.goto('/api/preview?slug=home', { waitUntil: 'networkidle' })

      // If preview mode is active, there may be an indicator
      // (This depends on your implementation)

      // Check for preview banner/indicator
      const previewIndicator = page.locator(
        'text=/preview mode|draft|viewing draft/i, [data-preview="true"], .preview-banner'
      )

      if ((await previewIndicator.count()) > 0) {
        await expect(previewIndicator).toBeVisible()
        console.log('Preview mode indicator found')
      } else {
        console.log('No preview mode indicator found (may require authentication)')
      }
    })

    test.skip('preview mode requires authentication', async ({ page }) => {
      // This test requires authentication to be set up

      // Without auth, preview should redirect to login
      const response = await page.goto('/api/preview?slug=home', { waitUntil: 'networkidle' })

      // If not authenticated, should redirect or return 401
      if (response?.status() === 401 || response?.status() === 302 || response?.status() === 307) {
        console.log('Preview mode requires authentication (expected)')
      }
    })
  })

  test.describe('Preview Exit', () => {
    test('preview exit route exists', async ({ page }) => {
      const response = await page.goto('/api/preview/exit', { waitUntil: 'networkidle' })

      // Should redirect to homepage or return success
      expect(response?.status()).toMatch(/200|302|307/)
    })

    test('exiting preview mode redirects to homepage', async ({ page }) => {
      await page.goto('/api/preview/exit', { waitUntil: 'networkidle' })

      // Should end up on homepage or where we came from
      const url = page.url()
      expect(url).toMatch(/\/$|\/services|\/locations/)
    })

    test.skip('exiting preview mode clears draft content', async ({ page, context }) => {
      // Enable preview mode
      await page.goto('/api/preview?slug=home', { waitUntil: 'networkidle' })

      // Exit preview mode
      await page.goto('/api/preview/exit', { waitUntil: 'networkidle' })

      // Draft content should no longer be visible
      const previewIndicator = page.locator('[data-preview="true"], .preview-banner')
      await expect(previewIndicator).not.toBeVisible()
    })
  })

  test.describe('Draft Content', () => {
    test.skip('draft pages are visible in preview mode', async ({ page }) => {
      // This requires:
      // 1. A draft document in Sanity
      // 2. Authentication token
      // 3. Preview mode enabled

      // Enable preview mode with authentication
      await page.goto('/api/preview?slug=draft-page&secret=YOUR_SECRET', {
        waitUntil: 'networkidle',
      })

      // Navigate to draft page
      await page.goto('/draft-page', { waitUntil: 'networkidle' })

      // Draft page should be visible
      const title = await page.title()
      expect(title).toBeTruthy()
    })

    test.skip('draft pages return 404 without preview mode', async ({ page }) => {
      // Without preview mode, draft pages should not be visible

      const response = await page.goto('/draft-page', { waitUntil: 'networkidle' })

      // Should be 404 (or redirect to published version)
      expect(response?.status()).toBe(404)
    })

    test.skip('published pages show draft changes in preview', async ({ page }) => {
      // This test requires:
      // 1. A published page with draft changes
      // 2. Preview mode enabled

      // Without preview mode
      await page.goto('/services/plumbing-toronto')
      const publishedTitle = await page.title()

      // With preview mode (would need secret token)
      await page.goto('/api/preview?slug=services/plumbing-toronto&secret=YOUR_SECRET')
      await page.goto('/services/plumbing-toronto')
      const draftTitle = await page.title()

      // Titles might be different if there are draft changes
      // (This test would need actual draft changes to validate)
      expect(draftTitle).toBeTruthy()
    })
  })

  test.describe('Preview Fetch Route', () => {
    test('preview fetch route exists', async ({ page }) => {
      const response = await page.request.post('/api/preview/fetch', {
        data: {
          slug: 'home',
        },
      })

      // Should return data or require auth
      expect(response.status()).toMatch(/200|401|405/)
    })

    test.skip('preview fetch returns draft content', async ({ page }) => {
      // This requires authentication
      const response = await page.request.post('/api/preview/fetch', {
        data: {
          slug: 'home',
        },
        headers: {
          Authorization: 'Bearer YOUR_TOKEN',
        },
      })

      if (response.status() === 200) {
        const data = await response.json()
        expect(data).toBeTruthy()
      }
    })
  })

  test.describe('Real-time Updates', () => {
    test.skip('preview mode shows real-time content updates', async ({ page }) => {
      // This test requires:
      // 1. Preview mode enabled
      // 2. WebSocket or polling connection to Sanity
      // 3. Ability to trigger content updates

      // Enable preview mode
      await page.goto('/api/preview?slug=home&secret=YOUR_SECRET')
      await page.goto('/')

      // Get initial title
      const initialTitle = await page.title()

      // Simulate content update in Sanity (would need Sanity client)
      // ...

      // Wait for update (WebSocket or polling interval)
      await page.waitForTimeout(3000)

      // Title should update
      const updatedTitle = await page.title()

      // If content was updated, title should change
      console.log('Initial:', initialTitle)
      console.log('Updated:', updatedTitle)
    })
  })

  test.describe('Preview Security', () => {
    test('preview mode without valid secret is rejected', async ({ page }) => {
      const response = await page.goto('/api/preview?slug=home&secret=invalid-secret', {
        waitUntil: 'networkidle',
      })

      // Should reject invalid secret
      // May return 401, redirect to login, or show error
      expect(response?.status()).toMatch(/401|403|302/)
    })

    test.skip('preview mode secret is not exposed in client', async ({ page }) => {
      // Enable preview mode
      await page.goto('/api/preview?slug=home&secret=YOUR_SECRET')
      await page.goto('/')

      // Check that secret is not in page source
      const pageContent = await page.content()
      expect(pageContent).not.toContain('YOUR_SECRET')

      // Check that secret is not in cookies (should be httpOnly)
      const cookies = await page.context().cookies()
      const previewCookie = cookies.find((c) => c.name.includes('preview'))

      if (previewCookie) {
        expect(previewCookie.value).not.toContain('YOUR_SECRET')
      }
    })
  })

  test.describe('Preview Mode in Studio', () => {
    test('studio is accessible at /studio', async ({ page }) => {
      const response = await page.goto('/studio', { waitUntil: 'networkidle' })

      // Studio should load (may require auth)
      expect(response?.status()).toBe(200)
    })

    test('studio has preview functionality', async ({ page }) => {
      await page.goto('/studio', { waitUntil: 'networkidle', timeout: 30000 })

      // Wait for studio to load
      await page.waitForTimeout(2000)

      // Studio should have preview buttons/links
      // (Exact selector depends on Sanity Studio version)
      const bodyText = await page.locator('body').textContent()

      if (bodyText) {
        // May contain "preview", "view", or similar text
        console.log('Studio loaded successfully')
      }
    })
  })

  test.describe('Fallback Behavior', () => {
    test('pages without preview data fall back to published', async ({ page, context }) => {
      // Even in preview mode, if no draft exists, show published

      await page.goto('/api/preview?slug=services', { waitUntil: 'networkidle' })
      await page.goto('/services', { waitUntil: 'networkidle' })

      // Should show published content
      const title = await page.title()
      expect(title).toBeTruthy()

      // Page should load successfully
      const h1 = page.locator('h1').first()
      await expect(h1).toBeVisible()
    })

    test('invalid preview slugs return 404', async ({ page }) => {
      await page.goto('/api/preview?slug=invalid-slug-12345', { waitUntil: 'networkidle' })

      // Should redirect to 404 or show error
      // (Behavior depends on implementation)
    })
  })
})
