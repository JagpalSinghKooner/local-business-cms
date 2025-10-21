import Container from '@/components/layout/Container'
import Portable from '@/components/Portable'
import type { PageSection, PortableContent } from '@/types'
import { getSectionLayout } from './layout'
import { cn } from '@/lib/cn'

export type FaqSectionData = Extract<PageSection, { _type: 'section.faq' }> & {
  faqsSelected?: Array<{
    _id?: string
    question?: string
    answer?: PortableContent
  }>
}

type FaqSectionProps = {
  section: FaqSectionData
}

export default function FaqSection({ section }: FaqSectionProps) {
  const sectionData = section as any
  const faqs = sectionData.faqsSelected ?? []
  if (!faqs.length) return null

  const isColumns = sectionData.display === 'columns'

  const layout = getSectionLayout(sectionData)

  return (
    <section
      className={layout.wrapperClassName}
      style={layout.style}
      data-animate={layout.dataAnimate}
      data-alignment={layout.dataAlignment}
    >
      <Container width={layout.containerWidth} className={cn(layout.containerClassName, 'space-y-8')}>
        <header className="space-y-3 md:max-w-3xl">
          {section.title ? <h2 className="text-3xl font-semibold text-strong">{section.title}</h2> : null}
          {section.description ? <p className="text-base text-muted">{section.description}</p> : null}
        </header>

        <div className={isColumns ? 'grid gap-6 md:grid-cols-2' : 'space-y-4'}>
          {faqs.map((faq) => (
            <details
              key={faq._id}
              className="group rounded-2xl border border-divider bg-surface p-5 shadow-elevated"
              open={!isColumns}
            >
              <summary className="cursor-pointer list-none text-lg font-semibold text-strong">
                {faq.question}
              </summary>
              <div className="mt-3 text-sm text-muted">
                <Portable value={faq.answer} />
              </div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  )
}
