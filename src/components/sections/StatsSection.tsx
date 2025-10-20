import Container from '@/components/layout/Container'
import type { PageSection } from '@/types/sanity'

export default function StatsSection({ section }: { section: Extract<PageSection, { _type: 'section.stats' }> }) {
  const items = Array.isArray(section.items) ? section.items : []
  if (!items.length) return null

  const alignment = section.alignment ?? 'center'
  const textAlignment = alignment === 'left' ? 'md:text-left' : 'md:text-center'
  const headingAlignment = alignment === 'left' ? 'md:items-start' : 'md:items-center'
  const columns = items.length >= 4 ? 4 : Math.max(items.length, 2)
  const gridClass = {
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
  }[columns]

  return (
    <section className="py-16">
      <Container className={`flex flex-col gap-10 text-center ${textAlignment}`}>
        <div className={`space-y-3 md:max-w-3xl ${headingAlignment}`}>
          {section.title ? <h2 className="text-3xl font-semibold text-zinc-900">{section.title}</h2> : null}
          {section.description ? <p className="text-base text-zinc-600">{section.description}</p> : null}
        </div>
        <dl className={`grid gap-6 sm:grid-cols-2 ${gridClass}`}>
          {items.map((item, index) => (
            <div key={index} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 shadow-inner shadow-white/40">
              <dt className="text-sm uppercase tracking-[0.2em] text-zinc-500">{item.label}</dt>
              <dd className="mt-2 text-3xl font-semibold text-zinc-900">{item.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
