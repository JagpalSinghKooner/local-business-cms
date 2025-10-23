/**
 * Bulk Redirect Import
 *
 * Import redirects from CSV or JSON file to Sanity.
 *
 * CSV Format:
 * from,to,matchType,statusCode,isActive,priority,order,caseSensitive,queryStringHandling,notes
 * /old-page,/new-page,exact,301,true,0,0,false,preserve,Moved page
 * /blog/*,/articles/$1,wildcard,301,true,5,0,false,preserve,Blog restructure
 * ^/product/(\d+),/products/$1,regex,301,true,10,0,false,preserve,Product URL format change
 *
 * Usage:
 *   pnpm redirects:import redirects.csv              # Import from CSV
 *   pnpm redirects:import redirects.json             # Import from JSON
 *   pnpm redirects:import redirects.csv --dry-run    # Preview without saving
 *   pnpm redirects:import redirects.csv --update     # Update existing redirects
 */

// Load environment variables
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

import { writeClient } from '../src/sanity/writeClient'
import { validateRedirect, type RedirectRule } from '../src/lib/redirect-validation'
import { existsSync } from 'fs'

type ImportRow = {
  from: string
  to: string
  matchType: 'exact' | 'wildcard' | 'regex'
  statusCode: number
  isActive?: boolean
  priority?: number
  order?: number
  caseSensitive?: boolean
  queryStringHandling?: 'preserve' | 'remove' | 'ignore'
  notes?: string
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

async function parseFile(filePath: string): Promise<ImportRow[]> {
  const content = readFileSync(filePath, 'utf-8')
  const ext = filePath.toLowerCase().endsWith('.json') ? 'json' : 'csv'

  if (ext === 'json') {
    return JSON.parse(content) as ImportRow[]
  }

  // Parse CSV
  const lines = content.split('\n').filter((line) => line.trim())
  const dataLines = lines.slice(1) // Skip header

  const rows: ImportRow[] = []

  for (const line of dataLines) {
    const cells = parseCSVLine(line)
    const [from, to, matchType, statusCode, isActive, priority, order, caseSensitive, queryStringHandling, notes] = cells

    if (!from || !to) {
      console.warn(`⚠️  Skipping invalid row: ${line}`)
      continue
    }

    rows.push({
      from,
      to,
      matchType: (matchType || 'exact') as 'exact' | 'wildcard' | 'regex',
      statusCode: parseInt(statusCode || '301', 10),
      isActive: isActive === 'false' ? false : true,
      priority: priority ? parseInt(priority, 10) : 0,
      order: order ? parseInt(order, 10) : 0,
      caseSensitive: caseSensitive === 'true',
      queryStringHandling: (queryStringHandling || 'preserve') as 'preserve' | 'remove' | 'ignore',
      notes: notes || '',
    })
  }

  return rows
}

async function importRedirects(rows: ImportRow[], dryRun = false, allowUpdate = false) {
  console.log(`\n📥 Processing ${rows.length} redirect(s)...\n`)

  if (!writeClient) {
    throw new Error('Write client not configured. Check SANITY_API_WRITE_TOKEN environment variable.')
  }

  // Fetch existing redirects for validation
  const existingRedirects = await writeClient.fetch<(RedirectRule & { _id: string })[]>(`
    *[_type == "redirect"] {
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

  let successCount = 0
  let errorCount = 0
  let skipCount = 0
  let updateCount = 0

  for (const row of rows) {
    // Check for duplicates
    const duplicate = existingRedirects.find((r) => r.from === row.from && r.matchType === row.matchType)

    if (duplicate && !allowUpdate) {
      console.warn(`⚠️  Skipping duplicate: ${row.from} (already exists, use --update to modify)`)
      skipCount++
      continue
    }

    // Create/update redirect document
    const redirectDoc: Partial<RedirectRule> & { _type?: string; notes?: string } = {
      _type: 'redirect',
      from: row.from,
      to: row.to,
      matchType: row.matchType,
      statusCode: row.statusCode,
      isActive: row.isActive ?? true,
      priority: row.priority ?? 0,
      order: row.order ?? 0,
      caseSensitive: row.caseSensitive ?? false,
      queryStringHandling: row.queryStringHandling ?? 'preserve',
      notes: row.notes,
    }

    // Create a full redirect for validation
    const redirectForValidation: RedirectRule = {
      _id: duplicate?._id || 'temp',
      from: row.from,
      to: row.to,
      matchType: row.matchType,
      statusCode: row.statusCode,
      isActive: row.isActive ?? true,
      priority: row.priority ?? 0,
      order: row.order ?? 0,
      caseSensitive: row.caseSensitive ?? false,
      queryStringHandling: row.queryStringHandling ?? 'preserve',
    }

    // Validate before import
    const allRedirects = duplicate
      ? existingRedirects.map((r) => (r._id === duplicate._id ? redirectForValidation : r))
      : [...existingRedirects, redirectForValidation]

    const validation = validateRedirect(redirectForValidation, allRedirects)

    if (!validation.isValid) {
      console.error(`❌ Error validating ${row.from}:`)
      validation.errors.forEach((err) => console.error(`   - ${err}`))
      errorCount++
      continue
    }

    if (validation.warnings.length > 0) {
      console.warn(`⚠️  Warnings for ${row.from}:`)
      validation.warnings.forEach((warn) => console.warn(`   - ${warn}`))
    }

    const action = duplicate ? 'update' : 'import'
    const actionPast = duplicate ? 'updated' : 'imported'

    if (dryRun) {
      console.log(`✓ Would ${action}: ${row.from} → ${row.to} (P${row.priority ?? 0})`)
      successCount++
      if (duplicate) updateCount++
    } else {
      try {
        if (duplicate) {
          await writeClient.patch(duplicate._id).set(redirectDoc).commit()
          console.log(`✓ Updated: ${row.from} → ${row.to} (P${row.priority ?? 0})`)
          updateCount++
        } else {
          await writeClient.create({
            _type: 'redirect',
            ...redirectDoc,
          })
          console.log(`✓ Imported: ${row.from} → ${row.to} (P${row.priority ?? 0})`)
        }
        successCount++
      } catch (err) {
        console.error(`❌ Failed to ${action} ${row.from}:`, err)
        errorCount++
      }
    }
  }

  console.log('\n' + '='.repeat(80))
  console.log('\n📊 Import Summary:')
  console.log(`   Total processed: ${rows.length}`)
  console.log(`   ✅ Success: ${successCount} (${updateCount} updated, ${successCount - updateCount} new)`)
  console.log(`   ⚠️  Skipped: ${skipCount}`)
  console.log(`   ❌ Errors: ${errorCount}`)
  console.log('\n' + '='.repeat(80))

  if (errorCount > 0) {
    process.exit(1)
  }
}

// CLI entrypoint
async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0 || args.includes('--help')) {
    console.log(`
Bulk Redirect Import

Usage:
  pnpm redirects:import <file> [options]

Arguments:
  <file>         Path to CSV or JSON file to import

Options:
  --dry-run      Preview import without saving to Sanity
  --update       Update existing redirects (default: skip duplicates)
  --help         Show this help message

Examples:
  pnpm redirects:import redirects.csv
  pnpm redirects:import redirects.json --dry-run
  pnpm redirects:import redirects.csv --update
    `)
    process.exit(0)
  }

  const filePath = join(process.cwd(), args[0])
  const dryRun = args.includes('--dry-run')
  const allowUpdate = args.includes('--update')

  if (!existsSync(filePath)) {
    console.error(`\n❌ File not found: ${filePath}\n`)
    process.exit(1)
  }

  console.log(`\n📂 Reading redirects from: ${filePath}`)
  if (dryRun) console.log('🔍 DRY RUN MODE - No changes will be made\n')
  if (allowUpdate) console.log('🔄 UPDATE MODE - Existing redirects will be updated\n')

  try {
    const rows = await parseFile(filePath)
    await importRedirects(rows, dryRun, allowUpdate)
  } catch (error) {
    console.error('\n❌ Import failed:', error)
    process.exit(1)
  }
}

main()
