import Link from 'next/link'
import { notFound } from 'next/navigation'
import Container from '@/components/layout/Container'
import Portable from '@/components/Portable'
import ServiceCard from '@/components/cards/ServiceCard'
import { SectionRenderer } from '@/components/sections'
import Breadcrumbs from '@/components/navigation/Breadcrumbs'
import { buildSeo } from '@/lib/seo'
import { portableTextToPlainText } from '@/lib/portableText'
import { buildBreadcrumbs } from '@/lib/breadcrumbs'
import { getGlobalDataset, getLocationBySlug, getPageBySlug, getServiceBySlug, listOffers } from '@/sanity/loaders'
import { ApplyScriptOverrides } from '@/components/scripts/ScriptOverridesProvider'
import { env } from '@/lib/env'
import { getOgImageUrl, type ScriptOverride } from '@/types/sanity-helpers'

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
  const baseUrl = env.NEXT_PUBLIC_SITE_URL
  const global = await getGlobalDataset()
  const parts = splitServiceAndCity(servicePlusCity, global.locations)

  if (!parts) {
    const page = await getPageBySlug(servicePlusCity)
    if (page) {
      return buildSeo({
        baseUrl,
        path: `/${servicePlusCity}`,
        title: page.metaTitle || page.title || global.site?.name,
        description: page.metaDescription || global.site?.metaDescription,
        image: getOgImageUrl(page.socialMedia) ?? getOgImageUrl(global.site?.ogImage) ?? null,
      })
    }

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
    const page = await getPageBySlug(servicePlusCity)
    if (page) {
      return buildSeo({
        baseUrl,
        path: `/${servicePlusCity}`,
        title: page.metaTitle || page.title || global.site?.name,
        description: page.metaDescription || global.site?.metaDescription,
        image: getOgImageUrl(page.socialMedia) ?? getOgImageUrl(global.site?.ogImage) ?? null,
      })
    }

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
    image: getOgImageUrl(service.seo?.ogImage) ?? getOgImageUrl(service.heroImage) ?? null,
  })
}

export default async function CombinedPage({ params }: { params: Promise<Params> }) {
  const { servicePlusCity } = await params
  const globalPromise = getGlobalDataset()
  const offersPromise = listOffers()
  const [global, offers] = await Promise.all([globalPromise, offersPromise])
  const parts = splitServiceAndCity(servicePlusCity, global.locations)
  const normalizedPath = `/${servicePlusCity}`

  if (!parts) {
    const page = await getPageBySlug(servicePlusCity)
    if (!page) return notFound()

    const hasSections = Array.isArray(page.sections) && page.sections.length > 0
    const breadcrumbs = buildBreadcrumbs({
      path: normalizedPath,
      currentLabel: page.title ?? servicePlusCity,
      settings: page.breadcrumbs ?? null,
      navigation: global.navigation,
      pages: global.pages,
      homeLabel: global.site?.name ?? 'Home',
    })
    return (
      <main className="pb-16">
        <ApplyScriptOverrides overrides={(page.scriptOverrides as ScriptOverride[] | undefined) ?? []} />
        <Breadcrumbs trail={breadcrumbs} />
        {hasSections ? (
          <SectionRenderer
            sections={page.sections}
            services={global.services}
            locations={global.locations}
            offers={offers}
            site={global.site}
            pagePath={normalizedPath}
          />
        ) : (
          <header className="bg-surface-muted py-12">
            <Container>
              <h1 className="text-4xl font-semibold text-strong">{page.title}</h1>
            </Container>
          </header>
        )}

        {page.body && page.body.length ? (
          <section className="border-t border-divider py-16">
            <Container className="prose prose-theme max-w-none">
              <Portable value={page.body} />
            </Container>
          </section>
        ) : null}
      </main>
    )
  }

  const [service, location] = await Promise.all([
    getServiceBySlug(parts.serviceSlug),
    getLocationBySlug(parts.locationSlug),
  ])

  if (!service || !location) {
    const page = await getPageBySlug(servicePlusCity)
    if (!page) return notFound()

    const hasSections = Array.isArray(page.sections) && page.sections.length > 0
    const breadcrumbs = buildBreadcrumbs({
      path: normalizedPath,
      currentLabel: page.title ?? servicePlusCity,
      settings: page.breadcrumbs ?? null,
      navigation: global.navigation,
      pages: global.pages,
      homeLabel: global.site?.name ?? 'Home',
    })
    return (
      <main className="pb-16">
        <ApplyScriptOverrides overrides={(page.scriptOverrides as ScriptOverride[] | undefined) ?? []} />
        <Breadcrumbs trail={breadcrumbs} />
        {hasSections ? (
          <SectionRenderer
            sections={page.sections}
            services={global.services}
            locations={global.locations}
            offers={offers}
            site={global.site}
            pagePath={normalizedPath}
          />
        ) : (
          <header className="bg-surface-muted py-12">
            <Container>
              <h1 className="text-4xl font-semibold text-strong">{page.title}</h1>
            </Container>
          </header>
        )}

        {page.body && page.body.length ? (
          <section className="border-t border-divider py-16">
            <Container className="prose prose-theme max-w-none">
              <Portable value={page.body} />
            </Container>
          </section>
        ) : null}
      </main>
    )
  }

  const otherLocations = global.locations.filter((item) => item.slug !== location.slug).slice(0, 6)
  const otherServices = global.services.filter((item) => item.slug !== service.slug)
  const sections = Array.isArray(service.sections) ? service.sections : []
  const coordinates =
    location.map && typeof location.map === 'object'
      ? (location.map as { lat?: number; lng?: number })
      : undefined
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
      <ApplyScriptOverrides overrides={(service.scriptOverrides as ScriptOverride[] | undefined) ?? []} />
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
