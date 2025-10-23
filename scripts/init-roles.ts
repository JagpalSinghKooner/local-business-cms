#!/usr/bin/env tsx

/**
 * Initialize Default Roles Script
 *
 * Create default system roles (Admin, Editor, Reviewer, Viewer)
 *
 * Usage:
 *   pnpm init-roles
 *   pnpm init-roles --dataset=site-budds
 */

import { createDefaultRoles } from '../src/sanity/lib/rbac'

// Parse command line arguments
const args = process.argv.slice(2)
const options = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || '',
}

for (const arg of args) {
  if (arg.startsWith('--dataset=')) {
    options.dataset = arg.split('=')[1]
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
  console.log('\n🔐 Initializing Default Roles\n')
  console.log(`Dataset: ${options.dataset}\n`)

  try {
    await createDefaultRoles()

    console.log('\n✅ Default roles created successfully!\n')
    console.log('Created roles:')
    console.log('  👑 Administrator - Full access to all features')
    console.log('  ✏️  Editor - Create and edit content')
    console.log('  ✅ Reviewer - Review and approve content')
    console.log('  👁️  Viewer - Read-only access')
    console.log('')
  } catch (error: any) {
    console.error('\n❌ Failed to create roles:', error.message)
    process.exit(1)
  }
}

// Run
main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Operation failed:', error)
    process.exit(1)
  })
