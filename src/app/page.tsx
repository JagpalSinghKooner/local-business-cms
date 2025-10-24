import { draftMode } from 'next/headers'
import { PreviewSuspense } from '@/components/preview/PreviewSuspense'
import Portable from '@/components/Portable'
import { SectionRenderer } from '@/components/sections'
import Container from '@/components/layout/Container'
import { buildSeo } from '@/lib/seo'
import { getGlobalDataset, getPageBySlug, listOffers } from '@/sanity/loaders'
import { ApplyScriptOverrides } from '@/components/scripts/ScriptOverridesProvider'
import PagePreview from '@/components/preview/PagePreview'
import { env } from '@/lib/env'
import { getOgImageUrl, type ScriptOverride } from '@/types/sanity-helpers'

// Route segment config for optimal performance
export const revalidate = 3600 // ISR: Revalidate every hour
export const fetchCache = 'force-cache' // Aggressive caching

const HOME_SLUG = 'home'

// SEO metadata
export async function generateMetadata() {
  const baseUrl = env.NEXT_PUBLIC_SITE_URL
  const [global, page] = await Promise.all([getGlobalDataset(), getPageBySlug(HOME_SLUG)])

  return buildSeo({
    baseUrl,
    path: '/',
    title: page?.seo?.metaTitle || page?.title || global.site?.name || 'Local Business',
    description:
      page?.seo?.metaDescription ||
      global.site?.metaDescription ||
      global.site?.tagline ||
      'Professional services delivered by trusted local experts.',
    image: getOgImageUrl(page?.seo?.ogImage) ?? getOgImageUrl(global.site?.ogImage) ?? null,
  })
}

export default async function Home() {
  const draft = await draftMode()
  if (draft.isEnabled) {
    return (
      <PreviewSuspense fallback={<div className="p-8 text-muted">Loading preview…</div>}>
        <PagePreview slug="home" />
      </PreviewSuspense>
    )
  }
  const [global, page, offers] = await Promise.all([
    getGlobalDataset(),
    getPageBySlug(HOME_SLUG),
    listOffers(),
  ])

  if (!page) {
    // Fallback simple hero if the home page is not yet authored
    return (
      <main>
        <section className="bg-surface-muted py-24">
          <Container className="space-y-4 text-center">
            <h1 className="text-4xl font-semibold text-strong">Welcome</h1>
            <p className="text-base text-muted">
              Create a page with slug &ldquo;home&rdquo; in Sanity to control the homepage content.
            </p>
          </Container>
        </section>
      </main>
    )
  }

  return (
    <main>
      <ApplyScriptOverrides
        overrides={(page.scriptOverrides as ScriptOverride[] | undefined)?.map((o) => ({
          scriptKey: o.scriptKey ?? '',
          enabled: o.enabled ?? true,
        }))}
      />
      <SectionRenderer
        sections={page.sections}
        services={global.services}
        locations={global.locations}
        offers={offers}
        site={global.site}
        pagePath="/"
      />

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
