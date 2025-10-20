import Link from 'next/link'
import Container from '@/components/layout/Container'
import type { OfferSummary, PageSection } from '@/types/sanity'

type OffersSectionProps = {
  section: Extract<PageSection, { _type: 'section.offers' }>
  allOffers: OfferSummary[]
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

export default function OffersSection({ section, allOffers }: OffersSectionProps) {
  let offers = section.offersSelected && section.offersSelected.length ? section.offersSelected : allOffers
  if (!offers.length) return null
  if (section.limit) {
    offers = offers.slice(0, section.limit)
  }

  return (
    <section className="bg-amber-50 py-16">
      <Container className="space-y-8">
        <header className="space-y-3 md:max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-amber-600">Offers</p>
          {section.title ? <h2 className="text-3xl font-semibold text-zinc-900">{section.title}</h2> : null}
          {section.description ? <p className="text-base text-zinc-700">{section.description}</p> : null}
        </header>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {offers.map((offer) => {
            const validity = buildValidityRange(offer.validFrom, offer.validTo)
            return (
              <li key={offer.slug} className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm shadow-amber-900/10">
                <article className="flex h-full flex-col gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-900">{offer.title}</h3>
                    {offer.summary ? <p className="mt-2 text-sm text-zinc-600">{offer.summary}</p> : null}
                  </div>
                  {validity ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">{validity}</p> : null}
                  <Link href={`/offers/${offer.slug}`} className="mt-auto text-sm font-semibold text-amber-600 hover:text-amber-500">
                    View details →
                  </Link>
                </article>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
