#!/usr/bin/env tsx

/**
 * Content Import CLI
 *
 * Import content from CSV or JSON files into Sanity
 *
 * Usage:
 *   pnpm import-content --file=services.csv --type=service --dataset=site-budds
 *   pnpm import-content --file=data.json --dataset=site-budds
 *   pnpm import-content --file=locations.csv --type=location --dataset=site-budds --validate-only
 *   pnpm import-content --file=faqs.csv --type=faq --dataset=site-budds --dry-run
 */

import { createClient, type SanityClient, type SanityDocument } from '@sanity/client'
import { readFileSync } from 'fs'
import { extname } from 'path'
import {
  parseCSV,
  csvRowToDocument,
  csvToService,
  csvToLocation,
  csvToFaq,
  generateSlug,
  type CSVRow,
} from './lib/csv-parser'

// Parse command line arguments
const args = process.argv.slice(2)
const options = {
  file: '',
  type: '',
  dataset: '',
  validateOnly: false,
  dryRun: false,
  skipDuplicates: false,
  updateExisting: false,
  verbose: false,
}

for (const arg of args) {
  if (arg.startsWith('--file=')) {
    options.file = arg.split('=')[1]
  } else if (arg.startsWith('--type=')) {
    options.type = arg.split('=')[1]
  } else if (arg.startsWith('--dataset=')) {
    options.dataset = arg.split('=')[1]
  } else if (arg === '--validate-only') {
    options.validateOnly = true
  } else if (arg === '--dry-run') {
    options.dryRun = true
  } else if (arg === '--skip-duplicates') {
    options.skipDuplicates = true
  } else if (arg === '--update-existing') {
    options.updateExisting = true
  } else if (arg === '--verbose' || arg === '-v') {
    options.verbose = true
  }
}

// Validate required options
if (!options.file || !options.dataset) {
  console.error('❌ Error: --file and --dataset are required')
  console.log('\nUsage:')
  console.log('  pnpm import-content --file=services.csv --type=service --dataset=site-name')
  console.log('  pnpm import-content --file=data.json --dataset=site-name')
  console.log('\nOptions:')
  console.log('  --file=PATH          Path to CSV or JSON file')
  console.log('  --type=TYPE          Document type (required for CSV)')
  console.log('  --dataset=NAME       Target dataset name')
  console.log('  --validate-only      Only validate, do not import')
  console.log('  --dry-run            Show what would be imported without making changes')
  console.log('  --skip-duplicates    Skip documents that already exist')
  console.log('  --update-existing    Update existing documents instead of skipping')
  console.log('  --verbose, -v        Show detailed progress')
  console.log('\nSupported Types:')
  console.log('  - service           Services')
  console.log('  - location          Locations')
  console.log('  - faq               FAQs')
  console.log('  - offer             Offers')
  console.log('  - testimonial       Testimonials')
  console.log('\nFile Formats:')
  console.log('  CSV: Headers must match field names')
  console.log('  JSON: Array of Sanity documents or single document')
  process.exit(1)
}

// Determine file type
const fileExt = extname(options.file).toLowerCase()

if (fileExt === '.csv' && !options.type) {
  console.error('❌ Error: --type is required for CSV files')
  process.exit(1)
}

// Create Sanity client
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error('❌ Error: NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN must be set')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset: options.dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

/**
 * Load documents from file
 */
function loadDocuments(): any[] {
  console.log(`📂 Loading file: ${options.file}`)

  if (fileExt === '.csv') {
    const rows = parseCSV(options.file)
    console.log(`   Found ${rows.length} rows`)

    // Convert CSV rows to documents
    const docs = rows.map((row, index) => {
      try {
        return convertCSVRow(row, options.type)
      } catch (error: any) {
        console.error(`   ⚠️  Row ${index + 1} error: ${error.message}`)
        return null
      }
    }).filter(Boolean)

    return docs
  } else if (fileExt === '.json') {
    const content = readFileSync(options.file, 'utf-8')
    const data = JSON.parse(content)

    // Handle both array and single document
    const docs = Array.isArray(data) ? data : [data]
    console.log(`   Found ${docs.length} document(s)`)

    return docs
  } else {
    throw new Error(`Unsupported file format: ${fileExt}`)
  }
}

