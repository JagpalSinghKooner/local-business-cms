import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import type { CSSProperties, ReactNode } from 'react'
import './globals.css'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AnalyticsScripts from '@/components/AnalyticsScripts'
import JsonLd from '@/components/seo/JsonLd'
import WebVitalsReporter from '@/components/WebVitalsReporter'
import { buildLocalBusinessJsonLd } from '@/lib/jsonld'
import { resolveDesignTokens } from '@/lib/tokens'
import { getGlobalDataset } from '@/sanity/loaders'
import type { Navigation, SiteSettings, Tokens, ServiceSummary, LocationSummary, PageSummary } from '@/types'
import { ScriptOverridesProvider } from '@/components/scripts/ScriptOverridesProvider'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { env } from '@/lib/env'
import { getImageUrl } from '@/types/sanity-helpers'

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

const FALLBACK_NAVIGATION = {
  header: [],
  utility: [],
  footer: [],
} satisfies Partial<Navigation>

const FALLBACK_DATA = {
  site: null as SiteSettings | null,
  navigation: FALLBACK_NAVIGATION,
  tokens: null as Tokens | null,
  services: [] as ServiceSummary[],
  locations: [] as LocationSummary[],
  pages: [] as PageSummary[],
}

const FALLBACK_SITE_NAME = 'Local Business'

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const dataset = await getGlobalDataset().catch((error) => {
    console.error('Failed to load global settings from Sanity', error)
    return FALLBACK_DATA
  })

  const { site, navigation, tokens, services, locations } = {
    site: dataset.site ?? null,
    navigation: dataset.navigation ?? FALLBACK_DATA.navigation,
    tokens: dataset.tokens ?? FALLBACK_DATA.tokens,
    services: dataset.services ?? FALLBACK_DATA.services,
    locations: dataset.locations ?? FALLBACK_DATA.locations,
  }
  const { cssVariables } = resolveDesignTokens(tokens, site)
  const businessName = site?.name ?? FALLBACK_SITE_NAME
  const baseUrl = env.NEXT_PUBLIC_SITE_URL
  const siteRecord = (site ?? {}) as Record<string, unknown>
  const sameAsLinks = Array.isArray(siteRecord.sameAs)
    ? (siteRecord.sameAs as string[])
    : Array.isArray(site?.social)
      ? (site.social.map((link) => link.url).filter(Boolean) as string[])
      : undefined
  const geo = siteRecord.geo as { lat?: number; lng?: number } | undefined
  const localBusinessJsonLd = buildLocalBusinessJsonLd({
    baseUrl,
    urlPath: '/',
    name: site?.name ?? FALLBACK_SITE_NAME,
    legalName: siteRecord.legalName as string | undefined,
    telephone: site?.phone,
    priceRange: site?.priceRange,
    sameAs: sameAsLinks,
    image: getImageUrl(site?.ogImage) ?? null,
    address: site?.address
      ? {
          streetAddress: site.address.street1,
          addressLocality: site.address.city,
          addressRegion: site.address.state,
          postalCode: site.address.postcode,
          addressCountry: site.address.country,
        }
      : undefined,
    geo: geo?.lat && geo?.lng ? { latitude: geo.lat, longitude: geo.lng } : undefined,
    openingHours: site?.hours?.map((hours) => ({
      dayOfWeek: hours.dayOfWeek,
      opens: hours.opens,
      closes: hours.closes,
    })),
  })

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-surface text-strong`}
        style={cssVariables as CSSProperties}
      >
        <ErrorBoundary>
          <ScriptOverridesProvider>
            <WebVitalsReporter />
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
          </ScriptOverridesProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
