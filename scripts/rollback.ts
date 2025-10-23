#!/usr/bin/env tsx

/**
 * Automated Rollback Script
 *
 * Automates common rollback scenarios for faster recovery
 *
 * Usage:
 *   pnpm rollback --type=deployment --id=DEPLOYMENT_ID
 *   pnpm rollback --type=git --commit=abc123
 *   pnpm rollback --type=schema --dataset=site-budds
 *   pnpm rollback --type=content --dataset=site-budds --backup=2025-10-23
 */

import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { getCurrentBranch } from './lib/git-analyzer'

// Parse command line arguments
const args = process.argv.slice(2)
const options = {
  type: '',
  id: '',
  commit: '',
  dataset: '',
  backup: '',
  yes: false,
  dry: false,
}

for (const arg of args) {
  if (arg.startsWith('--type=')) {
    options.type = arg.split('=')[1]
  } else if (arg.startsWith('--id=')) {
    options.id = arg.split('=')[1]
  } else if (arg.startsWith('--commit=')) {
    options.commit = arg.split('=')[1]
  } else if (arg.startsWith('--dataset=')) {
    options.dataset = arg.split('=')[1]
  } else if (arg.startsWith('--backup=')) {
    options.backup = arg.split('=')[1]
  } else if (arg === '--yes' || arg === '-y') {
    options.yes = true
  } else if (arg === '--dry-run') {
    options.dry = true
  }
}

/**
 * Execute command safely
 */
function executeCommand(command: string, description: string): void {
  if (options.dry) {
    console.log(`[DRY RUN] Would execute: ${command}`)
    return
  }

  try {
    console.log(`\n⚙️  ${description}...`)
    execSync(command, { stdio: 'inherit' })
    console.log(`✅ ${description} completed\n`)
  } catch (error: any) {
    console.error(`\n❌ ${description} failed:`, error.message)
    process.exit(1)
  }
}

/**
 * Confirm action with user
 */
function confirm(message: string): boolean {
  if (options.yes) return true

  console.log(`\n⚠️  ${message}`)
  console.log('This action cannot be undone without further rollback.')
  console.log('\nContinue? (yes/no)')

  // In a real implementation, you'd use a proper prompt library
  // For now, require --yes flag
  console.log('\n❌ Confirmation required. Use --yes flag to proceed.')
  return false
}

/**
 * Rollback Vercel deployment
 */
async function rollbackDeployment() {
  console.log('\n🔄 Vercel Deployment Rollback\n')

  if (!options.id) {
    console.error('❌ Error: --id=DEPLOYMENT_ID is required')
    console.log('\nFind deployment ID:')
    console.log('  vercel list')
    console.log('  Or check: https://vercel.com/dashboard')
    process.exit(1)
  }

  const projectUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-site.com'

  if (!confirm(`Rollback production to deployment: ${options.id}?`)) {
    process.exit(1)
  }

  console.log('📋 Rollback Steps:')
  console.log('  1. Promote deployment to production')
  console.log('  2. Verify deployment is live')
  console.log('  3. Run smoke tests\n')

  // Execute rollback
  executeCommand(
    `vercel rollback ${options.id} --yes`,
    'Promoting deployment to production'
  )

  // Verify
  console.log('⏳ Waiting 10 seconds for deployment to propagate...')
  if (!options.dry) {
    await new Promise((resolve) => setTimeout(resolve, 10000))
  }

  executeCommand(
    `curl -I ${projectUrl}`,
    'Verifying deployment is live'
  )

  console.log('\n✅ Deployment rollback completed!')
  console.log('\n📝 Next Steps:')
  console.log(`  1. Run smoke tests: pnpm test:smoke --url=${projectUrl}`)
  console.log('  2. Monitor error logs: vercel logs --follow')
  console.log('  3. Document the rollback in docs/rollback-playbook.md')
  console.log('  4. Identify and fix the root cause\n')
}

/**
 * Rollback git commit
 */
async function rollbackGit() {
  console.log('\n🔄 Git Commit Rollback\n')

  if (!options.commit) {
    console.error('❌ Error: --commit=HASH is required')
    console.log('\nFind commit hash:')
    console.log('  git log --oneline -10')
    process.exit(1)
  }

  const currentBranch = getCurrentBranch()

  if (!confirm(`Revert commit ${options.commit} on branch ${currentBranch}?`)) {
    process.exit(1)
  }

  console.log('📋 Rollback Steps:')
  console.log('  1. Create revert commit')
  console.log('  2. Push to trigger CI/CD')
  console.log('  3. Monitor deployment\n')

  // Execute rollback
  executeCommand(
    `git revert ${options.commit} --no-edit`,
    'Creating revert commit'
  )

  executeCommand(
    `git push origin ${currentBranch}`,
    'Pushing revert commit'
  )

  console.log('\n✅ Git rollback completed!')
  console.log('\n📝 Next Steps:')
  console.log('  1. Monitor CI/CD pipeline')
  console.log('  2. Verify deployment completes successfully')
  console.log('  3. Run smoke tests after deployment')
  console.log('  4. Document the revert\n')
}

/**
 * Rollback schema changes
 */