/**
 * Convert CSV row to Sanity document based on type
 */
function convertCSVRow(row: CSVRow, type: string): any {
  switch (type) {
    case 'service':
      return csvToService(row)
    case 'location':
      return csvToLocation(row)
    case 'faq':
      return csvToFaq(row)
    case 'offer':
      return csvToOffer(row)
    case 'testimonial':
      return csvToTestimonial(row)
    default:
      // Generic conversion
      return csvRowToDocument(row, type)
  }
}

/**
 * CSV to Offer document
 */
function csvToOffer(row: CSVRow): any {
  return {
    _type: 'offer',
    title: row.title,
    slug: {
      _type: 'slug',
      current: row.slug || generateSlug(row.title),
    },
    description: row.description,
    discountAmount: row.discountAmount,
    discountType: row.discountType || 'percentage',
    code: row.code,
    validFrom: row.validFrom ? new Date(row.validFrom).toISOString() : undefined,
    validTo: row.validTo ? new Date(row.validTo).toISOString() : undefined,
    featured: row.featured === 'true' || row.featured === '1',
  }
}

/**
 * CSV to Testimonial document
 */
function csvToTestimonial(row: CSVRow): any {
  return {
    _type: 'testimonial',
    name: row.name || row.author,
    role: row.role || row.title,
    company: row.company,
    content: row.content || row.testimonial || row.quote,
    rating: row.rating ? parseInt(row.rating, 10) : undefined,
    featured: row.featured === 'true' || row.featured === '1',
  }
}

/**
 * Validate document
 */
