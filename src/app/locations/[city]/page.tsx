import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { PreviewSuspense } from '@/components/preview/PreviewSuspense'
import Portable from '@/components/Portable'
import ServiceCard from '@/components/cards/ServiceCard'
import type { ServiceSummary } from '@/types'
import { buildSeo } from '@/lib/seo'
import { buildBreadcrumbs } from '@/lib/breadcrumbs'
import { getGlobalDataset, getLocationBySlug } from '@/sanity/loaders'
import Breadcrumbs from '@/components/navigation/Breadcrumbs'
import Container from '@/components/layout/Container'
import LocationPreview from '@/components/preview/LocationPreview'
import { env } from '@/lib/env'
import { getImageUrl, getImageAlt } from '@/types/sanity-helpers'

type Params = { city: string }

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { city: slug } = await params
  const [location, global] = await Promise.all([getLocationBySlug(slug), getGlobalDataset()])
  const baseUrl = env.NEXT_PUBLIC_SITE_URL

  if (!location) {
    return buildSeo({
      baseUrl,
      path: `/locations/${slug}`,
      title: 'Location',
      description: global.site?.metaDescription,
    })
  }

  return buildSeo({
    baseUrl,
    path: `/locations/${slug}`,
    title: location.seo?.title || `${location.city} Service Area`,
    description: location.seo?.description,
    image: getImageUrl(location.seo?.ogImage) ?? null,
  })
}

export default async function LocationPage({ params }: { params: Promise<Params> }) {
  const { city: slug } = await params
  const draft = await draftMode()
  if (draft.isEnabled) {
    return (
      <PreviewSuspense fallback={<div className="p-8 text-muted">Loading preview…</div>}>
        <LocationPreview slug={slug} />
      </PreviewSuspense>
    )
  }
  const [location, global] = await Promise.all([getLocationBySlug(slug), getGlobalDataset()])

  if (!location) return notFound()

  const galleryItems = Array.isArray(location.gallery)
    ? (location.gallery as Array<{
        _key: string
        image?: { alt?: string; asset?: { url?: string } }
        alt?: string
      }>)
    : []
  const popularServices = Array.isArray(location.services)
    ? (location.services as unknown as ServiceSummary[])
    : []
  const otherLocations = (global.locations ?? []).filter((item) => item.slug !== slug).slice(0, 6)
  const coordinates =
    location.map && typeof location.map === 'object'
      ? (location.map as { lat?: number; lng?: number })
      : undefined
  const breadcrumbs = buildBreadcrumbs({
    path: `/locations/${slug}`,
    currentLabel: location.city,
    settings: location.breadcrumbs ?? null,
    navigation: global.navigation,
    pages: global.pages,
    homeLabel: global.site?.name ?? 'Home',
  })
  const displayOptions = location.displayOptions ?? {}
  const showGallery = displayOptions.showGallery !== false
  const showPopularServices = displayOptions.showPopularServices !== false
  const showOtherLocations = displayOptions.showOtherLocations !== false

  return (
    <main className="pb-16">
      <Breadcrumbs trail={breadcrumbs} />
      <section className="bg-surface-muted py-16">
        <Container className="space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Service Area</p>
          <h1 className="text-4xl font-semibold text-strong">{location.city}</h1>
          <div className="prose prose-theme max-w-none">
            <Portable value={location.intro} />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="bg-brand inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Request service in {location.city}
            </Link>
          </div>
          {coordinates?.lat && coordinates?.lng ? (
            <p className="text-xs text-muted">
              Coordinates: {coordinates.lat}, {coordinates.lng}
            </p>
          ) : null}
        </Container>
      </section>

      {showGallery && galleryItems.length ? (
        <section className="py-16">
          <Container>
            <h2 className="text-2xl font-semibold text-strong">Recent work</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((item) => {
                const imageUrl = getImageUrl(item?.image)
                const imageAlt = getImageAlt(item, item?.alt ?? '')
                return imageUrl ? (
                  <figure key={item._key} className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                    <Image
                      src={imageUrl}
                      alt={imageAlt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 33vw, 100vw"
                    />
                  </figure>
                ) : null
              })}
            </div>
          </Container>
        </section>
      ) : null}

      {showPopularServices && popularServices.length ? (
        <section className="border-y border-divider bg-surface py-16">
          <Container className="space-y-6">
            <h2 className="text-2xl font-semibold text-strong">Popular services in {location.city}</h2>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {popularServices.map((service) => (
                <li key={service.slug}>
                  <ServiceCard service={service} locationSlug={location.slug} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {showOtherLocations && otherLocations.length ? (
        <section className="py-16">
          <Container className="space-y-6">
            <h2 className="text-2xl font-semibold text-strong">Other nearby areas</h2>
            <ul className="flex flex-wrap gap-3 text-sm text-muted">
              {otherLocations.map((item) => (
                <li key={item.slug}>
                  <Link href={`/locations/${item.slug}`} className="rounded-full border border-divider px-4 py-2 hover:border-brand">
                    {item.city}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
    </main>
  )
}
