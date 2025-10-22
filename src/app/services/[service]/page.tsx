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
import { getGlobalDataset, getServiceBySlug, getLocationBySlug, listOffers } from '@/sanity/loaders'
import { ApplyScriptOverrides } from '@/components/scripts/ScriptOverridesProvider'
import Container from '@/components/layout/Container'
import ServicePreview from '@/components/preview/ServicePreview'
import { env } from '@/lib/env'
import { getOgImageUrl, getImageUrl, getImageAlt } from '@/types/sanity-helpers'

type Params = { service: string }
type LocationRef = { city: string; slug: string }

export const revalidate = 3600

// Helper function to split service-location slug
function splitServiceAndLocation(slug: string, locations: LocationRef[]): { serviceSlug: string; locationSlug: string } | null {
  const sorted = [...locations].sort((a, b) => b.slug.length - a.slug.length)
  for (const location of sorted) {
    const suffix = `-${location.slug}`
    if (slug.endsWith(suffix)) {
      const serviceSlug = slug.slice(0, slug.length - suffix.length)
      if (serviceSlug) {
        return { serviceSlug, locationSlug: location.slug }
      }
    }
  }
  return null
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { service: slug } = await params
  const global = await getGlobalDataset()
  const baseUrl = env.NEXT_PUBLIC_SITE_URL

  // Check if this is a service+location combination
  const parts = splitServiceAndLocation(slug, global.locations)

  if (parts) {
    // Service + Location metadata
    const [service, location] = await Promise.all([
      getServiceBySlug(parts.serviceSlug),
      getLocationBySlug(parts.locationSlug),
    ])

    if (!service || !location) {
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
      title: `${service.title} in ${location.city}`,
      description: service.seo?.description || introText,
      image: getOgImageUrl(service.seo?.ogImage) ?? getImageUrl(service.heroImage) ?? null,
    })
  }

  // Single service metadata
  const service = await getServiceBySlug(slug)

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
    image: getOgImageUrl(service.seo?.ogImage) ?? getImageUrl(service.heroImage) ?? null,
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

  const global = await getGlobalDataset()
  const offers = await listOffers()

  // Check if this is a service+location combination
  const parts = splitServiceAndLocation(slug, global.locations)

  if (parts) {
    // Render service+location page
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
    const normalizedPath = `/services/${slug}`

    const serviceTrail = buildBreadcrumbs({
      path: `/services/${parts.serviceSlug}`,
      currentLabel: service.title,
      settings: service.breadcrumbs ?? null,
      navigation: global.navigation,
      pages: global.pages,
      homeLabel: global.site?.name ?? 'Home',
    }).map((crumb) => ({ ...crumb, isCurrent: false }))

    const locationTrail = buildBreadcrumbs({
      path: `/locations/${location.slug}`,
      currentLabel: location.city,
      settings: location.breadcrumbs ?? null,
      navigation: global.navigation,
      pages: global.pages,
      homeLabel: global.site?.name ?? 'Home',
    })

    const combinedTrail: { label: string; href: string; isCurrent: boolean }[] = []
    const pushUnique = (node: { label: string; href: string; isCurrent: boolean }) => {
      const existingIndex = combinedTrail.findIndex((item) => item.href === node.href)
      if (existingIndex >= 0) {
        combinedTrail[existingIndex] = { ...combinedTrail[existingIndex], ...node }
      } else {
        combinedTrail.push(node)
      }
    }

    serviceTrail.forEach(pushUnique)
    if (locationTrail.length > 0) {
      const locationCrumb = locationTrail[locationTrail.length - 1]
      pushUnique({ ...locationCrumb, isCurrent: false })
    } else {
      pushUnique({ label: location.city, href: `/locations/${location.slug}`, isCurrent: false })
    }
    pushUnique({ label: `${service.title} in ${location.city}`, href: normalizedPath, isCurrent: true })

    const breadcrumbs = combinedTrail.map((crumb, index) => ({
      ...crumb,
      isCurrent: index === combinedTrail.length - 1,
    }))

    const displayOptions = service.displayOptions ?? {}
    const showRelatedLocations = displayOptions.showRelatedLocations !== false
    const showOtherServices = displayOptions.showOtherServices !== false

    return (
      <main className="pb-16">
        <ApplyScriptOverrides
          overrides={service.scriptOverrides?.map((o) => ({
            scriptKey: o.scriptKey ?? '',
            enabled: o.enabled ?? true,
          }))}
        />
        <Breadcrumbs trail={breadcrumbs} />
        <section className="bg-surface-muted py-16">
          <Container className="space-y-4">
            <p className="text-sm uppercase tracking-[0.2em] text-muted">Local Service</p>
            <h1 className="text-4xl font-semibold text-strong">
              {service.title} in {location.city}
            </h1>
            {service.intro ? (
              <Portable value={service.intro.slice(0, 1)} className="mt-4 text-base text-muted" />
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
                className="inline-flex items-center rounded-full border border-divider px-5 py-2 text-sm font-semibold text-strong hover:border-brand"
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
            pagePath={normalizedPath}
          />
        ) : null}

        {service.body ? (
          <section className="py-16">
            <Container className="grid gap-10 md:grid-cols-2">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-strong">About this service</h2>
                <div className="prose prose-theme max-w-none">
                  <Portable value={service.body} />
                </div>
              </div>
              <div className="space-y-6 rounded-3xl border border-divider bg-surface-muted p-6 shadow-elevated">
                <h2 className="text-2xl font-semibold text-strong">About {location.city}</h2>
                <div className="prose prose-theme max-w-none text-sm">
                  <Portable value={location.intro} />
                </div>
                <div className="space-y-2 text-sm text-muted">
                  {coordinates?.lat && coordinates?.lng ? (
                    <p>
                      <span className="font-semibold text-muted">Coordinates:</span> {coordinates.lat}, {coordinates.lng}
                    </p>
                  ) : null}
                </div>
              </div>
            </Container>
          </section>
        ) : null}

        {showRelatedLocations && otherLocations.length ? (
          <section className="border-y border-divider bg-surface py-16">
            <Container className="space-y-6">
              <h2 className="text-2xl font-semibold text-strong">Nearby service areas</h2>
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

        {showOtherServices && otherServices.length ? (
          <section className="py-16">
            <Container className="space-y-6">
              <h2 className="text-2xl font-semibold text-strong">Related services</h2>
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

  // Render single service page
  const service = await getServiceBySlug(slug)

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
      <ApplyScriptOverrides
        overrides={service.scriptOverrides?.map((o) => ({
          scriptKey: o.scriptKey ?? '',
          enabled: o.enabled ?? true,
        }))}
      />
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
                  {global.site?.contactCta ?? utilityLink?.label ?? 'Contact Us'}
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
          {getImageUrl(service.heroImage) ? (
            <div className="relative aspect-video overflow-hidden rounded-3xl shadow-elevated">
              <Image
                src={getImageUrl(service.heroImage) ?? ''}
                alt={getImageAlt(service.heroImage, service.title)}
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
