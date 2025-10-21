import { draftMode } from 'next/headers'
import { PreviewSuspense } from '@/components/preview/PreviewSuspense'
import Portable from '@/components/Portable'
import ServiceCard from '@/components/cards/ServiceCard'
import { SectionRenderer } from '@/components/sections'
import Breadcrumbs from '@/components/navigation/Breadcrumbs'
import Container from '@/components/layout/Container'
import { buildBreadcrumbs } from '@/lib/breadcrumbs'
import { getGlobalDataset, getPageBySlug, listOffers, listServices } from '@/sanity/loaders'
import { ApplyScriptOverrides } from '@/components/scripts/ScriptOverridesProvider'
import PagePreview from '@/components/preview/PagePreview'

export const revalidate = 3600

export default async function ServicesPage() {
  const draft = await draftMode()
  if (draft.isEnabled) {
    return (
      <PreviewSuspense fallback={<div className="p-8 text-muted">Loading preview…</div>}>
        <PagePreview slug="services" />
      </PreviewSuspense>
    )
  }
  const [global, page, services, offers] = await Promise.all([
    getGlobalDataset(),
    getPageBySlug('services'),
    listServices(),
    listOffers(),
  ])

  const breadcrumbs = buildBreadcrumbs({
    path: '/services',
    currentLabel: page?.title ?? 'Services',
    settings: page?.breadcrumbs ?? null,
    navigation: global.navigation,
    pages: global.pages,
    homeLabel: global.site?.name ?? 'Home',
  })

  return (
    <main className="pb-16">
      <ApplyScriptOverrides overrides={page?.scriptOverrides as any} />
      <Breadcrumbs trail={breadcrumbs} />
      {page?.sections?.length ? (
        <SectionRenderer
          sections={page.sections}
          services={global.services}
          locations={global.locations}
          offers={offers}
          site={global.site}
          pagePath="/services"
        />
      ) : null}

      <section className="py-16">
        <Container className="space-y-6">
          {page?.title ? <h1 className="text-3xl font-semibold text-strong">{page.title}</h1> : null}
          {page?.body?.length ? (
            <div className="prose prose-theme max-w-none">
              <Portable value={page.body} />
            </div>
          ) : null}
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <li key={service.slug}>
                <ServiceCard service={service} />
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </main>
  )
}
