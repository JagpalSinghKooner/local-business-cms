import Link from 'next/link'
import type { CTA } from '@/types'
import { resolveLink } from '@/lib/links'

export function CtaButton({ cta, invert = false }: { cta: CTA; invert?: boolean }) {
  const resolved = resolveLink(cta.link)
  if (!resolved) return null

  const variant = cta.style ?? 'primary'
  const tone = invert ? 'button-inverted' : ''

  return (
    <Link
      href={resolved.href}
      className={`button ${tone}`}
      data-variant={variant}
      target={resolved.target}
      rel={resolved.rel}
    >
      {cta.label}
    </Link>
  )
}
