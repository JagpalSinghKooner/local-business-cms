/**
 * Auto-generate SEO metadata when not provided manually
 * Templates for service, location, and service+location pages
 */

import type { ServiceDetail, LocationSummary, SiteSettings } from '@/types'
import { portableTextToPlainText } from './portableText'

type MetaTemplateData = {
  service?: ServiceDetail
  location?: LocationSummary & { localSEO?: { state?: string } }
  site: SiteSettings | null
  servicesCount?: number
}

/**
 * Generate meta description for service pages
 */
export function generateServiceMetaDescription(data: MetaTemplateData): string {
  const { service, site } = data

  if (!service || !site) return ''

  // Use manual SEO description if provided
  if (service.seo?.metaDescription) return service.seo.metaDescription

  // Auto-generate from service intro
  const introText = service.intro ? portableTextToPlainText(service.intro) : ''
  const truncatedIntro = introText.slice(0, 100)

  return `Professional ${service.title.toLowerCase()} services from ${site.name || 'our team'}. ${truncatedIntro}${introText.length > 100 ? '...' : ''}`
}

/**
 * Generate meta description for location pages
 */
export function generateLocationMetaDescription(data: MetaTemplateData): string {
  const { location, site, servicesCount = 0 } = data

  if (!location || !site) return ''

  const state = location.localSEO?.state || ''
  const stateText = state ? `, ${state}` : ''

  return `${site.name || 'We'} serve ${location.city}${stateText}. Offering ${servicesCount} professional services. Call ${site.phone || 'us'} today.`
}

/**
 * Generate meta description for service+location pages
 */
export function generateServiceLocationMetaDescription(data: MetaTemplateData): string {
  const { service, location, site } = data

  if (!service || !location || !site) return ''

  const state = location.localSEO?.state || ''
  const stateText = state ? `, ${state}` : ''
  const category = service.category?.title ? service.category.title.toLowerCase() : 'services'

  return `Expert ${service.title.toLowerCase()} in ${location.city}${stateText}. ${site.name || 'We'} provide professional ${category}. Call ${site.phone || 'us'} for a free quote.`
}

/**
 * Generate meta title for service+location pages
 */
export function generateServiceLocationTitle(data: MetaTemplateData): string {
  const { service, location, site } = data

  if (!service || !location) return ''

  const state = location.localSEO?.state || ''
  const stateText = state ? `, ${state}` : ''
  const siteName = site?.name ? ` | ${site.name}` : ''

  return `${service.title} in ${location.city}${stateText}${siteName}`
}

/**
 * Main template selector - determines which template to use
 */
export function generateMetaDescription(
  type: 'service' | 'location' | 'service-location',
  data: MetaTemplateData
): string {
  switch (type) {
    case 'service':
      return generateServiceMetaDescription(data)
    case 'location':
      return generateLocationMetaDescription(data)
    case 'service-location':
      return generateServiceLocationMetaDescription(data)
    default:
      return ''
  }
}

/**
 * Main template selector for titles
 */
export function generateMetaTitle(
  type: 'service' | 'location' | 'service-location',
  data: MetaTemplateData
): string {
  const { service, location, site } = data

  switch (type) {
    case 'service':
      return service?.seo?.metaTitle || service?.title || ''
    case 'location':
      return `Services in ${location?.city || ''}${site?.name ? ` | ${site.name}` : ''}`
    case 'service-location':
      return generateServiceLocationTitle(data)
    default:
      return ''
  }
}
