/**
 * Content Transformation Utilities
 *
 * Handles field mapping, value transformation, and data normalization
 * during content migration between datasets
 */

import type { SanityDocument } from '@sanity/client'

export type FieldMapping = {
  from: string
  to: string
  transform?: (value: any) => any
}

export type TransformOptions = {
  fieldMappings?: FieldMapping[]
  removeFields?: string[]
  addFields?: Record<string, any>
  transformFn?: (doc: SanityDocument) => SanityDocument
}

/**
 * Transform a document according to specified options
 */
export function transformDocument(
  doc: SanityDocument,
  options: TransformOptions = {}
): SanityDocument {
  let transformed = { ...doc }

  // Apply field mappings (rename fields, transform values)
  if (options.fieldMappings) {
    for (const mapping of options.fieldMappings) {
      const value = getNestedValue(transformed, mapping.from)
      if (value !== undefined) {
        // Apply transformation if provided
        const transformedValue = mapping.transform ? mapping.transform(value) : value
        // Set to new field name
        setNestedValue(transformed, mapping.to, transformedValue)
        // Remove old field if names are different
        if (mapping.from !== mapping.to) {
          deleteNestedValue(transformed, mapping.from)
        }
      }
    }
  }

  // Remove specified fields
  if (options.removeFields) {
    for (const field of options.removeFields) {
      deleteNestedValue(transformed, field)
    }
  }

  // Add new fields
  if (options.addFields) {
    transformed = { ...transformed, ...options.addFields }
  }

  // Apply custom transformation function
  if (options.transformFn) {
    transformed = options.transformFn(transformed)
  }

  return transformed
}

/**
 * Transform multiple documents
 */
export function transformDocuments(
  docs: SanityDocument[],
  options: TransformOptions = {}
): SanityDocument[] {
  return docs.map((doc) => transformDocument(doc, options))
}

/**
 * Get nested value from object using dot notation
 * Example: getNestedValue(obj, 'user.profile.name')
 */
function getNestedValue(obj: any, path: string): any {
  const keys = path.split('.')
  let current = obj

  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined
    }
    current = current[key]
  }

  return current
}

/**
 * Set nested value in object using dot notation
 * Example: setNestedValue(obj, 'user.profile.name', 'John')
 */
function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.')
  let current = obj

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {}
    }
    current = current[key]
  }

  current[keys[keys.length - 1]] = value
}

/**
 * Delete nested value from object using dot notation
 */
function deleteNestedValue(obj: any, path: string): void {
  const keys = path.split('.')
  let current = obj

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!(key in current)) {
      return
    }
    current = current[key]
  }

  delete current[keys[keys.length - 1]]
}

/**
 * Common transformations
 */
export const commonTransforms = {
  /**
   * Convert string to lowercase
   */
  toLowerCase: (value: string) => value?.toLowerCase(),

  /**
   * Convert string to uppercase
   */
  toUpperCase: (value: string) => value?.toUpperCase(),

  /**
   * Trim whitespace
   */
  trim: (value: string) => value?.trim(),

  /**
   * Convert to slug format
   */
  toSlug: (value: string) =>
    value
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, ''),

  /**
   * Parse JSON string
   */
  parseJson: (value: string) => {
    try {
      return JSON.parse(value)
    } catch {
      return null
    }
  },

  /**
   * Stringify to JSON
   */
  toJson: (value: any) => JSON.stringify(value),

  /**
   * Convert timestamp to ISO date
   */
  toISODate: (value: number | string) => new Date(value).toISOString(),

  /**
   * Extract numeric value from string
   */
  toNumber: (value: string) => {
    const num = parseFloat(value)
    return isNaN(num) ? null : num
  },

  /**
   * Convert array to comma-separated string
   */
  arrayToString: (value: any[]) => value?.join(', '),

  /**
   * Convert comma-separated string to array
   */
  stringToArray: (value: string) =>
    value
      ?.split(',')
      .map((v) => v.trim())
      .filter(Boolean),
}

/**
 * Validate transformed document
 */
export function validateTransformedDocument(doc: SanityDocument): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Check required Sanity fields
  if (!doc._id) {
    errors.push('Missing required field: _id')
  }

  if (!doc._type) {
    errors.push('Missing required field: _type')
  }

  // Check for invalid field names (Sanity reserved)
  const reservedFields = ['_key', '_weak', '_ref']
  for (const field of Object.keys(doc)) {
    if (field.startsWith('_') && !['_id', '_type', '_createdAt', '_updatedAt', '_rev'].includes(field)) {
      if (!reservedFields.includes(field)) {
        errors.push(`Invalid field name: ${field} (reserved prefix _)`)
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Prepare document for migration (remove system fields)
 */
export function prepareForMigration(doc: SanityDocument): Omit<SanityDocument, '_rev' | '_updatedAt'> {
  const { _rev, _updatedAt, ...rest } = doc
  return rest
}

/**
 * Generate new document ID for target dataset
 */
export function generateNewId(originalId: string, sourceDataset: string, targetDataset: string): string {
  // Keep same ID but ensure it's unique if needed
  // You might want to add dataset prefix if there's risk of collision
  return originalId.replace(sourceDataset, targetDataset)
}
