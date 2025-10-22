/**
 * Bulk Redirect Export
 *
 * Export all redirects from Sanity to CSV file.
 *
 * Usage:
 * pnpm tsx scripts/redirect-bulk-export.ts [output-file.csv]
 */

import { client } from '../src/sanity/client'
import type { RedirectRule } from '../src/lib/redirect-validation'
import * as fs from 'fs'
import * as path from 'path'

async function exportRedirects(outputPath: string) {
  console.log('Fetching redirects from Sanity...')

  const redirects = await client.fetch<
    Array<RedirectRule & { notes?: string; _createdAt?: string; _updatedAt?: string }>
  >(`
    *[_type == "redirect"] | order(priority asc, from asc) {
      _id,
      from,
      to,
      matchType,
      statusCode,
      isActive,
      priority,
      notes,
      _createdAt,
      _updatedAt
    }
  `)

  console.log(`Found ${redirects.length} redirects`)

  // Create CSV content
  const headers = ['from', 'to', 'matchType', 'statusCode', 'isActive', 'priority', 'notes', 'createdAt', 'updatedAt']
  const rows = redirects.map((r) => [
    r.from,
    r.to,
    r.matchType,
    r.statusCode,
    r.isActive ?? true,
    r.priority ?? 100,
    r.notes?.replace(/,/g, ';') ?? '', // Replace commas in notes
    r._createdAt ?? '',
    r._updatedAt ?? '',
  ])

  const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')

  // Write to file
  fs.writeFileSync(outputPath, csv, 'utf-8')
  console.log(`\n✓ Exported ${redirects.length} redirects to: ${outputPath}`)
}

// CLI entrypoint
async function main() {
  const args = process.argv.slice(2)
  const outputPath = path.resolve(process.cwd(), args[0] || 'redirects-export.csv')

  await exportRedirects(outputPath)
}

main().catch(console.error)
