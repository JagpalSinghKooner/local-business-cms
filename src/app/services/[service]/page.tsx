import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { PreviewSuspense } from '@/components/preview/PreviewSuspense'
import Portable from '@/components/Portable'
import ServiceCard from '@/components/cards/ServiceCard'
import { SectionRenderer } from '@/components/sections'
import Breadcrumbs from '@/components/navigation/Breadcrumbs'
import { buildSeo } from '@/lib/seo'
import { resolveLink } from '@/lib/links'
import { portableTextToPlainText } from '@/lib/portableText'
import { buildBreadcrumbs } from '@/lib/breadcrumbs'
import { getGlobalDataset, getServiceBySlug, listOffers } from '@/sanity/loaders'
import { ApplyScriptOverrides } from '@/components/scripts/ScriptOverridesProvider'
import Container from '@/components/layout/Container'
import ServicePreview from '@/components/preview/ServicePreview'

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

  const draft = await draftMode()
  if (draft.isEnabled) {
    return (
      <PreviewSuspense fallback={<div className="p-8 text-muted">Loading preview…</div>}>
        <ServicePreview slug={slug} />
      </PreviewSuspense>
    )
  }

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
  const utilityLink = global.navigation?.utility?.[0]
  const resolvedUtilityLink = utilityLink ? resolveLink(utilityLink.link) : null
  const breadcrumbs = buildBreadcrumbs({
    path: `/services/${slug}`,
    currentLabel: service.title,
    settings: service.breadcrumbs ?? null,
    navigation: global.navigation,
    pages: global.pages,
    homeLabel: global.site?.name ?? 'Home',
  })
  const displayOptions = service.displayOptions ?? {}
  const showRelatedLocations = displayOptions.showRelatedLocations !== false
  const showOtherServices = displayOptions.showOtherServices !== false

  return (
    <main className="pb-16">
      <ApplyScriptOverrides overrides={service.scriptOverrides as any} />
      <Breadcrumbs trail={breadcrumbs} />
      <section className="bg-surface-muted py-16">
        <Container className="grid items-center gap-10 md:grid-cols-[1.25fr_1fr]">
          <div className="space-y-4">
            {service.category?.title ? (
              <p className="text-sm uppercase tracking-[0.2em] text-muted">{service.category.title}</p>
            ) : null}
            <h1 className="text-4xl font-semibold text-strong">{service.title}</h1>
            {service.intro ? (
              <Portable value={service.intro.slice(0, 1)} className="mt-4 text-base text-muted" />
            ) : null}
            <div className="flex flex-wrap gap-3">
              {resolvedUtilityLink ? (
                <Link
                  href={resolvedUtilityLink.href}
                  target={resolvedUtilityLink.target}
                  rel={resolvedUtilityLink.rel}
                  className="bg-brand inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  {global.site?.contactCta ?? utilityLink.label}
                </Link>
              ) : null}
              {global.site?.phone ? (
                <Link
                  href={`tel:${global.site.phone.replace(/[^+\d]/g, '')}`}
                  className="inline-flex items-center rounded-full border border-divider px-5 py-2 text-sm font-semibold text-strong transition hover:border-brand"
                >
                  Call {global.site.phone}
                </Link>
              ) : null}
            </div>
          </div>
          {service.heroImage?.asset?.url ? (
            <div className="relative aspect-video overflow-hidden rounded-3xl shadow-elevated">
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
          <Container className="prose prose-theme max-w-none">
            <Portable value={service.body} />
          </Container>
        </section>
      ) : null}

      {showRelatedLocations && relatedLocations.length ? (
        <section className="border-y border-divider bg-surface-muted py-16">
          <Container className="space-y-6">
            <h2 className="text-2xl font-semibold text-strong">Popular locations</h2>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedLocations.map((location) => (
                <li key={location.slug} className="rounded-2xl border border-divider bg-surface p-5 shadow-sm">
                  <Link href={`/locations/${location.slug}`} className="flex flex-col gap-2">
                    <span className="text-lg font-semibold text-strong">{location.city}</span>
                    <span className="text-sm font-semibold text-strong">View location →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {showOtherServices && otherServices.length ? (
        <section className="py-16">
          <Container className="space-y-6">
            <h2 className="text-2xl font-semibold text-strong">More services</h2>
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
