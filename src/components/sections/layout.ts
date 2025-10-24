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

const PADDING_MAP: Record<string, string> = {
  none: 'py-0',
  xs: 'py-1',
  sm: 'py-2',
  md: 'py-3',
  lg: 'py-5',
  xl: 'py-7',
  '2xl': 'py-10',
  '3xl': 'py-16',
  section: 'py-20',
  gutter: 'py-6',
}

const resolvePaddingClasses = (topToken?: string, bottomToken?: string): string => {
  const top = topToken ?? 'section'
  const bottom = bottomToken ?? 'section'

  const topClass = PADDING_MAP[top] || PADDING_MAP.section
  const bottomClass = PADDING_MAP[bottom] || PADDING_MAP.section

  // Extract py value and combine into pt-X pb-Y
  const topValue = topClass.replace('py-', 'pt-')
  const bottomValue = bottomClass.replace('py-', 'pb-')

  return `${topValue} ${bottomValue}`
}

const resolveVisibilityClass = (section: PageSection) => {
  const visibility = 'visibility' in section ? section.visibility : undefined
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

export type LayoutOptions = NonNullable<Extract<PageSection, { layout?: unknown }>['layout']>

const mergeLayout = (layout?: LayoutOptions | null): LayoutOptions => ({
  background: layout?.background,
  textTone: layout?.textTone,
  paddingTop: layout?.paddingTop,
  paddingBottom: layout?.paddingBottom,
  container: layout?.container,
  contentAlignment: layout?.contentAlignment,
})

export function getSectionLayout(section: PageSection, options?: SectionLayoutOptions): SectionLayoutResult {
  const sectionLayout = 'layout' in section ? section.layout : undefined
  const layout = mergeLayout(options?.layoutOverride ?? sectionLayout ?? {})
  const baseClassName = options?.baseClassName
  const background = layout.background ?? 'surface'
  const backgroundClass = BACKGROUND_CLASS_MAP[background] || BACKGROUND_CLASS_MAP.surface
  const textClass = TEXT_TONE_CLASS_MAP[layout.textTone ?? 'default'] || ''
  const visibilityClass = resolveVisibilityClass(section)
  const paddingClasses = resolvePaddingClasses(layout.paddingTop, layout.paddingBottom)

  const containerWidth = (layout.container ?? 'default') as 'default' | 'narrow' | 'full'
  const containerAlignment = layout.contentAlignment === 'center' ? 'text-center' : ''

  return {
    wrapperClassName: cn(baseClassName, 'section-wrapper', backgroundClass, textClass, visibilityClass, paddingClasses),
    containerWidth,
    containerClassName: containerAlignment,
    dataAnimate: ('animation' in section ? section.animation : undefined) ?? 'none',
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
