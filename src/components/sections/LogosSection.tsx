import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/layout/Container'
import type { PageSection } from '@/types'
import { getSectionLayout } from './layout'
import { cn } from '@/lib/cn'
import { getImageUrl } from '@/types/sanity-helpers'

const PLACEHOLDER = 'https://placehold.co/200x100/png?text=Logo'

export default function LogosSection({ section }: { section: Extract<PageSection, { _type: 'section.logos' }> }) {
  const items = Array.isArray(section.items) ? section.items : []
  if (!items.length) return null

  const layout = getSectionLayout(section, { baseClassName: 'border-y border-divider bg-surface' })

  return (
    <section
      className={layout.wrapperClassName}
      style={layout.style}
      data-animate={layout.dataAnimate}
      data-alignment={layout.dataAlignment}
    >
      <Container width={layout.containerWidth} className={cn(layout.containerClassName, 'space-y-8')}>
        <header className="space-y-3 text-center md:max-w-2xl md:mx-auto">
          {section.title ? <h2 className="text-3xl font-semibold text-strong">{section.title}</h2> : null}
          {section.description ? <p className="text-base text-muted">{section.description}</p> : null}
        </header>
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {items.map((item, index) => {
            const content = (
              <div className="flex h-24 items-center justify-center rounded-2xl border border-divider bg-surface-muted p-4">
                <Image
                  src={getImageUrl(item.logo) ?? PLACEHOLDER}
                  alt={item.name ?? `Logo ${index + 1}`}
                  width={180}
                  height={90}
                  className="object-contain"
                />
              </div>
            )

            return (
              <li key={index} className="flex items-center justify-center">
                {item.url ? (
                  <Link href={item.url} target="_blank" rel="noreferrer" className="block w-full">
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
