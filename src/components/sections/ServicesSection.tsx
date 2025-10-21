import Container from '@/components/layout/Container'
import ServiceCard from '@/components/cards/ServiceCard'
import type { PageSection, ServiceSummary } from '@/types'
import { getSectionLayout } from './layout'
import { cn } from '@/lib/cn'

export type ServicesSectionData = Extract<PageSection, { _type: 'section.services' }> & {
  servicesSelected?: ServiceSummary[]
  servicesCategory?: { slug?: string | null } | null
}

type ServicesSectionProps = {
  section: ServicesSectionData
  allServices: ServiceSummary[]
}

const columnClasses: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

export default function ServicesSection({ section, allServices }: ServicesSectionProps) {
  const display = section.display ?? 'selected'
  let services: ServiceSummary[] = []

  if (display === 'all') {
    services = allServices
  } else if (display === 'category' && section.servicesCategory?.slug) {
    services = allServices.filter((service) => service.category?.slug === section.servicesCategory?.slug)
  } else {
    services = section.servicesSelected && section.servicesSelected.length > 0 ? section.servicesSelected : allServices
  }

  if (!services.length) return null

  const columns = Math.min(Math.max(section.columns ?? 3, 1), 4)
  const gridClass = columnClasses[columns] ?? columnClasses[3]
  const layout = getSectionLayout(section, { baseClassName: 'border-y border-divider' })

  return (
    <section
      className={layout.wrapperClassName}
      style={layout.style}
      data-animate={layout.dataAnimate}
      data-alignment={layout.dataAlignment}
    >
      <Container width={layout.containerWidth} className={cn(layout.containerClassName, 'space-y-8')}>
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Services</p>
          <h2 className="text-3xl font-semibold text-strong">{section.title}</h2>
          {section.description ? <p className="text-base text-muted">{section.description}</p> : null}
        </header>

        <ul className={`grid gap-6 ${gridClass}`}>
          {services.map((service) => (
            <li key={service.slug}>
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
