import Image from 'next/image'
import type { PageSection } from '@/types'
import Container from '@/components/layout/Container'
import { getSectionLayout } from './layout'
import { cn } from '@/lib/cn'

type GallerySectionProps = {
  section: Extract<PageSection, { _type: 'section.gallery' }>
}

export default function GallerySection({ section }: GallerySectionProps) {
  const images = Array.isArray(section.images) ? section.images : []
  if (!images.length) return null

  const layout = getSectionLayout(section)
  const mode = section.layoutMode ?? 'grid'

  const renderImage = (image: (typeof images)[number], index: number) => (
    <figure key={image?._key || index} className="relative overflow-hidden rounded-2xl bg-surface-muted">
      <Image
                src={image?.image?.asset?.url ?? `https://placehold.co/800x600/png?text=Media+${index + 1}`}
        alt={image?.image?.alt ?? ''}
        width={800}
        height={600}
        className="h-full w-full object-cover"
      />
      {image?.caption ? (
        <figcaption className="absolute inset-x-0 bottom-0 bg-surface bg-opacity-90 p-3 text-sm text-muted">
          {image.caption}
        </figcaption>
      ) : null}
    </figure>
  )

  return (
    <section
      className={layout.wrapperClassName}
      style={layout.style}
      data-animate={layout.dataAnimate}
      data-alignment={layout.dataAlignment}
    >
      <Container width={layout.containerWidth} className={cn(layout.containerClassName, 'space-y-8')}>
        <header className="space-y-3 md:max-w-3xl">
          {section.eyebrow ? (
            <p className="text-sm uppercase tracking-[0.2em] text-secondary">{section.eyebrow}</p>
          ) : null}
          <h2 className="text-3xl font-semibold text-strong">{section.heading}</h2>
          {section.body ? <p className="text-base text-muted">{section.body}</p> : null}
        </header>

        {mode === 'carousel' ? (
          <div className="overflow-x-auto">
            <div className="flex gap-4 pb-4">
              {images.map((image, index) => (
                <div key={image?._key || index} className="min-w-[220px] max-w-xs flex-1">
                  {renderImage(image, index)}
                </div>
              ))}
            </div>
          </div>
        ) : mode === 'masonry' ? (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [column-gap:1.5rem]">
            {images.map((image, index) => (
              <div key={image?._key || index} className="mb-4 break-inside-avoid">
                {renderImage(image, index)}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => renderImage(image, index))}
          </div>
        )}

        {section.enableLightbox ? (
          <p className="text-xs text-muted">
            Tap any media to view in detail. (Lightbox functionality to be implemented in frontend.)
          </p>
        ) : null}
      </Container>
    </section>
  )
}
