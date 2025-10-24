import Link from 'next/link'
import Container from '@/components/layout/Container'
import Portable from '@/components/Portable'
import type { OfferSummary, PageSection } from '@/types'
import { getSectionLayout } from './layout'
import { cn } from '@/lib/cn'

export type OffersSectionData = Extract<PageSection, { _type: 'section.offers' }> & {
  offersSelected?: OfferSummary[]
}

type OffersSectionProps = {
  section: OffersSectionData
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
  const sectionWithLimit = section as typeof section & { limit?: number }
  let offers =
    section.offersSelected && section.offersSelected.length
      ? section.offersSelected
      : allOffers
  if (!offers.length) return null
  if (sectionWithLimit.limit) {
    offers = offers.slice(0, sectionWithLimit.limit)
  }

  const layout = getSectionLayout(section, { baseClassName: 'bg-amber-50' })

  return (
    <section
      className={layout.wrapperClassName}
      style={layout.style}
      data-animate={layout.dataAnimate}
      data-alignment={layout.dataAlignment}
    >
      <Container width={layout.containerWidth} className={cn(layout.containerClassName, 'space-y-8')}>
        <header className="space-y-3 md:max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-amber-700">Offers</p>
          {section.title ? <h2 className="text-3xl font-semibold text-strong">{section.title}</h2> : null}
          {section.description ? <p className="text-base text-muted">{section.description}</p> : null}
        </header>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {offers.map((offer) => {
            const validity = buildValidityRange(offer.validFrom, offer.validTo)
            return (
              <li key={offer.slug} className="rounded-3xl border border-amber-200 bg-surface p-6 shadow-sm shadow-amber-900/10">
                <article className="flex h-full flex-col gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-strong">{offer.title}</h3>
                    {offer.summary ? (
                      <div className="prose prose-sm mt-2 text-muted">
                        <Portable value={offer.summary} />
                      </div>
                    ) : null}
                  </div>
                  {validity ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">{validity}</p> : null}
                  <Link href={`/offers/${offer.slug}`} className="mt-auto text-sm font-semibold text-amber-700 hover:text-amber-600">
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
