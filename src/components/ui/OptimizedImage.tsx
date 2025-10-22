import Image from 'next/image'
import { getImageUrl, getImageAlt } from '@/types/sanity-helpers'

export type ImageLoadingPriority = 'eager' | 'lazy' | 'auto'

export type OptimizedImageProps = {
  image?: {
    asset?: {
      _ref?: string
      _type?: string
    } | null
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
 * - Fallback handling for missing images
 */
export default function OptimizedImage({
  image,
  alt,
  fill = false,
  width,
  height,
  className,
  sizes,
  priority: priorityProp = 'auto',
  objectFit = 'cover',
}: OptimizedImageProps) {
  const imageUrl = getImageUrl(image)

  // Handle missing images gracefully
  if (!imageUrl) {
    return null
  }

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
    ...(fill && { fill: true }),
    ...(!fill && width && { width }),
    ...(!fill && height && { height }),
    ...(sizes && { sizes }),
    ...(isEager && { priority: true }),
    ...(isLazy && { loading: 'lazy' as const }),
  }

  // Validate dimensions for non-fill images to prevent CLS
  if (!fill && (!width || !height)) {
    console.warn(
      `OptimizedImage: Missing width or height for image ${imageUrl.substring(0, 50)}... This may cause Cumulative Layout Shift (CLS).`
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
