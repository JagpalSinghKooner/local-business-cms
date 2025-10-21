import { notFound } from 'next/navigation'
import Container from '@/components/layout/Container'
import Portable from '@/components/Portable'
import Breadcrumbs from '@/components/navigation/Breadcrumbs'
import { sanity } from '@/sanity/client'
import { groq } from 'next-sanity'
import { buildSeo } from '@/lib/seo'
import { formatOfferValidity } from '@/lib/dates'
import { buildBreadcrumbs } from '@/lib/breadcrumbs'
import { getGlobalDataset } from '@/sanity/loaders'
import type { PortableContent, BreadcrumbSettings } from '@/types'

export const revalidate = 3600

const offerBySlugQ = groq`*[_type == "offer" && slug.current == $slug][0]{
  title,
  summary,
  "slug": slug.current,
  body,
  validFrom,
  validTo,
  breadcrumbs{
    mode,
    currentLabel,
    manualItems[]{
      _key,
      label,
      link{
        linkType,
        internalPath,
        href,
        openInNewTab
      }
    },
    additionalItems[]{
      _key,
      label,
      link{
        linkType,
        internalPath,
        href,
        openInNewTab
      }
    }
  },
  seo,
}`

type Offer = {
  title: string
  summary?: string
  slug: string
  body?: PortableContent
  validFrom?: string
  validTo?: string
  breadcrumbs?: BreadcrumbSettings | null
  seo?: {
    title?: string
    description?: string
    ogImage?: { asset?: { url?: string } }
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const offer = await sanity.fetch<Offer | null>(offerBySlugQ, { slug }, {
    perspective: 'published',
    next: { revalidate: 120 },
  })

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.localbusiness.com'

  if (!offer) {
    return buildSeo({
      baseUrl,
      path: `/offers/${slug}`,
      title: 'Offer',
      description: 'Current local promotions and coupons.',
    })
  }

  return buildSeo({
    baseUrl,
    path: `/offers/${slug}`,
    title: offer.seo?.title || offer.title,
    description: offer.seo?.description || offer.summary,
    image: offer.seo?.ogImage?.asset?.url ?? null,
  })
}

export default async function OfferPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [offer, global] = await Promise.all([
    sanity.fetch<Offer | null>(offerBySlugQ, { slug }, {
      perspective: 'published',
      next: { revalidate: 120 },
    }),
    getGlobalDataset(),
  ])

  if (!offer) return notFound()

  const validity = formatOfferValidity(offer.validFrom, offer.validTo)
  const breadcrumbs = buildBreadcrumbs({
    path: `/offers/${slug}`,
    currentLabel: offer.title,
    settings: offer.breadcrumbs ?? null,
    navigation: global.navigation,
    pages: global.pages,
    homeLabel: global.site?.name ?? 'Home',
  })

  return (
    <main className="py-16">
      <Breadcrumbs trail={breadcrumbs} />
      <Container className="space-y-8">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-wide text-amber-600">Special Offer</p>
          <h1 className="text-4xl font-semibold text-strong">{offer.title}</h1>
          {offer.summary ? <p className="text-base text-muted">{offer.summary}</p> : null}
          {validity ? <p className="text-xs font-medium uppercase tracking-wide text-amber-600">{validity}</p> : null}
        </header>

        {offer.body ? (
          <section className="prose prose-theme max-w-none">
            <Portable value={offer.body} />
          </section>
        ) : null}
      </Container>
    </main>
  )
}
