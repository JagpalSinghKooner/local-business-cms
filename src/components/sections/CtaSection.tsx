import Container from '@/components/layout/Container'
import { CtaButton } from '@/components/ui/CtaButton'
import type { PageSection } from '@/types'
import { getSectionLayout } from './layout'
import { cn } from '@/lib/cn'

type CtaSectionProps = {
  section: Extract<PageSection, { _type: 'section.cta' }>
}

const backgroundClasses: Record<string, string> = {
  brand: 'bg-brand text-inverted',
  dark: 'bg-surface-strong text-inverted',
  light: 'bg-surface-muted text-strong',
}

export default function CtaSection({ section }: CtaSectionProps) {
  const background = backgroundClasses[section.background ?? 'brand'] ?? backgroundClasses.brand
  const ctas = section.ctas ?? []
  const layout = getSectionLayout(section, { baseClassName: background })

  return (
    <section
      className={layout.wrapperClassName}
      style={layout.style}
      data-animate={layout.dataAnimate}
      data-alignment={layout.dataAlignment}
    >
      <Container
        width={layout.containerWidth}
        className={cn(layout.containerClassName, 'flex flex-col gap-6 text-center md:items-center')}
      >
        <h2 className="text-3xl font-semibold md:text-4xl">{section.heading}</h2>
        {section.body ? <p className="max-w-2xl text-base opacity-90">{section.body}</p> : null}
        {ctas.length ? (
          <div className="flex flex-wrap justify-center gap-3">
            {ctas.map((cta, index) => (
              <CtaButton key={`${cta.label}-${index}`} cta={cta} invert={background !== backgroundClasses.light} />
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  )
}
