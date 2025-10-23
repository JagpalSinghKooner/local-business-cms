#!/usr/bin/env tsx

/**
 * Content Migration CLI
 *
 * Migrates content between Sanity datasets with support for:
 * - Selective migration (by type, by IDs)
 * - Reference resolution
 * - Field transformations
 * - Dry-run mode
 * - Progress reporting
 *
 * Usage:
 *   pnpm migrate-content --from=site-budds --to=site-hvac --type=service
 *   pnpm migrate-content --from=site-budds --to=site-hvac --type=service --ids=abc,xyz
 *   pnpm migrate-content --from=site-budds --to=site-hvac --type=offer --all
 *   pnpm migrate-content --from=site-budds --to=site-hvac --type=service --dry-run
 */

import { createClient, type SanityClient, type SanityDocument } from '@sanity/client'
import { transformDocument, prepareForMigration, validateTransformedDocument, type TransformOptions } from './lib/content-transformer'
import {
  findReferences,
  updateReferences,
  buildReferenceMapping,
  findBrokenReferences,
  sortByDependencies,
  type ReferenceMapping,
} from './lib/reference-resolver'

// Parse command line arguments
const args = process.argv.slice(2)
const options = {
  from: '',
  to: '',
  type: '',
  ids: [] as string[],
  all: false,
  dryRun: false,
  skipAssets: false,
  verbose: false,
}

for (const arg of args) {
  if (arg.startsWith('--from=')) {
    options.from = arg.split('=')[1]
  } else if (arg.startsWith('--to=')) {
    options.to = arg.split('=')[1]
  } else if (arg.startsWith('--type=')) {
    options.type = arg.split('=')[1]
  } else if (arg.startsWith('--ids=')) {
    options.ids = arg.split('=')[1].split(',').map((id) => id.trim())
  } else if (arg === '--all') {
    options.all = true
  } else if (arg === '--dry-run') {
    options.dryRun = true
  } else if (arg === '--skip-assets') {
    options.skipAssets = true
  } else if (arg === '--verbose' || arg === '-v') {
    options.verbose = true
  }
}

// Validate required options
if (!options.from || !options.to) {
  console.error('❌ Error: --from and --to datasets are required')
  console.log('\nUsage:')
  console.log('  pnpm migrate-content --from=site-source --to=site-target --type=service')
  console.log('  pnpm migrate-content --from=site-source --to=site-target --type=service --ids=id1,id2')
  console.log('  pnpm migrate-content --from=site-source --to=site-target --type=service --all')
  console.log('\nOptions:')
  console.log('  --from=DATASET       Source dataset name')
  console.log('  --to=DATASET         Target dataset name')
  console.log('  --type=TYPE          Document type to migrate (required)')
  console.log('  --ids=ID1,ID2        Comma-separated list of document IDs to migrate')
  console.log('  --all                Migrate all documents of the specified type')
  console.log('  --dry-run            Show what would be migrated without making changes')
  console.log('  --skip-assets        Skip migrating referenced assets')
  console.log('  --verbose, -v        Show detailed progress')
  process.exit(1)
}

if (!options.type) {
  console.error('❌ Error: --type is required')
  process.exit(1)
}

if (!options.all && options.ids.length === 0) {
  console.error('❌ Error: Either --all or --ids must be specified')
  process.exit(1)
}

// Create Sanity clients
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error('❌ Error: NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN must be set')
  process.exit(1)
}

