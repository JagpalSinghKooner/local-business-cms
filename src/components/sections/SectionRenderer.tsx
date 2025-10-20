import HeroSection from './HeroSection'
import TextSection from './TextSection'
import ServicesSection from './ServicesSection'
import LocationsSection from './LocationsSection'
import TestimonialsSection from './TestimonialsSection'
import FaqSection from './FaqSection'
import OffersSection from './OffersSection'
import CtaSection from './CtaSection'
import ContactSection from './ContactSection'
import FeaturesSection from './FeaturesSection'
import StepsSection from './StepsSection'
import StatsSection from './StatsSection'
import LogosSection from './LogosSection'
import type { PageSection, ServiceSummary, LocationSummary, OfferSummary, SiteSettings } from '@/types/sanity'

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
            return <ServicesSection key={section._key} section={section} allServices={services} />
          case 'section.locations':
            return <LocationsSection key={section._key} section={section} allLocations={locations} />
          case 'section.testimonials':
            return <TestimonialsSection key={section._key} section={section} />
          case 'section.faq':
            return <FaqSection key={section._key} section={section} />
          case 'section.offers':
            return <OffersSection key={section._key} section={section} allOffers={offers} />
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
          default:
            return null
        }
      })}
    </>
  )
}
