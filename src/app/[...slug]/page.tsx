import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { PreviewSuspense } from '@/components/preview/PreviewSuspense'
import Portable from '@/components/Portable'
import { SectionRenderer } from '@/components/sections'
import Breadcrumbs from '@/components/navigation/Breadcrumbs'
import { buildSeo } from '@/lib/seo'
import { buildBreadcrumbs } from '@/lib/breadcrumbs'
import { getGlobalDataset, getPageBySlug, listOffers } from '@/sanity/loaders'
import { ApplyScriptOverrides } from '@/components/scripts/ScriptOverridesProvider'
import Container from '@/components/layout/Container'
import PagePreview from '@/components/preview/PagePreview'
import { env } from '@/lib/env'
import { getOgImageUrl, type ScriptOverride } from '@/types/sanity-helpers'

function normalizeSlug(raw: string[]): string {
  return raw.join('/')
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params
  const slugPath = normalizeSlug(slug)
  const [page, global] = await Promise.all([getPageBySlug(slugPath), getGlobalDataset()])

  const baseUrl = env.NEXT_PUBLIC_SITE_URL

  if (!page) {
    return buildSeo({
      baseUrl,
      path: `/${slugPath}`,
      title: 'Page',
      description: 'Local business information and services.',
    })
  }

  return buildSeo({
    baseUrl,
    path: `/${slugPath}`,
    title: page.metaTitle || page.title || global.site?.name,
    description: page.metaDescription || global.site?.metaDescription,
    image:
      getOgImageUrl(page.socialMedia) ??
      getOgImageUrl(global.site?.ogImage) ??
      null,
  })
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params
  const slugPath = normalizeSlug(slug)

  const draft = await draftMode()
  if (draft.isEnabled) {
    return (
      <PreviewSuspense fallback={<div className="p-8 text-muted">Loading preview…</div>}>
        <PagePreview slug={slugPath} />
      </PreviewSuspense>
    )
  }

  const [global, page, offers] = await Promise.all([
    getGlobalDataset(),
    getPageBySlug(slugPath),
    listOffers(),
  ])

  if (!page) {
    return notFound()
  }

  const hasSections = page.sections && page.sections.length > 0
  const breadcrumbs = buildBreadcrumbs({
    path: `/${slugPath}`,
    currentLabel: page.title ?? slugPath.split('/').pop() ?? '',
    settings: page.breadcrumbs ?? null,
    navigation: global.navigation,
    pages: global.pages,
    homeLabel: global.site?.name ?? 'Home',
  })

  return (
    <main className="pb-16">
      <ApplyScriptOverrides overrides={page.scriptOverrides as ScriptOverride[] | undefined} />
      <Breadcrumbs trail={breadcrumbs} />
      {hasSections ? (
        <SectionRenderer
          sections={page.sections}
          services={global.services}
          locations={global.locations}
          offers={offers}
          site={global.site}
          pagePath={`/${slugPath}`}
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
