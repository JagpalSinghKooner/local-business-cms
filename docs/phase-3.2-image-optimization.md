# Phase 3.2 - Image Optimization Pipeline

**Status**: 🔴 NOT STARTED
**Priority**: 🔴 HIGH - Performance Critical
**Duration**: Week 2 of Phase 3
**Completion**: 0% (0/8 steps)

---

## Overview

Build a production-grade image optimization system to improve Core Web Vitals (LCP, CLS) and page load performance. This includes responsive images, modern formats (WebP/AVIF), lazy loading, and blur placeholders.

**Target Metrics**:
- LCP < 2.5s on 3G connection
- Zero Cumulative Layout Shift (CLS = 0)
- Images < 100KB at 1x resolution
- WebP/AVIF support with fallbacks

---

## Implementation Steps

### ✅ 3.2.1 Create Responsive Image Component with srcset/sizes

**Status**: ⬜ TODO
**Files**: `src/components/SanityImage.tsx`

**Requirements**:
- Build `<SanityImage>` component wrapping Next.js `<Image>`
- Generate `srcset` for multiple resolutions (1x, 2x, 3x)
- Calculate `sizes` attribute based on layout
- Support Sanity CDN image transforms (width, height, quality, format)
- Preserve aspect ratio from Sanity metadata
- Add TypeScript types for all props

**Component API**:
```typescript
interface SanityImageProps {
  image: SanityImageAsset; // From Sanity schema
  alt: string;
  priority?: boolean; // For above-fold images
  loading?: 'lazy' | 'eager';
  sizes?: string; // Responsive sizes
  quality?: number; // 1-100, default 80
  fill?: boolean; // Fill parent container
  className?: string;
}

<SanityImage
  image={heroImage}
  alt="Hero banner"
  priority={true}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
/>
```

**Sanity CDN URL Generation**:
```typescript
function buildImageUrl(
  baseUrl: string,
  options: { width?: number; height?: number; quality?: number; format?: string }
): string {
  const params = new URLSearchParams();
  if (options.width) params.set('w', String(options.width));
  if (options.height) params.set('h', String(options.height));
  if (options.quality) params.set('q', String(options.quality));
  if (options.format) params.set('fm', options.format);

  return `${baseUrl}?${params.toString()}`;
}
```

**Acceptance Criteria**:
- Component generates correct srcset
- Sizes attribute calculated accurately
- Works with all Sanity image types
- TypeScript types fully typed

---

### ✅ 3.2.2 Add Priority/Loading Hints Field to Image Schema

**Status**: ⬜ TODO
**Files**: `src/sanity/schemaTypes/objects/customImage.ts`

**Requirements**:
- Extend Sanity image schema with `loadingHint` field
- Add `priority` boolean (for above-fold images)
- Add `loading` dropdown: `'lazy' | 'eager' | 'auto'`
- Add default values based on image position
- Update TypeScript types via `pnpm sanitize:types`

**Enhanced Schema**:
```typescript
export default defineType({
  name: 'customImage',
  type: 'image',
  options: {
    hotspot: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'string',
      title: 'Alternative Text',
      validation: Rule => Rule.required().error('Alt text is required for accessibility')
    },
    {
      name: 'priority',
      type: 'boolean',
      title: 'Priority Loading',
      description: 'Enable for above-the-fold images (hero, logo)',
      initialValue: false
    },
    {
      name: 'loading',
      type: 'string',
      title: 'Loading Strategy',
      options: {
        list: [
          { title: 'Lazy (default)', value: 'lazy' },
          { title: 'Eager (load immediately)', value: 'eager' },
          { title: 'Auto (browser decides)', value: 'auto' }
        ]
      },
      initialValue: 'lazy'
    },
    {
      name: 'caption',
      type: 'string',
      title: 'Caption',
      description: 'Optional caption displayed below image'
    }
  ]
});
```

**Acceptance Criteria**:
- Schema compiles without errors
- Loading hints available in Studio
- Default values set appropriately
- Types regenerated successfully

---

### ✅ 3.2.3 Implement WebP/AVIF Support with Fallbacks

**Status**: ⬜ TODO
**Files**: `src/components/SanityImage.tsx`, `next.config.ts`

