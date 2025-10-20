import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Container from '@/components/layout/Container'
import Portable from '@/components/Portable'
import ServiceCard from '@/components/cards/ServiceCard'
import type { ServiceSummary } from '@/types/sanity'
import { buildSeo } from '@/lib/seo'
import { getGlobalDataset, getLocationBySlug } from '@/sanity/loaders'

type Params = { city: string }

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { city: slug } = await params
  const [location, global] = await Promise.all([getLocationBySlug(slug), getGlobalDataset()])
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.localbusiness.com'

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
    image: location.seo?.ogImage?.asset?.url ?? null,
  })
}

export default async function LocationPage({ params }: { params: Promise<Params> }) {
  const { city: slug } = await params
  const [location, global] = await Promise.all([getLocationBySlug(slug), getGlobalDataset()])

  if (!location) return notFound()

  const galleryItems = Array.isArray(location.gallery)
    ? (location.gallery as Array<{
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

  return (
    <main className="pb-16">
      <section className="bg-zinc-50 py-16">
        <Container className="space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Service Area</p>
          <h1 className="text-4xl font-semibold text-zinc-900">{location.city}</h1>
          <div className="prose prose-zinc max-w-none">
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
            <p className="text-xs text-zinc-500">
              Coordinates: {coordinates.lat}, {coordinates.lng}
            </p>
          ) : null}
        </Container>
      </section>

      {galleryItems.length ? (
        <section className="py-16">
          <Container>
            <h2 className="text-2xl font-semibold text-zinc-900">Recent work</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((item, index) =>
                item?.image?.asset?.url ? (
                  <figure key={index} className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                    <Image
                      src={item.image.asset.url}
                      alt={item.alt ?? ''}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 33vw, 100vw"
                    />
                  </figure>
                ) : null
              )}
            </div>
          </Container>
        </section>
      ) : null}

      {popularServices.length ? (
        <section className="border-y border-zinc-200 bg-white py-16">
          <Container className="space-y-6">
            <h2 className="text-2xl font-semibold text-zinc-900">Popular services in {location.city}</h2>
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

      {otherLocations.length ? (
        <section className="py-16">
          <Container className="space-y-6">
            <h2 className="text-2xl font-semibold text-zinc-900">Other nearby areas</h2>
            <ul className="flex flex-wrap gap-3 text-sm text-zinc-600">
              {otherLocations.map((item) => (
                <li key={item.slug}>
                  <Link href={`/locations/${item.slug}`} className="rounded-full border border-zinc-200 px-4 py-2 hover:border-zinc-400">
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
