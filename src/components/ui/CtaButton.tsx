import Link from 'next/link'
import type { CTA } from '@/types/sanity'

const baseClasses =
  'inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'

const variants: Record<NonNullable<CTA['style']>, string> = {
  primary: `${baseClasses} bg-brand hover:opacity-90`,
  secondary: `${baseClasses} bg-[var(--brand-secondary)] text-[var(--brand-on-secondary)] hover:opacity-90`,
  outline: `${baseClasses} border border-brand text-brand hover:bg-brand/10 focus-visible:outline-brand`,
  link: 'inline-flex items-center text-sm font-semibold text-brand hover:underline',
}

export function CtaButton({ cta, invert = false }: { cta: CTA; invert?: boolean }) {
  const style = cta.style ?? 'primary'
  const className =
    invert && style === 'primary'
      ? `${baseClasses} bg-white text-zinc-900 hover:bg-zinc-200 focus-visible:outline-white`
      : invert && style === 'secondary'
        ? `${baseClasses} bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white`
        : variants[style]

  return (
    <Link href={cta.href} className={className}>
      {cta.label}
    </Link>
  )
}
