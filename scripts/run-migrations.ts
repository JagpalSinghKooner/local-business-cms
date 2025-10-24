#!/usr/bin/env tsx
/**
 * Schema Migration CLI
 *
 * USAGE:
 *   pnpm migrate              - Run all pending migrations
 *   pnpm migrate:rollback     - Rollback last migration
 *   pnpm migrate:status       - Check which migrations need to run
 *
 * SAFETY:
 *   - Always backs up data before migration
 *   - Validates schema compatibility
 *   - Supports rollback for safe reversal
 */

import { writeClient } from '../src/sanity/writeClient'
import {
  MigrationRunner,
  allMigrations,
  type Migration,
} from '../src/lib/sanity/migrations'

const args = process.argv.slice(2)
const command = args[0] || 'run'

async function main() {
  if (!writeClient) {
    console.error('❌ Write client not configured. Check SANITY_API_TOKEN.')
    process.exit(1)
  }

  const runner = new MigrationRunner(writeClient)

  switch (command) {
    case 'run':
      await runMigrations(runner)
      break

    case 'status':
      await checkStatus(runner)
      break

    case 'rollback':
      await rollbackLast(runner)
      break

    default:
      console.error(`❌ Unknown command: ${command}`)
      console.log('Available commands: run, status, rollback')
      process.exit(1)
  }
}

async function runMigrations(runner: MigrationRunner) {
  console.log('🚀 Running migrations...\n')

  const results = await runner.runMigrations(allMigrations)

  console.log('\n📊 Migration Summary:')
  console.log('='.repeat(50))

  let totalAffected = 0
  let totalErrors = 0

  for (const [id, result] of Object.entries(results)) {
    const status = result.success ? '✅' : '❌'
    console.log(`${status} ${id}`)
    console.log(`   Documents: ${result.documentsAffected}`)

    if (result.errors.length > 0) {
      console.log(`   Errors: ${result.errors.join(', ')}`)
    }

    if (result.warnings.length > 0) {
      console.log(`   Warnings: ${result.warnings.join(', ')}`)
    }

    totalAffected += result.documentsAffected
    totalErrors += result.errors.length
  }

  console.log('='.repeat(50))
  console.log(`Total documents affected: ${totalAffected}`)
  console.log(`Total errors: ${totalErrors}\n`)

  if (totalErrors === 0) {
    console.log('✅ All migrations completed successfully!')
  } else {
    console.error('❌ Some migrations failed. Review errors above.')
    process.exit(1)
  }
}

async function checkStatus(runner: MigrationRunner) {
  console.log('🔍 Checking migration status...\n')

  for (const migration of allMigrations) {
    const shouldRun = migration.shouldRun
      ? await migration.shouldRun(writeClient!)
      : true

    const status = shouldRun ? '⏳ Pending' : '✅ Applied'
    console.log(`${status} ${migration.id}`)
    console.log(`   ${migration.description}`)
    console.log(`   Affects: ${migration.documentTypes.join(', ')}\n`)
  }
}

async function rollbackLast(runner: MigrationRunner) {
  const lastMigration = allMigrations[allMigrations.length - 1]

  if (!lastMigration) {
    console.log('ℹ️  No migrations to rollback')
    return
  }

  console.log(`🔄 Rolling back: ${lastMigration.id}\n`)

  const result = await runner.rollbackMigration(lastMigration)

  if (result.success) {
    console.log(`✅ Rollback successful!`)
    console.log(`   Documents affected: ${result.documentsAffected}`)
  } else {
    console.error(`❌ Rollback failed:`)
    console.error(result.errors.join('\n'))
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
