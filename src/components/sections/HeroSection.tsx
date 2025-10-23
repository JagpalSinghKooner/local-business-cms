import type { PageSection } from '@/types'
import { CtaButton } from '@/components/ui/CtaButton'
import Container from '@/components/layout/Container'
import { getSectionLayout } from './layout'
import { cn } from '@/lib/cn'
import OptimizedImage from '@/components/ui/OptimizedImage'

type HeroSectionProps = {
  section: Extract<PageSection, { _type: 'section.hero' }>
  isFirstSection?: boolean
}

const backgroundClasses: Record<string, string> = {
  default: 'bg-surface',
  muted: 'bg-surface-muted',
  brand: 'bg-brand text-inverted',
}

export default function HeroSection({ section, isFirstSection = false }: HeroSectionProps) {
  const variant = section.variant ?? 'split'
  const backgroundClass =
    backgroundClasses[section.background ?? 'default'] ?? backgroundClasses.default
  const ctas = section.ctas ?? []
  const layoutMeta = getSectionLayout(section, {
    baseClassName: variant === 'background' ? 'relative isolate overflow-hidden' : backgroundClass,
  })

  // Use eager priority for first hero section for better LCP
  const priority = isFirstSection
    ? 'eager'
    : ((section.media as { loadingPriority?: string })?.loadingPriority as
        | 'eager'
        | 'lazy'
        | 'auto') || 'auto'

  if (variant === 'background') {
    return (
      <section
        className={layoutMeta.wrapperClassName}
        style={layoutMeta.style}
        data-animate={layoutMeta.dataAnimate}
        data-alignment={layoutMeta.dataAlignment}
      >
        <OptimizedImage
          image={section.media}
          alt={section.heading}
          fill
          className="object-cover"
          sizes="100vw"
          priority={priority}
        />
        <div className="absolute inset-0 bg-black/40" aria-hidden />
        <Container
          width={layoutMeta.containerWidth}
          className={cn('relative flex min-h-[24rem] flex-col justify-center text-inverted')}
        >
          {section.eyebrow ? (
            <p className="text-sm uppercase tracking-[0.2em]">{section.eyebrow}</p>
          ) : null}
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{section.heading}</h1>
          {section.subheading ? (
            <p className="mt-4 max-w-2xl text-lg text-inverted">{section.subheading}</p>
          ) : null}
          {ctas.length ? (
            <div className="mt-8 flex flex-wrap gap-4">
              {ctas.map((cta, index) => (
                <CtaButton key={`${cta.label}-${index}`} cta={cta} invert />
              ))}
            </div>
          ) : null}
        </Container>
      </section>
    )
  }

  return (
    <section
      className={layoutMeta.wrapperClassName}
      style={layoutMeta.style}
      data-animate={layoutMeta.dataAnimate}
      data-alignment={layoutMeta.dataAlignment}
    >
      <Container
        width={layoutMeta.containerWidth}
        className={cn(
          layoutMeta.containerClassName,
          'grid items-center gap-10 md:grid-cols-2',
          variant === 'centered' && 'md:grid-cols-1'
        )}
      >
        <div>
          {section.eyebrow ? (
            <p className="text-sm uppercase tracking-[0.2em] text-secondary">{section.eyebrow}</p>
          ) : null}
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-strong md:text-5xl">
            {section.heading}
          </h1>
          {section.subheading ? (
            <p className="mt-4 text-lg text-muted">{section.subheading}</p>
          ) : null}
          {ctas.length ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {ctas.map((cta, index) => (
                <CtaButton key={`${cta.label}-${index}`} cta={cta} />
              ))}
            </div>
          ) : null}
        </div>
        {variant === 'split' ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-surface-muted shadow-elevated">
            <OptimizedImage
              image={section.media}
              alt={section.heading}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority={priority}
            />
          </div>
        ) : variant === 'centered' ? (
          <div className="md:col-span-1">
            {ctas.length ? (
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {ctas.map((cta, index) => (
                  <CtaButton key={`${cta.label}-${index}`} cta={cta} />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </Container>
    </section>
  )
}
