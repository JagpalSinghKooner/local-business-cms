import Link from 'next/link'
import Container from '@/components/layout/Container'
import type { LocationSummary, PageSection, PortableContent } from '@/types/sanity'

type LocationsSectionProps = {
  section: Extract<PageSection, { _type: 'section.locations' }>
  allLocations: LocationSummary[]
}

const columnClasses: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

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

export default function LocationsSection({ section, allLocations }: LocationsSectionProps) {
  const locations =
    section.locationsSelected && section.locationsSelected.length > 0 ? section.locationsSelected : allLocations

  if (!locations.length) return null

  const columns = Math.min(Math.max(section.columns ?? 3, 1), 4)
  const gridClass = columnClasses[columns] ?? columnClasses[3]

  return (
    <section className="py-16">
      <Container className="space-y-8">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Locations</p>
          <h2 className="text-3xl font-semibold text-zinc-900">{section.title}</h2>
          {section.description ? <p className="text-base text-zinc-600">{section.description}</p> : null}
        </header>
        <ul className={`grid gap-4 ${gridClass}`}>
          {locations.map((location) => (
            <li key={location.slug} className="rounded-2xl border border-zinc-200 bg-white shadow-sm shadow-zinc-900/5">
              <Link href={`/locations/${location.slug}`} className="flex h-full flex-col gap-3 p-6">
                <span className="text-lg font-semibold text-zinc-900">{location.city}</span>
                {location.intro ? (
                  <p className="text-sm text-zinc-600 line-clamp-3">{extractText(location.intro)}</p>
                ) : null}
                <span className="mt-auto text-sm font-semibold text-zinc-900">View location →</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