**Requirements**:
- Configure Next.js to serve WebP/AVIF via Sanity CDN
- Add automatic format detection based on browser support
- Implement fallback to JPEG/PNG for older browsers
- Add format preference order: AVIF → WebP → Original
- Test across browsers (Chrome, Safari, Firefox)

**Next.js Config**:
```typescript
// next.config.ts
const config: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'], // Preferred formats
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      }
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  }
};
```

**Format Detection**:
```typescript
function getOptimalFormat(acceptHeader: string): 'avif' | 'webp' | 'jpg' {
  if (acceptHeader.includes('image/avif')) return 'avif';
  if (acceptHeader.includes('image/webp')) return 'webp';
  return 'jpg';
}
```

**Acceptance Criteria**:
- AVIF served to supporting browsers
- WebP served as fallback
- Original format served to legacy browsers
- No broken images in any browser

---

### ✅ 3.2.4 Add Image Dimension Validation (Prevent CLS)

**Status**: ⬜ TODO
**Files**: `src/components/SanityImage.tsx`, `src/lib/image-validator.ts`

**Requirements**:
- Extract width/height from Sanity image metadata
- Pass dimensions to Next.js `<Image>` component
- Validate dimensions exist before rendering
- Add fallback dimensions if metadata missing
- Calculate aspect ratio for responsive sizing
- Add ESLint rule to enforce dimensions

**Dimension Extraction**:
```typescript
function getImageDimensions(image: SanityImageAsset): { width: number; height: number } {
  const { width, height } = image.asset.metadata.dimensions;

  if (!width || !height) {
    console.error('Image missing dimensions:', image.asset._ref);
    return { width: 1200, height: 630 }; // Fallback OG image size
  }

  return { width, height };
}
```

**Aspect Ratio Calculation**:
```typescript
function calculateAspectRatio(width: number, height: number): string {
  return `${width} / ${height}`;
}

// Usage in component
<Image
  src={imageUrl}
  width={width}
  height={height}
  style={{ aspectRatio: calculateAspectRatio(width, height) }}
/>
```

**ESLint Rule**:
```json
{
  "rules": {
    "jsx-a11y/alt-text": ["error", {
      "elements": ["img"],
      "img": ["Image"]
    }]
  }
}
```

**Acceptance Criteria**:
- All images have width/height attributes
- CLS score = 0 (no layout shift)
- Missing dimensions logged as errors
- ESLint enforces dimension props

---

### ✅ 3.2.5 Configure Lazy Loading by Default

**Status**: ⬜ TODO
**Files**: `src/components/SanityImage.tsx`, section components

**Requirements**:
- Set `loading="lazy"` as default for all images
- Override with `priority={true}` for above-fold images
- Identify critical images (hero, logo) and mark as priority
- Add intersection observer for manual lazy loading (if needed)
- Test lazy loading in Lighthouse

**Priority Image Detection**:
```typescript
// In hero sections, first image should be priority
<SanityImage
  image={section.backgroundImage}
  alt={section.heading}
  priority={true} // Above-the-fold
  loading="eager"
/>

// Below-fold images
<SanityImage
  image={testimonial.avatar}
  alt={testimonial.name}
  loading="lazy" // Default
/>
```

**Automatic Priority Detection**:
```typescript
interface SanityImageProps {
  image: SanityImageAsset;
  alt: string;
  priority?: boolean;
  autoPriority?: boolean; // Auto-detect if above fold
}

function SanityImage({ image, alt, priority, autoPriority = false }: SanityImageProps) {
  const isPriority = priority || (autoPriority && isAboveFold());

  return (
    <Image
      src={buildImageUrl(image)}
      alt={alt}
      loading={isPriority ? 'eager' : 'lazy'}
      priority={isPriority}
    />
  );
}
```

**Acceptance Criteria**:
- Lazy loading enabled by default
- Priority images load immediately
- Lighthouse audit passes (lazy loading detected)
- No above-fold images lazy-loaded

---

### ✅ 3.2.6 Add Blur Placeholder Generation

**Status**: ⬜ TODO
**Files**: `src/components/SanityImage.tsx`, `src/lib/image-utils.ts`

**Requirements**:
- Use Sanity LQIP (Low-Quality Image Placeholder) metadata
- Implement blur-up effect during image load
- Generate base64 blur placeholder from LQIP
- Add smooth transition when image loads
- Fallback to solid color if LQIP unavailable

