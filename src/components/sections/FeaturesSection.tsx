import Link from 'next/link'
import Container from '@/components/layout/Container'
import Portable from '@/components/Portable'
import type { PageSection } from '@/types/sanity'

const iconClass = 'flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-lg font-semibold text-zinc-900'

export default function FeaturesSection({ section }: { section: Extract<PageSection, { _type: 'section.features' }> }) {
  const items = Array.isArray(section.items) ? section.items : []
  if (!items.length) return null

  const columns = Math.min(Math.max(section.columns ?? 3, 1), 4)
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns]

  return (
    <section className="py-16">
      <Container className="space-y-8">
        <header className="space-y-3 md:max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Why choose us</p>
          <h2 className="text-3xl font-semibold text-zinc-900">{section.title}</h2>
          {section.description ? <p className="text-base text-zinc-600">{section.description}</p> : null}
        </header>

        <ul className={`grid gap-6 ${gridClass}`}>
          {items.map((item, index) => (
            <li key={index} className="flex h-full flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-900/5">
              {item.icon ? <span className={iconClass}>{item.icon}</span> : null}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-zinc-900">{item.title}</h3>
                {item.body ? <Portable value={item.body} className="text-sm text-zinc-600" /> : null}
              </div>
              {item.linkHref && item.linkLabel ? (
                <Link href={item.linkHref} className="mt-auto text-sm font-semibold text-zinc-900 hover:underline">
                  {item.linkLabel}
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
