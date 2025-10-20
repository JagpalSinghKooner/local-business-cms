import Container from '@/components/layout/Container'
import Portable from '@/components/Portable'
import type { PageSection } from '@/types/sanity'

type TextSectionProps = {
  section: Extract<PageSection, { _type: 'section.text' }>
}

export default function TextSection({ section }: TextSectionProps) {
  const alignment = section.alignment ?? 'left'

  return (
    <section className="py-16">
      <Container
        className={`space-y-5 ${alignment === 'center' ? 'text-center md:max-w-3xl md:mx-auto' : ''}`}
      >
        {section.eyebrow ? (
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">{section.eyebrow}</p>
        ) : null}
        {section.heading ? <h2 className="text-3xl font-semibold text-zinc-900">{section.heading}</h2> : null}
        {section.body ? (
          <div className="prose prose-zinc max-w-none text-base">
            <Portable value={section.body} />
          </div>
        ) : null}
      </Container>
    </section>
  )
}
