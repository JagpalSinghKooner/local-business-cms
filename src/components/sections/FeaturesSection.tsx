import Link from 'next/link'
import Container from '@/components/layout/Container'
import Portable from '@/components/Portable'
import { resolveLink } from '@/lib/links'
import type { PageSection } from '@/types'
import { getSectionLayout } from './layout'
import { cn } from '@/lib/cn'

const iconClass = 'flex h-10 w-10 items-center justify-center rounded-full bg-surface-muted text-lg font-semibold text-strong'

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

  const layout = getSectionLayout(section)

  return (
    <section
      className={layout.wrapperClassName}
      style={layout.style}
      data-animate={layout.dataAnimate}
      data-alignment={layout.dataAlignment}
    >
      <Container width={layout.containerWidth} className={cn(layout.containerClassName, 'space-y-8')}>
        <header className="space-y-3 md:max-w-3xl">
          {section.eyebrow ? (
            <p className="text-sm uppercase tracking-[0.2em] text-secondary">{section.eyebrow}</p>
          ) : null}
          <h2 className="text-3xl font-semibold text-strong">{section.title}</h2>
          {section.description ? <p className="text-base text-muted">{section.description}</p> : null}
        </header>

        <ul className={`grid gap-6 ${gridClass}`}>
          {items.map((item, index) => {
            const resolved = item.linkLabel ? resolveLink(item.link) : null
            return (
              <li key={index} className="flex h-full flex-col gap-4 rounded-2xl border border-divider bg-surface p-6 shadow-elevated">
                {item.icon ? <span className={iconClass}>{item.icon}</span> : null}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-strong">{item.title}</h3>
                  {item.body ? <Portable value={item.body} className="text-sm text-muted" /> : null}
                </div>
                {item.linkLabel && resolved ? (
                  <Link
                    href={resolved.href}
                    target={resolved.target}
                    rel={resolved.rel}
                    className="mt-auto text-sm font-semibold text-strong hover:underline"
                  >
                    {item.linkLabel}
                  </Link>
                ) : null}
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
