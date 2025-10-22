import Link from 'next/link'
import { draftMode } from 'next/headers'
import { PreviewSuspense } from '@/components/preview/PreviewSuspense'
import Portable from '@/components/Portable'
import { SectionRenderer } from '@/components/sections'
import Breadcrumbs from '@/components/navigation/Breadcrumbs'
import Container from '@/components/layout/Container'
import { buildBreadcrumbs } from '@/lib/breadcrumbs'
import { getGlobalDataset, getPageBySlug, listLocations, listOffers } from '@/sanity/loaders'
import type { PortableContent } from '@/types'
import { ApplyScriptOverrides } from '@/components/scripts/ScriptOverridesProvider'
import { type ScriptOverride } from '@/types/sanity-helpers'
import PagePreview from '@/components/preview/PagePreview'

export const revalidate = 3600

function extractText(nodes?: PortableContent): string | undefined {
  if (!Array.isArray(nodes)) return undefined
  return nodes
    .map((node) => {
      if (node && typeof node === 'object' && '_type' in node && node._type === 'block') {
        const block = node as { children?: Array<{ text?: string }> }
        const children = Array.isArray(block.children) ? block.children : []
        return children.map((child) => child?.text ?? '').join('')
      }
      return ''
    })
    .join(' ')
    .trim()
}

export default async function LocationsPage() {
  const draft = await draftMode()
  if (draft.isEnabled) {
    return (
      <PreviewSuspense fallback={<div className="p-8 text-muted">Loading preview…</div>}>
        <PagePreview slug="locations" />
      </PreviewSuspense>
    )
  }
  const [global, page, locations, offers] = await Promise.all([
    getGlobalDataset(),
    getPageBySlug('locations'),
    listLocations(),
    listOffers(),
  ])

  const breadcrumbs = buildBreadcrumbs({
    path: '/locations',
    currentLabel: page?.title ?? 'Locations',
    settings: page?.breadcrumbs ?? null,
    navigation: global.navigation,
    pages: global.pages,
    homeLabel: global.site?.name ?? 'Home',
  })

  return (
    <main className="pb-16">
      <ApplyScriptOverrides overrides={(page?.scriptOverrides as ScriptOverride[] | undefined) ?? []} />
      <Breadcrumbs trail={breadcrumbs} />
      {page?.sections?.length ? (
        <SectionRenderer
          sections={page.sections}
          services={global.services}
          locations={global.locations}
          offers={offers}
          site={global.site}
          pagePath="/locations"
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
            {locations.map((location) => (
              <li key={location.slug} className="rounded-2xl border border-divider bg-surface shadow-elevated">
                <Link href={`/locations/${location.slug}`} className="flex h-full flex-col gap-3 p-6">
                  <span className="text-lg font-semibold text-strong">{location.city}</span>
                  {location.intro ? (
                    <p className="text-sm text-muted line-clamp-3">{extractText(location.intro)}</p>
                  ) : null}
                  <span className="mt-auto text-sm font-medium text-muted">View details →</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </main>
  )
}
