import Container from '@/components/layout/Container'
import Portable from '@/components/Portable'
import type { PageSection } from '@/types/sanity'

type FaqSectionProps = {
  section: Extract<PageSection, { _type: 'section.faq' }>
}

export default function FaqSection({ section }: FaqSectionProps) {
  const faqs = section.faqsSelected ?? []
  if (!faqs.length) return null

  const isColumns = section.display === 'columns'

  return (
    <section className="py-16">
      <Container className="space-y-8">
        <header className="space-y-3 md:max-w-3xl">
          {section.title ? <h2 className="text-3xl font-semibold text-zinc-900">{section.title}</h2> : null}
          {section.description ? <p className="text-base text-zinc-600">{section.description}</p> : null}
        </header>

        <div className={isColumns ? 'grid gap-6 md:grid-cols-2' : 'space-y-4'}>
          {faqs.map((faq) => (
            <details
              key={faq._id}
              className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm shadow-zinc-900/5"
              open={!isColumns}
            >
              <summary className="cursor-pointer list-none text-lg font-semibold text-zinc-900">
                {faq.question}
              </summary>
              <div className="mt-3 text-sm text-zinc-600">
                <Portable value={faq.answer} />
              </div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  )
}
