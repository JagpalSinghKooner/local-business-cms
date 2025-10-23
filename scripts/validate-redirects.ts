/**
 * Bulk Redirect Validation Script
 *
 * Validates all redirect documents in Sanity and reports:
 * - Errors (blocking issues that prevent redirects from working)
 * - Warnings (potential issues that may cause unexpected behavior)
 *
 * Usage:
 *   pnpm redirects:validate
 */

// Load environment variables from .env.local
import { readFileSync } from 'fs'
import { join } from 'path'

try {
  const envPath = join(process.cwd(), '.env.local')
  const envFile = readFileSync(envPath, 'utf-8')
  envFile.split('\n').forEach((line) => {
    const match = line.match(/^([^=:#]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim()
      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  })
} catch {
  console.warn('⚠️  Could not load .env.local file')
}

import { client } from '../src/sanity/client'
import { validateAllRedirects, type RedirectRule } from '../src/lib/redirect-validation'

async function validateRedirects() {
  console.log('🔍 Fetching all redirects from Sanity...\n')

  try {
    // Fetch all redirects (active and inactive)
    const redirects = await client.fetch<RedirectRule[]>(`
      *[_type == "redirect"] | order(priority desc, order asc) {
        _id,
        from,
        to,
        matchType,
        statusCode,
        isActive,
        priority,
        order,
        caseSensitive,
        queryStringHandling
      }
    `)

    console.log(`Found ${redirects.length} redirect(s)\n`)

    if (redirects.length === 0) {
      console.log('✅ No redirects to validate')
      return
    }

    // Validate all redirects
    const results = validateAllRedirects(redirects)

    // Count issues
    let totalErrors = 0
    let totalWarnings = 0
    let validCount = 0

    // Report results
    console.log('📋 Validation Results:\n')
    console.log('='.repeat(80))

    for (const redirect of redirects) {
      const result = results.get(redirect._id)

      if (!result) continue

      const status = result.isValid ? '✅' : '❌'
      const activeStatus = redirect.isActive ? '🟢 Active' : '⚫ Inactive'

      console.log(
        `\n${status} ${redirect.from} → ${redirect.to} (${redirect.matchType}) [${activeStatus}]`
      )
      console.log(`   ID: ${redirect._id}`)
      console.log(`   Priority: ${redirect.priority ?? 0} | Order: ${redirect.order ?? 0}`)

      if (result.errors.length > 0) {
        console.log(`   ❌ ERRORS (${result.errors.length}):`)
        result.errors.forEach((error) => {
          console.log(`      - ${error}`)
        })
        totalErrors += result.errors.length
      }

      if (result.warnings.length > 0) {
        console.log(`   ⚠️  WARNINGS (${result.warnings.length}):`)
        result.warnings.forEach((warning) => {
          console.log(`      - ${warning}`)
        })
        totalWarnings += result.warnings.length
      }

      if (result.isValid && result.warnings.length === 0) {
        console.log('   ✅ Valid - no issues found')
        validCount++
      }
    }

    console.log('\n' + '='.repeat(80))
    console.log('\n📊 Summary:')
    console.log(`   Total redirects: ${redirects.length}`)
    console.log(`   Valid (no issues): ${validCount}`)
    console.log(`   With warnings: ${results.size - validCount - (totalErrors > 0 ? 1 : 0)}`)
    console.log(`   With errors: ${totalErrors > 0 ? 1 : 0}`)
    console.log(`   Total errors: ${totalErrors}`)
    console.log(`   Total warnings: ${totalWarnings}`)

    // Exit with error code if there are blocking errors
    if (totalErrors > 0) {
      console.log('\n❌ Validation failed - please fix errors before deploying')
      process.exit(1)
    } else if (totalWarnings > 0) {
      console.log('\n⚠️  Validation passed with warnings - review warnings before deploying')
      process.exit(0)
    } else {
      console.log('\n✅ All redirects are valid!')
      process.exit(0)
    }
  } catch (error) {
    console.error('❌ Error validating redirects:', error)
    process.exit(1)
  }
}

// Run the script
validateRedirects()
