import Image from 'next/image'
import type { PageSection } from '@/types'
import Container from '@/components/layout/Container'
import { getSectionLayout } from './layout'
import { cn } from '@/lib/cn'
import { CtaButton } from '@/components/ui/CtaButton'

type QuoteSectionProps = {
  section: Extract<PageSection, { _type: 'section.quote' }>
}

export default function QuoteSection({ section }: QuoteSectionProps) {
  const layout = getSectionLayout(section)

  return (
    <section
      className={layout.wrapperClassName}
      style={layout.style}
      data-animate={layout.dataAnimate}
      data-alignment={layout.dataAlignment}
    >
      <Container width={layout.containerWidth} className={cn(layout.containerClassName, 'space-y-6 md:max-w-3xl')}>
        {section.eyebrow ? (
          <p className="text-sm uppercase tracking-[0.2em] text-secondary">{section.eyebrow}</p>
        ) : null}
        <blockquote className="space-y-4">
          <p className="text-2xl font-semibold text-strong">“{section.quote}”</p>
          <footer className="flex items-center gap-4 text-sm text-muted">
            {section.avatar?.asset?.url ? (
              <Image
                src={section.avatar.asset.url}
                alt={section.author ?? ''}
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : null}
            <div>
              <p className="font-semibold text-strong">{section.author}</p>
              <p>
                {[section.role, section.company].filter(Boolean).join(' · ')}
              </p>
            </div>
            {section.logo?.asset?.url ? (
              <Image
                src={section.logo.asset.url}
                alt={section.company ?? ''}
                width={80}
                height={40}
                className="ml-auto h-10 w-auto object-contain"
              />
            ) : null}
          </footer>
        </blockquote>
        {section.cta ? (
          <div>
            <CtaButton cta={section.cta} invert={layout.wrapperClassName.includes('text-inverted')} />
          </div>
        ) : null}
      </Container>
    </section>
  )
}
