import type { SiteSettings, Tokens } from '@/types'

type TypographyToken = {
  fontSize: string
  lineHeight?: string
  fontWeight?: string
}

type ButtonToken = {
  background?: string
  text?: string
  border?: string
  hoverBackground?: string
  hoverText?: string
  shadow?: string
}

export type ResolvedTokens = {
  colors: {
    primary: string
    onPrimary: string
    secondary: string
    onSecondary: string
    surface: string
    surfaceMuted: string
    surfaceStrong: string
    textStrong: string
    textMuted: string
    textInverted: string
    border: string
  }
  spacing: Record<string, string>
  typography: Record<string, TypographyToken>
  radii: Record<string, string>
  shadows: Record<string, string>
  buttons: Record<string, ButtonToken>
  containerWidth: string
}

const DEFAULT_COLORS: ResolvedTokens['colors'] = {
  primary: '#0ea5e9',
  onPrimary: '#ffffff',
  secondary: '#f97316',
  onSecondary: '#ffffff',
  surface: '#ffffff',
  surfaceMuted: '#f5f5f5',
  surfaceStrong: '#111827',
  textStrong: '#0f172a',
  textMuted: '#475569',
  textInverted: '#ffffff',
  border: '#e4e4e7',
}

const DEFAULT_SPACING: Record<string, string> = {
  none: '0px',
  xs: '0.25rem',
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1.25rem',
  xl: '1.75rem',
  '2xl': '2.5rem',
  '3xl': '4rem',
  section: '5rem',
  gutter: '1.5rem',
}

const DEFAULT_TYPOGRAPHY: Record<string, TypographyToken> = {
  'heading-xl': { fontSize: '3.25rem', lineHeight: '1.1', fontWeight: '700' },
  'heading-lg': { fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '600' },
  'heading-md': { fontSize: '2rem', lineHeight: '1.25', fontWeight: '600' },
  'heading-sm': { fontSize: '1.5rem', lineHeight: '1.35', fontWeight: '600' },
  'body-lg': { fontSize: '1.125rem', lineHeight: '1.7', fontWeight: '400' },
  'body-md': { fontSize: '1rem', lineHeight: '1.65', fontWeight: '400' },
  'body-sm': { fontSize: '0.875rem', lineHeight: '1.55', fontWeight: '400' },
  eyebrow: { fontSize: '0.75rem', lineHeight: '1.6', fontWeight: '600' },
}

const DEFAULT_RADII: Record<string, string> = {
  none: '0px',
  sm: '0.375rem',
  md: '0.75rem',
  lg: '1.5rem',
  pill: '999px',
}

const DEFAULT_SHADOWS: Record<string, string> = {
  sm: '0 10px 20px rgba(15, 23, 42, 0.08)',
  md: '0 18px 40px rgba(15, 23, 42, 0.14)',
  card: '0 12px 30px rgba(15, 23, 42, 0.1)',
}

const DEFAULT_BUTTONS: Record<string, ButtonToken> = {
  primary: {
    background: DEFAULT_COLORS.primary,
    text: DEFAULT_COLORS.onPrimary,
    border: DEFAULT_COLORS.primary,
    hoverBackground: '#0284c7',
    hoverText: DEFAULT_COLORS.onPrimary,
    shadow: DEFAULT_SHADOWS.sm,
  },
  secondary: {
    background: DEFAULT_COLORS.surfaceStrong,
    text: DEFAULT_COLORS.textInverted,
    border: DEFAULT_COLORS.surfaceStrong,
    hoverBackground: '#1f2937',
    hoverText: DEFAULT_COLORS.textInverted,
    shadow: DEFAULT_SHADOWS.sm,
  },
  outline: {
    background: 'transparent',
    text: DEFAULT_COLORS.textStrong,
    border: DEFAULT_COLORS.border,
    hoverBackground: 'rgba(15, 23, 42, 0.04)',
    hoverText: DEFAULT_COLORS.textStrong,
    shadow: 'none',
  },
  link: {
    background: 'transparent',
    text: DEFAULT_COLORS.primary,
    border: 'transparent',
    hoverBackground: 'transparent',
    hoverText: DEFAULT_COLORS.textStrong,
    shadow: 'none',
  },
}

