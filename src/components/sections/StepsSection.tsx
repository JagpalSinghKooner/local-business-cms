import Container from '@/components/layout/Container'
import Portable from '@/components/Portable'
import type { PageSection } from '@/types'
import { getSectionLayout } from './layout'
import { cn } from '@/lib/cn'

export default function StepsSection({ section }: { section: Extract<PageSection, { _type: 'section.steps' }> }) {
  const items = Array.isArray(section.items) ? section.items : []
  if (!items.length) return null

  const layout = getSectionLayout(section, { baseClassName: 'bg-surface-muted' })

  return (
    <section
      className={layout.wrapperClassName}
      style={layout.style}
      data-animate={layout.dataAnimate}
      data-alignment={layout.dataAlignment}
    >
      <Container width={layout.containerWidth} className={cn(layout.containerClassName, 'space-y-10')}>
        <header className="space-y-3 md:max-w-2xl">
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Our process</p>
          <h2 className="text-3xl font-semibold text-strong">{section.title}</h2>
          {section.description ? <p className="text-base text-muted">{section.description}</p> : null}
        </header>

        <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <li key={index} className="flex flex-col gap-3 rounded-2xl border border-divider bg-surface p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-semibold">
                {index + 1}
              </span>
              <h3 className="text-lg font-semibold text-strong">{item.title}</h3>
              {item.body ? <Portable value={item.body} className="text-sm text-muted" /> : null}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
