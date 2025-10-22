import Link from 'next/link'
import Portable from '@/components/Portable'
import { SectionRenderer } from '@/components/sections'
import Breadcrumbs from '@/components/navigation/Breadcrumbs'
import Container from '@/components/layout/Container'
import { buildSeo } from '@/lib/seo'
import { formatOfferValidity } from '@/lib/dates'
import { buildBreadcrumbs } from '@/lib/breadcrumbs'
import { getGlobalDataset, getPageBySlug, listOffers } from '@/sanity/loaders'
import { ApplyScriptOverrides } from '@/components/scripts/ScriptOverridesProvider'
import { env } from '@/lib/env'
import { getOgImageUrl, type ScriptOverride } from '@/types/sanity-helpers'

export const revalidate = 3600

export async function generateMetadata() {
  const [global, page] = await Promise.all([getGlobalDataset(), getPageBySlug('offers')])
  const baseUrl = env.NEXT_PUBLIC_SITE_URL

  return buildSeo({
    baseUrl,
    path: '/offers',
    title: page?.metaTitle || page?.title || global.site?.metaTitle || 'Offers',
    description: page?.metaDescription || global.site?.metaDescription || '',
    image:
      getOgImageUrl(page?.socialMedia) ??
      getOgImageUrl(global.site?.ogImage) ??
      null,
  })
}

export default async function OffersPage() {
  const [global, page, offers] = await Promise.all([
    getGlobalDataset(),
    getPageBySlug('offers'),
    listOffers(),
  ])

  const breadcrumbs = buildBreadcrumbs({
    path: '/offers',
    currentLabel: page?.title ?? 'Offers',
    settings: page?.breadcrumbs ?? null,
    navigation: global.navigation,
    pages: global.pages,
    homeLabel: global.site?.name ?? 'Home',
  })

  return (
    <main className="pb-16">
      <ApplyScriptOverrides overrides={page?.scriptOverrides as ScriptOverride[] | undefined} />
      <Breadcrumbs trail={breadcrumbs} />
      {page?.sections?.length ? (
        <SectionRenderer
          sections={page.sections}
          services={global.services}
          locations={global.locations}
          offers={offers}
          site={global.site}
          pagePath="/offers"
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

          {offers.length ? (
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {offers.map((offer) => {
                const validRange = formatOfferValidity(offer.validFrom, offer.validTo)

                return (
                  <li key={offer.slug} className="rounded-2xl border border-amber-200 bg-surface shadow-sm shadow-amber-900/10">
                    <article className="flex h-full flex-col gap-4 p-6">
                      <div>
                        <h2 className="text-xl font-semibold text-strong">{offer.title}</h2>
                        {offer.summary ? (
                          <div className="mt-2 text-sm text-muted">
                            <Portable value={offer.summary} />
                          </div>
                        ) : null}
                      </div>
                      {validRange ? <p className="text-xs font-medium uppercase tracking-wide text-amber-600">{validRange}</p> : null}
                      <Link href={`/offers/${offer.slug}`} className="mt-auto text-sm font-semibold text-amber-600 transition hover:text-amber-500">
                        View details →
                      </Link>
                    </article>
                  </li>
                )
              })}
            </ul>
          ) : null}
        </Container>
      </section>
    </main>
  )
}
