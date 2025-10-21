'use client'

import { useState } from 'react'
import Link from 'next/link'
import Container from './Container'
import MegaMenu from './MegaMenu'
import type { LocationSummary, NavLink, ServiceSummary } from '@/types'
import { resolveLink, ResolvedLink } from '@/lib/links'

const normalizePath = (href: string) => {
  if (!href.startsWith('/')) return href
  const sanitized = href === '/' ? '/' : `/${href.replace(/^\/+/, '')}`
  return sanitized
}

type HeaderProps = {
  businessName: string
  headerLinks?: NavLink[]
  utilityLinks?: NavLink[]
  phone?: string
  ctaLabel?: string
  megaMenu?: {
    services?: ServiceSummary[]
    locations?: LocationSummary[]
  }
}

export default function Header({
  businessName,
  headerLinks = [],
  utilityLinks,
  phone,
  ctaLabel,
  megaMenu,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const normalizedUtilityLinks = Array.isArray(utilityLinks) ? utilityLinks : []

  const resolvedHeaderLinks = headerLinks
    .map((item) => {
      const resolved = resolveLink(item.link)
      if (!resolved) return null
      return { label: item.label, resolved }
    })
    .filter(Boolean) as Array<{ label: string; resolved: ResolvedLink }>

  const filteredLinks = resolvedHeaderLinks.filter((item) => {
    if (!megaMenu) return true
    const suppressed = ['/services', '/locations']
    const path = normalizePath(item.resolved.href)
    return !suppressed.includes(path)
  })

  const primaryUtility = normalizedUtilityLinks[0]
  const resolvedPrimaryUtility = primaryUtility ? resolveLink(primaryUtility.link) : null
  const primaryCta = resolvedPrimaryUtility
    ? { label: primaryUtility.label, resolved: resolvedPrimaryUtility }
    : phone
      ? { label: phone, resolved: { href: `tel:${phone}` } }
      : null

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <>
      <header className="sticky top-0 z-40 surface-glass border-b border-divider">
        <Container className="flex h-16 items-center justify-between gap-6">
          <Link href="/" className="text-base font-semibold tracking-tight text-strong">
            {businessName}
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Primary" className="hidden items-center gap-6 text-sm text-muted md:flex">
            <MegaMenu services={megaMenu?.services} locations={megaMenu?.locations} />
            {filteredLinks.map((item) => (
              <Link
                key={`${item.label}-${item.resolved.href}`}
                href={item.resolved.href}
                target={item.resolved.target}
                rel={item.resolved.rel}
                className="transition-colors hover:text-strong"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {primaryCta ? (
              <Link
                href={primaryCta.resolved.href}
                target={primaryCta.resolved.target}
                rel={primaryCta.resolved.rel}
                className="bg-brand hidden rounded-full px-4 py-2 text-sm font-medium transition sm:block"
              >
                {ctaLabel || primaryCta.label}
              </Link>
            ) : null}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-muted transition hover:bg-surface-muted hover:text-strong md:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* Mobile Menu Panel */}
          <div className="fixed right-0 top-16 z-40 h-[calc(100vh-4rem)] w-full overflow-y-auto border-t border-divider bg-surface shadow-elevated md:hidden">
            <nav aria-label="Mobile navigation" className="flex flex-col">
              {/* Mega Menu Items */}
              <MegaMenu
                services={megaMenu?.services}
                locations={megaMenu?.locations}
                isMobile
                onNavigate={closeMobileMenu}
              />

              {/* Other Links */}
              {filteredLinks.map((item) => (
                <Link
                  key={`mobile-${item.label}-${item.resolved.href}`}
                  href={item.resolved.href}
                  target={item.resolved.target}
                  rel={item.resolved.rel}
                  onClick={closeMobileMenu}
                  className="border-b border-divider px-4 py-3 text-base font-medium text-strong transition hover:bg-surface-muted"
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile CTA */}
              {primaryCta ? (
                <div className="border-t border-divider p-4">
                  <Link
                    href={primaryCta.resolved.href}
                    target={primaryCta.resolved.target}
                    rel={primaryCta.resolved.rel}
                    onClick={closeMobileMenu}
                    className="bg-brand block w-full rounded-full px-4 py-3 text-center text-base font-medium"
                  >
                    {ctaLabel || primaryCta.label}
                  </Link>
                </div>
              ) : null}
            </nav>
          </div>
        </>
      )}
    </>
  )
}