**LQIP Implementation**:
```typescript
function getLQIP(image: SanityImageAsset): string | undefined {
  return image.asset.metadata?.lqip; // Base64 blur placeholder
}

<Image
  src={imageUrl}
  alt={alt}
  placeholder="blur"
  blurDataURL={getLQIP(image) || '/default-blur.jpg'}
/>
```

**CSS Transition**:
```css
.image-container {
  position: relative;
  overflow: hidden;
}

.image-container img {
  transition: opacity 0.3s ease-in-out;
  opacity: 0;
}

.image-container img[data-loaded="true"] {
  opacity: 1;
}
```

**Fallback Color**:
```typescript
function getImagePlaceholder(image: SanityImageAsset): string {
  const lqip = image.asset.metadata?.lqip;
  if (lqip) return lqip;

  // Extract dominant color or use default
  const palette = image.asset.metadata?.palette;
  const dominantColor = palette?.dominant?.background || '#f0f0f0';

  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect fill='${dominantColor}' width='1' height='1'/%3E%3C/svg%3E`;
}
```

**Acceptance Criteria**:
- LQIP blur placeholder shows during load
- Smooth transition when image loads
- Fallback to solid color works
- No flash of unstyled content

---

### ✅ 3.2.7 Implement Image CDN Optimization Parameters

**Status**: ⬜ TODO
**Files**: `src/lib/image-cdn.ts`, `src/components/SanityImage.tsx`

**Requirements**:
- Build URL parameter builder for Sanity CDN
- Support width, height, quality, format, fit, crop
- Implement smart defaults (quality: 80, format: auto)
- Add auto-format detection based on browser
- Cache CDN URLs for performance

**CDN URL Builder**:
```typescript
interface ImageCDNOptions {
  width?: number;
  height?: number;
  quality?: number; // 1-100
  format?: 'jpg' | 'png' | 'webp' | 'avif' | 'auto';
  fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min';
  crop?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'focalpoint';
  auto?: 'format'; // Auto-detect optimal format
  dpr?: number; // Device pixel ratio (1, 2, 3)
}

