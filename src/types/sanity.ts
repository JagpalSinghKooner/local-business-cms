export type SanityImageAsset = {
  asset?: {
    _ref?: string
    url?: string
    metadata?: {
      lqip?: string
      dimensions?: { width: number; height: number; aspectRatio: number }
    }
  }
}

export type PortableContent = Array<{ _type: string; [key: string]: unknown }>

export type SocialLink = {
  platform: string
  url: string
}

export type OpeningHours = {
  dayOfWeek?: string[]
  opens?: string
  closes?: string
}

export type Address = {
  street1?: string
  street2?: string
  city?: string
  state?: string
  postcode?: string
  country?: string
}

export type TrackingScript = {
  label: string
  code: string
  location: 'head' | 'body'
}

export type CTA = {
  label: string
  href: string
  style?: 'primary' | 'secondary' | 'outline' | 'link'
}

export type SiteSettings = {
  name: string
  tagline?: string
  legalName?: string
  domain?: string
  phone?: string
  email?: string
  contactCta?: string
  primaryColor?: string
  secondaryColor?: string
  fontHeading?: string
  fontBody?: string
  hours?: OpeningHours[]
  social?: SocialLink[]
  metaTitle?: string
  metaDescription?: string
  ogImage?: SanityImageAsset
  twitterHandle?: string
  robots?: string
  googleTagManagerId?: string
  googleAnalyticsId?: string
  metaPixelId?: string
  trackingScripts?: TrackingScript[]
  address?: Address
  businessType?: string
  serviceAreas?: string[]
  priceRange?: string
  sameAs?: string[]
  geo?: {
    lat?: number
    lng?: number
  }
}

export type NavLink = {
  label: string
  href: string
}

export type Navigation = {
  header?: NavLink[]
  utility?: NavLink[]
  footer?: NavLink[]
}

export type MenuCollections = {
  services?: ServiceSummary[]
  locations?: LocationSummary[]
}

export type Tokens = {
  primary?: string
  secondary?: string
  fontFamily?: string
  radius?: string
  containerWidth?: string
}

export type ServiceSummary = {
  title: string
  slug: string
  intro?: PortableContent
  category?: {
    title?: string
    slug?: string
  }
  heroImage?: {
    alt?: string
    asset?: {
      url?: string
      metadata?: {
        lqip?: string
        dimensions?: { width: number; height: number }
      }
    }
  }
}

export type ServiceDetail = ServiceSummary & {
  sections?: PageSection[]
  body?: PortableContent
  locations?: LocationSummary[]
  seo?: {
    title?: string
    description?: string
    ogImage?: { asset?: { url?: string } }
  }
}

export type LocationSummary = {
  city: string
  slug: string
  intro?: PortableContent
}

export type OfferSummary = {
  title: string
  slug: string
  summary?: string
  validFrom?: string
  validTo?: string
}

export type Testimonial = {
  _id: string
  author?: string
  quote?: string
  role?: string
  location?: string
  rating?: number
}

export type FAQ = {
  _id: string
  question: string
  answer: PortableContent
}

export type PageSection =
  | {
      _key: string
      _type: 'section.hero'
      variant?: 'split' | 'centered' | 'background'
      eyebrow?: string
      heading: string
      subheading?: string
      background?: 'default' | 'muted' | 'brand'
      media?: {
        image?: {
          alt?: string
          asset?: {
            url?: string
            metadata?: { lqip?: string; dimensions?: { width: number; height: number } }
          }
        }
        videoUrl?: string
      }
      ctas?: CTA[]
    }
  | {
      _key: string
      _type: 'section.text'
      eyebrow?: string
      heading?: string
      body?: PortableContent
      alignment?: 'left' | 'center'
    }
  | {
      _key: string
      _type: 'section.services'
      title: string
      description?: string
      display?: 'selected' | 'all' | 'category'
      columns?: number
      servicesSelected?: ServiceSummary[]
      servicesCategory?: { title?: string; slug?: string }
    }
  | {
      _key: string
      _type: 'section.locations'
      title: string
      description?: string
      columns?: number
      locationsSelected?: LocationSummary[]
    }
  | {
      _key: string
      _type: 'section.testimonials'
      title?: string
      description?: string
      style?: 'grid' | 'carousel'
      testimonialsSelected: Testimonial[]
    }
  | {
      _key: string
      _type: 'section.faq'
      title?: string
      description?: string
      display?: 'accordion' | 'columns'
      faqsSelected: FAQ[]
    }
  | {
      _key: string
      _type: 'section.offers'
      title?: string
      description?: string
      offersSelected?: OfferSummary[]
      limit?: number
    }
  | {
      _key: string
      _type: 'section.cta'
      background?: 'brand' | 'dark' | 'light'
      heading: string
      body?: string
      ctas: CTA[]
    }
  | {
      _key: string
      _type: 'section.contact'
      title: string
      description?: string
      formType?: 'inline' | 'embed' | 'external'
      embedCode?: string
      externalLink?: string
    }
  | {
      _key: string
      _type: 'section.features'
      title: string
      description?: string
      columns?: number
      items: Array<{
        icon?: string
        title: string
        body?: PortableContent
        linkLabel?: string
        linkHref?: string
      }>
    }
  | {
      _key: string
      _type: 'section.steps'
      title: string
      description?: string
      items: Array<{
        title: string
        body?: PortableContent
      }>
    }
  | {
      _key: string
      _type: 'section.stats'
      title?: string
      description?: string
      alignment?: 'left' | 'center'
      items: Array<{
        value: string
        label: string
      }>
    }
  | {
      _key: string
      _type: 'section.logos'
      title?: string
      description?: string
      items: Array<{
        name: string
        logo?: {
          asset?: { url?: string }
        }
        url?: string
      }>
    }

export type PageDocument = {
  title: string
  slug: string
  sections?: PageSection[]
  body?: PortableContent
  seo?: {
    title?: string
    description?: string
    canonical?: string
    ogImage?: { asset?: { url?: string } }
  }
}
