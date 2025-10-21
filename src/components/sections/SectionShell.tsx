import type { CSSProperties, ReactNode } from 'react'
import Container from '@/components/layout/Container'
import type { PageSection } from '@/types'
import { cn } from '@/lib/cn'

type LayoutOptions = NonNullable<PageSection['layout']>
type VisibilityOptions = NonNullable<PageSection['visibility']>

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

const resolvePaddingStyle = (layout?: LayoutOptions): CSSProperties => {
  const top = layout?.paddingTop ?? 'section'
  const bottom = layout?.paddingBottom ?? 'section'
  return {
    paddingTop: `var(--space-${top})`,
    paddingBottom: `var(--space-${bottom})`,
  }
}

const resolveContainerWidth = (layout?: LayoutOptions) => layout?.container ?? 'default'

type SectionShellProps = {
  section: PageSection
  children: ReactNode
  disableContainer?: boolean
  containerClassName?: string
}

export function SectionShell({ section, children, disableContainer = false, containerClassName }: SectionShellProps) {
  const layout = section.layout ?? undefined
  const visibility = section.visibility ?? undefined
  const wrapperClass = cn(
    'section-wrapper',
    resolveBackgroundClass(layout),
    resolveTextToneClass(layout),
    resolveVisibilityClass(visibility),
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
      style={resolvePaddingStyle(layout)}
      data-animate={section.animation ?? 'none'}
      data-alignment={layout?.contentAlignment ?? 'start'}
    >
      {content}
    </section>
  )
}
