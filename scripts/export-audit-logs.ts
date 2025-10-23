#!/usr/bin/env tsx

/**
 * Export Audit Logs Script
 *
 * Export audit logs for compliance reports and analysis
 *
 * Usage:
 *   pnpm export-audit-logs
 *   pnpm export-audit-logs --start=2025-01-01 --end=2025-12-31
 *   pnpm export-audit-logs --action=published --output=published-logs.json
 *   pnpm export-audit-logs --format=csv
 *   pnpm export-audit-logs --dataset=site-budds
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

// Parse command line arguments
const args = process.argv.slice(2)
const options = {
  startDate: '',
  endDate: '',
  action: '',
  userId: '',
  documentType: '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || '',
  output: '',
  format: 'json' as 'json' | 'csv',
  verbose: false,
}

for (const arg of args) {
  if (arg.startsWith('--start=')) {
    options.startDate = arg.split('=')[1]
  } else if (arg.startsWith('--end=')) {
    options.endDate = arg.split('=')[1]
  } else if (arg.startsWith('--action=')) {
    options.action = arg.split('=')[1]
  } else if (arg.startsWith('--user=')) {
    options.userId = arg.split('=')[1]
  } else if (arg.startsWith('--type=')) {
    options.documentType = arg.split('=')[1]
  } else if (arg.startsWith('--dataset=')) {
    options.dataset = arg.split('=')[1]
  } else if (arg.startsWith('--output=')) {
    options.output = arg.split('=')[1]
  } else if (arg.startsWith('--format=')) {
    const format = arg.split('=')[1]
    if (format === 'json' || format === 'csv') {
      options.format = format
    }
  } else if (arg === '--verbose' || arg === '-v') {
    options.verbose = true
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
 * Build GROQ query based on filters
 */
function buildQuery(): { query: string; params: Record<string, any> } {
  const conditions: string[] = ['_type == "auditLog"']
  const params: Record<string, any> = {}

  if (options.startDate) {
    conditions.push('timestamp >= $startDate')
    params.startDate = new Date(options.startDate).toISOString()
  }

  if (options.endDate) {
    conditions.push('timestamp <= $endDate')
    params.endDate = new Date(options.endDate).toISOString()
  }

  if (options.action) {
    conditions.push('action == $action')
    params.action = options.action
  }

  if (options.userId) {
    conditions.push('userId == $userId')
    params.userId = options.userId
  }

  if (options.documentType) {
    conditions.push('documentType == $documentType')
    params.documentType = options.documentType
  }

  const query = `*[${conditions.join(' && ')}] | order(timestamp desc)`

  return { query, params }
}

/**
 * Convert logs to CSV format
 */
function convertToCSV(logs: any[]): string {
  if (logs.length === 0) {
    return 'No logs to export'
  }

  // CSV Headers
  const headers = [
    'Timestamp',
    'Action',
    'Document ID',
    'Document Type',
    'Document Title',
    'User ID',
    'User Name',
    'User Email',
    'Changes',
    'Notes',
    'IP Address',
    'Dataset',
  ]

  // CSV Rows
  const rows = logs.map((log) => {
    const changes = log.changes
      ? log.changes.map((c: any) => `${c.field}: ${c.oldValue} → ${c.newValue}`).join('; ')
      : ''

    return [
      log.timestamp || '',
      log.action || '',
      log.documentId || '',
      log.documentType || '',
      log.documentTitle || '',
      log.userId || '',
      log.userName || '',
      log.userEmail || '',
      changes,
      log.notes || '',
      log.metadata?.ipAddress || '',
      log.metadata?.dataset || '',
    ].map((field) => `"${String(field).replace(/"/g, '""')}"`)
  })

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
}

/**
 * Generate default output filename
 */
function generateFilename(): string {
  const timestamp = new Date().toISOString().split('T')[0]
  const extension = options.format === 'csv' ? 'csv' : 'json'

  let filename = `audit-logs-${options.dataset}-${timestamp}`

  if (options.action) {
    filename += `-${options.action}`
  }

  return `${filename}.${extension}`
}