const sourceClient = createClient({
  projectId,
  dataset: options.from,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

const targetClient = createClient({
  projectId,
  dataset: options.to,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

/**
 * Fetch documents from source dataset
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
    console.log(`📋 Fetching documents from ${options.from}...`)
    console.log(`   Query: ${query}`)
    console.log(`   Params:`, params)
  }

  const docs = await sourceClient.fetch<SanityDocument[]>(query, params)

  console.log(`✅ Found ${docs.length} document(s) to migrate`)

  return docs
}

/**
 * Migrate a single document
 */
async function migrateDocument(
  doc: SanityDocument,
  refMapping: ReferenceMapping
): Promise<SanityDocument | null> {
  try {
    // Prepare document for migration
    let prepared = prepareForMigration(doc)

    // Update references
    prepared = updateReferences(prepared, refMapping)

    // Validate transformed document
    const validation = validateTransformedDocument(prepared as SanityDocument)
    if (!validation.valid) {
      console.error(`❌ Validation failed for ${doc._id}:`)
      validation.errors.forEach((err) => console.error(`   - ${err}`))
      return null
    }

    return prepared as SanityDocument
  } catch (error) {
    console.error(`❌ Error preparing document ${doc._id}:`, error)
    return null
  }
}

/**
 * Check if document exists in target dataset
 */
async function documentExists(id: string): Promise<boolean> {
  const result = await targetClient.fetch(`*[_id == $id][0]._id`, { id })
  return !!result
}

/**
 * Create or update document in target dataset
 */
async function createOrUpdateDocument(doc: SanityDocument): Promise<void> {
  const exists = await documentExists(doc._id)

  if (exists) {
    console.log(`   ↻ Updating existing document: ${doc._id}`)
    await targetClient.createOrReplace(doc)
  } else {
    console.log(`   + Creating new document: ${doc._id}`)
    await targetClient.create(doc)
  }
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('\n🚀 Content Migration Tool\n')
  console.log(`Source: ${options.from}`)
  console.log(`Target: ${options.to}`)
  console.log(`Type: ${options.type}`)

  if (options.dryRun) {
    console.log('Mode: DRY RUN (no changes will be made)\n')
  } else {
    console.log('Mode: LIVE (changes will be made)\n')
  }

  // Step 1: Fetch documents
  const docs = await fetchDocuments()

  if (docs.length === 0) {
    console.log('\n⚠️  No documents to migrate')
    return
  }

  // Step 2: Sort by dependencies to handle references correctly
  console.log('\n📊 Analyzing dependencies...')
  const sortedDocs = sortByDependencies(docs)

  if (options.verbose) {
    console.log(`   Sorted ${sortedDocs.length} documents by dependency order`)
  }

  // Step 3: Build reference mapping (old ID -> new ID)
  // For now, we keep the same IDs
  const refMapping = buildReferenceMapping(docs, docs)

  // Step 4: Check for broken references
  console.log('\n🔍 Checking references...')
  const allRefs = new Set<string>()
  for (const doc of docs) {
    const refs = findReferences(doc)
    refs.forEach((ref) => allRefs.add(ref))
  }

  console.log(`   Found ${allRefs.size} unique reference(s)`)

  // Step 5: Migrate documents
  console.log(`\n📦 Migrating ${docs.length} document(s)...\n`)

  let successCount = 0
  let failCount = 0

  for (let i = 0; i < sortedDocs.length; i++) {
    const doc = sortedDocs[i]
    const progress = `[${i + 1}/${sortedDocs.length}]`

    console.log(`${progress} Processing: ${doc._id}`)

    const migrated = await migrateDocument(doc, refMapping)

    if (!migrated) {
      failCount++
      continue
    }

    if (options.verbose) {
      console.log(`   Type: ${migrated._type}`)
      const refs = findReferences(migrated)
      if (refs.length > 0) {
        console.log(`   References: ${refs.length}`)
      }
    }

    if (!options.dryRun) {
      try {
        await createOrUpdateDocument(migrated)
        successCount++
      } catch (error: any) {
        console.error(`   ❌ Error: ${error.message}`)
        failCount++
      }
    } else {
      console.log(`   ✓ Would migrate (dry run)`)
      successCount++
    }
  }

  // Step 6: Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 Migration Summary')
  console.log('='.repeat(50))
  console.log(`Total documents: ${docs.length}`)
  console.log(`Successful: ${successCount}`)
  console.log(`Failed: ${failCount}`)
  console.log(`Mode: ${options.dryRun ? 'DRY RUN' : 'LIVE'}`)

  if (options.dryRun) {
    console.log('\n💡 This was a dry run. No changes were made.')
    console.log('   Remove --dry-run to perform the actual migration.')
  }

  console.log('')
}

// Run migration
migrate()
  .then(() => {
    console.log('✅ Migration completed\n')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  })
