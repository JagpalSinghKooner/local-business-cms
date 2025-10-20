import { notFound } from 'next/navigation'
import Container from '@/components/layout/Container'
import Portable from '@/components/Portable'
import { SectionRenderer } from '@/components/sections'
import { buildSeo } from '@/lib/seo'
import { getGlobalDataset, getPageBySlug, listOffers } from '@/sanity/loaders'

function normalizeSlug(raw: string[]): string {
  return raw.join('/')
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params
  const slugPath = normalizeSlug(slug)
  const [page, global] = await Promise.all([getPageBySlug(slugPath), getGlobalDataset()])

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.localbusiness.com'

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
    title: page.seo?.title || page.title || global.site?.name,
    description: page.seo?.description || global.site?.metaDescription,
    image: page.seo?.ogImage?.asset?.url ?? global.site?.ogImage?.asset?.url ?? null,
  })
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params
  const slugPath = normalizeSlug(slug)

  const [global, page, offers] = await Promise.all([
    getGlobalDataset(),
    getPageBySlug(slugPath),
    listOffers(),
  ])

  if (!page) {
    return notFound()
  }

  const hasSections = page.sections && page.sections.length > 0

  return (
    <main className="pb-16">
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
        <header className="bg-zinc-50 py-12">
          <Container>
            <h1 className="text-4xl font-semibold text-zinc-900">{page.title}</h1>
          </Container>
        </header>
      )}

      {page.body && page.body.length ? (
        <section className="border-t border-zinc-200 py-16">
          <Container className="prose prose-zinc max-w-none">
            <Portable value={page.body} />
          </Container>
        </section>
      ) : null}
    </main>
  )
}
