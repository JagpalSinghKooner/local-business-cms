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

  return (
    <header className="sticky top-0 z-40 surface-glass border-b border-divider">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" className="text-base font-semibold tracking-tight text-strong">
          {businessName}
        </Link>

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

        {primaryCta ? (
          <Link
            href={primaryCta.resolved.href}
            target={primaryCta.resolved.target}
            rel={primaryCta.resolved.rel}
            className="bg-brand rounded-full px-4 py-2 text-sm font-medium transition"
          >
            {ctaLabel || primaryCta.label}
          </Link>
        ) : null}
      </Container>
    </header>
  )
}
