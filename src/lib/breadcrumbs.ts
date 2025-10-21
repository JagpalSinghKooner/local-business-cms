import type { BreadcrumbSettings, Navigation, PageSummary } from '@/types'
import { resolveLink } from './links'

export type BreadcrumbNode = {
  label: string
  href: string
  isCurrent?: boolean
}

type AdditionalLabel = {
  path: string
  label: string
}

type BuildBreadcrumbsOptions = {
  path: string
  currentLabel?: string | null
  settings?: BreadcrumbSettings | null
  navigation?: Navigation | null
  pages?: PageSummary[] | null
  homeLabel?: string | null
  additionalLabels?: AdditionalLabel[]
}

const INTERNAL_URL_REGEX = /^\/(?!\/)/

const normalizePath = (value: string | undefined | null): string => {
  if (!value) return '/'
  const trimmed = value.trim()
  if (!trimmed) return '/'
  const noQuery = trimmed.split(/[?#]/)[0]
  if (noQuery === '' || noQuery === '/') return '/'
  const normalized = noQuery.startsWith('/') ? noQuery : `/${noQuery}`
  return normalized.replace(/\/+$/, '') || '/'
}

const humanizeSegment = (segment: string): string => {
  if (!segment) return ''
  const cleaned = segment.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()
  if (!cleaned) return ''
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
}

const collectNavigationLabels = (navigation?: Navigation | null): Map<string, string> => {
  const map = new Map<string, string>()
  if (!navigation) return map

  const collections = [navigation.header, navigation.utility, navigation.footer]

  for (const list of collections) {
    if (!Array.isArray(list)) continue
    for (const item of list) {
      const resolved = resolveLink(item?.link)
      if (!resolved) continue
      if (!INTERNAL_URL_REGEX.test(resolved.href)) continue
      const path = normalizePath(resolved.href)
      if (!path || map.has(path)) continue
      map.set(path, item.label ?? humanizeSegment(path.split('/').pop() ?? ''))
    }
  }

  return map
}

const collectPageLabels = (pages?: PageSummary[] | null): Map<string, string> => {
  const map = new Map<string, string>()
  if (!Array.isArray(pages)) return map

  for (const page of pages) {
    if (!page?.slug) continue
    const path = normalizePath(page.slug)
    if (!path || map.has(path)) continue
    map.set(path, page.title ?? humanizeSegment(path.split('/').pop() ?? ''))
  }

  return map
}

const resolveManualTrail = (settings?: BreadcrumbSettings | null): BreadcrumbNode[] | null => {
  if (!settings || settings.mode !== 'manual') return null
  if (!Array.isArray(settings.manualItems)) return []

  const nodes: BreadcrumbNode[] = []
  for (const item of settings.manualItems) {
    if (!item) continue
    const resolved = resolveLink(item.link)
    if (!resolved) continue
    nodes.push({
      label: item.label ?? resolved.href,
      href: resolved.href,
    })
  }

  return nodes.map((node, index) => ({
    ...node,
    isCurrent: index === nodes.length - 1,
  }))
}

export function buildBreadcrumbs({
  path,
  currentLabel,
  settings,
  navigation,
  pages,
  homeLabel,
  additionalLabels,
}: BuildBreadcrumbsOptions): BreadcrumbNode[] {
  const manualTrail = resolveManualTrail(settings)
  if (manualTrail) {
    return manualTrail
  }

  const normalizedPath = normalizePath(path)
  const homeCrumb: BreadcrumbNode = {
    label: homeLabel?.trim() || 'Home',
    href: '/',
  }

  const segments = normalizedPath.split('/').filter(Boolean)
  if (segments.length === 0) {
    return [homeCrumb]
  }

  const labelMap = new Map<string, string>()
  // Navigation labels first so page titles can override if needed
  for (const [key, value] of collectNavigationLabels(navigation)) {
    labelMap.set(key, value)
  }
  for (const [key, value] of collectPageLabels(pages)) {
    labelMap.set(key, value)
  }
  if (Array.isArray(additionalLabels)) {
    for (const { path: additionalPath, label } of additionalLabels) {
      const normalized = normalizePath(additionalPath)
      if (!normalized || normalized === '/') continue
      labelMap.set(normalized, label)
    }
  }

  const autoTrail: BreadcrumbNode[] = [homeCrumb]
  const appliedPaths = new Set<string>(['/'])
  let accumulator = ''

  segments.forEach((segment, index) => {
    accumulator = `${accumulator}/${segment}`
    const pathKey = normalizePath(accumulator)
    if (appliedPaths.has(pathKey) && index !== segments.length - 1) {
      return
    }
    appliedPaths.add(pathKey)
    const isLast = index === segments.length - 1
    const fallback = humanizeSegment(segment)
    const baseLabel = labelMap.get(pathKey) || fallback
    const finalLabel = isLast
      ? settings?.currentLabel?.trim() || currentLabel?.trim() || baseLabel
      : baseLabel

    autoTrail.push({
      label: finalLabel || fallback || segment,
      href: pathKey,
    })
  })

  if (autoTrail.length <= 1) {
    return autoTrail
  }

  if (settings?.additionalItems && settings.additionalItems.length > 0) {
    const withExtras: BreadcrumbNode[] = []
    const lastCrumb = autoTrail[autoTrail.length - 1]
    for (let i = 0; i < autoTrail.length - 1; i += 1) {
      withExtras.push(autoTrail[i])
    }

    for (const item of settings.additionalItems) {
      if (!item) continue
      const resolved = resolveLink(item.link)
      if (!resolved) continue
      const normalizedHref = normalizePath(resolved.href)
      const existingIndex = withExtras.findIndex((crumb) => normalizePath(crumb.href) === normalizedHref)
      const node: BreadcrumbNode = {
        label: item.label ?? withExtras[existingIndex]?.label ?? resolved.href,
        href: normalizedHref,
      }

      if (existingIndex >= 0) {
        withExtras[existingIndex] = node
      } else {
        withExtras.push(node)
      }
    }

    withExtras.push(lastCrumb)
    return withExtras.map((crumb, index) => ({
      ...crumb,
      isCurrent: index === withExtras.length - 1,
    }))
  }

  return autoTrail.map((crumb, index) => ({
    ...crumb,
    isCurrent: index === autoTrail.length - 1,
  }))
}
