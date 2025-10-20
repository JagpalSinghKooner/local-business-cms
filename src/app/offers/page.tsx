import Link from 'next/link'
import Container from '@/components/layout/Container'
import { buildSeo } from '@/lib/seo'
import { getGlobalDataset, listOffers } from '@/sanity/loaders'

export const revalidate = 3600

export async function generateMetadata() {
  const [global] = await Promise.all([getGlobalDataset()])
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.localbusiness.com'

  return buildSeo({
    baseUrl,
    path: '/offers',
    title: 'Current Promotions',
    description: global.site?.metaDescription ?? 'Browse current coupons and promotions.',
  })
}

export default async function OffersPage() {
  const offers = await listOffers()

  return (
    <main className="py-16">
      <Container className="space-y-10">
        <header className="max-w-2xl space-y-3">
          <p className="text-sm uppercase tracking-wide text-zinc-500">Offers</p>
          <h1 className="text-4xl font-semibold text-zinc-900">Current Promotions</h1>
          <p className="text-base text-zinc-600">Browse limited-time coupons and promotions. Each offer can be redeemed online or mentioned when booking.</p>
        </header>

        {offers.length > 0 ? (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {offers.map((offer) => {
              const validRange = buildValidityRange(offer.validFrom, offer.validTo)

              return (
                <li key={offer.slug} className="rounded-2xl border border-amber-200 bg-white shadow-sm shadow-amber-900/10">
                  <article className="flex h-full flex-col gap-4 p-6">
                    <div>
                      <h2 className="text-xl font-semibold text-zinc-900">{offer.title}</h2>
                      {offer.summary ? <p className="mt-2 text-sm text-zinc-600">{offer.summary}</p> : null}
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
        ) : (
          <p className="text-sm text-zinc-500">No live offers right now. Publish an offer in Sanity to display it here.</p>
        )}
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
