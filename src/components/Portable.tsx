"use client";
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableContent } from '@/types/sanity'

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={value?.asset?.url} alt={value?.alt || ''} />
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === 'string' ? value.href : '#'
      const isExternal = href.startsWith('http')
      return (
        <a
          href={href}
          className="text-zinc-900 underline underline-offset-4 decoration-zinc-300 hover:decoration-zinc-500"
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
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
