import HeroSection from './HeroSection'
import TextSection from './TextSection'
import ServicesSection, { type ServicesSectionData } from './ServicesSection'
import LocationsSection, { type LocationsSectionData } from './LocationsSection'
import TestimonialsSection, { type TestimonialsSectionData } from './TestimonialsSection'
import FaqSection, { type FaqSectionData } from './FaqSection'
import OffersSection, { type OffersSectionData } from './OffersSection'
import CtaSection from './CtaSection'
import ContactSection from './ContactSection'
import FeaturesSection from './FeaturesSection'
import StepsSection from './StepsSection'
import StatsSection from './StatsSection'
import LogosSection from './LogosSection'
import MediaTextSection from './MediaTextSection'
import TimelineSection from './TimelineSection'
import PricingTableSection from './PricingTableSection'
import GallerySection from './GallerySection'
import QuoteSection from './QuoteSection'
import BlogListSection from './BlogListSection'
import { computeLayoutFromOptions } from './layout'
import Container from '@/components/layout/Container'
import { cn } from '@/lib/cn'
import type { CSSProperties } from 'react'
import type { PageSection, ServiceSummary, LocationSummary, OfferSummary, SiteSettings } from '@/types'

type SectionRendererProps = {
  sections?: PageSection[]
  services: ServiceSummary[]
  locations: LocationSummary[]
  offers: OfferSummary[]
  site?: SiteSettings | null
  pagePath?: string
}

export default function SectionRenderer({ sections = [], services, locations, offers, site, pagePath }: SectionRendererProps) {
  return (
    <>
      {sections.map((section) => {
        switch (section._type) {
          case 'section.hero':
            return <HeroSection key={section._key} section={section} />
          case 'section.text':
            return <TextSection key={section._key} section={section} />
          case 'section.services':
            return (
              <ServicesSection
                key={section._key}
                section={section as ServicesSectionData}
                allServices={services}
              />
            )
          case 'section.locations':
            return (
              <LocationsSection
                key={section._key}
                section={section as LocationsSectionData}
                allLocations={locations}
              />
            )
          case 'section.testimonials':
            return <TestimonialsSection key={section._key} section={section as TestimonialsSectionData} />
          case 'section.faq':
            return <FaqSection key={section._key} section={section as FaqSectionData} />
          case 'section.offers':
            return (
              <OffersSection
                key={section._key}
                section={section as OffersSectionData}
                allOffers={offers}
              />
            )
          case 'section.cta':
            return <CtaSection key={section._key} section={section} />
          case 'section.contact':
            return <ContactSection key={section._key} section={section} site={site} pagePath={pagePath} />
          case 'section.features':
            return <FeaturesSection key={section._key} section={section} />
          case 'section.steps':
            return <StepsSection key={section._key} section={section} />
          case 'section.stats':
            return <StatsSection key={section._key} section={section} />
          case 'section.logos':
            return <LogosSection key={section._key} section={section} />
          case 'section.mediaText':
            return <MediaTextSection key={section._key} section={section} />
          case 'section.timeline':
            return <TimelineSection key={section._key} section={section} />
          case 'section.pricingTable':
            return <PricingTableSection key={section._key} section={section} />
          case 'section.gallery':
            return <GallerySection key={section._key} section={section} />
          case 'section.quote':
            return <QuoteSection key={section._key} section={section} />
          case 'section.blogList':
            return <BlogListSection key={section._key} section={section} />
          case 'section.layout': {
            const nestedSections = Array.isArray((section as any).sections)
              ? ((section as any).sections as PageSection[])
              : []
            const layoutInfo = computeLayoutFromOptions((section as any).layoutSettings?.layout, {
              baseClassName: undefined,
            })
            const gapToken = (section as any).gap ?? 'md'
            const gapValue = `var(--space-${gapToken})`
            const containerStyle: CSSProperties = {
              '--layout-stack-gap': gapValue,
            } as CSSProperties

            return (
              <section
                key={section._key}
                className={layoutInfo.wrapperClassName}
                style={layoutInfo.style}
                data-animate={layoutInfo.dataAnimate}
                data-alignment={layoutInfo.dataAlignment}
              >
                <Container
                  width={layoutInfo.containerWidth}
                  className={cn(layoutInfo.containerClassName, 'flex flex-col gap-[var(--layout-stack-gap)]')}
                  style={containerStyle}
                >
                  <SectionRenderer
                    sections={nestedSections}
                    services={services}
                    locations={locations}
                    offers={offers}
                    site={site}
                    pagePath={pagePath}
                  />
                </Container>
              </section>
            )
          }
          default:
            return null
        }
      })}
    </>
  )
}