export function resolveDesignTokens(tokens?: Tokens | null, site?: SiteSettings | null): {
  cssVariables: Record<string, string>
  resolved: ResolvedTokens
} {
  const colors: ResolvedTokens['colors'] = {
    ...DEFAULT_COLORS,
    ...(site?.primaryColor ? { primary: site.primaryColor } : {}),
    ...(site?.secondaryColor ? { secondary: site.secondaryColor } : {}),
    ...(tokens?.primary ? { primary: tokens.primary } : {}),
    ...(tokens?.onPrimary ? { onPrimary: tokens.onPrimary } : {}),
    ...(tokens?.secondary ? { secondary: tokens.secondary } : {}),
    ...(tokens?.onSecondary ? { onSecondary: tokens.onSecondary } : {}),
    ...(tokens?.surface ? { surface: tokens.surface } : {}),
    ...(tokens?.surfaceMuted ? { surfaceMuted: tokens.surfaceMuted } : {}),
    ...(tokens?.surfaceStrong ? { surfaceStrong: tokens.surfaceStrong } : {}),
    ...(tokens?.textStrong ? { textStrong: tokens.textStrong } : {}),
    ...(tokens?.textMuted ? { textMuted: tokens.textMuted } : {}),
    ...(tokens?.textInverted ? { textInverted: tokens.textInverted } : {}),
    ...(tokens?.borderColor ? { border: tokens.borderColor } : {}),
  }

  const spacing: Record<string, string> = { ...DEFAULT_SPACING }
  if (Array.isArray(tokens?.spacingScale)) {
    for (const item of tokens.spacingScale) {
      if (!item?.token || !item.value) continue
      spacing[item.token] = item.value
    }
  }

  const typography: Record<string, TypographyToken> = { ...DEFAULT_TYPOGRAPHY }
  if (Array.isArray(tokens?.typographyScale)) {
    for (const item of tokens.typographyScale) {
      if (!item?.token) continue
      const existing = typography[item.token] ?? DEFAULT_TYPOGRAPHY['body-md']
      typography[item.token] = {
        fontSize: item.fontSize || existing.fontSize,
        lineHeight: item.lineHeight || existing.lineHeight,
        fontWeight: item.fontWeight || existing.fontWeight,
      }
    }
  }

  const radii: Record<string, string> = { ...DEFAULT_RADII }
  if (Array.isArray(tokens?.radiusScale)) {
    for (const item of tokens.radiusScale) {
      if (!item?.token || !item.value) continue
      radii[item.token] = item.value
    }
  }

  const shadows: Record<string, string> = { ...DEFAULT_SHADOWS }
  if (Array.isArray(tokens?.shadowScale)) {
    for (const item of tokens.shadowScale) {
      if (!item?.token || !item.value) continue
      shadows[item.token] = item.value
    }
  }

  const buttons: Record<string, ButtonToken> = { ...DEFAULT_BUTTONS }
  if (Array.isArray(tokens?.buttonStyles)) {
    for (const item of tokens.buttonStyles) {
      if (!item?.token) continue
      const existing = buttons[item.token] ?? {}
      buttons[item.token] = {
        background: item.background || existing.background,
        text: item.text || existing.text,
        border: item.border || existing.border,
        hoverBackground: item.hoverBackground || existing.hoverBackground,
        hoverText: item.hoverText || existing.hoverText,
        shadow: item.shadow || existing.shadow,
      }
    }
  }

  const containerWidth = tokens?.containerWidth?.trim() || '1200px'

  const cssVariables: Record<string, string> = {
    '--color-brand-primary': colors.primary,
    '--color-brand-secondary': colors.secondary,
    '--color-on-primary': colors.onPrimary,
    '--color-on-secondary': colors.onSecondary,
    '--color-surface': colors.surface,
    '--color-surface-muted': colors.surfaceMuted,
    '--color-surface-strong': colors.surfaceStrong,
    '--color-text-strong': colors.textStrong,
    '--color-text-muted': colors.textMuted,
    '--color-text-inverted': colors.textInverted,
    '--color-border': colors.border,
    '--layout-container-width': containerWidth,
  }

  for (const [key, value] of Object.entries(spacing)) {
    cssVariables[`--space-${key}`] = value
  }

  for (const [key, value] of Object.entries(typography)) {
    cssVariables[`--font-${key}-size`] = value.fontSize
    if (value.lineHeight) cssVariables[`--font-${key}-line`] = value.lineHeight
    if (value.fontWeight) cssVariables[`--font-${key}-weight`] = value.fontWeight
  }

  for (const [key, value] of Object.entries(radii)) {
    cssVariables[`--radius-${key}`] = value
  }

  for (const [key, value] of Object.entries(shadows)) {
    cssVariables[`--shadow-${key}`] = value
  }

  for (const [key, value] of Object.entries(buttons)) {
    if (value.background) cssVariables[`--btn-${key}-bg`] = value.background
    if (value.text) cssVariables[`--btn-${key}-text`] = value.text
    if (value.border) cssVariables[`--btn-${key}-border`] = value.border
    if (value.hoverBackground) cssVariables[`--btn-${key}-hover-bg`] = value.hoverBackground
    if (value.hoverText) cssVariables[`--btn-${key}-hover-text`] = value.hoverText
    if (value.shadow) cssVariables[`--btn-${key}-shadow`] = value.shadow
  }

  if (tokens?.fontBody) cssVariables['--brand-font-body'] = tokens.fontBody
  if (tokens?.fontHeading) cssVariables['--brand-font-heading'] = tokens.fontHeading

  const resolved: ResolvedTokens = {
    colors,
    spacing,
    typography,
    radii,
    shadows,
    buttons,
    containerWidth,
  }

  return { cssVariables, resolved }
}