async function rollbackSchema() {
  console.log('\n🔄 Schema Rollback\n')

  if (!options.dataset) {
    console.error('❌ Error: --dataset is required')
    console.log('\nExample: --dataset=site-budds')
    process.exit(1)
  }

  if (!options.commit) {
    console.error('❌ Error: --commit=HASH is required (commit with working schema)')
    console.log('\nFind commit with last working schema:')
    console.log('  git log --oneline src/sanity/schemaTypes/')
    process.exit(1)
  }

  if (!confirm(`Rollback schema to commit ${options.commit} for ${options.dataset}?`)) {
    process.exit(1)
  }

  console.log('📋 Rollback Steps:')
  console.log('  1. Checkout previous schema files')
  console.log('  2. Deploy schema to dataset')
  console.log('  3. Verify in Studio\n')

  // Checkout schema files
  executeCommand(
    `git checkout ${options.commit} -- src/sanity/schemaTypes/`,
    'Checking out previous schema'
  )

  // Deploy schema
  executeCommand(
    `pnpm deploy-schema-all`,
    'Deploying schema to all datasets'
  )

  console.log('\n✅ Schema rollback completed!')
  console.log('\n📝 Next Steps:')
  console.log('  1. Open Sanity Studio and verify it loads')
  console.log('  2. Test creating/editing documents')
  console.log('  3. Run schema diff: pnpm schema-diff --all')
  console.log('  4. Commit the schema rollback if successful')
  console.log('  5. Create a fix for the schema issue\n')
}

/**
 * Rollback content from backup
 */
async function rollbackContent() {
  console.log('\n🔄 Content Rollback\n')

  if (!options.dataset) {
    console.error('❌ Error: --dataset is required')
    process.exit(1)
  }

  if (!options.backup) {
    console.error('❌ Error: --backup=DATE or --backup=FILE is required')
    console.log('\nExample: --backup=2025-10-23 or --backup=backup.ndjson')
    process.exit(1)
  }

  // Determine backup file
  const backupFile = options.backup.endsWith('.ndjson')
    ? options.backup
    : `backup-${options.dataset}-${options.backup}.ndjson`

  if (!existsSync(backupFile) && !options.dry) {
    console.error(`❌ Error: Backup file not found: ${backupFile}`)
    console.log('\nAvailable backups:')
    executeCommand('ls -lh backup-*.ndjson', 'Listing backups')
    process.exit(1)
  }

  if (!confirm(`Restore ${options.dataset} from backup ${backupFile}?`)) {
    process.exit(1)
  }

  console.log('📋 Rollback Steps:')
  console.log('  1. Create safety backup of current state')
  console.log('  2. Import backup data')
  console.log('  3. Verify data integrity\n')

  // Create safety backup
  const safetyBackup = `pre-rollback-${options.dataset}-${new Date().toISOString().split('T')[0]}.ndjson`
  executeCommand(
    `pnpm sanity:export --dataset=${options.dataset} --output=${safetyBackup}`,
    'Creating safety backup'
  )

  // Import backup
  executeCommand(
    `pnpm sanity:import ${backupFile} --dataset=${options.dataset}`,
    'Importing backup data'
  )

  console.log('\n✅ Content rollback completed!')
  console.log('\n📝 Next Steps:')
  console.log('  1. Verify content in Sanity Studio')
  console.log('  2. Run smoke tests')
  console.log('  3. Check frontend displays correctly')
  console.log(`  4. Safety backup saved: ${safetyBackup}\n`)
}

/**
 * Display help
 */
function showHelp() {
  console.log(`
📋 Rollback Script - Automated Recovery Tool

USAGE:
  pnpm rollback --type=TYPE [options]

TYPES:
  deployment    Rollback Vercel deployment
  git           Revert git commit
  schema        Rollback Sanity schema
  content       Restore content from backup

OPTIONS:
  --id=ID           Deployment ID (for deployment type)
  --commit=HASH     Git commit hash
  --dataset=NAME    Dataset name (for schema/content type)
  --backup=FILE     Backup file or date (for content type)
  --yes, -y         Skip confirmation prompts
  --dry-run         Show actions without executing

EXAMPLES:

  # Rollback Vercel deployment
  pnpm rollback --type=deployment --id=dpl_abc123xyz --yes

  # Revert git commit
  pnpm rollback --type=git --commit=abc123 --yes

  # Rollback schema to previous version
  pnpm rollback --type=schema --dataset=site-budds --commit=abc123

  # Restore content from backup
  pnpm rollback --type=content --dataset=site-budds --backup=2025-10-23

  # Dry run (preview actions)
  pnpm rollback --type=deployment --id=dpl_abc123 --dry-run

DOCUMENTATION:
  See docs/rollback-playbook.md for detailed procedures

SUPPORT:
  For complex rollbacks, consult the playbook or team lead
`)
}

/**
 * Main function
 */
async function main() {
  console.log('\n🚨 Automated Rollback Script\n')

  // Validate type
  if (!options.type) {
    console.error('❌ Error: --type is required\n')
    showHelp()
    process.exit(1)
  }

  if (options.dry) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n')
  }

  // Execute rollback based on type
  switch (options.type) {
    case 'deployment':
      await rollbackDeployment()
      break

    case 'git':
      await rollbackGit()
      break

    case 'schema':
      await rollbackSchema()
      break

    case 'content':
      await rollbackContent()
      break

    case 'help':
      showHelp()
      break

    default:
      console.error(`❌ Error: Unknown type "${options.type}"`)
      console.log('\nValid types: deployment, git, schema, content')
      console.log('Run: pnpm rollback --type=help\n')
      process.exit(1)
  }
}

// Run
main()
  .then(() => {
    console.log('✅ Rollback script completed\n')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Rollback failed:', error)
    console.log('\n📋 Consult docs/rollback-playbook.md for manual procedures\n')
    process.exit(1)
  })
