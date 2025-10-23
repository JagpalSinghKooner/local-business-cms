/**
 * Bulk Redirect Export
 *
 * Export all redirects from Sanity to CSV or JSON file.
 *
 * Usage:
 *   pnpm redirects:export                           # Default: CSV to redirects-export.csv
 *   pnpm redirects:export --format csv              # Export to CSV
 *   pnpm redirects:export --format json             # Export to JSON
 *   pnpm redirects:export --output my-redirects.csv # Custom output file
 */

// Load environment variables
import { readFileSync, writeFileSync } from 'fs'
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

interface RedirectExport {
  _id: string
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
  _createdAt?: string
  _updatedAt?: string
}

function parseArgs() {
  const args = process.argv.slice(2)

  let format = 'csv'
  let output = ''

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--format' && args[i + 1]) {
      format = args[i + 1]
      i++
    } else if (args[i] === '--output' && args[i + 1]) {
      output = args[i + 1]
      i++
    } else if (!args[i].startsWith('--')) {
      output = args[i]
    }
  }

  if (!output) {
    output = `redirects-export.${format}`
  }

  return { format, output }
}

function escapeCSVCell(cell: string): string {
  if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
    return `"${cell.replace(/"/g, '""')}"`
  }
  return cell
}

function convertToCSV(redirects: RedirectExport[]): string {
  const headers = [
    'from',
    'to',
    'matchType',
    'statusCode',
    'isActive',
    'priority',
    'order',
    'caseSensitive',
    'queryStringHandling',
    'notes',
    'createdAt',
    'updatedAt',
  ]

  const rows = redirects.map((r) => [
    r.from,
    r.to,
    r.matchType,
    (r.statusCode || 301).toString(),
    (r.isActive ?? true).toString(),
    (r.priority ?? 0).toString(),
    (r.order ?? 0).toString(),
    (r.caseSensitive ?? false).toString(),
    r.queryStringHandling || 'preserve',
    r.notes || '',
    r._createdAt || '',
    r._updatedAt || '',
  ])

  return [
    headers.join(','),
    ...rows.map((row) => row.map(escapeCSVCell).join(',')),
  ].join('\n')
}

async function exportRedirects() {
  const { format, output } = parseArgs()

  console.log(`📤 Exporting redirects from Sanity...\n`)
  console.log(`   Format: ${format}`)
  console.log(`   Output: ${output}\n`)

  try {
    const redirects = await client.fetch<RedirectExport[]>(`
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
        queryStringHandling,
        notes,
        _createdAt,
        _updatedAt
      }
    `)

    console.log(`   Found ${redirects.length} redirect(s)\n`)

    if (redirects.length === 0) {
      console.log('⚠️  No redirects to export')
      return
    }

    let content: string
    if (format === 'json') {
      content = JSON.stringify(redirects, null, 2)
    } else {
      content = convertToCSV(redirects)
    }

    const outputPath = join(process.cwd(), output)
    writeFileSync(outputPath, content, 'utf-8')

    console.log(`✅ Successfully exported ${redirects.length} redirects to ${output}\n`)

    console.log('📋 Sample (first 3 redirects):')
    console.log('='.repeat(80))
    redirects.slice(0, 3).forEach((r) => {
      const activeStatus = r.isActive ? '🟢' : '⚫'
      console.log(
        `${activeStatus} ${r.from} → ${r.to} (${r.matchType}, ${r.statusCode}, P${r.priority ?? 0})`
      )
    })
    console.log('='.repeat(80))
  } catch (error) {
    console.error('\n❌ Error exporting redirects:', error)
    process.exit(1)
  }
}

exportRedirects()
