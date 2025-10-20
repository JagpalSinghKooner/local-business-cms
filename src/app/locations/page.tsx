import Link from 'next/link'
import Container from '@/components/layout/Container'
import { listLocations } from '@/sanity/loaders'
import type { PortableContent } from '@/types/sanity'

export const revalidate = 3600

function extractText(nodes?: PortableContent): string | undefined {
  if (!Array.isArray(nodes)) return undefined
  return nodes
    .map((node) => {
      if (node && typeof node === 'object' && '_type' in node && node._type === 'block') {
        const block = node as { children?: Array<{ text?: string }> }
        const children = Array.isArray(block.children) ? block.children : []
        return children.map((child) => child?.text ?? '').join('')
      }
      return ''
    })
    .join(' ')
    .trim()
}

export default async function LocationsPage() {
  const locations = await listLocations()

  return (
    <main className="py-16">
      <Container className="space-y-10">
        <header className="max-w-2xl space-y-3">
          <p className="text-sm uppercase tracking-wide text-zinc-500">Locations</p>
          <h1 className="text-4xl font-semibold text-zinc-900">Service Areas</h1>
          <p className="text-base text-zinc-600">
            We proudly support homes and businesses across our service regions. Select a location to see localised
            contact details, featured offers, and highlighted services.
          </p>
        </header>

        <section>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((location) => (
              <li key={location.slug} className="rounded-2xl border border-zinc-200 bg-white shadow-sm shadow-zinc-900/5">
                <Link href={`/locations/${location.slug}`} className="flex h-full flex-col gap-3 p-6">
                  <span className="text-lg font-semibold text-zinc-900">{location.city}</span>
                  {location.intro ? (
                    <p className="text-sm text-zinc-600 line-clamp-3">{extractText(location.intro)}</p>
                  ) : null}
                  <span className="mt-auto text-sm font-medium text-zinc-700">View details →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </main>
  )
}
