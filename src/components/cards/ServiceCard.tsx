import Image from 'next/image'
import Link from 'next/link'
import Portable from '@/components/Portable'
import type { ServiceSummary } from '@/types'
import { getImageUrl, getImageAlt } from '@/types/sanity-helpers'

const PLACEHOLDER = 'https://placehold.co/600x400/png?text=Service'

type ServiceCardProps = {
  service: ServiceSummary
  locationSlug?: string
}

export default function ServiceCard({ service, locationSlug }: ServiceCardProps) {
  const imageSrc = getImageUrl(service.heroImage) ?? PLACEHOLDER
  const imageAlt = getImageAlt(service.heroImage, service.title)
  const intro = service.intro ? service.intro.slice(0, 1) : undefined
  const href = locationSlug ? `/services/${service.slug}-${locationSlug}` : `/services/${service.slug}`

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-divider bg-surface shadow-elevated transition-transform duration-300 hover:-translate-y-1 hover:shadow-elevated"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            {service.category?.title ?? 'Service'}
          </p>
          <h3 className="text-lg font-semibold text-strong">{service.title}</h3>
        </div>
        {intro ? (
          <Portable value={intro} className="text-sm text-muted" />
        ) : null}
        <span className="mt-auto text-sm font-semibold text-strong">View service →</span>
      </div>
    </Link>
  )
}
