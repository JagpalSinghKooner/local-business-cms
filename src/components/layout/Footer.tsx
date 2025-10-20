import Container from './Container'
import Link from 'next/link'
import type { Address, NavLink, SocialLink } from '@/types/sanity'

type FooterProps = {
  businessName: string
  footerLinks?: NavLink[]
  address?: Address
  phone?: string
  email?: string
  social?: SocialLink[]
}

function renderAddress(address?: Address) {
  if (!address) return null
  const { street1, street2, city, state, postcode } = address

  return (
    <address className="not-italic text-sm leading-relaxed text-zinc-500">
      {street1 && <div>{street1}</div>}
      {street2 && <div>{street2}</div>}
      {(city || state || postcode) && (
        <div>
          {[city, state, postcode].filter(Boolean).join(', ')}
        </div>
      )}
    </address>
  )
}

export default function Footer({ businessName, footerLinks = [], address, phone, email, social = [] }: FooterProps) {
  const normalizedFooterLinks = Array.isArray(footerLinks) ? footerLinks : []
  const normalizedSocial = Array.isArray(social) ? social : []
  const normalizeHref = (href: string) => {
    if (!href) return '#'
    const trimmed = href.trim()
    if (trimmed === '') return '#'
    if (/^(https?:|mailto:|tel:|#)/i.test(trimmed)) return trimmed
    const sanitized = trimmed.replace(/^\/+/, '')
    if (sanitized === '' || sanitized === 'home') return '/'
    return `/${sanitized}`
  }
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <Container className="flex flex-col gap-8 py-10 text-sm text-zinc-600 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <p className="font-semibold text-zinc-900">{businessName}</p>
          {renderAddress(address)}
          <div className="space-y-1 text-sm">
            {phone && (
              <div>
                <span className="font-medium text-zinc-700">Phone: </span>
                <Link href={`tel:${phone}`} className="text-zinc-600 hover:text-zinc-900">
                  {phone}
                </Link>
              </div>
            )}
            {email && (
              <div>
                <span className="font-medium text-zinc-700">Email: </span>
                <Link href={`mailto:${email}`} className="text-zinc-600 hover:text-zinc-900">
                  {email}
                </Link>
              </div>
            )}
          </div>
          <p className="text-xs text-zinc-400">© {new Date().getFullYear()} {businessName}. All rights reserved.</p>
        </div>

        {normalizedFooterLinks.length > 0 ? (
          <nav aria-label="Footer" className="grid gap-2 text-sm">
            {normalizedFooterLinks.map((item) => (
              <Link key={item.href} href={normalizeHref(item.href)} className="transition hover:text-zinc-900">
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}

        {normalizedSocial.length ? (
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-zinc-900">Connect</p>
            <ul className="space-y-1">
              {normalizedSocial.map((item) => (
                <li key={item.url}>
                  <Link href={item.url} className="transition hover:text-zinc-900" target="_blank" rel="noreferrer">
                    {item.platform || item.url}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Container>
    </footer>
  )
}
