/**
 * Schema Comparison Utilities
 *
 * Compare Sanity schemas between datasets to detect inconsistencies
 */

export interface SchemaField {
  name: string
  type: string
  required?: boolean
  validation?: any
  options?: any
}

export interface SchemaType {
  name: string
  type: string
  fields?: SchemaField[]
}

export interface SchemaDifference {
  type: 'missing_type' | 'extra_type' | 'missing_field' | 'extra_field' | 'field_type_mismatch' | 'field_validation_diff'
  severity: 'error' | 'warning' | 'info'
  path: string
  message: string
  expected?: any
  actual?: any
}

/**
 * Compare two schemas and return differences
 */
export function compareSchemas(
  schema1: SchemaType[],
  schema2: SchemaType[],
  dataset1Name: string,
  dataset2Name: string
): SchemaDifference[] {
  const differences: SchemaDifference[] = []

  // Create maps for quick lookup
  const schema1Map = new Map(schema1.map((type) => [type.name, type]))
  const schema2Map = new Map(schema2.map((type) => [type.name, type]))

  // Find missing types (in schema1 but not in schema2)
  for (const type1 of schema1) {
    if (!schema2Map.has(type1.name)) {
      differences.push({
        type: 'missing_type',
        severity: 'error',
        path: type1.name,
        message: `Type "${type1.name}" exists in ${dataset1Name} but not in ${dataset2Name}`,
        expected: type1.name,
        actual: null,
      })
    } else {
      // Type exists in both, compare fields
      const type2 = schema2Map.get(type1.name)!
      const fieldDiffs = compareFields(type1, type2, dataset1Name, dataset2Name)
      differences.push(...fieldDiffs)
    }
  }

  // Find extra types (in schema2 but not in schema1)
  for (const type2 of schema2) {
    if (!schema1Map.has(type2.name)) {
      differences.push({
        type: 'extra_type',
        severity: 'warning',
        path: type2.name,
        message: `Type "${type2.name}" exists in ${dataset2Name} but not in ${dataset1Name}`,
        expected: null,
        actual: type2.name,
      })
    }
  }

  return differences
}

/**
 * Compare fields between two schema types
 */
function compareFields(
  type1: SchemaType,
  type2: SchemaType,
  dataset1Name: string,
  dataset2Name: string
): SchemaDifference[] {
  const differences: SchemaDifference[] = []

  if (!type1.fields || !type2.fields) {
    return differences
  }

  // Create maps for quick lookup
  const fields1Map = new Map(type1.fields.map((field) => [field.name, field]))
  const fields2Map = new Map(type2.fields.map((field) => [field.name, field]))

  // Find missing fields (in type1 but not in type2)
  for (const field1 of type1.fields) {
    const path = `${type1.name}.${field1.name}`

    if (!fields2Map.has(field1.name)) {
      differences.push({
        type: 'missing_field',
        severity: 'error',
        path,
        message: `Field "${field1.name}" exists in ${dataset1Name} but not in ${dataset2Name}`,
        expected: field1,
        actual: null,
      })
    } else {
      // Field exists in both, compare details
      const field2 = fields2Map.get(field1.name)!

      // Compare field type
      if (field1.type !== field2.type) {
        differences.push({
          type: 'field_type_mismatch',
          severity: 'error',
          path,
          message: `Field "${field1.name}" has different types: ${field1.type} (${dataset1Name}) vs ${field2.type} (${dataset2Name})`,
          expected: field1.type,
          actual: field2.type,
        })
      }

      // Compare required flag
      if (field1.required !== field2.required) {
        differences.push({
          type: 'field_validation_diff',
          severity: 'warning',
          path,
          message: `Field "${field1.name}" has different required status: ${field1.required} (${dataset1Name}) vs ${field2.required} (${dataset2Name})`,
          expected: field1.required,
          actual: field2.required,
        })
      }
    }
  }

  // Find extra fields (in type2 but not in type1)
  for (const field2 of type2.fields) {
    if (!fields1Map.has(field2.name)) {
      const path = `${type2.name}.${field2.name}`
      differences.push({
        type: 'extra_field',
        severity: 'warning',
        path,
        message: `Field "${field2.name}" exists in ${dataset2Name} but not in ${dataset1Name}`,
        expected: null,
        actual: field2,
      })
    }
  }

  return differences
}

