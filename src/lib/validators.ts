import { z } from 'zod'

/**
 * Runtime Data Validators
 *
 * These schemas validate data fetched from Sanity CMS at runtime.
 * This ensures type safety even if CMS data doesn't match expectations.
 */

// Basic schemas
const portableTextSchema = z.array(z.any()).optional()

const imageSchema = z
  .object({
    asset: z.object({
      url: z.string().url(),
    }),
    alt: z.string().optional(),
  })
  .optional()

const seoSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    ogImage: imageSchema,
  })
  .optional()

// Service schemas
export const serviceSummarySchema = z.object({
  title: z.string(),
  slug: z.string(),
  category: z
    .object({
      title: z.string().optional(),
      slug: z.string().optional(),
    })
    .optional(),
})

export const serviceDetailSchema = z.object({
  title: z.string(),
  slug: z.string(),
  category: z
    .object({
      title: z.string().optional(),
      slug: z.string().optional(),
    })
    .optional(),
  intro: portableTextSchema,
  body: portableTextSchema,
  heroImage: imageSchema,
  seo: seoSchema,
  sections: z.array(z.any()).optional(),
  locations: z.array(z.any()).optional(),
  scriptOverrides: z.any().optional(),
  displayOptions: z
    .object({
      showRelatedLocations: z.boolean().optional(),
      showOtherServices: z.boolean().optional(),
    })
    .optional(),
  breadcrumbs: z.any().optional(),
})

// Location schemas
export const locationSummarySchema = z.object({
  city: z.string(),
  slug: z.string(),
  intro: portableTextSchema,
})

export const locationDetailSchema = z.object({
  city: z.string(),
  slug: z.string(),
  intro: portableTextSchema,
  body: portableTextSchema,
  heroImage: imageSchema,
  seo: seoSchema,
  map: z
    .object({
      lat: z.number().optional(),
      lng: z.number().optional(),
    })
    .optional(),
  sections: z.array(z.any()).optional(),
  breadcrumbs: z.any().optional(),
})

// Page schemas
export const pageSummarySchema = z.object({
  title: z.string(),
  slug: z.string(),
})

export const pageDetailSchema = z.object({
  title: z.string(),
  slug: z.string(),
  intro: portableTextSchema,
  heroImage: imageSchema,
  seo: seoSchema,
  sections: z.array(z.any()).optional(),
  scriptOverrides: z.any().optional(),
  breadcrumbs: z.any().optional(),
})

// Site Settings schema
export const siteSettingsSchema = z.object({
  name: z.string(),
  tagline: z.string().optional(),
  metaDescription: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  contactCta: z.string().optional(),
  priceRange: z.string().optional(),
  address: z
    .object({
      street1: z.string().optional(),
      street2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postcode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  social: z
    .array(
      z.object({
        platform: z.string(),
        url: z.string().url(),
      })
    )
    .optional(),
  ogImage: imageSchema,
  hours: z
    .array(
      z.object({
        dayOfWeek: z.string(),
        opens: z.string().optional(),
        closes: z.string().optional(),
      })
    )
    .optional(),
  googleTagManagerId: z.string().optional(),
})

// Offer schema
export const offerSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  validUntil: z.string().optional(),
})

/**
 * Validates service data
 * Returns null if validation fails
 */
export function validateService(data: unknown): z.infer<typeof serviceDetailSchema> | null {
  const result = serviceDetailSchema.safeParse(data)
  if (!result.success) {
    console.error('Service validation failed:', result.error)
    return null
  }
  return result.data
}

/**
 * Validates location data
 * Returns null if validation fails
 */
export function validateLocation(data: unknown): z.infer<typeof locationDetailSchema> | null {
  const result = locationDetailSchema.safeParse(data)
  if (!result.success) {
    console.error('Location validation failed:', result.error)
    return null
  }
  return result.data
}

/**
 * Validates page data
 * Returns null if validation fails
 */
export function validatePage(data: unknown): z.infer<typeof pageDetailSchema> | null {
  const result = pageDetailSchema.safeParse(data)
  if (!result.success) {
    console.error('Page validation failed:', result.error)
    return null
  }
  return result.data
}

/**
 * Validates site settings data
 * Returns partial data with safe defaults if validation fails
 */
export function validateSiteSettings(
  data: unknown
): Partial<z.infer<typeof siteSettingsSchema>> {
  const result = siteSettingsSchema.safeParse(data)
  if (!result.success) {
    console.warn('Site settings validation failed, using partial data:', result.error)
    // Return partial data if validation fails
    return typeof data === 'object' && data !== null
      ? (data as Partial<z.infer<typeof siteSettingsSchema>>)
      : {}
  }
  return result.data
}
