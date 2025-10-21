import type { LinkValue } from '@/types'

const EXTERNAL_REGEX = /^(?:https?:\/\/|mailto:|tel:)/i

export type ResolvedLink = {
  href: string
  target?: string
  rel?: string
}

function normalizeInternalPath(path?: string | null): string | null {
  if (!path) return null
  const trimmed = path.trim()
  if (!trimmed) return null
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

export function resolveLink(link?: LinkValue | null): ResolvedLink | null {
  if (!link) return null

  const openInNewTab = Boolean(link.openInNewTab)
  const href =
    link.linkType === 'external'
      ? link.href?.trim() ?? null
      : normalizeInternalPath(link.internalPath) ?? null

  if (!href) return null

  const isExternal = EXTERNAL_REGEX.test(href)
  const target = openInNewTab || isExternal ? '_blank' : undefined
  const rel = target ? 'noopener noreferrer' : undefined

  return { href, target, rel }
}
