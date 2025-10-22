/**
 * Redirect Validation Script
 *
 * Validates all redirects in Sanity and reports issues:
 * - Redirect loops
 * - Redirect chains
 * - Invalid patterns
 * - Duplicate rules
 *
 * Usage:
 * pnpm redirects:validate
 */

import { client } from '../src/sanity/client'
import { validateAllRedirects, type RedirectRule } from '../src/lib/redirect-validation'

async function validateRedirects() {
  console.log('Fetching redirects from Sanity...\n')

  const redirects = await client.fetch<RedirectRule[]>(`
    *[_type == "redirect"] {
      _id,
      from,
      to,
      matchType,
      statusCode,
      isActive,
      priority
    }
  `)

  console.log(`Found ${redirects.length} redirects (${redirects.filter((r) => r.isActive).length} active)\n`)

  const results = validateAllRedirects(redirects)

  let errorCount = 0
  let warningCount = 0

  console.log('=== Validation Results ===\n')

  for (const [id, result] of results.entries()) {
    const redirect = redirects.find((r) => r._id === id)
    if (!redirect) continue

    if (result.errors.length > 0) {
      console.log(`❌ ${redirect.from} → ${redirect.to}`)
      result.errors.forEach((error) => console.log(`   Error: ${error}`))
      errorCount++
    }

    if (result.warnings.length > 0) {
      console.log(`⚠️  ${redirect.from} → ${redirect.to}`)
      result.warnings.forEach((warning) => console.log(`   Warning: ${warning}`))
      warningCount++
    }
  }

  console.log('\n=== Summary ===')
  console.log(`Total redirects: ${redirects.length}`)
  console.log(`Active: ${redirects.filter((r) => r.isActive).length}`)
  console.log(`Errors: ${errorCount}`)
  console.log(`Warnings: ${warningCount}`)

  if (errorCount === 0 && warningCount === 0) {
    console.log('\n✅ All redirects are valid!')
  } else if (errorCount > 0) {
    console.log('\n❌ Please fix errors before deploying')
    process.exit(1)
  }
}

validateRedirects().catch(console.error)
