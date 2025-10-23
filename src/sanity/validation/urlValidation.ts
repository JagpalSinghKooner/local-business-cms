/**
 * URL Validation Utilities
 *
 * Validates URLs, domains, and slugs for multi-tenant sites
 *
 * Usage: validation: (rule) => rule.custom(validateUrl)
 */

/**
 * Validate that a URL is properly formatted
 */
export const validateUrl = (value: string | undefined): true | string => {
  if (!value) return true

  try {
    const url = new URL(value)

    if (!['http:', 'https:'].includes(url.protocol)) {
      return 'URL must use http:// or https:// protocol'
    }

    if (!url.hostname || url.hostname.length < 3) {
      return 'URL must have a valid domain name'
    }

    return true
  } catch (error) {
    return 'Must be a valid URL (e.g., https://example.com)'
  }
}

/**
 * Validate production URL format (must be HTTPS, no localhost)
 */
export const validateProductionUrl = (value: string | undefined): true | string => {
  if (!value) return true

  try {
    const url = new URL(value)

    if (url.protocol !== 'https:') {
      return 'Production URLs must use HTTPS'
    }

    if (
      url.hostname === 'localhost' ||
      url.hostname.startsWith('127.') ||
      url.hostname.startsWith('192.168.') ||
      url.hostname.startsWith('10.') ||
      /^\d+\.\d+\.\d+\.\d+$/.test(url.hostname)
    ) {
      return 'Production URLs cannot use localhost or IP addresses'
    }

    const parts = url.hostname.split('.')
    if (parts.length < 2 || parts[parts.length - 1].length < 2) {
      return 'URL must have a valid top-level domain (e.g., .com, .org)'
    }

    return true
  } catch (error) {
    return 'Must be a valid URL (e.g., https://example.com)'
  }
}

/**
 * Validate domain format (without protocol)
 */
export const validateDomain = (value: string | undefined): true | string => {
  if (!value) return true

  const domain = value.replace(/^https?:\/\//, '').replace(/\/.*$/, '')

  if (/\s/.test(domain)) {
    return 'Domain cannot contain spaces'
  }

  if (!/^[a-z0-9.-]+$/i.test(domain)) {
    return 'Domain can only contain letters, numbers, dots, and hyphens'
  }

  if (!domain.includes('.')) {
    return 'Domain must include a top-level domain (e.g., .com, .org)'
  }

  if (/^[.-]|[.-]$/.test(domain)) {
    return 'Domain cannot start or end with a dot or hyphen'
  }

  const parts = domain.split('.')
  if (parts[parts.length - 1].length < 2) {
    return 'Domain must have a valid top-level domain'
  }

  return true
}

/**
 * Validate Sanity dataset name format
 */
export const validateDatasetName = (value: string | undefined): true | string => {
  if (!value) return true

  if (!/^[a-z]/.test(value)) {
    return 'Dataset name must start with a lowercase letter'
  }

  if (!/^[a-z][a-z0-9-]*$/.test(value)) {
    return 'Dataset name can only contain lowercase letters, numbers, and hyphens'
  }

  if (value.endsWith('-')) {
    return 'Dataset name cannot end with a hyphen'
  }

  if (value.length < 3) {
    return 'Dataset name must be at least 3 characters long'
  }

  if (value.length > 128) {
    return 'Dataset name cannot exceed 128 characters'
  }

  if (value.includes('--')) {
    return 'Dataset name cannot contain consecutive hyphens'
  }

  return true
}

/**
 * Validate slug value (from slug type)
 */
export const validateSlugValue = (value: { current?: string } | undefined): true | string => {
  if (!value?.current) return true

  const slug = value.current

  if (slug !== slug.toLowerCase()) {
    return 'Slug must be lowercase'
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return 'Slug can only contain lowercase letters, numbers, and hyphens'
  }

  if (slug.startsWith('-') || slug.endsWith('-')) {
    return 'Slug cannot start or end with a hyphen'
  }

  if (slug.includes('--')) {
    return 'Slug cannot contain consecutive hyphens'
  }

  if (slug.length > 60) {
    return 'Slug is very long. Consider shortening for better SEO (recommended: < 60 characters)'
  }

  return true
}

/**
 * Validate email format
 */
export const validateEmail = (value: string | undefined): true | string => {
  if (!value) return true

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(value)) {
    return 'Must be a valid email address'
  }

  if (value.includes('..')) {
    return 'Email cannot contain consecutive dots'
  }

  if (value.startsWith('.') || value.endsWith('.')) {
    return 'Email cannot start or end with a dot'
  }

  return true
}

/**
 * Validate phone number
 */
export const validatePhone = (value: string | undefined): true | string => {
  if (!value) return true

  const digitsOnly = value.replace(/\D/g, '')

  if (digitsOnly.length < 10) {
    return 'Phone number must have at least 10 digits'
  }

  if (digitsOnly.length > 15) {
    return 'Phone number cannot exceed 15 digits'
  }

  return true
}
