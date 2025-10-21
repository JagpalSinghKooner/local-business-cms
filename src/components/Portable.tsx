"use client";
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableContent } from '@/types'

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={value?.asset?.url} alt={value?.alt || ''} />
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const linkType = value?.linkType ?? 'internal'
      const internalPath = typeof value?.internalPath === 'string' ? value.internalPath : undefined
      const externalHref = typeof value?.href === 'string' ? value.href : undefined

      let href: string | null = null
      if (linkType === 'internal' && internalPath) {
        href = internalPath.startsWith('/') ? internalPath : `/${internalPath}`
      } else if (linkType === 'external' && externalHref) {
        href = externalHref
      }

      if (!href) {
        return <>{children}</>
      }

      const isExternal =
        linkType === 'external' ||
        /^https?:\/\//i.test(href) ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:')

      const target = value?.openInNewTab || isExternal ? '_blank' : undefined
      const rel = target ? 'noopener noreferrer' : undefined

      return (
        <a
          href={href}
          className="text-accent underline underline-offset-4 decoration-[var(--color-border)] hover:decoration-[var(--color-brand-primary)]"
          target={target}
          rel={rel}
        >
          {children}
        </a>
      )
    },
  },
};

type PortableProps = {
  value?: PortableContent
  className?: string
}

export default function Portable({ value, className }: PortableProps) {
  if (!value || value.length === 0) return null

  const content = <PortableText value={value} components={components} />

  return className ? <div className={className}>{content}</div> : content
}