/**
 * Main function
 */
async function main() {
  console.log('\n📋 Audit Logs Export\n')
  console.log(`Dataset: ${options.dataset}`)
  console.log(`Format: ${options.format.toUpperCase()}`)

  if (options.startDate) {
    console.log(`Start Date: ${options.startDate}`)
  }

  if (options.endDate) {
    console.log(`End Date: ${options.endDate}`)
  }

  if (options.action) {
    console.log(`Action Filter: ${options.action}`)
  }

  if (options.userId) {
    console.log(`User Filter: ${options.userId}`)
  }

  if (options.documentType) {
    console.log(`Document Type Filter: ${options.documentType}`)
  }

  console.log('')

  // Create Sanity client
  const client = createClient({
    projectId,
    dataset: options.dataset,
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  })

  // Build and execute query
  console.log('📥 Fetching audit logs...\n')

  const { query, params } = buildQuery()

  if (options.verbose) {
    console.log('Query:', query)
    console.log('Params:', params)
    console.log('')
  }

  const logs = await client.fetch<any[]>(query, params)

  console.log(`✅ Found ${logs.length} log entries\n`)

  if (logs.length === 0) {
    console.log('No logs found matching criteria\n')
    return
  }

  // Display summary statistics
  console.log('='.repeat(60))
  console.log('SUMMARY')
  console.log('='.repeat(60))

  const actionCounts: Record<string, number> = {}
  const typeCounts: Record<string, number> = {}
  const userCounts: Record<string, number> = {}

  logs.forEach((log) => {
    // Count by action
    actionCounts[log.action] = (actionCounts[log.action] || 0) + 1

    // Count by document type
    typeCounts[log.documentType] = (typeCounts[log.documentType] || 0) + 1

    // Count by user
    const userName = log.userName || 'Unknown'
    userCounts[userName] = (userCounts[userName] || 0) + 1
  })

  console.log('\nActions:')
  Object.entries(actionCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([action, count]) => {
      console.log(`  ${action}: ${count}`)
    })

  console.log('\nDocument Types:')
  Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`)
    })

  console.log('\nTop Users:')
  Object.entries(userCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([user, count]) => {
      console.log(`  ${user}: ${count}`)
    })

  // Export to file
  const outputPath = options.output || generateFilename()
  const fullPath = path.resolve(process.cwd(), outputPath)

  console.log('\n' + '='.repeat(60))
  console.log('EXPORT')
  console.log('='.repeat(60))

  let content: string

  if (options.format === 'csv') {
    content = convertToCSV(logs)
  } else {
    content = JSON.stringify(logs, null, 2)
  }

  fs.writeFileSync(fullPath, content, 'utf-8')

  console.log(`\n✅ Exported ${logs.length} logs to: ${fullPath}`)
  console.log(`   Size: ${(content.length / 1024).toFixed(2)} KB\n`)

  // Display sample entries if verbose
  if (options.verbose && logs.length > 0) {
    console.log('='.repeat(60))
    console.log('SAMPLE ENTRIES (First 5)')
    console.log('='.repeat(60))

    logs.slice(0, 5).forEach((log, index) => {
      console.log(`\n${index + 1}. ${log.action.toUpperCase()} - ${log.documentTitle || log.documentId}`)
      console.log(`   Type: ${log.documentType}`)
      console.log(`   User: ${log.userName || 'Unknown'}`)
      console.log(`   Time: ${new Date(log.timestamp).toLocaleString()}`)

      if (log.changes && log.changes.length > 0) {
        console.log(`   Changes: ${log.changes.length} field(s)`)
      }

      if (log.notes) {
        console.log(`   Notes: ${log.notes}`)
      }
    })

    console.log('')
  }
}

// Run
main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Export failed:', error)
    process.exit(1)
  })
