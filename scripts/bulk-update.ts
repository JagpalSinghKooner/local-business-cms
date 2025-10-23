#!/usr/bin/env tsx

/**
 * Bulk Update CLI
 *
 * Update multiple documents at once with support for:
 * - Setting field values
 * - Removing fields
 * - Adding sections to arrays
 * - Dry-run mode
 *
 * Usage:
 *   pnpm bulk-update --dataset=site-budds --type=service --set="featured=true"
 *   pnpm bulk-update --dataset=site-budds --type=service --unset="oldField"
 *   pnpm bulk-update --dataset=site-budds --type=page --add-section="section.cta"
 *   pnpm bulk-update --dataset=site-budds --type=service --ids=id1,id2 --set="category=ref123"
 *   pnpm bulk-update --dataset=site-budds --type=service --all --dry-run
 */

import { createClient, type SanityClient, type SanityDocument } from '@sanity/client'

// Parse command line arguments
const args = process.argv.slice(2)
const options = {
  dataset: '',
  type: '',
  ids: [] as string[],
  all: false,
  set: [] as Array<{ field: string; value: any }>,
  unset: [] as string[],
  addSection: '',
  dryRun: false,
  verbose: false,
}

for (const arg of args) {
  if (arg.startsWith('--dataset=')) {
    options.dataset = arg.split('=')[1]
  } else if (arg.startsWith('--type=')) {
    options.type = arg.split('=')[1]
  } else if (arg.startsWith('--ids=')) {
    options.ids = arg.split('=')[1].split(',').map((id) => id.trim())
  } else if (arg === '--all') {
    options.all = true
  } else if (arg.startsWith('--set=')) {
    const setPart = arg.split('=').slice(1).join('=')
    const [field, ...valueParts] = setPart.split('=')
    const value = valueParts.join('=')
    options.set.push({ field, value: parseValue(value) })
  } else if (arg.startsWith('--unset=')) {
    options.unset.push(arg.split('=')[1])
  } else if (arg.startsWith('--add-section=')) {
    options.addSection = arg.split('=')[1]
  } else if (arg === '--dry-run') {
    options.dryRun = true
  } else if (arg === '--verbose' || arg === '-v') {
    options.verbose = true
  }
}

/**
 * Parse value from string (handles booleans, numbers, JSON)
 */
function parseValue(value: string): any {
  // Boolean
  if (value === 'true') return true
  if (value === 'false') return false

  // Null
  if (value === 'null') return null

  // Number
  if (!isNaN(Number(value)) && value !== '') {
    return Number(value)
  }

  // JSON object/array
  if (value.startsWith('{') || value.startsWith('[')) {
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }

  // String
  return value
}

// Validate required options
if (!options.dataset || !options.type) {
  console.error('❌ Error: --dataset and --type are required')
  console.log('\nUsage:')
  console.log('  pnpm bulk-update --dataset=site-name --type=service --set="field=value"')
  console.log('  pnpm bulk-update --dataset=site-name --type=service --unset="field"')
  console.log('  pnpm bulk-update --dataset=site-name --type=page --add-section="section.cta"')
  console.log('\nOptions:')
  console.log('  --dataset=NAME       Dataset name')
  console.log('  --type=TYPE          Document type to update')
  console.log('  --ids=ID1,ID2        Comma-separated list of document IDs (optional)')
  console.log('  --all                Update all documents of the specified type')
  console.log('  --set="field=value"  Set field to value (can be used multiple times)')
  console.log('  --unset="field"      Remove field (can be used multiple times)')
  console.log('  --add-section=TYPE   Add a section to sections array')
  console.log('  --dry-run            Show what would be updated without making changes')
  console.log('  --verbose, -v        Show detailed progress')
  console.log('\nExamples:')
  console.log('  --set="featured=true"')
  console.log('  --set="category._ref=category-abc123"')
  console.log('  --set="tags=[\\"tag1\\",\\"tag2\\"]"')
  process.exit(1)
}

if (!options.all && options.ids.length === 0) {
  console.error('❌ Error: Either --all or --ids must be specified')
  process.exit(1)
}

