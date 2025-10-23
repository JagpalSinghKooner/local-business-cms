/**
 * Date Validation Utilities
 *
 * Validates dates for offers, events, and time-sensitive content
 *
 * Usage: validation: (rule) => rule.custom((value, context) => validateEndDateAfterStart(value, context))
 */

type ValidationResult = true | string | { level: 'warning' | 'info'; message: string }

/**
 * Validate that end date is after start date
 * Note: This requires context, so use inline: rule.custom((value, context) => {})
 */
export const warnIfPastDate = (value: string | undefined): ValidationResult => {
  if (!value) return true

  const date = new Date(value)
  const now = new Date()

  if (date < now) {
    return {
      level: 'warning',
      message: 'This date is in the past. Content may not be visible to users.',
    }
  }

  return true
}

/**
 * Warn if offer expires soon (within 7 days)
 */
export const warnIfExpiringSoon = (value: string | undefined): ValidationResult => {
  if (!value) return true

  const expiryDate = new Date(value)
  const now = new Date()
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  if (expiryDate < now) {
    return {
      level: 'warning',
      message: 'This offer has expired. Consider archiving or updating it.',
    }
  }

  if (expiryDate < sevenDaysFromNow) {
    const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return {
      level: 'info',
      message: `This offer expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
    }
  }

  return true
}

/**
 * Validate published date is not in the future
 */
export const validatePublishedDateNotFuture = (value: string | undefined): ValidationResult => {
  if (!value) return true

  const publishDate = new Date(value)
  const now = new Date()

  if (publishDate > now) {
    return {
      level: 'warning',
      message: 'Published date is in the future. Content may not be visible until this date.',
    }
  }

  return true
}

/**
 * Validate duration makes sense (in minutes)
 */
export const validateDuration = (value: number | undefined): ValidationResult => {
  if (!value) return true

  if (value <= 0) {
    return 'Duration must be greater than 0'
  }

  if (value > 1440) {
    // 1440 minutes = 24 hours
    return {
      level: 'warning',
      message: 'Duration is more than 24 hours. Is this correct?',
    }
  }

  if (value < 15) {
    return {
      level: 'warning',
      message: 'Duration is less than 15 minutes. Is this correct?',
    }
  }

  return true
}

/**
 * Validate year is reasonable
 */
export const validateYear = (value: number | undefined): ValidationResult => {
  if (!value) return true

  const currentYear = new Date().getFullYear()
  const minYear = 1900
  const maxYear = currentYear + 10

  if (value < minYear) {
    return `Year must be ${minYear} or later`
  }

  if (value > maxYear) {
    return `Year cannot be more than ${maxYear}. Please verify this is correct.`
  }

  return true
}
