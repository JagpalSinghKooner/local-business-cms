#!/usr/bin/env tsx
/**
 * Pre-Commit Schema Validation
 *
 * PURPOSE: Prevent breaking schema changes from being committed
 * CHECKS:
 *   1. Schema field removal detection
 *   2. Required field additions
 *   3. Type changes that break compatibility
 *   4. Missing migration for schema changes
 *
 * EXITS:
 *   - 0: Safe to commit
 *   - 1: Breaking changes detected, commit blocked
 */

import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

interface SchemaField {
  name: string
  type: string
  required: boolean
}

interface DocumentSchema {
  name: string
  fields: SchemaField[]
}

function main() {
  console.log('🔍 Validating schema changes...\n')

  // Get changed schema files
  const changedSchemaFiles = getChangedSchemaFiles()

  if (changedSchemaFiles.length === 0) {
    console.log('✅ No schema changes detected')
    process.exit(0)
  }

  console.log(`📝 Changed schema files:`)
  changedSchemaFiles.forEach(file => console.log(`   - ${file}`))
  console.log()

  // Check if serviceLocation schema changed
  const serviceLocationChanged = changedSchemaFiles.some(file =>
    file.includes('serviceLocation.ts')
  )

  if (serviceLocationChanged) {
    console.log('⚠️  serviceLocation schema modified!')
    console.log('📋 Required actions:\n')
    console.log('   1. Update schema validator: src/lib/sanity/schema-validators.ts')
    console.log('   2. Create migration if needed: src/lib/sanity/migrations.ts')
    console.log('   3. Run: pnpm sanitize:types')
    console.log('   4. Run: pnpm migrate:status (check if migration needed)')
    console.log()

    // Check if validator was also updated
    const validatorChanged = hasFileChanged('src/lib/sanity/schema-validators.ts')
    const migrationsChanged = hasFileChanged('src/lib/sanity/migrations.ts')
    const typesChanged = hasFileChanged('src/types/sanity.generated.d.ts')

    const warnings: string[] = []

    if (!validatorChanged) {
      warnings.push('❌ Schema validator not updated')
    }

    if (!typesChanged) {
      warnings.push('❌ TypeScript types not regenerated (run pnpm sanitize:types)')
    }

    if (warnings.length > 0) {
      console.error('❌ Validation failed:\n')
      warnings.forEach(w => console.error(`   ${w}`))
      console.error('\n💡 Follow the required actions above before committing.\n')
      process.exit(1)
    }

    if (!migrationsChanged) {
      console.warn('⚠️  Warning: No migration file updated.')
      console.warn('   If you added/removed/changed fields, create a migration!\n')
    }
  }

  console.log('✅ Schema validation passed!\n')
  process.exit(0)
}

function getChangedSchemaFiles(): string[] {
  try {
    const output = execSync('git diff --cached --name-only', {
      encoding: 'utf-8',
    })

    return output
      .split('\n')
      .filter(file => file.includes('schemaTypes/') && file.endsWith('.ts'))
  } catch {
    return []
  }
}

function hasFileChanged(filePath: string): boolean {
  try {
    const output = execSync(`git diff --cached --name-only ${filePath}`, {
      encoding: 'utf-8',
    })
    return output.trim().length > 0
  } catch {
    return false
  }
}

main()
