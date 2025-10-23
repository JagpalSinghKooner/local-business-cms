/**
 * Sanity Validation Utilities
 *
 * Centralized validation rules for multi-tenant CMS
 *
 * Usage in schema definitions:
 * ```ts
 * import { validateMetaTitle, validateUrl } from '@/sanity/validation'
 *
 * defineField({
 *   name: 'metaTitle',
 *   type: 'string',
 *   validation: (rule) => rule.custom(validateMetaTitle)
 * })
 * ```
 */

// URL & Domain Validation
export {
  validateUrl,
  validateProductionUrl,
  validateDomain,
  validateDatasetName,
  validateSlugValue,
  validateEmail,
  validatePhone,
} from './urlValidation'

// SEO Validation
export {
  validateMetaTitle,
  validateMetaDescription,
  validateOgTitle,
  validateOgDescription,
  validateH1,
  validateCanonicalUrl,
  validateRobotsDirective,
  validateAltText,
  validateFocusKeyword,
} from './seoValidation'

// Date Validation
export {
  warnIfPastDate,
  warnIfExpiringSoon,
  validatePublishedDateNotFuture,
  validateDuration,
  validateYear,
} from './dateValidation'

// Site Config Validation
export {
  validateSiteId,
  validateHexColor,
  validateGoogleAnalyticsId,
  validateGoogleTagManagerId,
  validateMetaPixelId,
  validateSocialUsername,
  validateBusinessName,
  validateLatitude,
  validateLongitude,
  validateServiceAreaRadius,
} from './siteConfigValidation'
