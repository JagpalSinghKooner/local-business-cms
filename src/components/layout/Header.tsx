import Link from 'next/link'
import Container from './Container'
import MegaMenu from './MegaMenu'
import type { LocationSummary, NavLink, ServiceSummary } from '@/types/sanity'

const normalizeHref = (href: string) => {
  if (!href) return '#'
  const trimmed = href.trim()
  if (trimmed === '') return '#'
  if (/^(https?:|mailto:|tel:|#)/i.test(trimmed)) return trimmed
  const sanitized = trimmed.replace(/^\/+/, '')
  if (sanitized === '' || sanitized === 'home') return '/'
  return `/${sanitized}`
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
  const primaryCta = normalizedUtilityLinks[0] ?? (phone ? { label: phone, href: `tel:${phone}` } : undefined)
  const filteredLinks = headerLinks.filter((item) => {
    if (!megaMenu) return true
    const suppressed = ['/services', '/locations']
    return !suppressed.includes(item.href)
  })

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" className="text-base font-semibold tracking-tight text-zinc-900">
          {businessName}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 text-sm text-zinc-600 md:flex">
          <MegaMenu services={megaMenu?.services} locations={megaMenu?.locations} />
          {filteredLinks.map((item) => (
            <Link key={item.href} href={normalizeHref(item.href)} className="transition-colors hover:text-zinc-900">
              {item.label}
            </Link>
          ))}
        </nav>

        {primaryCta ? (
          <Link
            href={normalizeHref(primaryCta.href)}
            className="bg-brand rounded-full px-4 py-2 text-sm font-medium transition"
          >
            {ctaLabel || primaryCta.label}
          </Link>
        ) : null}
      </Container>
    </header>
  )
}
