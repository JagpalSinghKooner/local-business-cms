import Portable from '@/components/Portable'
import { SectionRenderer } from '@/components/sections'
import Container from '@/components/layout/Container'
import { buildSeo } from '@/lib/seo'
import { getGlobalDataset, getPageBySlug, listOffers } from '@/sanity/loaders'

export const revalidate = 3600;

const HOME_SLUG = 'home'

// SEO metadata
export async function generateMetadata() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.localbusiness.com'
  const [global, page] = await Promise.all([getGlobalDataset(), getPageBySlug(HOME_SLUG)])

  return buildSeo({
    baseUrl,
    path: '/',
    title: page?.seo?.title || page?.title || global.site?.name || 'Local Business',
    description:
      page?.seo?.description ||
      global.site?.metaDescription ||
      global.site?.tagline ||
      'Professional services delivered by trusted local experts.',
    image: page?.seo?.ogImage?.asset?.url ?? global.site?.ogImage?.asset?.url ?? null,
  })
}

export default async function Home() {
  const [global, page, offers] = await Promise.all([
    getGlobalDataset(),
    getPageBySlug(HOME_SLUG),
    listOffers(),
  ])

  if (!page) {
    // Fallback simple hero if the home page is not yet authored
    return (
      <main>
        <section className="bg-zinc-50 py-24">
          <Container className="space-y-4 text-center">
            <h1 className="text-4xl font-semibold text-zinc-900">Welcome</h1>
            <p className="text-base text-zinc-600">
              Create a page with slug “home” in Sanity to control the homepage content.
            </p>
          </Container>
        </section>
      </main>
    )
  }

  return (
    <main>
      <SectionRenderer
        sections={page.sections}
        services={global.services}
        locations={global.locations}
        offers={offers}
        site={global.site}
        pagePath="/"
      />

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
