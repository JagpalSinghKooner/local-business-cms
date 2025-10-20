import Container from '@/components/layout/Container'
import type { PageSection } from '@/types/sanity'

type TestimonialsSectionProps = {
  section: Extract<PageSection, { _type: 'section.testimonials' }>
}

export default function TestimonialsSection({ section }: TestimonialsSectionProps) {
  const items = section.testimonialsSelected ?? []
  if (!items.length) return null

  const isCarousel = section.style === 'carousel'

  return (
    <section className="bg-zinc-50 py-16">
      <Container className="space-y-10">
        <header className="space-y-3 text-center md:max-w-2xl md:mx-auto">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Testimonials</p>
          {section.title ? <h2 className="text-3xl font-semibold text-zinc-900">{section.title}</h2> : null}
          {section.description ? <p className="text-base text-zinc-600">{section.description}</p> : null}
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
                className="min-w-[20rem] rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-900/5"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">Customer</p>
                <blockquote className="mt-3 space-y-3">
                  <p className="text-lg text-zinc-800">“{testimonial.quote}”</p>
                  <footer className="text-sm text-zinc-500">
                    <span className="font-semibold text-zinc-700">{testimonial.author}</span>
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
