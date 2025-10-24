import { MetadataRoute } from 'next'
import { groq } from 'next-sanity'
import { sanity } from '@/sanity/client'
import { env } from '@/lib/env'
import { urlFor } from '@/sanity/lib/image'

type PageRecord = {
  slug?: string
  updatedAt?: string
  heroImage?: {
    alt?: string
    asset?: {
      url?: string
    }
  }
}

type LocationSummary = {
  slug?: string
  updatedAt?: string
  heroImage?: {
    alt?: string
    asset?: {
      url?: string
    }
  }
}

type ServiceSummaryWithLocations = {
  slug?: string
  updatedAt?: string
  heroImage?: {
    alt?: string
    asset?: {
      url?: string
    }
  }
  locations?: LocationSummary[]
}

const now = new Date()

const sitemapQuery = groq`{
  "pages": *[_type == "page" && defined(slug.current)]{
    "slug": slug.current,
    "updatedAt": coalesce(_updatedAt, _createdAt),
    heroImage{
      alt,
      asset->{ url }
    }
  },
  "services": *[_type == "service" && defined(slug.current)]{
    "slug": slug.current,
    "updatedAt": coalesce(_updatedAt, _createdAt),
    heroImage{
      alt,
      asset->{ url }
    },
    "locations": locations[]->{
      "slug": slug.current,
      "updatedAt": coalesce(_updatedAt, _createdAt),
      heroImage{
        alt,
        asset->{ url }
      }
    }
  },
  "locations": *[_type == "location" && defined(slug.current)]{
    "slug": slug.current,
    "updatedAt": coalesce(_updatedAt, _createdAt),
    heroImage{
      alt,
      asset->{ url }
    }
  }
}`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '')

  const {
    pages = [],
    services = [],
    locations = [],
  } = await sanity.fetch<{
    pages?: PageRecord[]
    services?: ServiceSummaryWithLocations[]
    locations?: LocationSummary[]
  }>(sitemapQuery, {}, { perspective: 'published' })

  const urls: MetadataRoute.Sitemap = [
    { url: `${base}`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/services`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/locations`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
  ]

  // Helper function to build image URL with proper dimensions for SEO
  const buildImageUrl = (imageData?: PageRecord['heroImage']): string | null => {
    if (!imageData?.asset?.url) return null
    try {
      // Use urlFor to create an absolute URL with SEO-friendly dimensions
      const imageUrl = urlFor(imageData).width(1200).height(630).fit('crop').url()
      // Ensure absolute URL
      return imageUrl && imageUrl.startsWith('http') ? imageUrl : `https:${imageUrl}`
    } catch (error) {
      console.warn('Failed to build image URL:', error)
      return null
    }
  }

  // Generic pages - lower priority
  for (const page of pages) {
    if (!page?.slug || page.slug === 'home') continue
    const imageUrl = buildImageUrl(page.heroImage)
    urls.push({
      url: `${base}/${page.slug}`,
      lastModified: page.updatedAt ? new Date(page.updatedAt) : now,
      changeFrequency: 'monthly',
      priority: 0.6,
      images: imageUrl ? [imageUrl] : undefined,
    })
  }

  // Individual services - high priority
  for (const service of services) {
    if (!service?.slug) continue
    const lastModified = service.updatedAt ? new Date(service.updatedAt) : now
    const imageUrl = buildImageUrl(service.heroImage)
    urls.push({
      url: `${base}/services/${service.slug}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
      images: imageUrl ? [imageUrl] : undefined,
    })

    // Service + Location combinations - HIGHEST PRIORITY for local SEO
    if (Array.isArray(service.locations)) {
      for (const location of service.locations) {
        if (!location?.slug) continue
        const locationUpdated = location.updatedAt ? new Date(location.updatedAt) : lastModified
        // Use service image if available, fallback to location image
        const combinedImageUrl =
          buildImageUrl(service.heroImage) || buildImageUrl(location.heroImage)
        urls.push({
          url: `${base}/services/${service.slug}-${location.slug}`,
          lastModified: locationUpdated > lastModified ? locationUpdated : lastModified,
          changeFrequency: 'weekly',
          priority: 0.85, // Higher than single pages for local SEO
          images: combinedImageUrl ? [combinedImageUrl] : undefined,
        })
      }
    }
  }

  // Individual locations - high priority
  for (const location of locations) {
    if (!location?.slug) continue
    const imageUrl = buildImageUrl(location.heroImage)
    urls.push({
      url: `${base}/locations/${location.slug}`,
      lastModified: location.updatedAt ? new Date(location.updatedAt) : now,
      changeFrequency: 'weekly',
      priority: 0.8,
      images: imageUrl ? [imageUrl] : undefined,
    })
  }

  return urls
}
