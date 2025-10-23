#!/usr/bin/env tsx

/**
 * Publish Scheduled Content Script
 *
 * Manually run scheduled publishing (useful for testing or as fallback)
 *
 * Usage:
 *   pnpm publish-scheduled
 *   pnpm publish-scheduled --dry-run
 *   pnpm publish-scheduled --dataset=site-budds
 */

import { createClient } from '@sanity/client'
import { WORKFLOW_STATES } from '../src/sanity/schemaTypes/objects/workflowState'

// Parse command line arguments
const args = process.argv.slice(2)
const options = {
  dryRun: false,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || '',
  verbose: false,
}

for (const arg of args) {
  if (arg === '--dry-run') {
    options.dryRun = true
  } else if (arg.startsWith('--dataset=')) {
    options.dataset = arg.split('=')[1]
  } else if (arg === '--verbose' || arg === '-v') {
    options.verbose = true
  }
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const token = process.env.SANITY_API_TOKEN

if (!projectId) {
  console.error('❌ Error: NEXT_PUBLIC_SANITY_PROJECT_ID must be set')
  process.exit(1)
}

if (!token) {
  console.error('❌ Error: SANITY_API_TOKEN must be set')
  process.exit(1)
}

if (!options.dataset) {
  console.error('❌ Error: Dataset must be specified')
  console.log('Use --dataset=DATASET_NAME or set NEXT_PUBLIC_SANITY_DATASET')
  process.exit(1)
}

/**
 * Main function
 */
async function main() {
  console.log('\n📅 Scheduled Content Publisher\n')

  if (options.dryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n')
  }

  console.log(`Dataset: ${options.dataset}\n`)

  // Create Sanity client
  const client = createClient({
    projectId,
    dataset: options.dataset,
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  })

  // Find documents ready to publish
  console.log('📥 Checking for documents ready to publish...\n')

  const documentsToPublish = await client.fetch<any[]>(`
    *[
      publishAt != null &&
      publishAt <= now() &&
      workflow.state != "${WORKFLOW_STATES.PUBLISHED}"
    ] | order(publishAt asc) {
      _id,
      _type,
      title,
      publishAt,
      workflow
    }
  `)

  if (documentsToPublish.length === 0) {
    console.log('✅ No documents ready to publish\n')
  } else {
    console.log(`Found ${documentsToPublish.length} document(s) ready to publish:\n`)

    for (const doc of documentsToPublish) {
      const scheduledDate = new Date(doc.publishAt).toLocaleString()
      console.log(`  📄 ${doc.title || doc._id}`)
      console.log(`     Type: ${doc._type}`)
      console.log(`     Scheduled: ${scheduledDate}`)
      console.log(`     Current State: ${doc.workflow?.state || 'unknown'}`)
      console.log('')

      if (!options.dryRun) {
        try {
          await client
            .patch(doc._id)
            .set({
              'workflow.state': WORKFLOW_STATES.PUBLISHED,
              'workflow.changedAt': new Date().toISOString(),
              'workflow.changedBy': 'scheduled-publisher',
              'workflow.notes': 'Published automatically by scheduler',
            })
            .commit()

          console.log(`     ✅ Published successfully\n`)
        } catch (error: any) {
          console.error(`     ❌ Error: ${error.message}\n`)
        }
      }
    }
  }

  // Find documents ready to unpublish
  console.log('📥 Checking for documents ready to unpublish...\n')

  const documentsToUnpublish = await client.fetch<any[]>(`
    *[
      unpublishAt != null &&
      unpublishAt <= now() &&
      workflow.state == "${WORKFLOW_STATES.PUBLISHED}"
    ] | order(unpublishAt asc) {
      _id,
      _type,
      title,
      unpublishAt,
      workflow
    }
  `)

  if (documentsToUnpublish.length === 0) {
    console.log('✅ No documents ready to unpublish\n')
  } else {
    console.log(`Found ${documentsToUnpublish.length} document(s) ready to unpublish:\n`)

    for (const doc of documentsToUnpublish) {
      const scheduledDate = new Date(doc.unpublishAt).toLocaleString()
      console.log(`  📄 ${doc.title || doc._id}`)
      console.log(`     Type: ${doc._type}`)
      console.log(`     Scheduled: ${scheduledDate}`)
      console.log(`     Current State: ${doc.workflow?.state || 'unknown'}`)
      console.log('')

      if (!options.dryRun) {
        try {
          await client
            .patch(doc._id)
            .set({
              'workflow.state': WORKFLOW_STATES.ARCHIVED,
              'workflow.changedAt': new Date().toISOString(),
              'workflow.changedBy': 'scheduled-publisher',
              'workflow.notes': 'Unpublished automatically by scheduler',
            })
            .commit()

          console.log(`     ✅ Unpublished successfully\n`)
        } catch (error: any) {
          console.error(`     ❌ Error: ${error.message}\n`)
        }
      }
    }
  }

  // Summary
  console.log('='.repeat(60))
  console.log('SUMMARY')
  console.log('='.repeat(60))
  console.log(`Documents to publish: ${documentsToPublish.length}`)
  console.log(`Documents to unpublish: ${documentsToUnpublish.length}`)

  if (options.dryRun) {
    console.log('\n🔍 This was a dry run. No changes were made.')
    console.log('Remove --dry-run flag to apply changes.\n')
  } else {
    console.log('\n✅ Scheduled publishing completed\n')
  }
}

// Run
main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Scheduled publishing failed:', error)
    process.exit(1)
  })
