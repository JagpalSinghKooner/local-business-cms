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
import { computeLayoutFromOptions, type LayoutOptions } from './layout'
import Container from '@/components/layout/Container'
import { cn } from '@/lib/cn'
import type {
  PageSection,
  ServiceSummary,
  LocationSummary,
  OfferSummary,
  SiteSettings,
} from '@/types'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

type SectionRendererProps = {
  sections?: PageSection[]
  services: ServiceSummary[]
  locations: LocationSummary[]
  offers: OfferSummary[]
  site?: SiteSettings | null
  pagePath?: string
}

const GAP_CLASS_MAP: Record<string, string> = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-5',
  xl: 'gap-7',
  '2xl': 'gap-10',
  '3xl': 'gap-16',
  section: 'gap-20',
  gutter: 'gap-6',
}

export default function SectionRenderer({
  sections = [],
  services,
  locations,
  offers,
  site,
  pagePath,
}: SectionRendererProps) {
  return (
    <>
      {sections.map((section, index) => {
        const renderSection = () => {
          switch (section._type) {
            case 'section.hero':
              return <HeroSection section={section} isFirstSection={index === 0} />
            case 'section.text':
              return <TextSection section={section} />
            case 'section.services':
              return (
                <ServicesSection section={section as ServicesSectionData} allServices={services} />
              )
            case 'section.locations':
              return (
                <LocationsSection
                  section={section as LocationsSectionData}
                  allLocations={locations}
                />
              )
            case 'section.testimonials':
              return <TestimonialsSection section={section as TestimonialsSectionData} />
            case 'section.faq':
              return <FaqSection section={section as FaqSectionData} />
            case 'section.offers':
              return <OffersSection section={section as OffersSectionData} allOffers={offers} />
            case 'section.cta':
              return <CtaSection section={section} />
            case 'section.contact':
              return <ContactSection section={section} site={site} pagePath={pagePath} />
            case 'section.features':
              return <FeaturesSection section={section} />
            case 'section.steps':
              return <StepsSection section={section} />
            case 'section.stats':
              return <StatsSection section={section} />
            case 'section.logos':
              return <LogosSection section={section} />
            case 'section.mediaText':
              return <MediaTextSection section={section} />
            case 'section.timeline':
              return <TimelineSection section={section} />
            case 'section.pricingTable':
              return <PricingTableSection section={section} />
            case 'section.gallery':
              return <GallerySection section={section} />
            case 'section.quote':
              return <QuoteSection section={section} />
            case 'section.blogList':
              return <BlogListSection section={section} />
            case 'section.layout': {
              // Type guard for layout section
              const layoutSection = section as {
                sections?: PageSection[]
                layoutSettings?: {
                  layout?: LayoutOptions
                }
                gap?: string
              }
              const nestedSections = Array.isArray(layoutSection.sections)
                ? layoutSection.sections
                : []
              const layoutInfo = computeLayoutFromOptions(layoutSection.layoutSettings?.layout, {
                baseClassName: undefined,
              })
              const gapToken = layoutSection.gap ?? 'md'
              const gapClass = GAP_CLASS_MAP[gapToken] || GAP_CLASS_MAP.md

              return (
                <section
                  className={layoutInfo.wrapperClassName}
                  style={layoutInfo.style}
                  data-animate={layoutInfo.dataAnimate}
                  data-alignment={layoutInfo.dataAlignment}
                >
                  <Container
                    width={layoutInfo.containerWidth}
                    className={cn(
                      layoutInfo.containerClassName,
                      'flex flex-col',
                      gapClass
                    )}
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
        }

        return (
          <ErrorBoundary key={section._key} fallback={null}>
            {renderSection()}
          </ErrorBoundary>
        )
      })}
    </>
  )
}
