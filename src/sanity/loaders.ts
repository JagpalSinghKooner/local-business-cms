import { cache } from 'react'
import { sanity } from './client'
import {
  globalSettingsQ,
  pageBySlugQ,
  serviceBySlugQ,
  locationBySlugQ,
  servicesListQ,
  locationsListQ,
  offersListQ,
} from './queries'
import type {
  Navigation,
  OfferSummary,
  PageDocument,
  SiteSettings,
  Tokens,
  LocationSummary,
  ServiceSummary,
  ServiceDetail,
  PageSummary,
} from '@/types'
import { getSiteCachePrefix } from '@/lib/site-detection'

type GlobalDataset = {
  site: SiteSettings | null
  navigation: Navigation | null
  tokens: Tokens | null
  services: ServiceSummary[]
  locations: LocationSummary[]
  pages: PageSummary[]
}

/**
 * Fetch options for Sanity queries
 *
 * Cache isolation notes:
 * - React cache() provides request-level deduplication
 * - Next.js ISR provides time-based revalidation (120s)
 * - Dataset-scoped tags prevent cross-tenant cache collisions
 * - Published content uses ISR, draft content bypasses cache
 *
 * Multi-tenant approach:
 * - Each dataset = separate deployment = natural cache isolation
 * - Cache tags include dataset ID to prevent cross-site pollution
 * - No shared cache between different business sites
 */
const fetchOptions = {
  perspective: 'published' as const,
  next: {
    revalidate: 120,
    tags: [
      'sanity',
      `dataset-${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
      `project-${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`,
      getSiteCachePrefix(),
    ],
  },
}

/**
 * Extended cache options for infrequently-changing data (locations, settings)
 * Locations and site settings rarely change, so we can cache them longer
 */
const extendedFetchOptions = {
  perspective: 'published' as const,
  next: {
    revalidate: 3600, // 1 hour cache for locations
    tags: [
      'sanity',
      `dataset-${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
      `project-${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`,
      getSiteCachePrefix(),
    ],
  },
}

/**
 * Fetches global dataset (site settings, navigation, tokens, services, locations, pages)
 * Uses React cache for request deduplication across components
 */
export const getGlobalDataset = cache(async (): Promise<GlobalDataset> => {
  try {
    const data = await sanity.fetch<Partial<GlobalDataset>>(globalSettingsQ, {}, fetchOptions)

    return {
      site: data.site ?? null,
      navigation: data.navigation ?? null,
      tokens: data.tokens ?? null,
      services: data.services ?? [],
      locations: data.locations ?? [],
      pages: data.pages ?? [],
    }
  } catch (error) {
    console.error('Failed to fetch global dataset from Sanity:', error)

    // Return safe defaults instead of crashing
    return {
      site: null,
      navigation: null,
      tokens: null,
      services: [],
      locations: [],
      pages: [],
    }
  }
})

/**
 * Fetches a page by slug
 * Returns null if not found or if fetch fails
 */
export const getPageBySlug = cache(async (slug: string): Promise<PageDocument | null> => {
  try {
    return await sanity.fetch<PageDocument | null>(pageBySlugQ, { slug }, fetchOptions)
  } catch (error) {
    console.error(`Failed to fetch page with slug "${slug}":`, error)
    return null
  }
})

/**
 * Fetches a service by slug
 * Returns null if not found or if fetch fails
 */
export const getServiceBySlug = cache(async (slug: string): Promise<ServiceDetail | null> => {
  try {
    return await sanity.fetch<ServiceDetail | null>(serviceBySlugQ, { slug }, fetchOptions)
  } catch (error) {
    console.error(`Failed to fetch service with slug "${slug}":`, error)
    return null
  }
})

/**
 * Fetches a location by slug
 * Returns null if not found or if fetch fails
 */
export const getLocationBySlug = cache(async (slug: string) => {
  try {
    return await sanity.fetch(locationBySlugQ, { slug }, fetchOptions)
  } catch (error) {
    console.error(`Failed to fetch location with slug "${slug}":`, error)
    return null
  }
})

/**
 * Fetches list of all services
 * Returns empty array if fetch fails
 */
export const listServices = cache(async (): Promise<ServiceSummary[]> => {
  try {
    return await sanity.fetch<ServiceSummary[]>(servicesListQ, {}, fetchOptions)
  } catch (error) {
    console.error('Failed to fetch services list:', error)
    return []
  }
})

/**
 * Fetches list of all locations
 * Returns empty array if fetch fails
 * Uses extended cache (1 hour) as locations rarely change
 */
export const listLocations = cache(async (): Promise<LocationSummary[]> => {
  try {
    return await sanity.fetch<LocationSummary[]>(locationsListQ, {}, extendedFetchOptions)
  } catch (error) {
    console.error('Failed to fetch locations list:', error)
    return []
  }
})

/**
 * Fetches list of all offers
 * Returns empty array if fetch fails
 */
export const listOffers = cache(async (): Promise<OfferSummary[]> => {
  try {
    return await sanity.fetch<OfferSummary[]>(offersListQ, {}, fetchOptions)
  } catch (error) {
    console.error('Failed to fetch offers list:', error)
    return []
  }
})