function validateDocument(doc: any, index: number): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!doc._type) {
    errors.push(`Document ${index + 1}: Missing _type field`)
  }

  // Type-specific validation
  switch (doc._type) {
    case 'service':
      if (!doc.title) errors.push(`Document ${index + 1}: Missing title`)
      if (!doc.slug?.current) errors.push(`Document ${index + 1}: Missing slug`)
      break

    case 'location':
      if (!doc.name) errors.push(`Document ${index + 1}: Missing name`)
      if (!doc.slug?.current) errors.push(`Document ${index + 1}: Missing slug`)
      break

    case 'faq':
      if (!doc.question) errors.push(`Document ${index + 1}: Missing question`)
      if (!doc.answer) errors.push(`Document ${index + 1}: Missing answer`)
      break

    case 'offer':
      if (!doc.title) errors.push(`Document ${index + 1}: Missing title`)
      break

    case 'testimonial':
      if (!doc.name) errors.push(`Document ${index + 1}: Missing name`)
      if (!doc.content) errors.push(`Document ${index + 1}: Missing content`)
      break
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Check if document exists
 */
async function documentExists(doc: any): Promise<string | null> {
  // Check by slug if available
  if (doc.slug?.current) {
    const existing = await client.fetch(
      `*[_type == $type && slug.current == $slug][0]._id`,
      { type: doc._type, slug: doc.slug.current }
    )
    return existing
  }

  // Check by title for documents without slug
  if (doc.title || doc.name || doc.question) {
    const titleField = doc.title ? 'title' : doc.name ? 'name' : 'question'
    const titleValue = doc.title || doc.name || doc.question

    const existing = await client.fetch(
      `*[_type == $type && ${titleField} == $value][0]._id`,
      { type: doc._type, value: titleValue }
    )
    return existing
  }

  return null
}

/**
 * Generate unique ID
 */
function generateId(doc: any): string {
  const slug = doc.slug?.current || generateSlug(doc.title || doc.name || doc.question || 'doc')
  return `${doc._type}-${slug}-${Date.now()}`
}

/**
 * Import documents
 */
async function importDocuments(docs: any[]) {
  console.log(`\n📦 Importing ${docs.length} document(s)...\n`)

  let successCount = 0
  let skipCount = 0
  let updateCount = 0
  let failCount = 0

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i]
    const progress = `[${i + 1}/${docs.length}]`

    const docTitle = doc.title || doc.name || doc.question || doc._id || 'Untitled'
    console.log(`${progress} Processing: ${docTitle}`)

    // Validate
    const validation = validateDocument(doc, i)
    if (!validation.valid) {
      console.error(`   ❌ Validation failed:`)
      validation.errors.forEach((err) => console.error(`      - ${err}`))
      failCount++
      continue
    }

    if (options.verbose) {
      console.log(`   Type: ${doc._type}`)
      if (doc.slug?.current) {
        console.log(`   Slug: ${doc.slug.current}`)
      }
    }

    // Check if exists
    const existingId = await documentExists(doc)

    if (existingId) {
      if (options.skipDuplicates) {
        console.log(`   ⊘ Skipped (already exists)`)
        skipCount++
        continue
      }

      if (options.updateExisting) {
        if (!options.dryRun && !options.validateOnly) {
          doc._id = existingId
          await client.createOrReplace(doc)
          console.log(`   ↻ Updated existing document`)
          updateCount++
        } else {
          console.log(`   ↻ Would update (${options.validateOnly ? 'validate-only' : 'dry-run'})`)
          updateCount++
        }
        continue
      }

      console.log(`   ⚠️  Already exists (use --skip-duplicates or --update-existing)`)
      failCount++
      continue
    }

    // Create new document
    if (!options.dryRun && !options.validateOnly) {
      try {
        // Generate ID if not present
        if (!doc._id) {
          doc._id = generateId(doc)
        }

        await client.create(doc)
        console.log(`   ✓ Created`)
        successCount++
      } catch (error: any) {
        console.error(`   ❌ Error: ${error.message}`)
        failCount++
      }
    } else {
      console.log(`   ✓ Would create (${options.validateOnly ? 'validate-only' : 'dry-run'})`)
      successCount++
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 Import Summary')
  console.log('='.repeat(60))
  console.log(`Total documents: ${docs.length}`)
  console.log(`Created: ${successCount}`)
  console.log(`Updated: ${updateCount}`)
  console.log(`Skipped: ${skipCount}`)
  console.log(`Failed: ${failCount}`)
  console.log(`Mode: ${options.validateOnly ? 'VALIDATE ONLY' : options.dryRun ? 'DRY RUN' : 'LIVE'}`)

  if (options.validateOnly) {
    console.log('\n💡 This was validation only. No changes were made.')
    console.log('   Remove --validate-only to perform the import.')
  } else if (options.dryRun) {
    console.log('\n💡 This was a dry run. No changes were made.')
    console.log('   Remove --dry-run to perform the actual import.')
  }

  console.log('')
}

/**
 * Main function
 */
async function main() {
  console.log('\n📥 Content Import Tool\n')
  console.log(`File: ${options.file}`)
  console.log(`Dataset: ${options.dataset}`)
  console.log(`Type: ${options.type || 'auto-detect'}`)

  if (options.validateOnly) {
    console.log('Mode: VALIDATE ONLY\n')
  } else if (options.dryRun) {
    console.log('Mode: DRY RUN\n')
  } else {
    console.log('Mode: LIVE\n')
  }

  try {
    // Load documents
    const docs = loadDocuments()

    if (docs.length === 0) {
      console.log('\n⚠️  No documents to import')
      return
    }

    // Import
    await importDocuments(docs)
  } catch (error: any) {
    console.error('\n❌ Import failed:', error.message)
    if (options.verbose) {
      console.error(error.stack)
    }
    process.exit(1)
  }
}

// Run
main()
  .then(() => {
    console.log('✅ Import completed\n')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Import failed:', error)
    process.exit(1)
  })
