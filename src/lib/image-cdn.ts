/**
 * Sanity Image CDN URL Builder
 *
 * Builds optimized image URLs using Sanity's image CDN parameters.
 * Supports width, height, quality, format, fit, crop, and DPR.
 *
 * @see https://www.sanity.io/docs/image-urls
 */

export interface ImageCDNOptions {
  /** Image width in pixels */
  width?: number
  /** Image height in pixels */
  height?: number
  /** Image quality (1-100). Default: 80 */
  quality?: number
  /** Image format. 'auto' detects optimal format based on browser support */
  format?: 'jpg' | 'png' | 'webp' | 'avif' | 'auto'
  /** How to fit the image in the bounding box */
  fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min'
  /** Crop mode (requires fit=crop) */
  crop?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'focalpoint'
  /** Auto-detect optimal format based on browser support */
  auto?: 'format'
  /** Device pixel ratio (1, 2, or 3) */
  dpr?: 1 | 2 | 3
  /** Blur amount for placeholder images (0-100) */
  blur?: number
  /** Sharpen amount (0-100) */
  sharpen?: number
}

/**
 * Smart default options for image optimization
 */
export const DEFAULT_CDN_OPTIONS: Partial<ImageCDNOptions> = {
  quality: 80,
  format: 'auto',
  fit: 'max',
  auto: 'format',
}

/**
 * Build a Sanity CDN URL with optimization parameters
 *
 * @param baseUrl - The base Sanity image URL (from asset.url)
 * @param options - CDN parameters to apply
 * @returns Optimized image URL
 *
 * @example
 * ```ts
 * const url = buildSanityCDNUrl(image.asset.url, {
 *   width: 800,
 *   quality: 85,
 *   format: 'webp'
 * })
 * ```
 */
export function buildSanityCDNUrl(
  baseUrl: string,
  options: ImageCDNOptions = {}
): string {
  // Merge with defaults
  const opts = { ...DEFAULT_CDN_OPTIONS, ...options }

  // Build URL search params
  const params = new URLSearchParams()

  if (opts.width) params.set('w', String(opts.width))
  if (opts.height) params.set('h', String(opts.height))
  if (opts.quality) params.set('q', String(opts.quality))
  if (opts.format) params.set('fm', opts.format)
  if (opts.fit) params.set('fit', opts.fit)
  if (opts.crop) params.set('crop', opts.crop)
  if (opts.auto) params.set('auto', opts.auto)
  if (opts.dpr) params.set('dpr', String(opts.dpr))
  if (opts.blur) params.set('blur', String(opts.blur))
  if (opts.sharpen) params.set('sharpen', String(opts.sharpen))

  const queryString = params.toString()

  // Return URL with or without existing query params
  if (baseUrl.includes('?')) {
    return `${baseUrl}&${queryString}`
  }

  return `${baseUrl}?${queryString}`
}

/**
 * Generate srcset string for responsive images
 *
 * @param baseUrl - The base Sanity image URL
 * @param widths - Array of widths to generate
 * @param options - Additional CDN options
 * @returns srcset string
 *
 * @example
 * ```ts
 * const srcset = generateSrcSet(image.asset.url, [400, 800, 1200])
 * // "https://cdn.sanity.io/...?w=400 400w, https://cdn.sanity.io/...?w=800 800w, ..."
 * ```
 */
export function generateSrcSet(
  baseUrl: string,
  widths: number[],
  options: Omit<ImageCDNOptions, 'width'> = {}
): string {
  return widths
    .map((width) => {
      const url = buildSanityCDNUrl(baseUrl, { ...options, width })
      return `${url} ${width}w`
    })
    .join(', ')
}

/**
 * Generate sizes attribute based on breakpoints
 *
 * @param breakpoints - Map of media queries to viewport widths
 * @param defaultSize - Default size when no media query matches
 * @returns sizes attribute string
 *
 * @example
 * ```ts
 * const sizes = generateSizesAttribute({
 *   '(max-width: 768px)': '100vw',
 *   '(max-width: 1200px)': '80vw'
 * }, '1200px')
 * // "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
 * ```
 */
export function generateSizesAttribute(
  breakpoints: Record<string, string>,
  defaultSize: string
): string {
  const mediaQueries = Object.entries(breakpoints)
    .map(([query, size]) => `${query} ${size}`)
    .join(', ')

  return `${mediaQueries}, ${defaultSize}`
}

/**
 * Get optimal image width based on container size and DPR
 *
 * @param containerWidth - Width of container in pixels
 * @param dpr - Device pixel ratio (default: 1)
 * @returns Optimal image width
 *
 * @example
 * ```ts
 * const width = getOptimalImageWidth(800, 2) // 1600px for retina
 * ```
 */
export function getOptimalImageWidth(containerWidth: number, dpr = 1): number {
  return Math.ceil(containerWidth * dpr)
}

/**
 * Common responsive image configurations
 */
export const RESPONSIVE_PRESETS = {
  hero: {
    widths: [640, 828, 1200, 1920],
    sizes: '100vw',
    quality: 85,
  },
  card: {
    widths: [300, 600, 900],
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    quality: 80,
  },
  thumbnail: {
    widths: [100, 200, 300],
    sizes: '(max-width: 768px) 25vw, 150px',
    quality: 75,
  },
  fullWidth: {
    widths: [640, 828, 1200, 1920, 2048],
    sizes: '100vw',
    quality: 85,
  },
  halfWidth: {
    widths: [400, 600, 900, 1200],
    sizes: '(max-width: 768px) 100vw, 50vw',
    quality: 80,
  },
} as const

/**
 * Extract image reference from Sanity asset
 *
 * @param assetRef - Sanity asset reference (_ref field)
 * @returns Image reference parts
 */
export function parseImageRef(assetRef: string): {
  id: string
  width: number
  height: number
  format: string
} | null {
  // Format: image-{id}-{width}x{height}-{format}
  const match = assetRef.match(/image-([a-z0-9]+)-(\d+)x(\d+)-(\w+)/)

  if (!match) return null

  return {
    id: match[1],
    width: parseInt(match[2], 10),
    height: parseInt(match[3], 10),
    format: match[4],
  }
}
