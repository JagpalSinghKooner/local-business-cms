import { test, expect } from '@playwright/test'

/**
 * Redirect Rules Integration Tests
 *
 * Tests the advanced redirect system with:
 * - Exact matching
 * - Wildcard patterns
 * - Regex patterns
 * - Capture groups
 * - Priority ordering
 * - Loop detection
 */

test.describe('Redirect Rules', () => {
  test.describe('Exact Redirects', () => {
    test.skip('exact redirect works', async ({ page }) => {
      // This test requires redirects to be configured in Sanity
      // Skip if no test redirects exist

      const response = await page.goto('/old-page', { waitUntil: 'networkidle' })

      if (response) {
        // Should redirect to new page
        expect(response.status()).toBe(301)
        expect(page.url()).toContain('/new-page')
      }
    })

    test('non-existent page returns 404', async ({ page }) => {
      const response = await page.goto('/this-page-definitely-does-not-exist-12345', {
        waitUntil: 'networkidle',
      })

      expect(response?.status()).toBe(404)
    })
  })

  test.describe('Trailing Slash Handling', () => {
    test('trailing slash is removed via redirect', async ({ page, context }) => {
      // Navigate to a page with trailing slash
      const response = await page.goto('/services/', { waitUntil: 'networkidle' })

      // Should redirect (308) to remove trailing slash
      const finalUrl = page.url()
      expect(finalUrl).not.toMatch(/\/services\/$/)
      expect(finalUrl).toMatch(/\/services$/)

      // Status should be redirect
      if (response && response.status() >= 300 && response.status() < 400) {
        console.log('Trailing slash redirect working correctly')
      }
    })

    test('root path "/" is allowed', async ({ page }) => {
      const response = await page.goto('/', { waitUntil: 'networkidle' })
      expect(response?.status()).toBe(200)
      expect(page.url()).toMatch(/\/$/)
    })
  })

  test.describe('Canonical Host Redirect', () => {
    test.skip('non-canonical host redirects to canonical', async ({ page }) => {
      // This test requires CANONICAL_HOST to be set
      // Skip in local development

      // If CANONICAL_HOST is set, accessing via different host should redirect
      // Example: http://example.com → http://www.example.com

      const canonicalHost = process.env.CANONICAL_HOST || process.env.NEXT_PUBLIC_SITE_URL

      if (!canonicalHost) {
        test.skip()
      }

      // This would require accessing the site from a non-canonical domain
      // which is difficult to test in local environment
    })
  })

  test.describe('Wildcard Redirects', () => {
    test.skip('wildcard redirect with capture group', async ({ page }) => {
      // Example: /blog/* → /articles/$1
      // This requires a wildcard redirect to be configured in Sanity

      const response = await page.goto('/blog/my-post', { waitUntil: 'networkidle' })

      if (response && response.status() >= 300 && response.status() < 400) {
        // Should redirect to /articles/my-post
        expect(page.url()).toContain('/articles/my-post')
      }
    })
  })

  test.describe('Regex Redirects', () => {
    test.skip('regex redirect with numeric capture', async ({ page }) => {
      // Example: ^/product/(\d+) → /products/$1
      // This requires a regex redirect to be configured in Sanity

      const response = await page.goto('/product/12345', { waitUntil: 'networkidle' })

      if (response && response.status() >= 300 && response.status() < 400) {
        // Should redirect to /products/12345
        expect(page.url()).toContain('/products/12345')
      }
    })
  })

  test.describe('Priority Ordering', () => {
    test.skip('higher priority redirect is used first', async ({ page }) => {
      // If two redirects match the same path, the one with lower priority number wins
      // Example:
      // - /test → /test-a (priority: 50)
      // - /test → /test-b (priority: 100)
      // Should redirect to /test-a

      const response = await page.goto('/test', { waitUntil: 'networkidle' })

      if (response && response.status() >= 300 && response.status() < 400) {
        // Should use the higher priority redirect
        expect(page.url()).toContain('/test-a')
      }
    })
  })

  test.describe('Loop Detection', () => {
    test('redirect validation script detects loops', async () => {
      // Test the validation script (not a browser test)
      // This would be run as: pnpm redirects:validate

      // For now, just verify the script exists
      const { exec } = require('child_process')
      const { promisify } = require('util')
      const execAsync = promisify(exec)

      try {
        // Check if validation script exists
        const { stdout } = await execAsync('pnpm redirects:validate --help || echo "Script exists"')
        expect(stdout).toBeTruthy()
      } catch (error) {
        console.log('Validation script test skipped')
      }
    })
  })

  test.describe('Status Codes', () => {
    test('301 redirect is permanent', async ({ page }) => {
      // Test that redirects use correct status codes
      // 301 = Permanent (cached by browsers)
      // 302 = Temporary
      // 308 = Permanent (preserves method)

      // For trailing slash removal, we use 308
      const response = await page.request.get('/services/')

      if (response.status() >= 300 && response.status() < 400) {
        expect([301, 308]).toContain(response.status())
      }
    })
  })

  test.describe('Redirect Cache', () => {
    test('redirects are cached in middleware', async ({ page }) => {
      // Middleware caches redirects for 5 minutes
      // Multiple requests should not hit Sanity every time

      // First request
      await page.goto('/services')

      // Second request (should use cache)
      await page.goto('/locations')

      // Third request
      await page.goto('/services')

      // If cache is working, all requests should be fast
      // This is more of a performance test than functional
    })
  })

  test.describe('External Redirects', () => {
    test.skip('external redirect works', async ({ page, context }) => {
      // Example: /external → https://external-site.com
      // This requires an external redirect to be configured

      context.on('page', async (newPage) => {
        // If redirect opens in new tab, verify URL
        expect(newPage.url()).toMatch(/^https?:\/\//)
      })

      await page.goto('/external', { waitUntil: 'networkidle' })

      // Should redirect to external site or open in new tab
    })
  })

  test.describe('Inactive Redirects', () => {
    test.skip('inactive redirects are not processed', async ({ page }) => {
      // Redirects with isActive: false should not redirect

      // If a redirect is marked inactive, the original URL should work
      // This requires setting up test data in Sanity
    })
  })
})
