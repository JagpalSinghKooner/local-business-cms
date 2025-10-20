import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Container from '@/components/layout/Container'
import Portable from '@/components/Portable'
import ServiceCard from '@/components/cards/ServiceCard'
import { SectionRenderer } from '@/components/sections'
import { buildSeo } from '@/lib/seo'
import { portableTextToPlainText } from '@/lib/portableText'
import { getGlobalDataset, getServiceBySlug, listOffers } from '@/sanity/loaders'

type Params = { service: string }

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { service: slug } = await params
  const service = await getServiceBySlug(slug)
  const global = await getGlobalDataset()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.localbusiness.com'

  if (!service) {
    return buildSeo({
      baseUrl,
      path: `/services/${slug}`,
      title: 'Service',
      description: global.site?.metaDescription,
    })
  }

  const introText = portableTextToPlainText(service.intro)

  return buildSeo({
    baseUrl,
    path: `/services/${slug}`,
    title: service.seo?.title || service.title,
    description: service.seo?.description || introText,
    image: service.seo?.ogImage?.asset?.url ?? service.heroImage?.asset?.url ?? null,
  })
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { service: slug } = await params
  const [service, global, offers] = await Promise.all([
    getServiceBySlug(slug),
    getGlobalDataset(),
    listOffers(),
  ])

  if (!service) return notFound()

  const relatedLocations = Array.isArray(service.locations)
    ? (service.locations as Array<{ slug: string; city: string }>)
    : []
  const otherServices = (global.services ?? []).filter((item) => item.slug !== slug)
  const sections = Array.isArray(service.sections) ? service.sections : []

  return (
    <main className="pb-16">
      <section className="bg-zinc-50 py-16">
        <Container className="grid items-center gap-10 md:grid-cols-[1.25fr_1fr]">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
              {service.category?.title ?? 'Service'}
            </p>
            <h1 className="text-4xl font-semibold text-zinc-900">{service.title}</h1>
            {service.intro ? (
              <Portable value={service.intro.slice(0, 1)} className="mt-4 text-base text-zinc-600" />
            ) : null}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="bg-brand inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Book this service
              </Link>
              <Link
                href="tel:+1-555-123-4567"
                className="inline-flex items-center rounded-full border border-zinc-300 px-5 py-2 text-sm font-semibold text-zinc-900 transition hover:border-zinc-500"
              >
                Call now
              </Link>
            </div>
          </div>
          {service.heroImage?.asset?.url ? (
            <div className="relative aspect-video overflow-hidden rounded-3xl shadow-lg shadow-zinc-900/10">
              <Image
                src={service.heroImage.asset.url}
                alt={service.heroImage?.alt ?? service.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>
          ) : null}
        </Container>
      </section>

      {sections.length ? (
        <SectionRenderer
          sections={sections}
          services={global.services}
          locations={global.locations}
          offers={offers}
          site={global.site}
          pagePath={`/services/${slug}`}
        />
      ) : null}

      {service.body ? (
        <section className="py-16">
          <Container className="prose prose-zinc max-w-none">
            <Portable value={service.body} />
          </Container>
        </section>
      ) : null}

      {relatedLocations.length ? (
        <section className="border-y border-zinc-200 bg-zinc-50 py-16">
          <Container className="space-y-6">
            <h2 className="text-2xl font-semibold text-zinc-900">Popular locations</h2>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedLocations.map((location) => (
                <li key={location.slug} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                  <Link href={`/locations/${location.slug}`} className="flex flex-col gap-2">
                    <span className="text-lg font-semibold text-zinc-900">{location.city}</span>
                    <span className="text-sm font-semibold text-zinc-900">View location →</span>
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
            <h2 className="text-2xl font-semibold text-zinc-900">More services</h2>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {otherServices.map((item) => (
                <li key={item.slug}>
                  <ServiceCard service={item} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
    </main>
  )
}
