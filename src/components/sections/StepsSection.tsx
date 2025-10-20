import Container from '@/components/layout/Container'
import Portable from '@/components/Portable'
import type { PageSection } from '@/types/sanity'

export default function StepsSection({ section }: { section: Extract<PageSection, { _type: 'section.steps' }> }) {
  const items = Array.isArray(section.items) ? section.items : []
  if (!items.length) return null

  return (
    <section className="bg-zinc-50 py-16">
      <Container className="space-y-10">
        <header className="space-y-3 md:max-w-2xl">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Our process</p>
          <h2 className="text-3xl font-semibold text-zinc-900">{section.title}</h2>
          {section.description ? <p className="text-base text-zinc-600">{section.description}</p> : null}
        </header>

        <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <li key={index} className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-semibold">
                {index + 1}
              </span>
              <h3 className="text-lg font-semibold text-zinc-900">{item.title}</h3>
              {item.body ? <Portable value={item.body} className="text-sm text-zinc-600" /> : null}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
