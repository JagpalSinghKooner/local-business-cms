import Image from 'next/image'
import { getImageUrl, getImageAlt, type SanityAssetWithUrl } from '@/types/sanity-helpers'

export type ImageLoadingPriority = 'eager' | 'lazy' | 'auto'

export type OptimizedImageProps = {
  image?: {
    asset?: (Partial<SanityAssetWithUrl> & {
      _ref?: string
      _type?: string
    }) | null
    alt?: string
    hotspot?: {
      x?: number
      y?: number
      height?: number
      width?: number
    }
  } | null
  alt?: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  sizes?: string
  priority?: ImageLoadingPriority
  objectFit?: 'cover' | 'contain' | 'fill' | 'none'
  quality?: number
}

/**
 * Optimized image component with automatic WebP/AVIF support,
 * responsive sizing, and CMS-driven loading priorities.
 *
 * Features:
 * - Automatic format optimization (WebP/AVIF)
 * - Responsive srcset generation
 * - CMS-controlled loading priority
 * - Dimension validation to prevent CLS
 * - LQIP blur placeholders from Sanity
 * - Fallback handling for missing images
 */
export default function OptimizedImage({
  image,
  alt,
  fill = false,
  width: widthProp,
  height: heightProp,
  className,
  sizes,
  priority: priorityProp = 'auto',
  objectFit = 'cover',
  quality = 80,
}: OptimizedImageProps) {
  const imageUrl = getImageUrl(image)

  // Handle missing images gracefully
  if (!imageUrl) {
    return null
  }

  // Extract dimensions from Sanity metadata if available
  const metadataWidth = image?.asset?.metadata?.dimensions?.width
  const metadataHeight = image?.asset?.metadata?.dimensions?.height

  // Use provided dimensions, or fall back to metadata
  const width = widthProp ?? metadataWidth
  const height = heightProp ?? metadataHeight

  // Extract LQIP blur placeholder from Sanity metadata
  const lqip = image?.asset?.metadata?.lqip

  // Fallback to dominant color if LQIP not available
  const dominantColor = image?.asset?.metadata?.palette?.dominant?.background

  // Generate SVG placeholder from dominant color
  const colorPlaceholder = dominantColor
    ? `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect fill='${encodeURIComponent(dominantColor)}' width='1' height='1'/%3E%3C/svg%3E`
    : undefined

  const blurDataURL = lqip || colorPlaceholder

  // Determine loading priority
  // 'eager' = priority={true} (LCP candidate, above fold)
  // 'lazy' = priority={false} (below fold)
  // 'auto' = default Next.js behavior
  const isEager = priorityProp === 'eager'
  const isLazy = priorityProp === 'lazy'

  const imageProps = {
    src: imageUrl,
    alt: alt ?? getImageAlt(image) ?? '',
    className,
    quality,
    ...(fill && { fill: true }),
    ...(!fill && width && { width }),
    ...(!fill && height && { height }),
    ...(sizes && { sizes }),
    ...(isEager && { priority: true }),
    ...(isLazy && { loading: 'lazy' as const }),
    ...(blurDataURL && { placeholder: 'blur' as const, blurDataURL }),
  }

  // Validate dimensions for non-fill images to prevent CLS
  if (!fill && (!width || !height)) {
    console.warn(
      `OptimizedImage: Missing width or height for image ${imageUrl.substring(0, 50)}... This may cause Cumulative Layout Shift (CLS). Provide dimensions explicitly or ensure metadata.dimensions is fetched in GROQ query.`
    )
  }

  return (
    <Image
      {...imageProps}
      alt={imageProps.alt}
      style={fill ? { objectFit } : undefined}
      // Next.js automatically handles:
      // - WebP/AVIF format selection based on browser support
      // - Responsive srcset generation
      // - Image optimization via Sanity CDN
    />
  )
}
