/**
 * Enterprise Schema Validation Layer
 *
 * PURPOSE: Enforce runtime type safety between API routes and Sanity schema
 * PREVENTS: Schema drift, unknown fields, type mismatches
 * USAGE: Validate all document mutations before Sanity write operations
 */

import { z } from 'zod'

/**
 * ServiceLocation Document Validator
 *
 * This Zod schema MUST stay in sync with:
 * - src/sanity/schemaTypes/documents/serviceLocation.ts
 * - src/types/sanity.generated.d.ts
 *
 * Any mismatch will cause validation to fail at runtime.
 */
export const serviceLocationCreateSchema = z.object({
  _type: z.literal('serviceLocation'),
  title: z.string().min(1),
  service: z.object({
    _type: z.literal('reference'),
    _ref: z.string(),
  }),
  location: z.object({
    _type: z.literal('reference'),
    _ref: z.string(),
  }),
  slug: z.object({
    _type: z.literal('slug'),
    current: z.string().min(1),
  }),
  contentSource: z.enum(['inherit', 'custom', 'ai']),
  publishedAt: z.string().datetime(),
  intro: z.any().optional(), // richText type - validated by Sanity
  sections: z.array(z.any()).optional(), // Section types - validated by Sanity
  displayOptions: z.object({
    showNearbyLocations: z.boolean().optional(),
    showRelatedServices: z.boolean().optional(),
  }).optional(),
  seo: z.any().optional(), // seoUnified type - validated by Sanity
  schemaVersion: z.string().optional(),
})

export type ServiceLocationCreate = z.infer<typeof serviceLocationCreateSchema>

/**
 * Validation Error with context
 */
export class SchemaValidationError extends Error {
  constructor(
    public documentType: string,
    public issues: z.ZodIssue[],
    public data: unknown
  ) {
    super(`Schema validation failed for ${documentType}`)
    this.name = 'SchemaValidationError'
  }

  toJSON() {
    return {
      error: this.message,
      documentType: this.documentType,
      issues: this.issues.map(issue => ({
        path: issue.path.join('.'),
        message: issue.message,
        code: issue.code,
      })),
    }
  }
}

/**
 * Validate document before creation
 *
 * @throws {SchemaValidationError} If validation fails
 */
export function validateServiceLocationCreate(data: unknown): ServiceLocationCreate {
  const result = serviceLocationCreateSchema.safeParse(data)

  if (!result.success) {
    throw new SchemaValidationError('serviceLocation', result.error.issues, data)
  }

  return result.data
}

/**
 * Generic document validator factory
 *
 * Use this to create validators for other document types:
 *
 * @example
 * const validateService = createValidator(serviceCreateSchema, 'service')
 */
export function createValidator<T>(
  schema: z.ZodSchema<T>,
  documentType: string
) {
  return (data: unknown): T => {
    const result = schema.safeParse(data)

    if (!result.success) {
      throw new SchemaValidationError(documentType, result.error.issues, data)
    }

    return result.data
  }
}