function buildSanityCDNUrl(
  imageRef: string,
  projectId: string,
  dataset: string,
  options: ImageCDNOptions = {}
): string {
  const baseUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${imageRef}`;

  const params = new URLSearchParams();
  if (options.width) params.set('w', String(options.width));
  if (options.height) params.set('h', String(options.height));
  if (options.quality) params.set('q', String(options.quality));
  if (options.format) params.set('fm', options.format);
  if (options.fit) params.set('fit', options.fit);
  if (options.crop) params.set('crop', options.crop);
  if (options.auto) params.set('auto', options.auto);
  if (options.dpr) params.set('dpr', String(options.dpr));

  return `${baseUrl}?${params.toString()}`;
}
```

**Smart Defaults**:
```typescript
const DEFAULT_OPTIONS: ImageCDNOptions = {
  quality: 80,
  format: 'auto',
  fit: 'max',
  auto: 'format'
};
```

**Acceptance Criteria**:
- CDN URL generation works for all options
- Smart defaults applied automatically
- URL caching improves performance
- Browser-specific formats served correctly

---

### ✅ 3.2.8 Create Image Performance Tests

**Status**: ⬜ TODO
**Files**: `tests/performance/image-optimization.spec.ts`

**Requirements**:
- Test image formats (WebP/AVIF served correctly)
- Test lazy loading (images below fold not loaded immediately)
- Test CLS (no layout shift)
- Test LCP (Largest Contentful Paint < 2.5s)
- Test image dimensions (all images have width/height)
- Test blur placeholders (LQIP displayed)
- Test responsive images (srcset generated)

**Test Cases**:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Image Optimization', () => {
  test('serves WebP format to supporting browsers', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('img');
    const firstImage = images.first();
    const src = await firstImage.getAttribute('src');

    expect(src).toContain('fm=webp');
  });

  test('all images have width and height attributes', async ({ page }) => {
    await page.goto('/');

    const images = await page.locator('img').all();

    for (const img of images) {
      const width = await img.getAttribute('width');
      const height = await img.getAttribute('height');

      expect(width).toBeTruthy();
      expect(height).toBeTruthy();
    }
  });

  test('lazy loads below-fold images', async ({ page }) => {
    await page.goto('/');

    const belowFoldImage = page.locator('[data-below-fold] img').first();
    const loading = await belowFoldImage.getAttribute('loading');

    expect(loading).toBe('lazy');
  });

  test('priority loads above-fold images', async ({ page }) => {
    await page.goto('/');

    const heroImage = page.locator('[data-hero] img').first();
    const fetchPriority = await heroImage.getAttribute('fetchpriority');

    expect(fetchPriority).toBe('high');
  });

  test('CLS is zero (no layout shift)', async ({ page }) => {
    await page.goto('/');

    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
        });
        observer.observe({ type: 'layout-shift', buffered: true });

        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 3000);
      });
    });

    expect(cls).toBeLessThan(0.1); // Good CLS score
  });

  test('LCP occurs within 2.5 seconds', async ({ page }) => {
    await page.goto('/');

    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          resolve(lastEntry.renderTime || lastEntry.loadTime);
        });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });

        setTimeout(() => {
          observer.disconnect();
        }, 5000);
      });
    });

    expect(lcp).toBeLessThan(2500); // 2.5 seconds
  });

  test('blur placeholder displays before image loads', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const image = page.locator('img').first();
    const blurDataURL = await image.getAttribute('blurdataurl');

    expect(blurDataURL).toBeTruthy();
    expect(blurDataURL).toMatch(/^data:image/);
  });

  test('responsive images have srcset', async ({ page }) => {
    await page.goto('/');

    const image = page.locator('img').first();
    const srcset = await image.getAttribute('srcset');

    expect(srcset).toBeTruthy();
    expect(srcset).toContain('1x');
    expect(srcset).toContain('2x');
  });
});
```

**Acceptance Criteria**:
- All image tests pass
- WebP/AVIF format detection works
- Lazy loading validated
- CLS = 0 confirmed
- LCP < 2.5s confirmed
- Dimensions validated on all images

---

## Deliverables

### New Files Created (4)
1. `src/components/SanityImage.tsx` - Optimized image component
2. `src/lib/image-cdn.ts` - CDN URL builder
3. `src/lib/image-validator.ts` - Dimension validation
4. `tests/performance/image-optimization.spec.ts` - Performance tests

### Modified Files (5)
1. `src/sanity/schemaTypes/objects/customImage.ts` - Enhanced schema
2. `next.config.ts` - Image optimization config
3. `src/components/sections/*` - Update to use SanityImage
4. `src/sanity/queries.ts` - Include LQIP/dimensions in queries
5. `.eslintrc.json` - Add image dimension rules

### Package.json Scripts to Add
```json
{
  "scripts": {
    "test:images": "playwright test tests/performance/image-optimization.spec.ts",
    "test:images:headed": "playwright test tests/performance/image-optimization.spec.ts --headed"
  }
}
```

---

## Testing Checklist

- [ ] WebP/AVIF formats served correctly
- [ ] Lazy loading works for below-fold images
- [ ] Priority loading works for above-fold images
- [ ] All images have width/height attributes
- [ ] CLS score = 0 (no layout shift)
- [ ] LCP < 2.5s on 3G connection
- [ ] Blur placeholders display correctly
- [ ] Responsive images have srcset
- [ ] Sanity CDN parameters work
- [ ] Fallback formats work in older browsers
- [ ] All performance tests pass

---

## Success Metrics

- ✅ LCP < 2.5s on 3G connection
- ✅ CLS = 0 (zero layout shift)
- ✅ Images < 100KB at 1x resolution
- ✅ 100% of images have dimensions
- ✅ WebP/AVIF support with fallbacks
- ✅ Lazy loading implemented correctly
- ✅ Lighthouse Image audit score = 100

---

## Migration Guide

### Updating Existing Components

**Before**:
```tsx
<img src={image.asset.url} alt={image.alt} />
```

**After**:
```tsx
<SanityImage
  image={image}
  alt={image.alt}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### Updating GROQ Queries

**Before**:
```typescript
`image { asset->{ url } }`
```

**After**:
```typescript
`image {
  asset->{
    _id,
    url,
    metadata {
      lqip,
      dimensions { width, height },
      palette { dominant { background } }
    }
  },
  alt,
  priority,
  loading
}`
```

---

## Next Steps After Completion

Once Phase 3.2 is complete, move to:
- **Phase 3.3**: Performance Monitoring & Web Vitals
