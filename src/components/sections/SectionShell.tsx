import type { ReactNode } from 'react'
import Container from '@/components/layout/Container'
import type { PageSection } from '@/types'
import { cn } from '@/lib/cn'

type LayoutOptions = NonNullable<Extract<PageSection, { layout?: unknown }>['layout']>
type VisibilityOptions = NonNullable<Extract<PageSection, { visibility?: unknown }>['visibility']>

const BACKGROUND_CLASS_MAP: Record<string, string> = {
  surface: 'bg-surface',
  'surface-muted': 'bg-surface-muted',
  'surface-strong': 'bg-surface-strong text-inverted',
  brand: 'bg-brand text-inverted',
  secondary: 'bg-secondary text-inverted',
}

const TEXT_TONE_MAP: Record<string, string> = {
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

const alignmentClass = (alignment?: LayoutOptions['contentAlignment']) => {
  if (alignment === 'center') return 'text-center'
  return ''
}

const resolveBackgroundClass = (layout?: LayoutOptions) => {
  const background = layout?.background ?? 'surface'
  return BACKGROUND_CLASS_MAP[background] || BACKGROUND_CLASS_MAP.surface
}

const resolveTextToneClass = (layout?: LayoutOptions) => {
  const tone = layout?.textTone ?? 'default'
  return TEXT_TONE_MAP[tone] || ''
}

const resolveVisibilityClass = (visibility?: VisibilityOptions) => {
  if (!visibility) return ''
  const { hideOnMobile, hideOnDesktop } = visibility
  if (hideOnMobile && hideOnDesktop) return 'hidden'
  if (hideOnMobile) return 'hidden md:block'
  if (hideOnDesktop) return 'md:hidden'
  return ''
}

const resolvePaddingClass = (layout?: LayoutOptions): string => {
  const topToken = layout?.paddingTop ?? 'section'
  const bottomToken = layout?.paddingBottom ?? 'section'

  const topClass = PADDING_MAP[topToken] || PADDING_MAP.section
  const bottomClass = PADDING_MAP[bottomToken] || PADDING_MAP.section

  // Extract py value and combine into pt-X pb-Y
  const topValue = topClass.replace('py-', 'pt-')
  const bottomValue = bottomClass.replace('py-', 'pb-')

  return `${topValue} ${bottomValue}`
}

const resolveContainerWidth = (layout?: LayoutOptions) => layout?.container ?? 'default'

type SectionShellProps = {
  section: PageSection
  children: ReactNode
  disableContainer?: boolean
  containerClassName?: string
}

export function SectionShell({ section, children, disableContainer = false, containerClassName }: SectionShellProps) {
  const layout = ('layout' in section ? section.layout : undefined) ?? undefined
  const visibility = ('visibility' in section ? section.visibility : undefined) ?? undefined
  const animation = ('animation' in section ? section.animation : undefined) ?? 'none'
  const wrapperClass = cn(
    'section-wrapper',
    resolveBackgroundClass(layout),
    resolveTextToneClass(layout),
    resolveVisibilityClass(visibility),
    resolvePaddingClass(layout),
  )

  const containerAlignmentClass = alignmentClass(layout?.contentAlignment)

  const content = disableContainer ? (
    children
  ) : (
    <Container width={resolveContainerWidth(layout)} className={cn(containerAlignmentClass, containerClassName)}>
      {children}
    </Container>
  )

  return (
    <section
      className={wrapperClass}
      data-animate={animation}
      data-alignment={layout?.contentAlignment ?? 'start'}
    >
      {content}
    </section>
  )
}
