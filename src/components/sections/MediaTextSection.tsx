import Image from 'next/image'
import Container from '@/components/layout/Container'
import Portable from '@/components/Portable'
import { CtaButton } from '@/components/ui/CtaButton'
import type { PageSection } from '@/types'
import { getSectionLayout } from './layout'
import { cn } from '@/lib/cn'

type MediaTextSectionProps = {
  section: Extract<PageSection, { _type: 'section.mediaText' }>
}

const backgroundClasses: Record<string, string> = {
  default: 'bg-surface',
  muted: 'bg-surface-muted',
  brand: 'bg-brand',
}

export default function MediaTextSection({ section }: MediaTextSectionProps) {
  const backgroundClass = backgroundClasses[section.background ?? 'default'] ?? backgroundClasses.default
  const image = section.media?.image
  const imagePosition = section.mediaPosition ?? 'image-right'
  const imageFirst = imagePosition === 'image-left'
  const ctas = Array.isArray(section.ctas) ? section.ctas : []
  const isBrandBackground = (section.background ?? 'default') === 'brand'
  const headingClass = isBrandBackground ? 'mt-2 text-3xl font-semibold text-inverted' : 'mt-2 text-3xl font-semibold text-strong'
  const subheadingClass = isBrandBackground ? 'mt-4 text-base text-inverted opacity-90' : 'mt-4 text-base text-muted'
  const bodyClass = isBrandBackground ? 'mt-6 prose prose-invert max-w-none' : 'mt-6 prose prose-theme max-w-none'
  const layout = getSectionLayout(section, { baseClassName: backgroundClass })

  return (
    <section
      className={layout.wrapperClassName}
      style={layout.style}
      data-animate={layout.dataAnimate}
      data-alignment={layout.dataAlignment}
    >
      <Container width={layout.containerWidth} className={cn(layout.containerClassName, 'grid items-center gap-10 md:grid-cols-2')}>
        <div className={imageFirst ? 'order-2 md:order-1' : 'order-2'}>
          {section.eyebrow ? (
            <p className="text-sm uppercase tracking-[0.2em] text-secondary">{section.eyebrow}</p>
          ) : null}
          {section.heading ? <h2 className={headingClass}>{section.heading}</h2> : null}
          {section.subheading ? <p className={subheadingClass}>{section.subheading}</p> : null}
          {section.body ? (
            <div className={bodyClass}>
              <Portable value={section.body} />
            </div>
          ) : null}
          {ctas.length ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {ctas.map((cta, index) => (
                <CtaButton key={`${cta.label}-${index}`} cta={cta} />
              ))}
            </div>
          ) : null}
        </div>

        {image?.asset?.url ? (
          <div className={`${imageFirst ? 'order-1 md:order-2' : 'order-1'} relative aspect-video overflow-hidden rounded-3xl shadow-elevated`}>
            <Image
              src={image.asset.url}
              alt={image.alt ?? section.heading ?? ''}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        ) : null}
      </Container>
    </section>
  )
}
