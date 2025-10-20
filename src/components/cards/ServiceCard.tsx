import Image from 'next/image'
import Link from 'next/link'
import Portable from '@/components/Portable'
import type { ServiceSummary } from '@/types/sanity'

const PLACEHOLDER = 'https://placehold.co/600x400?text=Service'

type ServiceCardProps = {
  service: ServiceSummary
  locationSlug?: string
}

export default function ServiceCard({ service, locationSlug }: ServiceCardProps) {
  const imageSrc = service.heroImage?.asset?.url ?? PLACEHOLDER
  const intro = service.intro ? service.intro.slice(0, 1) : undefined
  const href = locationSlug ? `/${service.slug}-${locationSlug}` : `/services/${service.slug}`

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm shadow-zinc-900/5 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-900/10"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={`${imageSrc}`}
          alt={service.heroImage?.alt ?? service.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
            {service.category?.title ?? 'Service'}
          </p>
          <h3 className="text-lg font-semibold text-zinc-900">{service.title}</h3>
        </div>
        {intro ? (
          <Portable value={intro} className="text-sm text-zinc-600" />
        ) : null}
        <span className="mt-auto text-sm font-semibold text-zinc-900">View service →</span>
      </div>
    </Link>
  )
}
