import Container from './Container'
import Link from 'next/link'
import type { Address, NavLink, SocialLink } from '@/types'
import { resolveLink } from '@/lib/links'

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
    <address className="not-italic text-sm leading-relaxed text-muted">
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
  return (
    <footer className="border-t border-divider bg-surface-muted">
      <Container className="flex flex-col gap-8 py-10 text-sm text-muted md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <p className="font-semibold text-strong">{businessName}</p>
          {renderAddress(address)}
          <div className="space-y-1 text-sm">
            {phone && (
              <div>
                <span className="font-medium text-muted">Phone: </span>
                <Link href={`tel:${phone}`} className="text-muted hover:text-strong">
                  {phone}
                </Link>
              </div>
            )}
            {email && (
              <div>
                <span className="font-medium text-muted">Email: </span>
                <Link href={`mailto:${email}`} className="text-muted hover:text-strong">
                  {email}
                </Link>
              </div>
            )}
          </div>
          <p className="text-xs text-muted">© {new Date().getFullYear()} {businessName}. All rights reserved.</p>
        </div>

        {normalizedFooterLinks.length > 0 ? (
          <nav aria-label="Footer" className="grid gap-2 text-sm">
            {normalizedFooterLinks.map((item) => {
              const resolved = resolveLink(item.link)
              if (!resolved) return null
              return (
                <Link
                  key={`${item.label}-${resolved.href}`}
                  href={resolved.href}
                  target={resolved.target}
                  rel={resolved.rel}
                  className="transition hover:text-strong"
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        ) : null}

        {normalizedSocial.length ? (
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-strong">Connect</p>
            <ul className="space-y-1">
              {normalizedSocial.map((item) => (
                <li key={item.url}>
                  <Link href={item.url} className="transition hover:text-strong" target="_blank" rel="noreferrer">
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
