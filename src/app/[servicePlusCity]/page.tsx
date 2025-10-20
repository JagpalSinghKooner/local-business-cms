import Link from 'next/link'
import { notFound } from 'next/navigation'
import Container from '@/components/layout/Container'
import Portable from '@/components/Portable'
import ServiceCard from '@/components/cards/ServiceCard'
import { SectionRenderer } from '@/components/sections'
import { buildSeo } from '@/lib/seo'
import { portableTextToPlainText } from '@/lib/portableText'
import { getGlobalDataset, getLocationBySlug, getServiceBySlug, listOffers } from '@/sanity/loaders'

export const revalidate = 3600

type Params = { servicePlusCity: string }

type LocationRef = { city: string; slug: string }

type Parts = { serviceSlug: string; locationSlug: string }

function splitServiceAndCity(value: string, locations: LocationRef[]): Parts | null {
  const sorted = [...locations].sort((a, b) => b.slug.length - a.slug.length)
  for (const location of sorted) {
    const suffix = `-${location.slug}`
    if (value.endsWith(suffix)) {
      const serviceSlug = value.slice(0, value.length - suffix.length)
      if (serviceSlug) {
        return { serviceSlug, locationSlug: location.slug }
      }
    }
  }
  return null
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { servicePlusCity } = await params
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.localbusiness.com'
  const global = await getGlobalDataset()
  const parts = splitServiceAndCity(servicePlusCity, global.locations)

  if (!parts) {
    return buildSeo({
      baseUrl,
      path: `/${servicePlusCity}`,
      title: 'Service',
      description: global.site?.metaDescription,
    })
  }

  const [service, location] = await Promise.all([
    getServiceBySlug(parts.serviceSlug),
    getLocationBySlug(parts.locationSlug),
  ])

  if (!service || !location) {
    return buildSeo({
      baseUrl,
      path: `/${servicePlusCity}`,
      title: 'Service',
      description: global.site?.metaDescription,
    })
  }

  const introText = portableTextToPlainText(service.intro)

  return buildSeo({
    baseUrl,
    path: `/${servicePlusCity}`,
    title: `${service.title} in ${location.city}`,
    description: service.seo?.description || introText,
    image: service.seo?.ogImage?.asset?.url ?? service.heroImage?.asset?.url ?? null,
  })
}

export default async function CombinedPage({ params }: { params: Promise<Params> }) {
  const { servicePlusCity } = await params
  const [global, offers] = await Promise.all([getGlobalDataset(), listOffers()])
  const parts = splitServiceAndCity(servicePlusCity, global.locations)
  if (!parts) return notFound()

  const [service, location] = await Promise.all([
    getServiceBySlug(parts.serviceSlug),
    getLocationBySlug(parts.locationSlug),
  ])

  if (!service || !location) return notFound()

  const otherLocations = global.locations.filter((item) => item.slug !== location.slug).slice(0, 6)
  const otherServices = global.services.filter((item) => item.slug !== service.slug)
  const sections = Array.isArray(service.sections) ? service.sections : []
  const coordinates =
    location.map && typeof location.map === 'object'
      ? (location.map as { lat?: number; lng?: number })
      : undefined

  return (
    <main className="pb-16">
      <section className="bg-zinc-50 py-16">
        <Container className="space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Local Service</p>
          <h1 className="text-4xl font-semibold text-zinc-900">
            {service.title} in {location.city}
          </h1>
          {service.intro ? (
            <Portable value={service.intro.slice(0, 1)} className="mt-4 text-base text-zinc-600" />
          ) : null}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="bg-brand inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold transition hover:opacity-90"
            >
              Request service
            </Link>
            <Link
              href={`/services/${service.slug}`}
              className="inline-flex items-center rounded-full border border-zinc-300 px-5 py-2 text-sm font-semibold text-zinc-900 hover:border-zinc-500"
            >
              View full service
            </Link>
          </div>
        </Container>
      </section>

      {sections.length ? (
        <SectionRenderer
          sections={sections}
          services={global.services}
          locations={global.locations}
          offers={offers}
          site={global.site}
          pagePath={`/${servicePlusCity}`}
        />
      ) : null}

      {service.body ? (
        <section className="py-16">
          <Container className="grid gap-10 md:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-zinc-900">About this service</h2>
              <div className="prose prose-zinc max-w-none">
                <Portable value={service.body} />
              </div>
            </div>
          <div className="space-y-6 rounded-3xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm shadow-zinc-900/5">
            <h2 className="text-2xl font-semibold text-zinc-900">About {location.city}</h2>
            <div className="prose prose-zinc max-w-none text-sm">
              <Portable value={location.intro} />
            </div>
            <div className="space-y-2 text-sm text-zinc-600">
              {coordinates?.lat && coordinates?.lng ? (
                <p>
                  <span className="font-semibold text-zinc-700">Coordinates:</span> {coordinates.lat}, {coordinates.lng}
                </p>
              ) : null}
            </div>
          </div>
          </Container>
        </section>
      ) : null}

      {otherLocations.length ? (
        <section className="border-y border-zinc-200 bg-white py-16">
          <Container className="space-y-6">
            <h2 className="text-2xl font-semibold text-zinc-900">Nearby service areas</h2>
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

      {otherServices.length ? (
        <section className="py-16">
          <Container className="space-y-6">
            <h2 className="text-2xl font-semibold text-zinc-900">Related services</h2>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {otherServices.map((item) => (
                <li key={item.slug}>
                  <ServiceCard service={item} locationSlug={location.slug} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
    </main>
  )
}
