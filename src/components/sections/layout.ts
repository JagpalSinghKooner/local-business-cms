import type { CSSProperties } from 'react'
import type { PageSection } from '@/types'
import { cn } from '@/lib/cn'

const BACKGROUND_CLASS_MAP: Record<string, string> = {
  surface: 'bg-surface',
  'surface-muted': 'bg-surface-muted',
  'surface-strong': 'bg-surface-strong text-inverted',
  brand: 'bg-brand text-inverted',
  secondary: 'bg-secondary text-inverted',
}

const TEXT_TONE_CLASS_MAP: Record<string, string> = {
  default: '',
  dark: 'text-strong',
  light: 'text-inverted',
}

const spacingValue = (token: string | undefined) => `var(--space-${token ?? 'section'})`

const resolveVisibilityClass = (section: PageSection) => {
  const visibility = section.visibility
  if (!visibility) return ''
  const { hideOnMobile, hideOnDesktop } = visibility
  if (hideOnMobile && hideOnDesktop) return 'hidden'
  if (hideOnMobile) return 'hidden md:block'
  if (hideOnDesktop) return 'md:hidden'
  return ''
}

export type SectionLayoutOptions = {
  baseClassName?: string
  layoutOverride?: LayoutOptions | null
}

export type SectionLayoutResult = {
  wrapperClassName: string
  style?: CSSProperties
  containerWidth: 'default' | 'narrow' | 'full'
  containerClassName: string
  dataAnimate: string
  dataAlignment: string
}

type LayoutOptions = NonNullable<PageSection['layout']>

const mergeLayout = (layout?: LayoutOptions | null): LayoutOptions => ({
  background: layout?.background,
  textTone: layout?.textTone,
  paddingTop: layout?.paddingTop,
  paddingBottom: layout?.paddingBottom,
  container: layout?.container,
  contentAlignment: layout?.contentAlignment,
})

export function getSectionLayout(section: PageSection, options?: SectionLayoutOptions): SectionLayoutResult {
  const layout = mergeLayout(options?.layoutOverride ?? section.layout ?? {})
  const baseClassName = options?.baseClassName
  const background = layout.background ?? 'surface'
  const backgroundClass = BACKGROUND_CLASS_MAP[background] || BACKGROUND_CLASS_MAP.surface
  const textClass = TEXT_TONE_CLASS_MAP[layout.textTone ?? 'default'] || ''
  const visibilityClass = resolveVisibilityClass(section)

  const style: CSSProperties = {
    paddingTop: spacingValue(layout.paddingTop),
    paddingBottom: spacingValue(layout.paddingBottom),
  }

  const containerWidth = (layout.container ?? 'default') as 'default' | 'narrow' | 'full'
  const containerAlignment = layout.contentAlignment === 'center' ? 'text-center' : ''

  return {
    wrapperClassName: cn(baseClassName, 'section-wrapper', backgroundClass, textClass, visibilityClass),
    style,
    containerWidth,
    containerClassName: containerAlignment,
    dataAnimate: section.animation ?? 'none',
    dataAlignment: layout.contentAlignment ?? 'start',
  }
}

export function computeLayoutFromOptions(layout?: LayoutOptions, options?: { baseClassName?: string }): SectionLayoutResult {
  const pseudoSection = {
    layout: undefined,
    animation: 'none',
    visibility: undefined,
  } as PageSection

  return getSectionLayout(pseudoSection, { baseClassName: options?.baseClassName, layoutOverride: layout ?? null })
}
