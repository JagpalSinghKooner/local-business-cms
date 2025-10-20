import Container from '@/components/layout/Container'
import { CtaButton } from '@/components/ui/CtaButton'
import type { PageSection } from '@/types/sanity'

type CtaSectionProps = {
  section: Extract<PageSection, { _type: 'section.cta' }>
}

const backgroundClasses: Record<string, string> = {
  brand: 'bg-[var(--brand-primary, #0ea5e9)] text-white',
  dark: 'bg-zinc-900 text-white',
  light: 'bg-zinc-100 text-zinc-900',
}

export default function CtaSection({ section }: CtaSectionProps) {
  const background = backgroundClasses[section.background ?? 'brand'] ?? backgroundClasses.brand
  const ctas = section.ctas ?? []

  return (
    <section className={`${background}`}>
      <Container className="flex flex-col gap-6 py-16 text-center md:items-center">
        <h2 className="text-3xl font-semibold md:text-4xl">{section.heading}</h2>
        {section.body ? <p className="max-w-2xl text-base opacity-90">{section.body}</p> : null}
        {ctas.length ? (
          <div className="flex flex-wrap justify-center gap-3">
            {ctas.map((cta) => (
              <CtaButton key={cta.href + cta.label} cta={cta} invert={background !== backgroundClasses.light} />
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  )
}
