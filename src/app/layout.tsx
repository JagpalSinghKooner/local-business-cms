import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import type { CSSProperties, ReactNode } from 'react'
import './globals.css'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AnalyticsScripts from '@/components/AnalyticsScripts'
import JsonLd from '@/components/seo/JsonLd'
import { buildLocalBusinessJsonLd } from '@/lib/jsonld'
import { getGlobalDataset } from '@/sanity/loaders'
import type { Navigation, SiteSettings, Tokens, ServiceSummary, LocationSummary } from '@/types/sanity'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Local Business',
    template: '%s | Local Business',
  },
  description: 'A CMS-driven marketing site for local service businesses.',
}

function buildBrandStyles(site?: SiteSettings | null, tokens?: Tokens | null): Record<string, string> {
  const styles: Record<string, string> = {}

  if (tokens?.primary || site?.primaryColor) {
    styles['--brand-primary'] = tokens?.primary ?? site?.primaryColor ?? ''
  }
  if (tokens?.secondary || site?.secondaryColor) {
    styles['--brand-secondary'] = tokens?.secondary ?? site?.secondaryColor ?? ''
  }
  styles['--brand-on-primary'] = '#ffffff'
  if (tokens?.fontFamily || site?.fontBody) {
    styles['--brand-font-body'] = tokens?.fontFamily ?? site?.fontBody ?? ''
  }
  if (site?.fontHeading) {
    styles['--brand-font-heading'] = site.fontHeading
  }

  return styles
}

const FALLBACK_SITE: SiteSettings = {
  name: 'Local Business',
  tagline: 'Professional services in your area',
}

const FALLBACK_NAVIGATION: Navigation = {
  header: [
    { label: 'Services', href: '/services' },
    { label: 'Locations', href: '/locations' },
    { label: 'Offers', href: '/offers' },
  ],
  utility: [],
  footer: [],
}

const FALLBACK_DATA = {
  site: FALLBACK_SITE,
  navigation: FALLBACK_NAVIGATION,
  tokens: null as Tokens | null,
  services: [] as ServiceSummary[],
  locations: [] as LocationSummary[],
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const dataset = await getGlobalDataset().catch((error) => {
    console.error('Failed to load global settings from Sanity', error)
    return FALLBACK_DATA
  })

  const { site, navigation, tokens, services, locations } = {
    site: dataset.site ?? FALLBACK_DATA.site,
    navigation: dataset.navigation ?? FALLBACK_DATA.navigation,
    tokens: dataset.tokens ?? FALLBACK_DATA.tokens,
    services: dataset.services ?? FALLBACK_DATA.services,
    locations: dataset.locations ?? FALLBACK_DATA.locations,
  }
  const brandStyles = buildBrandStyles(site, tokens) as CSSProperties
  const businessName = site?.name ?? FALLBACK_DATA.site?.name ?? 'Local Business'
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.localbusiness.com'
  const localBusinessJsonLd = buildLocalBusinessJsonLd({
    baseUrl,
    urlPath: '/',
    name: site?.name ?? FALLBACK_DATA.site.name,
    legalName: site?.legalName,
    telephone: site?.phone,
    priceRange: site?.priceRange,
    sameAs: site?.sameAs ?? site?.social?.map((link) => link.url).filter(Boolean),
    image: site?.ogImage?.asset?.url ?? null,
    address: site?.address
      ? {
          streetAddress: site.address.street1,
          addressLocality: site.address.city,
          addressRegion: site.address.state,
          postalCode: site.address.postcode,
          addressCountry: site.address.country,
        }
      : undefined,
    geo: site?.geo ? { latitude: site.geo.lat, longitude: site.geo.lng } : undefined,
    openingHours: site?.hours?.map((hours) => ({
      dayOfWeek: hours.dayOfWeek,
      opens: hours.opens,
      closes: hours.closes,
    })),
  })

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-zinc-900`}
        style={brandStyles}
      >
        <AnalyticsScripts site={site} />
        <JsonLd data={localBusinessJsonLd} />
        {site?.googleTagManagerId ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${site.googleTagManagerId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        ) : null}
        <Header
          businessName={businessName}
          headerLinks={navigation?.header}
          utilityLinks={navigation?.utility}
          phone={site?.phone}
          ctaLabel={site?.contactCta}
          megaMenu={{ services: services ?? [], locations: locations ?? [] }}
        />
        {children}
        <Footer
          businessName={businessName}
          footerLinks={navigation?.footer}
          address={site?.address}
          phone={site?.phone}
          email={site?.email}
          social={site?.social}
        />
      </body>
    </html>
  )
}
