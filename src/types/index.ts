export type SiteSettings = Sanity.Schema.SiteSettings
export type Navigation = Sanity.Schema.Navigation
export type Tokens = Sanity.Schema.Tokens
export type Address = Sanity.Schema.Address
export type SocialLink = Sanity.Schema.SocialLink
export type NavLink = Sanity.Schema.NavLink
export type LinkValue = Sanity.Schema.Link
export type CTA = Sanity.Schema.Cta
export type BreadcrumbSettings = Sanity.Schema.BreadcrumbSettings

export type PortableContent = Array<Sanity.Block | Record<string, unknown>>

export type PageSummary = {
  title?: string | null
  slug?: string | null
}

export type ServiceSummary = {
  title: string
  slug: string
  intro?: PortableContent
  category?: {
    title?: string
    slug?: string
  }
  heroImage?: Sanity.Schema.Service['heroImage']
  seo?: Sanity.Schema.Service['seo']
}

export type ServiceDetail = ServiceSummary & {
  body?: PortableContent
  sections?: PageSection[]
  locations?: Array<{
    _id?: string
    city?: string
    slug?: string
    intro?: PortableContent
  }>
  breadcrumbs?: BreadcrumbSettings
  displayOptions?: {
    showRelatedLocations?: boolean
    showOtherServices?: boolean
  }
  scriptOverrides?: Array<{
    scriptKey?: string
    enabled?: boolean
  }>
}

export type OfferSummary = {
  title: string
  summary?: PortableContent
  slug: string
  validFrom?: string
  validTo?: string
}

export type LocationSummary = {
  city: string
  slug: string
  intro?: PortableContent
}

export type PageDocument = Sanity.Schema.Page

type InferArrayMember<T> = T extends ReadonlyArray<infer Item> ? Item : T extends Array<infer Item> ? Item : never

export type PageSection = InferArrayMember<NonNullable<Sanity.Schema.Page['sections']>>