/**
 * Group differences by severity
 */
export function groupBySeverity(differences: SchemaDifference[]): {
  errors: SchemaDifference[]
  warnings: SchemaDifference[]
  info: SchemaDifference[]
} {
  return {
    errors: differences.filter((d) => d.severity === 'error'),
    warnings: differences.filter((d) => d.severity === 'warning'),
    info: differences.filter((d) => d.severity === 'info'),
  }
}

/**
 * Generate migration suggestions based on differences
 */
export function generateMigrationSuggestions(differences: SchemaDifference[]): string[] {
  const suggestions: string[] = []

  for (const diff of differences) {
    switch (diff.type) {
      case 'missing_type':
        suggestions.push(`Deploy schema to add type "${diff.path}"`)
        break

      case 'missing_field':
        suggestions.push(`Deploy schema to add field "${diff.path}"`)
        break

      case 'field_type_mismatch':
        suggestions.push(
          `Update schema definition for "${diff.path}" to use consistent type (${diff.expected})`
        )
        break

      case 'field_validation_diff':
        suggestions.push(`Align validation rules for "${diff.path}"`)
        break

      case 'extra_type':
      case 'extra_field':
        suggestions.push(`Consider removing "${diff.path}" from newer schema or add to older schema`)
        break
    }
  }

  return [...new Set(suggestions)] // Remove duplicates
}

/**
 * Format differences as readable report
 */
export function formatDifferencesReport(
  differences: SchemaDifference[],
  dataset1Name: string,
  dataset2Name: string
): string {
  if (differences.length === 0) {
    return `✅ Schemas are identical between ${dataset1Name} and ${dataset2Name}\n`
  }

  const grouped = groupBySeverity(differences)
  let report = ''

  report += `\n${'='.repeat(70)}\n`
  report += `Schema Comparison: ${dataset1Name} vs ${dataset2Name}\n`
  report += '='.repeat(70) + '\n\n'

  // Summary
  report += '📊 Summary:\n'
  report += `   Total Differences: ${differences.length}\n`
  report += `   Errors: ${grouped.errors.length}\n`
  report += `   Warnings: ${grouped.warnings.length}\n`
  report += `   Info: ${grouped.info.length}\n\n`

  // Errors
  if (grouped.errors.length > 0) {
    report += '❌ ERRORS (Critical Issues):\n'
    for (const diff of grouped.errors) {
      report += `   - ${diff.message}\n`
      if (diff.expected || diff.actual) {
        report += `     Expected: ${JSON.stringify(diff.expected)}\n`
        report += `     Actual: ${JSON.stringify(diff.actual)}\n`
      }
    }
    report += '\n'
  }

  // Warnings
  if (grouped.warnings.length > 0) {
    report += '⚠️  WARNINGS (Should Fix):\n'
    for (const diff of grouped.warnings) {
      report += `   - ${diff.message}\n`
    }
    report += '\n'
  }

  // Info
  if (grouped.info.length > 0) {
    report += 'ℹ️  INFO (Optional):\n'
    for (const diff of grouped.info) {
      report += `   - ${diff.message}\n`
    }
    report += '\n'
  }

  // Migration suggestions
  const suggestions = generateMigrationSuggestions(differences)
  if (suggestions.length > 0) {
    report += '💡 Migration Suggestions:\n'
    for (let i = 0; i < suggestions.length; i++) {
      report += `   ${i + 1}. ${suggestions[i]}\n`
    }
    report += '\n'
  }

  report += '='.repeat(70) + '\n'

  return report
}

/**
 * Check if schemas are compatible (no critical errors)
 */
export function areSchemasCompatible(differences: SchemaDifference[]): boolean {
  return differences.filter((d) => d.severity === 'error').length === 0
}

/**
 * Extract schema summary for comparison
 */
export function extractSchemaSummary(schema: any[]): SchemaType[] {
  const types: SchemaType[] = []

  for (const type of schema) {
    const schemaType: SchemaType = {
      name: type.name,
      type: type.type,
    }

    if (type.fields) {
      schemaType.fields = type.fields.map((field: any) => ({
        name: field.name,
        type: field.type,
        required: field.validation?.some((v: any) => v._required) || false,
        options: field.options,
      }))
    }

    types.push(schemaType)
  }

  return types
}
