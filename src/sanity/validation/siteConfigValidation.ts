/**
 * Site Configuration Validation Utilities
 *
 * Validates multi-tenant site configuration fields
 *
 * Usage: validation: (rule) => rule.custom(validateSiteId)
 */

type ValidationResult = true | string | { level: 'warning' | 'info'; message: string }

/**
 * Validate site ID format
 */
export const validateSiteId = (value: string | undefined): ValidationResult => {
  if (!value) return true

  if (!/^[a-z]/.test(value)) {
    return 'Site ID must start with a lowercase letter'
  }

  if (!/^[a-z][a-z0-9-]*$/.test(value)) {
    return 'Site ID can only contain lowercase letters, numbers, and hyphens'
  }

  if (value.endsWith('-')) {
    return 'Site ID cannot end with a hyphen'
  }

  if (value.length < 3) {
    return 'Site ID must be at least 3 characters long'
  }

  if (value.length > 50) {
    return 'Site ID cannot exceed 50 characters'
  }

  if (value.includes('--')) {
    return 'Site ID cannot contain consecutive hyphens'
  }

  const reserved = ['admin', 'api', 'www', 'app', 'cdn', 'static', 'assets', 'studio', 'preview']
  if (reserved.includes(value)) {
    return `"${value}" is a reserved keyword and cannot be used as a site ID`
  }

  return true
}

/**
 * Validate hex color code
 */
export const validateHexColor = (value: string | undefined): ValidationResult => {
  if (!value) return true

  if (!value.startsWith('#')) {
    return 'Color must start with # (e.g., #FF0000)'
  }

  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/

  if (!hexRegex.test(value)) {
    return 'Color must be a valid hex code (e.g., #FF0000 or #F00)'
  }

  return true
}

/**
 * Validate Google Analytics ID
 */
export const validateGoogleAnalyticsId = (value: string | undefined): ValidationResult => {
  if (!value) return true

  const ga4Regex = /^G-[A-Z0-9]{10}$/
  const uaRegex = /^UA-\d{6,10}-\d{1,4}$/

  if (!ga4Regex.test(value) && !uaRegex.test(value)) {
    return 'Must be a valid Google Analytics ID (GA4: G-XXXXXXXXXX or UA: UA-XXXXXXXX-X)'
  }

  if (uaRegex.test(value)) {
    return {
      level: 'warning',
      message: 'Universal Analytics (UA-) is deprecated. Consider upgrading to GA4 (G-)',
    }
  }

  return true
}

/**
 * Validate Google Tag Manager ID
 */
export const validateGoogleTagManagerId = (value: string | undefined): ValidationResult => {
  if (!value) return true

  const gtmRegex = /^GTM-[A-Z0-9]{7,8}$/

  if (!gtmRegex.test(value)) {
    return 'Must be a valid Google Tag Manager ID (GTM-XXXXXXX)'
  }

  return true
}

/**
 * Validate Meta Pixel ID (Facebook Pixel)
 */
export const validateMetaPixelId = (value: string | undefined): ValidationResult => {
  if (!value) return true

  const pixelRegex = /^\d{15,16}$/

  if (!pixelRegex.test(value)) {
    return 'Must be a valid Meta Pixel ID (15-16 digit number)'
  }

  return true
}

/**
 * Validate social media username format
 */
export const validateSocialUsername = (platform: string) => {
  return (value: string | undefined): ValidationResult => {
    if (!value) return true

    const username = value.replace(/^@/, '')

    if (username.length < 1) {
      return 'Username cannot be empty'
    }

    if (username.length > 30) {
      return `Username is too long for ${platform} (max 30 characters)`
    }

    switch (platform.toLowerCase()) {
      case 'twitter':
      case 'x':
        if (!/^[A-Za-z0-9_]{1,15}$/.test(username)) {
          return 'Twitter/X username can only contain letters, numbers, and underscores (max 15 chars)'
        }
        break

      case 'instagram':
        if (!/^[A-Za-z0-9._]{1,30}$/.test(username)) {
          return 'Instagram username can only contain letters, numbers, dots, and underscores'
        }
        break

      case 'facebook':
        if (!/^[A-Za-z0-9.]{1,50}$/.test(username)) {
          return 'Facebook username can only contain letters, numbers, and dots'
        }
        break

      case 'linkedin':
        if (!/^[A-Za-z0-9-]{3,100}$/.test(username)) {
          return 'LinkedIn username can only contain letters, numbers, and hyphens (min 3 chars)'
        }
        break

      default:
        if (!/^[A-Za-z0-9._-]+$/.test(username)) {
          return 'Username can only contain letters, numbers, dots, underscores, and hyphens'
        }
    }

    return true
  }
}

/**
 * Validate business name
 */
export const validateBusinessName = (value: string | undefined): ValidationResult => {
  if (!value) return true

  if (value.length < 2) {
    return 'Business name must be at least 2 characters'
  }

  if (value.length > 100) {
    return 'Business name is too long (max 100 characters)'
  }

  if (value === value.toUpperCase() && value.length > 10) {
    return {
      level: 'warning',
      message: 'Business name is all uppercase. Consider using proper capitalization for better readability',
    }
  }

  return true
}

/**
 * Validate latitude
 */
export const validateLatitude = (value: number | undefined): ValidationResult => {
  if (value === undefined) return true

  if (value < -90 || value > 90) {
    return 'Latitude must be between -90 and 90'
  }

  return true
}

/**
 * Validate longitude
 */
export const validateLongitude = (value: number | undefined): ValidationResult => {
  if (value === undefined) return true

  if (value < -180 || value > 180) {
    return 'Longitude must be between -180 and 180'
  }

  return true
}

/**
 * Validate service area radius (in kilometers)
 */
export const validateServiceAreaRadius = (value: number | undefined): ValidationResult => {
  if (value === undefined) return true

  if (value <= 0) {
    return 'Service area radius must be greater than 0'
  }

  if (value > 500) {
    return {
      level: 'warning',
      message: 'Service area radius is very large (> 500km). Is this correct?',
    }
  }

  if (value < 5) {
    return {
      level: 'warning',
      message: 'Service area radius is very small (< 5km). Is this correct?',
    }
  }

  return true
}
