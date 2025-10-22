/**
 * Schema.org structured data builders for SEO
 * Generates LocalBusiness, Service, and BreadcrumbList JSON-LD
 */

import type { SiteSettings, ServiceDetail, LocationSummary, ServiceSummary } from '@/types'
import { portableTextToPlainText } from './portableText'
import { getImageUrl } from '@/types/sanity-helpers'

type Coordinates = { lat?: number; lng?: number }

/**
 * Generate LocalBusiness schema for location pages
 */
export function generateLocalBusinessSchema(
  location: LocationSummary & {
    map?: Coordinates
    localSEO?: { state?: string; zipCodes?: string[]; radius?: number }
  },
  services: ServiceSummary[],
  site: SiteSettings | null
) {
  if (!site) return null

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || ''

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}#business`,
    name: site.name || 'Local Business',
    image: getImageUrl(site.logo),
    url: `${baseUrl}/locations/${location.slug}`,
    telephone: site.phone,
    email: site.email,
    address: location.localSEO
      ? {
          '@type': 'PostalAddress',
          addressLocality: location.city,
          addressRegion: location.localSEO.state,
          postalCode: location.localSEO.zipCodes?.[0],
          addressCountry: 'US',
        }
      : undefined,
    geo:
      location.map?.lat && location.map?.lng
        ? {
            '@type': 'GeoCoordinates',
            latitude: location.map.lat,
            longitude: location.map.lng,
          }
        : undefined,
    areaServed:
      location.map?.lat && location.map?.lng && location.localSEO?.radius
        ? {
            '@type': 'GeoCircle',
            geoMidpoint: {
              '@type': 'GeoCoordinates',
              latitude: location.map.lat,
              longitude: location.map.lng,
            },
            geoRadius: `${location.localSEO.radius} mi`,
          }
        : undefined,
    hasOfferCatalog:
      services.length > 0
        ? {
            '@type': 'OfferCatalog',
            name: 'Services',
            itemListElement: services.map((service) => ({
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: service.title,
                description: service.intro ? portableTextToPlainText(service.intro) : undefined,
                url: `${baseUrl}/services/${service.slug}`,
              },
            })),
          }
        : undefined,
  }
}

/**
 * Generate Service schema for service pages
 */
export function generateServiceSchema(
  service: ServiceDetail,
  location: (LocationSummary & { localSEO?: { state?: string } }) | null,
  site: SiteSettings | null
) {
  if (!site) return null

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || ''

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${baseUrl}/services/${service.slug}#service`,
    name: service.title,
    description: service.intro ? portableTextToPlainText(service.intro) : undefined,
    provider: {
      '@type': 'LocalBusiness',
      name: site.name,
      url: baseUrl,
    },
    areaServed: location
      ? {
          '@type': 'City',
          name: location.city,
          containedInPlace: location.localSEO?.state
            ? {
                '@type': 'State',
                name: location.localSEO.state,
              }
            : undefined,
        }
      : undefined,
  }
}

/**
 * Generate BreadcrumbList schema for navigation
 */
export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ label: string; href: string }>,
  baseUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: `${baseUrl}${crumb.href}`,
    })),
  }
}
