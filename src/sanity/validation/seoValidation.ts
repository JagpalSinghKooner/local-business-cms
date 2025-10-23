/**
 * SEO Validation Utilities
 *
 * Validates SEO-related fields for optimal search engine performance
 *
 * Usage: validation: (rule) => rule.custom(validateMetaTitle)
 */

type ValidationResult = true | string | { level: 'warning' | 'info' | 'error'; message: string }

/**
 * Validate meta title length
 * Recommended: 50-60 characters
 */
export const validateMetaTitle = (value: string | undefined): ValidationResult => {
  if (!value) return true

  const length = value.length

  if (length < 10) {
    return 'Meta title is too short. Recommended: 50-60 characters (minimum 10)'
  }

  if (length > 70) {
    return `Meta title is too long (${length} chars). Google may truncate it. Recommended: 50-60 characters`
  }

  if (length > 60) {
    return {
      level: 'warning',
      message: `Meta title is ${length} characters. Consider shortening to 50-60 for optimal display`,
    }
  }

  return true
}

/**
 * Validate meta description length
 * Recommended: 120-160 characters
 */
export const validateMetaDescription = (value: string | undefined): ValidationResult => {
  if (!value) return true

  const length = value.length

  if (length < 50) {
    return 'Meta description is too short. Recommended: 120-160 characters (minimum 50)'
  }

  if (length > 170) {
    return `Meta description is too long (${length} chars). Google will truncate it. Recommended: 120-160 characters`
  }

  if (length < 100) {
    return {
      level: 'warning',
      message: `Meta description is only ${length} characters. Consider expanding to 120-160 for better CTR`,
    }
  }

  if (length > 160) {
    return {
      level: 'warning',
      message: `Meta description is ${length} characters. May be truncated on some devices. Recommended: 120-160`,
    }
  }

  return true
}

/**
 * Validate Open Graph title
 */
export const validateOgTitle = (value: string | undefined): ValidationResult => {
  if (!value) return true

  const length = value.length

  if (length > 60) {
    return {
      level: 'warning',
      message: `OG title is ${length} characters. May be truncated on social media. Recommended: < 60 characters`,
    }
  }

  return true
}

/**
 * Validate Open Graph description
 */
export const validateOgDescription = (value: string | undefined): ValidationResult => {
  if (!value) return true

  const length = value.length

  if (length > 200) {
    return {
      level: 'warning',
      message: `OG description is ${length} characters. May be truncated on social media. Recommended: < 200 characters`,
    }
  }

  return true
}

/**
 * Validate H1 heading length
 */
export const validateH1 = (value: string | undefined): ValidationResult => {
  if (!value) return true

  const length = value.length

  if (length < 10) {
    return {
      level: 'warning',
      message: 'H1 is very short. Consider making it more descriptive',
    }
  }

  if (length > 70) {
    return {
      level: 'warning',
      message: `H1 is ${length} characters. Consider shortening for better readability (recommended: 20-70)`,
    }
  }

  return true
}

/**
 * Validate canonical URL
 */
export const validateCanonicalUrl = (value: string | undefined): ValidationResult => {
  if (!value) return true

  try {
    const url = new URL(value)

    if (!url.protocol || !url.hostname) {
      return 'Canonical URL must be absolute (e.g., https://example.com/page)'
    }

    if (url.protocol !== 'https:') {
      return {
        level: 'warning',
        message: 'Canonical URL should use HTTPS',
      }
    }

    if (url.search) {
      return {
        level: 'warning',
        message: 'Canonical URL should typically not include query parameters',
      }
    }

    if (url.hash) {
      return 'Canonical URL should not include hash fragments'
    }

    if (url.pathname.endsWith('/') && url.pathname !== '/') {
      return {
        level: 'warning',
        message: 'Canonical URL should not have trailing slash for consistency',
      }
    }

    return true
  } catch (error) {
    return 'Must be a valid absolute URL (e.g., https://example.com/page)'
  }
}

/**
 * Validate robots meta directives
 */
export const validateRobotsDirective = (value: string | undefined): ValidationResult => {
  if (!value) return true

  const validDirectives = [
    'index',
    'noindex',
    'follow',
    'nofollow',
    'none',
    'noarchive',
    'nosnippet',
    'noimageindex',
    'nocache',
    'notranslate',
    'max-snippet',
    'max-image-preview',
    'max-video-preview',
  ]

  const directives = value.split(',').map((d) => d.trim().toLowerCase())

  for (const directive of directives) {
    const baseDirective = directive.split(':')[0]

    if (!validDirectives.includes(baseDirective)) {
      return `Invalid robots directive: "${directive}". Valid directives: ${validDirectives.join(', ')}`
    }
  }

  if (directives.includes('index') && directives.includes('noindex')) {
    return 'Conflicting directives: "index" and "noindex" cannot both be set'
  }

  if (directives.includes('follow') && directives.includes('nofollow')) {
    return 'Conflicting directives: "follow" and "nofollow" cannot both be set'
  }

  if (directives.includes('none') && directives.length > 1) {
    return '"none" directive should be used alone (it means "noindex, nofollow")'
  }

  return true
}

/**
 * Validate alt text for images
 */
export const validateAltText = (value: string | undefined): ValidationResult => {
  if (!value) return true

  const length = value.length

  if (length > 125) {
    return {
      level: 'warning',
      message: `Alt text is ${length} characters. Screen readers may cut off long descriptions. Recommended: < 125 characters`,
    }
  }

  if (/^image of |^picture of |^photo of /i.test(value)) {
    return {
      level: 'warning',
      message: 'Alt text should not start with "image of" or "picture of" - screen readers announce it\'s an image',
    }
  }

  return true
}

/**
 * Validate focus keyword/keyphrase
 */
export const validateFocusKeyword = (value: string | undefined): ValidationResult => {
  if (!value) return true

  const words = value.trim().split(/\s+/)

  if (words.length > 5) {
    return {
      level: 'warning',
      message: 'Focus keyword has more than 5 words. Consider using a more specific phrase',
    }
  }

  if (value !== value.toLowerCase()) {
    return {
      level: 'warning',
      message: 'Focus keyword should typically be lowercase',
    }
  }

  return true
}
