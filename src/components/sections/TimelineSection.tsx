import type { PageSection } from '@/types'
import Container from '@/components/layout/Container'
import { CtaButton } from '@/components/ui/CtaButton'
import { getSectionLayout } from './layout'
import { cn } from '@/lib/cn'

type TimelineSectionProps = {
  section: Extract<PageSection, { _type: 'section.timeline' }>
}

export default function TimelineSection({ section }: TimelineSectionProps) {
  const items = Array.isArray(section.items) ? section.items : []
  if (!items.length) return null

  const layout = getSectionLayout(section)
  const mode = section.layoutMode ?? 'vertical'

  return (
    <section
      className={layout.wrapperClassName}
      style={layout.style}
      data-animate={layout.dataAnimate}
      data-alignment={layout.dataAlignment}
    >
      <Container width={layout.containerWidth} className={cn(layout.containerClassName, 'space-y-10')}>
        <header className="space-y-3 md:max-w-3xl">
          {section.eyebrow ? (
            <p className="text-sm uppercase tracking-[0.2em] text-secondary">{section.eyebrow}</p>
          ) : null}
          <h2 className="text-3xl font-semibold text-strong">{section.heading}</h2>
          {section.body ? <p className="text-base text-muted">{section.body}</p> : null}
        </header>

        {mode === 'horizontal' ? (
          <ol className="grid gap-6 md:grid-cols-3">
            {items.map((item, index) => (
              <li key={index} className="relative flex h-full flex-col gap-4 rounded-2xl border border-divider bg-surface p-6 shadow-elevated">
                {item.date ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{item.date}</p> : null}
                <h3 className="text-lg font-semibold text-strong">{item.title}</h3>
                {item.subheading ? <p className="text-sm text-muted">{item.subheading}</p> : null}
                {item.summary ? <p className="text-sm text-muted">{item.summary}</p> : null}
                {item.link?.label ? <span className="mt-auto text-sm font-semibold text-accent">{item.link.label}</span> : null}
              </li>
            ))}
          </ol>
        ) : (
          <ol className="relative space-y-8 border-l border-divider pl-6">
            {items.map((item, index) => (
              <li key={index} className="relative pl-6">
                <span className="absolute left-[-0.5rem] top-2 h-3 w-3 rounded-full bg-brand/80" />
                {item.date ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{item.date}</p> : null}
                <h3 className="text-lg font-semibold text-strong">{item.title}</h3>
                {item.subheading ? <p className="text-sm text-muted">{item.subheading}</p> : null}
                {item.summary ? <p className="mt-2 text-sm text-muted">{item.summary}</p> : null}
                {item.link?.label ? <span className="mt-3 inline-block text-sm font-semibold text-accent">{item.link.label}</span> : null}
              </li>
            ))}
          </ol>
        )}

        {section.ctas?.length ? (
          <div className="flex flex-wrap gap-3">
            {section.ctas.map((cta, index) => (
              <CtaButton key={`${cta.label}-${index}`} cta={cta} />
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  )
}
