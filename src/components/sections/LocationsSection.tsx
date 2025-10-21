import Link from 'next/link'
import Container from '@/components/layout/Container'
import type { LocationSummary, PageSection, PortableContent } from '@/types'
import { getSectionLayout } from './layout'
import { cn } from '@/lib/cn'

export type LocationsSectionData = Extract<PageSection, { _type: 'section.locations' }> & {
  locationsSelected?: LocationSummary[]
}

type LocationsSectionProps = {
  section: LocationsSectionData
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
    section.locationsSelected && section.locationsSelected.length > 0
      ? section.locationsSelected
      : allLocations

  if (!locations.length) return null

  const columnSetting = typeof section.columns === 'number' ? section.columns : 3
  const columns = Math.min(Math.max(columnSetting, 1), 4)
  const gridClass = columnClasses[columns] ?? columnClasses[3]
  const layout = getSectionLayout(section)

  return (
    <section
      className={layout.wrapperClassName}
      style={layout.style}
      data-animate={layout.dataAnimate}
      data-alignment={layout.dataAlignment}
    >
      <Container width={layout.containerWidth} className={cn(layout.containerClassName, 'space-y-8')}>
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Locations</p>
          <h2 className="text-3xl font-semibold text-strong">{section.title}</h2>
          {section.description ? <p className="text-base text-muted">{section.description}</p> : null}
        </header>
        <ul className={`grid gap-4 ${gridClass}`}>
          {locations.map((location) => (
            <li key={location.slug} className="rounded-2xl border border-divider bg-surface shadow-elevated">
              <Link href={`/locations/${location.slug}`} className="flex h-full flex-col gap-3 p-6">
                <span className="text-lg font-semibold text-strong">{location.city}</span>
                {location.intro ? (
                  <p className="text-sm text-muted line-clamp-3">{extractText(location.intro)}</p>
                ) : null}
                <span className="mt-auto text-sm font-semibold text-strong">View location →</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
