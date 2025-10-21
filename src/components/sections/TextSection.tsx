import Container from '@/components/layout/Container'
import Portable from '@/components/Portable'
import type { PageSection } from '@/types'
import { getSectionLayout } from './layout'
import { cn } from '@/lib/cn'

type TextSectionProps = {
  section: Extract<PageSection, { _type: 'section.text' }>
}

export default function TextSection({ section }: TextSectionProps) {
  const alignment = section.alignment ?? 'left'
  const layout = getSectionLayout(section)

  return (
    <section
      className={layout.wrapperClassName}
      style={layout.style}
      data-animate={layout.dataAnimate}
      data-alignment={layout.dataAlignment}
    >
      <Container
        width={layout.containerWidth}
        className={cn(layout.containerClassName, 'space-y-5', alignment === 'center' && 'text-center md:mx-auto md:max-w-3xl')}
      >
        {section.eyebrow ? (
          <p className="text-sm uppercase tracking-[0.2em] text-secondary">{section.eyebrow}</p>
        ) : null}
        {section.heading ? <h2 className="text-3xl font-semibold text-strong">{section.heading}</h2> : null}
        {section.body ? (
          <div className="prose prose-theme max-w-none text-base">
            <Portable value={section.body} />
          </div>
        ) : null}
      </Container>
    </section>
  )
}
