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
} from '@/types/sanity'

type GlobalDataset = {
  site: SiteSettings | null
  navigation: Navigation | null
  tokens: Tokens | null
  services: ServiceSummary[]
  locations: LocationSummary[]
}

const fetchOptions = { perspective: 'published' as const, next: { revalidate: 120 } }

export async function getGlobalDataset(): Promise<GlobalDataset> {
  const data = await sanity.fetch<Partial<GlobalDataset>>(globalSettingsQ, {}, fetchOptions)

  return {
    site: data.site ?? null,
    navigation: data.navigation ?? null,
    tokens: data.tokens ?? null,
    services: data.services ?? [],
    locations: data.locations ?? [],
  }
}

export async function getPageBySlug(slug: string): Promise<PageDocument | null> {
  return sanity.fetch<PageDocument | null>(pageBySlugQ, { slug }, fetchOptions)
}

export async function getServiceBySlug(slug: string): Promise<ServiceDetail | null> {
  return sanity.fetch<ServiceDetail | null>(serviceBySlugQ, { slug }, fetchOptions)
}

export async function getLocationBySlug(slug: string) {
  return sanity.fetch(locationBySlugQ, { slug }, fetchOptions)
}

export async function listServices(): Promise<ServiceSummary[]> {
  return sanity.fetch<ServiceSummary[]>(servicesListQ, {}, fetchOptions)
}

export async function listLocations(): Promise<LocationSummary[]> {
  return sanity.fetch<LocationSummary[]>(locationsListQ, {}, fetchOptions)
}

export async function listOffers(): Promise<OfferSummary[]> {
  return sanity.fetch<OfferSummary[]>(offersListQ, {}, fetchOptions)
}
