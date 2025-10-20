import Image from 'next/image'
import type { PageSection } from '@/types/sanity'
import { CtaButton } from '@/components/ui/CtaButton'
import Container from '@/components/layout/Container'

type HeroSectionProps = {
  section: Extract<PageSection, { _type: 'section.hero' }>
}

const backgroundClasses: Record<string, string> = {
  default: 'bg-white',
  muted: 'bg-zinc-50',
  brand: 'bg-[var(--brand-primary, #0ea5e9)] text-white',
}

export default function HeroSection({ section }: HeroSectionProps) {
  const variant = section.variant ?? 'split'
  const backgroundClass = backgroundClasses[section.background ?? 'default'] ?? backgroundClasses.default
  const ctas = section.ctas ?? []

  if (variant === 'background') {
    const imageUrl = section.media?.image?.asset?.url
    return (
      <section className="relative isolate overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={section.media?.image?.alt ?? section.heading}
            fill
            className="object-cover"
            priority
          />
        ) : null}
        <div className="absolute inset-0 bg-black/40" aria-hidden />
        <Container className="relative flex min-h-[24rem] flex-col justify-center py-24 text-white md:py-32">
          {section.eyebrow ? <p className="text-sm uppercase tracking-[0.2em]">{section.eyebrow}</p> : null}
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{section.heading}</h1>
          {section.subheading ? <p className="mt-4 max-w-2xl text-lg text-zinc-100">{section.subheading}</p> : null}
          {ctas.length ? (
            <div className="mt-8 flex flex-wrap gap-4">
              {ctas.map((cta) => (
                <CtaButton key={cta.href + cta.label} cta={cta} invert />
              ))}
            </div>
          ) : null}
        </Container>
      </section>
    )
  }

  const imageUrl = section.media?.image?.asset?.url

  return (
    <section className={`${backgroundClass}`}>
      <Container className="grid items-center gap-10 py-20 md:grid-cols-2">
        <div>
          {section.eyebrow ? (
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">{section.eyebrow}</p>
          ) : null}
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">{section.heading}</h1>
          {section.subheading ? <p className="mt-4 text-lg text-zinc-600">{section.subheading}</p> : null}
          {ctas.length ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {ctas.map((cta) => (
                <CtaButton key={cta.href + cta.label} cta={cta} />
              ))}
            </div>
          ) : null}
        </div>
        {variant === 'split' && imageUrl ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-zinc-100 shadow-lg shadow-zinc-900/10">
            <Image
              src={imageUrl}
              alt={section.media?.image?.alt ?? section.heading}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
          </div>
        ) : variant === 'centered' ? (
          <div className="md:col-span-2">
            <div className="mt-8 flex items-center justify-center">
              {ctas.length ? (
                <div className="flex flex-wrap justify-center gap-3">
                  {ctas.map((cta) => (
                    <CtaButton key={cta.href + cta.label} cta={cta} />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  )
}
