/**
 * Sanity Type Helpers
 *
 * This file provides helper types and utilities for working with Sanity data.
 * It extends the generated types with commonly used patterns and utilities.
 */

/**
 * Extended Asset type with URL
 * The generated Asset type doesn't include url, but Sanity API returns it
 */
export interface SanityAssetWithUrl {
  _id: string
  _type: 'sanity.imageAsset'
  url: string
  metadata?: {
    lqip?: string
    dimensions?: {
      width: number
      height: number
      aspectRatio: number
    }
    palette?: {
      dominant?: {
        background?: string
        foreground?: string
      }
    }
  }
}

/**
 * Image type with asset that includes URL
 */
export interface SanityImageWithUrl {
  asset: SanityAssetWithUrl
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  alt?: string
}

/**
 * Helper to safely get image URL from Sanity image
 */
export function getImageUrl(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: { asset?: any } | null | undefined
): string | null {
  return image?.asset?.url ?? null
}

/**
 * Helper to safely get image alt text
 */
export function getImageAlt(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: { alt?: string; [key: string]: any } | null | undefined,
  fallback = ''
): string {
  return image?.alt ?? fallback
}

/**
 * Helper to get OG image from SEO field structure
 * Can accept socialMedia object or direct image object
 */
export function getOgImageUrl(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: any
): string | null {
  if (!input) return null

  // Check if it's a socialMedia object with ogImage
  if ('ogImage' in input) {
    return input.ogImage?.asset?.url ?? null
  }

  // Otherwise treat it as a direct image object
  if ('asset' in input) {
    return input.asset?.url ?? null
  }

  return null
}

/**
 * Script Override type
 */
export interface ScriptOverride {
  _key: string
  scriptKey: string
  enabled: boolean
}

/**
 * Portable Text content type (any array structure)
 */
export type PortableTextContent = Array<Record<string, unknown>>

/**
 * Helper to check if value is defined and not null
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}
