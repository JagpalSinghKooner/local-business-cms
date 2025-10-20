import { notFound } from 'next/navigation'
import Container from '@/components/layout/Container'
import Portable from '@/components/Portable'
import { sanity } from '@/sanity/client'
import { groq } from 'next-sanity'
import { buildSeo } from '@/lib/seo'
import type { PortableContent } from '@/types/sanity'

export const revalidate = 3600

const offerBySlugQ = groq`*[_type == "offer" && slug.current == $slug][0]{
  title,
  summary,
  "slug": slug.current,
  body,
  validFrom,
  validTo,
  seo,
}`

type Offer = {
  title: string
  summary?: string
  slug: string
  body?: PortableContent
  validFrom?: string
  validTo?: string
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
  const offer = await sanity.fetch<Offer | null>(offerBySlugQ, { slug }, {
    perspective: 'published',
    next: { revalidate: 120 },
  })

  if (!offer) return notFound()

  const validity = buildValidityRange(offer.validFrom, offer.validTo)

  return (
    <main className="py-16">
      <Container className="space-y-8">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-wide text-amber-600">Special Offer</p>
          <h1 className="text-4xl font-semibold text-zinc-900">{offer.title}</h1>
          {offer.summary ? <p className="text-base text-zinc-600">{offer.summary}</p> : null}
          {validity ? <p className="text-xs font-medium uppercase tracking-wide text-amber-600">{validity}</p> : null}
        </header>

        {offer.body ? (
          <section className="prose prose-zinc max-w-none">
            <Portable value={offer.body} />
          </section>
        ) : null}
      </Container>
    </main>
  )
}

function buildValidityRange(from?: string, to?: string) {
  if (!from && !to) return null
  const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const start = from ? formatter.format(new Date(from)) : null
  const end = to ? formatter.format(new Date(to)) : null

  if (start && end) return `Valid ${start} – ${end}`
  if (start) return `Valid from ${start}`
  if (end) return `Valid until ${end}`
  return null
}
