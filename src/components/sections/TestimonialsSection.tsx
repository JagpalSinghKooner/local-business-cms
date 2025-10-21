import Container from '@/components/layout/Container'
import type { PageSection } from '@/types'
import { getSectionLayout } from './layout'
import { cn } from '@/lib/cn'

export type TestimonialsSectionData = Extract<PageSection, { _type: 'section.testimonials' }> & {
  testimonialsSelected?: Array<{
    _id?: string
    author?: string
    quote?: string
    role?: string
    location?: string
    rating?: number
  }>
}

type TestimonialsSectionProps = {
  section: TestimonialsSectionData
}

export default function TestimonialsSection({ section }: TestimonialsSectionProps) {
  const items = section.testimonialsSelected ?? []
  if (!items.length) return null

  const isCarousel = section.style === 'carousel'

  const layout = getSectionLayout(section, { baseClassName: 'bg-surface-muted' })

  return (
    <section
      className={layout.wrapperClassName}
      style={layout.style}
      data-animate={layout.dataAnimate}
      data-alignment={layout.dataAlignment}
    >
      <Container width={layout.containerWidth} className={cn(layout.containerClassName, 'space-y-10')}>
        <header className="space-y-3 text-center md:max-w-2xl md:mx-auto">
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Testimonials</p>
          {section.title ? <h2 className="text-3xl font-semibold text-strong">{section.title}</h2> : null}
          {section.description ? <p className="text-base text-muted">{section.description}</p> : null}
        </header>

        <div
          className={
            isCarousel
              ? 'overflow-x-auto pb-4'
              : 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
          }
        >
          <ul
            className={
              isCarousel
                ? 'flex gap-4'
                : 'contents'
            }
          >
            {items.map((testimonial) => (
              <li
                key={testimonial._id}
                className="min-w-[20rem] rounded-3xl border border-divider bg-surface p-6 shadow-elevated"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Customer</p>
                <blockquote className="mt-3 space-y-3">
                  <p className="text-lg text-strong">“{testimonial.quote}”</p>
                  <footer className="text-sm text-muted">
                    <span className="font-semibold text-muted">{testimonial.author}</span>
                    {testimonial.role ? ` · ${testimonial.role}` : ''}
                    {testimonial.location ? ` · ${testimonial.location}` : ''}
                  </footer>
                </blockquote>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
