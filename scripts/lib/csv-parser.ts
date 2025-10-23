/**
 * CSV Parser Utility
 *
 * Parses CSV files and converts them to Sanity documents
 */

import { readFileSync } from 'fs'

export interface CSVParseOptions {
  delimiter?: string
  skipEmptyLines?: boolean
  trimValues?: boolean
}

export interface CSVRow {
  [key: string]: string
}

/**
 * Parse CSV file to array of objects
 */
export function parseCSV(filePath: string, options: CSVParseOptions = {}): CSVRow[] {
  const {
    delimiter = ',',
    skipEmptyLines = true,
    trimValues = true,
  } = options

  const content = readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  if (lines.length === 0) {
    return []
  }

  // Parse header row
  const headers = parseLine(lines[0], delimiter, trimValues)

  // Parse data rows
  const rows: CSVRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]

    if (skipEmptyLines && !line.trim()) {
      continue
    }

    const values = parseLine(line, delimiter, trimValues)

    // Create object from headers and values
    const row: CSVRow = {}
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j] || ''
    }

    rows.push(row)
  }

  return rows
}

/**
 * Parse a single CSV line (handles quoted values)
 */
function parseLine(line: string, delimiter: string, trim: boolean): string[] {
  const values: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"'
        i++ // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes
      }
    } else if (char === delimiter && !inQuotes) {
      // End of value
      values.push(trim ? current.trim() : current)
      current = ''
    } else {
      current += char
    }
  }

  // Add last value
  values.push(trim ? current.trim() : current)

  return values
}

/**
 * Convert CSV row to Sanity document
 */
export function csvRowToDocument(
  row: CSVRow,
  docType: string,
  fieldMapping?: Record<string, string>
): any {
  const doc: any = {
    _type: docType,
  }

  // Apply field mapping or use row keys directly
  for (const [csvKey, value] of Object.entries(row)) {
    if (!value) continue

    const docKey = fieldMapping?.[csvKey] || csvKey

    // Parse value type
    doc[docKey] = parseValue(value)
  }

  return doc
}

/**
 * Parse value to appropriate type
 */
function parseValue(value: string): any {
  if (!value || value.trim() === '') {
    return null
  }

  const trimmed = value.trim()

  // Boolean
  if (trimmed.toLowerCase() === 'true') return true
  if (trimmed.toLowerCase() === 'false') return false

  // Null
  if (trimmed.toLowerCase() === 'null') return null

  // Number
  if (/^-?\d+\.?\d*$/.test(trimmed)) {
    return Number(trimmed)
  }

  // Array (comma-separated or JSON)
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      return JSON.parse(trimmed)
    } catch {
      // If JSON parse fails, treat as comma-separated
      const items = trimmed.slice(1, -1).split(',').map(s => s.trim()).filter(Boolean)
      return items
    }
  }

  // Object (JSON)
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      return JSON.parse(trimmed)
    } catch {
      return trimmed
    }
  }

  // String
  return trimmed
}

/**
 * Generate slug from string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/**
 * Validate CSV headers
 */
export function validateHeaders(
  headers: string[],
  requiredFields: string[],
  optionalFields: string[] = []
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check required fields
  for (const field of requiredFields) {
    if (!headers.includes(field)) {
      errors.push(`Missing required column: ${field}`)
    }
  }

  // Check for unknown fields
  const allowedFields = [...requiredFields, ...optionalFields]
  for (const header of headers) {
    if (!allowedFields.includes(header) && header.trim() !== '') {
      errors.push(`Unknown column: ${header}`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * CSV to Service document
 */
export function csvToService(row: CSVRow): any {
  return {
    _type: 'service',
    title: row.title || row.name,
    slug: {
      _type: 'slug',
      current: row.slug || generateSlug(row.title || row.name),
    },
    description: row.description,
    featured: row.featured === 'true' || row.featured === '1',
    category: row.category ? { _type: 'reference', _ref: row.category } : undefined,
  }
}

/**
 * CSV to Location document
 */
export function csvToLocation(row: CSVRow): any {
  return {
    _type: 'location',
    name: row.name || row.city,
    slug: {
      _type: 'slug',
      current: row.slug || generateSlug(row.name || row.city),
    },
    city: row.city,
    state: row.state,
    county: row.county,
    zipCode: row.zipCode || row.zip,
    latitude: row.latitude ? parseFloat(row.latitude) : undefined,
    longitude: row.longitude ? parseFloat(row.longitude) : undefined,
    serviceRadius: row.serviceRadius ? parseInt(row.serviceRadius, 10) : undefined,
    population: row.population ? parseInt(row.population, 10) : undefined,
  }
}

/**
 * CSV to FAQ document
 */
export function csvToFaq(row: CSVRow): any {
  return {
    _type: 'faq',
    question: row.question,
    answer: row.answer,
    category: row.category,
    order: row.order ? parseInt(row.order, 10) : undefined,
  }
}