if (options.set.length === 0 && options.unset.length === 0 && !options.addSection) {
  console.error('❌ Error: At least one operation (--set, --unset, or --add-section) is required')
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
 * Fetch documents to update
 */
async function fetchDocuments(): Promise<SanityDocument[]> {
  const { type, ids, all } = options

  let query: string
  let params: Record<string, any>

  if (all) {
    query = `*[_type == $type]`
    params = { type }
  } else {
    query = `*[_type == $type && _id in $ids]`
    params = { type, ids }
  }

  if (options.verbose) {
    console.log(`📋 Fetching documents from ${options.dataset}...`)
    console.log(`   Query: ${query}`)
  }

  const docs = await client.fetch<SanityDocument[]>(query, params)

  console.log(`✅ Found ${docs.length} document(s) to update`)

  return docs
}

/**
 * Apply updates to a document
 */
function applyUpdates(doc: SanityDocument): SanityDocument {
  let updated = { ...doc }

  // Apply set operations
  for (const { field, value } of options.set) {
    setNestedValue(updated, field, value)
  }

  // Apply unset operations
  for (const field of options.unset) {
    deleteNestedValue(updated, field)
  }

  // Add section if specified
  if (options.addSection) {
    if (!updated.sections) {
      updated.sections = []
    }

    const newSection = {
      _type: options.addSection,
      _key: generateKey(),
    }

    updated.sections.push(newSection)
  }

  return updated
}

/**
 * Set nested value in object using dot notation
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
 * Generate a unique key for array items
 */
function generateKey(): string {
  return Math.random().toString(36).substring(2, 11)
}

/**
 * Main bulk update function
 */
async function bulkUpdate() {
  console.log('\n🔧 Bulk Update Tool\n')
  console.log(`Dataset: ${options.dataset}`)
  console.log(`Type: ${options.type}`)

  if (options.set.length > 0) {
    console.log(`Set operations:`)
    options.set.forEach(({ field, value }) => {
      console.log(`  - ${field} = ${JSON.stringify(value)}`)
    })
  }

  if (options.unset.length > 0) {
    console.log(`Unset operations:`)
    options.unset.forEach((field) => {
      console.log(`  - Remove ${field}`)
    })
  }

  if (options.addSection) {
    console.log(`Add section: ${options.addSection}`)
  }

  if (options.dryRun) {
    console.log('\nMode: DRY RUN (no changes will be made)\n')
  } else {
    console.log('\nMode: LIVE (changes will be made)\n')
  }

  // Step 1: Fetch documents
  const docs = await fetchDocuments()

  if (docs.length === 0) {
    console.log('\n⚠️  No documents to update')
    return
  }

  // Step 2: Apply updates
  console.log(`\n🔨 Updating ${docs.length} document(s)...\n`)

  let successCount = 0
  let failCount = 0

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i]
    const progress = `[${i + 1}/${docs.length}]`

    console.log(`${progress} Processing: ${doc._id}`)

    try {
      const updated = applyUpdates(doc)

      if (options.verbose) {
        console.log(`   Changes:`)
        if (options.set.length > 0) {
          options.set.forEach(({ field, value }) => {
            console.log(`     Set ${field} = ${JSON.stringify(value)}`)
          })
        }
        if (options.unset.length > 0) {
          options.unset.forEach((field) => {
            console.log(`     Removed ${field}`)
          })
        }
        if (options.addSection) {
          console.log(`     Added section: ${options.addSection}`)
        }
      }

      if (!options.dryRun) {
        await client.createOrReplace(updated)
        console.log(`   ✓ Updated`)
        successCount++
      } else {
        console.log(`   ✓ Would update (dry run)`)
        successCount++
      }
    } catch (error: any) {
      console.error(`   ❌ Error: ${error.message}`)
      failCount++
    }
  }

  // Step 3: Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 Update Summary')
  console.log('='.repeat(50))
  console.log(`Total documents: ${docs.length}`)
  console.log(`Successful: ${successCount}`)
  console.log(`Failed: ${failCount}`)
  console.log(`Mode: ${options.dryRun ? 'DRY RUN' : 'LIVE'}`)

  if (options.dryRun) {
    console.log('\n💡 This was a dry run. No changes were made.')
    console.log('   Remove --dry-run to perform the actual update.')
  }

  console.log('')
}

// Run bulk update
bulkUpdate()
  .then(() => {
    console.log('✅ Bulk update completed\n')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Bulk update failed:', error)
    process.exit(1)
  })
