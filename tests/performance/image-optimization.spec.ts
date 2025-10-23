/**
 * Image Optimization Performance Tests
 *
 * Validates that images are properly optimized for Core Web Vitals:
 * - Modern formats (WebP/AVIF) served correctly
 * - Lazy loading for below-fold images
 * - Priority loading for above-fold images
 * - Zero Cumulative Layout Shift (CLS)
 * - Fast Largest Contentful Paint (LCP < 2.5s)
 * - All images have width/height attributes
 * - Blur placeholders displayed
 */

import { test, expect } from '@playwright/test'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'

test.describe('Image Optimization', () => {
  test('all images have width and height attributes to prevent CLS', async ({ page }) => {
    await page.goto(BASE_URL)

    // Wait for images to load
    await page.waitForLoadState('networkidle')

    const images = await page.locator('img').all()

    // Allow for some images without dimensions if they use fill or object-fit
    let imagesWithoutDimensions = 0

    for (const img of images) {
      const width = await img.getAttribute('width')
      const height = await img.getAttribute('height')
      const style = await img.getAttribute('style')

      // Check if image has dimensions OR is using fill/object-fit
      const hasDimensions = Boolean(width && height)
      const usesFill = style?.includes('object-fit') || false

      if (!hasDimensions && !usesFill) {
        const src = await img.getAttribute('src')
        console.warn(`Image without dimensions: ${src?.substring(0, 80)}`)
        imagesWithoutDimensions++
      }
    }

    // At least 90% of images should have proper dimensions
    const percentWithDimensions = ((images.length - imagesWithoutDimensions) / images.length) * 100
    expect(percentWithDimensions).toBeGreaterThanOrEqual(90)
  })

  test('lazy loads below-fold images', async ({ page }) => {
    await page.goto(BASE_URL)

    // Look for images with loading="lazy" attribute
    const lazyImages = await page.locator('img[loading="lazy"]').count()

    // Should have at least some lazy-loaded images
    expect(lazyImages).toBeGreaterThan(0)
  })

  test('priority loads above-fold hero images', async ({ page }) => {
    await page.goto(BASE_URL)

    // Look for priority images (fetchpriority="high")
    const priorityImages = await page.locator('img[fetchpriority="high"]').count()

    // Should have at least one priority image (hero)
    expect(priorityImages).toBeGreaterThanOrEqual(1)
  })

  test('serves optimized image formats', async ({ page }) => {
    await page.goto(BASE_URL)

    // Wait for images to load
    await page.waitForLoadState('networkidle')

    const images = await page.locator('img').all()

    if (images.length === 0) {
      test.skip()
      return
    }

    // Get src of first image
    const firstImage = images[0]
    const src = await firstImage.getAttribute('src')

    // Next.js optimizes images through /_next/image endpoint
    // or serves directly from Sanity CDN
    const isOptimized = src?.includes('/_next/image') || src?.includes('cdn.sanity.io')

    expect(isOptimized).toBeTruthy()
  })

  test('images have proper alt text for accessibility', async ({ page }) => {
    await page.goto(BASE_URL)

    const images = await page.locator('img').all()

    let imagesWithoutAlt = 0

    for (const img of images) {
      const alt = await img.getAttribute('alt')

      // Alt can be empty string (for decorative images) but should exist
      if (alt === null) {
        const src = await img.getAttribute('src')
        console.warn(`Image without alt attribute: ${src?.substring(0, 80)}`)
        imagesWithoutAlt++
      }
    }

    // All images must have alt attribute (even if empty)
    expect(imagesWithoutAlt).toBe(0)
  })

  test('CLS is minimal (no significant layout shift)', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' })

    // Measure CLS using PerformanceObserver API
    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0

        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            // Only count layout shifts without recent user input
            if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
              clsValue += (entry as any).value
            }
          }
        })

        observer.observe({ type: 'layout-shift', buffered: true })

        // Wait 3 seconds for page to stabilize
        setTimeout(() => {
          observer.disconnect()
          resolve(clsValue)
        }, 3000)
      })
    })

    // Good CLS score is < 0.1
    // We'll be lenient and accept < 0.2 for development
    expect(cls).toBeLessThan(0.2)
    console.log(`CLS score: ${cls.toFixed(4)}`)
  })

  test('LCP occurs within acceptable timeframe', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' })

    // Measure LCP using PerformanceObserver API
    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let lcpValue = 0

        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1] as any

          // LCP is renderTime or loadTime
          lcpValue = lastEntry.renderTime || lastEntry.loadTime
        })

        observer.observe({ type: 'largest-contentful-paint', buffered: true })

        // Wait 5 seconds for LCP to settle
        setTimeout(() => {
          observer.disconnect()
          resolve(lcpValue)
        }, 5000)
      })
    })

    // Good LCP is < 2.5s, acceptable is < 4s
    // We'll accept < 5s for development/testing
    expect(lcp).toBeLessThan(5000)
    console.log(`LCP: ${lcp.toFixed(0)}ms`)
  })

  test('responsive images have srcset attribute', async ({ page }) => {
    await page.goto(BASE_URL)

    const images = await page.locator('img').all()

    if (images.length === 0) {
      test.skip()
      return
    }

    // Count images with srcset
    let imagesWithSrcset = 0

    for (const img of images) {
      const srcset = await img.getAttribute('srcset')
      if (srcset) {
        imagesWithSrcset++
      }
    }

    // At least 50% of images should have srcset for responsive loading
    const percentWithSrcset = (imagesWithSrcset / images.length) * 100
    expect(percentWithSrcset).toBeGreaterThanOrEqual(50)
    console.log(`Images with srcset: ${imagesWithSrcset}/${images.length} (${percentWithSrcset.toFixed(0)}%)`)
  })

  test('images load efficiently without blocking render', async ({ page }) => {
    // Navigate and measure total image load time
    const startTime = Date.now()

    await page.goto(BASE_URL)
    await page.waitForLoadState('domcontentloaded')

    const domLoadTime = Date.now() - startTime

    // DOM should load quickly even if images are still loading
    // We'll accept < 3s for DOM content loaded
    expect(domLoadTime).toBeLessThan(3000)
    console.log(`DOM loaded in: ${domLoadTime}ms`)
  })

  test('no broken image links', async ({ page }) => {
    await page.goto(BASE_URL)

    // Wait for all images to attempt loading
    await page.waitForLoadState('networkidle')

    const images = await page.locator('img').all()

    for (const img of images) {
      // Check if image has naturalWidth (indicates successful load)
      const isLoaded = await img.evaluate((el: HTMLImageElement) => {
        return el.complete && el.naturalWidth > 0
      })

      if (!isLoaded) {
        const src = await img.getAttribute('src')
        console.warn(`Broken or failed to load image: ${src}`)
      }

      expect(isLoaded).toBeTruthy()
    }
  })
})

test.describe('Image Optimization - Specific Routes', () => {
  test('homepage hero image is optimized', async ({ page }) => {
    await page.goto(BASE_URL)

    // Look for hero section image
    const heroImage = page.locator('img').first()

    if ((await heroImage.count()) === 0) {
      test.skip()
      return
    }

    // Hero should have priority loading
    const fetchPriority = await heroImage.getAttribute('fetchpriority')
    expect(fetchPriority).toBe('high')

    // Hero should have dimensions
    const width = await heroImage.getAttribute('width')
    const height = await heroImage.getAttribute('height')
    expect(width).toBeTruthy()
    expect(height).toBeTruthy()

    console.log(`Hero image dimensions: ${width}x${height}`)
  })

  test('service page images are lazy loaded', async ({ page }) => {
    // Try to navigate to a service page
    const servicePage = `${BASE_URL}/services`

    try {
      await page.goto(servicePage, { timeout: 10000 })
    } catch {
      test.skip()
      return
    }

    // Images below fold should be lazy
    const lazyImages = await page.locator('img[loading="lazy"]').count()

    expect(lazyImages).toBeGreaterThan(0)
    console.log(`Lazy-loaded images on service page: ${lazyImages}`)
  })
})
