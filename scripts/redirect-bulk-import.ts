/**
 * Bulk Redirect Import
 *
 * Import redirects from CSV file to Sanity.
 *
 * CSV Format:
 * from,to,matchType,statusCode,priority,notes
 * /old-page,/new-page,exact,301,100,Moved page
 * /blog/*,/articles/$1,wildcard,301,100,Blog restructure
 * ^/product/(\d+),/products/$1,regex,301,100,Product URL format change
 *
 * Usage:
 * pnpm tsx scripts/redirect-bulk-import.ts path/to/redirects.csv
 */

import { writeClient } from '../src/sanity/writeClient'
import { validateRedirect, type RedirectRule } from '../src/lib/redirect-validation'
import * as fs from 'fs'
import * as path from 'path'

type ImportRow = {
  from: string
  to: string
  matchType: 'exact' | 'wildcard' | 'regex'
  statusCode: number
  priority?: number
  notes?: string
}

async function parseCSV(filePath: string): Promise<ImportRow[]> {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n').filter((line) => line.trim())

  // Skip header row
  const dataLines = lines.slice(1)

  const rows: ImportRow[] = []

  for (const line of dataLines) {
    // Simple CSV parsing (doesn't handle quotes/commas in fields)
    const [from, to, matchType, statusCode, priority, notes] = line.split(',').map((s) => s.trim())

    if (!from || !to) {
      console.warn(`Skipping invalid row: ${line}`)
      continue
    }

    rows.push({
      from,
      to,
      matchType: (matchType || 'exact') as 'exact' | 'wildcard' | 'regex',
      statusCode: parseInt(statusCode || '301', 10),
      priority: priority ? parseInt(priority, 10) : 100,
      notes,
    })
  }

  return rows
}

async function importRedirects(rows: ImportRow[], dryRun = false) {
  console.log(`Processing ${rows.length} redirects...`)

  if (!writeClient) {
    throw new Error('Write client not configured. Check SANITY_API_WRITE_TOKEN environment variable.')
  }

  // Fetch existing redirects for validation
  const existingRedirects = await writeClient.fetch<RedirectRule[]>(`
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

  let successCount = 0
  let errorCount = 0
  let skipCount = 0

  for (const row of rows) {
    // Check for duplicates
    const duplicate = existingRedirects.find((r) => r.from === row.from && r.matchType === row.matchType)

    if (duplicate) {
      console.warn(`⚠️  Skipping duplicate: ${row.from} (already exists)`)
      skipCount++
      continue
    }

    // Create redirect document
    const redirectDoc: RedirectRule & { _type: string } = {
      _id: `redirect-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      _type: 'redirect',
      from: row.from,
      to: row.to,
      matchType: row.matchType,
      statusCode: row.statusCode,
      isActive: true,
      priority: row.priority ?? 100,
    }

    // Validate before import
    const allRedirects = [...existingRedirects, redirectDoc]
    const validation = validateRedirect(redirectDoc, allRedirects)

    if (!validation.isValid) {
      console.error(`❌ Error validating ${row.from}:`, validation.errors)
      errorCount++
      continue
    }

    if (validation.warnings.length > 0) {
      console.warn(`⚠️  Warnings for ${row.from}:`, validation.warnings)
    }

    if (dryRun) {
      console.log(`✓ Would import: ${row.from} → ${row.to}`)
      successCount++
    } else {
      try {
        await writeClient.create({
          ...redirectDoc,
          notes: row.notes,
        })
        console.log(`✓ Imported: ${row.from} → ${row.to}`)
        successCount++
      } catch (err) {
        console.error(`❌ Failed to import ${row.from}:`, err)
        errorCount++
      }
    }
  }

  console.log('\n--- Import Summary ---')
  console.log(`✓ Success: ${successCount}`)
  console.log(`⚠️  Skipped: ${skipCount}`)
  console.log(`❌ Errors: ${errorCount}`)
  console.log(`Total: ${rows.length}`)
}

// CLI entrypoint
async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.error('Usage: pnpm tsx scripts/redirect-bulk-import.ts <csv-file> [--dry-run]')
    process.exit(1)
  }

  const csvPath = path.resolve(process.cwd(), args[0])
  const dryRun = args.includes('--dry-run')

  if (!fs.existsSync(csvPath)) {
    console.error(`File not found: ${csvPath}`)
    process.exit(1)
  }

  console.log(`Reading redirects from: ${csvPath}`)
  if (dryRun) console.log('--- DRY RUN MODE ---\n')

  const rows = await parseCSV(csvPath)
  await importRedirects(rows, dryRun)
}

main().catch(console.error)
