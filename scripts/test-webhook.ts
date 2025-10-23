#!/usr/bin/env tsx

/**
 * Test Webhook Script
 *
 * Test webhook delivery and view webhook statistics
 *
 * Usage:
 *   pnpm test-webhook --id=webhook-123
 *   pnpm test-webhook --list
 *   pnpm test-webhook --stats
 *   pnpm test-webhook --logs --webhook=webhook-123 --limit=10
 */

import { createClient } from '@sanity/client'
import { testWebhook } from '../src/sanity/lib/webhook-manager'

// Parse command line arguments
const args = process.argv.slice(2)
const options = {
  webhookId: '',
  list: false,
  stats: false,
  logs: false,
  limit: 20,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || '',
}

for (const arg of args) {
  if (arg.startsWith('--id=')) {
    options.webhookId = arg.split('=')[1]
  } else if (arg === '--list') {
    options.list = true
  } else if (arg === '--stats') {
    options.stats = true
  } else if (arg === '--logs') {
    options.logs = true
  } else if (arg.startsWith('--limit=')) {
    options.limit = parseInt(arg.split('=')[1], 10)
  } else if (arg.startsWith('--dataset=')) {
    options.dataset = arg.split('=')[1]
  } else if (arg.startsWith('--webhook=')) {
    options.webhookId = arg.split('=')[1]
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
 * List all webhooks
 */
async function listWebhooks() {
  console.log('\n📋 Configured Webhooks\n')

  const client = createClient({
    projectId,
    dataset: options.dataset,
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  })

  const webhooks = await client.fetch<any[]>(`
    *[_type == "webhook"] | order(_createdAt desc) {
      _id,
      name,
      url,
      enabled,
      events,
      documentTypes,
      statistics
    }
  `)

  if (webhooks.length === 0) {
    console.log('No webhooks configured\n')
    return
  }

  webhooks.forEach((webhook) => {
    const status = webhook.enabled ? '✅' : '❌'
    const eventCount = webhook.events?.length || 0
    const stats = webhook.statistics || {}
    const total = stats.totalDeliveries || 0
    const success = stats.successfulDeliveries || 0
    const rate = total > 0 ? `${Math.round((success / total) * 100)}%` : 'N/A'

    console.log(`${status} ${webhook.name}`)
    console.log(`   ID: ${webhook._id}`)
    console.log(`   URL: ${webhook.url}`)
    console.log(`   Events: ${eventCount}`)
    console.log(`   Document Types: ${webhook.documentTypes?.join(', ') || 'All'}`)
    console.log(`   Total Deliveries: ${total}`)
    console.log(`   Success Rate: ${rate}`)
    console.log('')
  })
}

/**
 * Show webhook statistics
 */
async function showStatistics() {
  console.log('\n📊 Webhook Statistics\n')

  const client = createClient({
    projectId,
    dataset: options.dataset,
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  })

  const webhooks = await client.fetch<any[]>(`
    *[_type == "webhook"] {
      _id,
      name,
      enabled,
      statistics
    }
  `)

  let totalDeliveries = 0
  let totalSuccess = 0
  let totalFailed = 0

  webhooks.forEach((webhook) => {
    const stats = webhook.statistics || {}
    totalDeliveries += stats.totalDeliveries || 0
    totalSuccess += stats.successfulDeliveries || 0
    totalFailed += stats.failedDeliveries || 0
  })

  const overallRate = totalDeliveries > 0 ? (totalSuccess / totalDeliveries) * 100 : 0

  console.log('='.repeat(60))
  console.log('OVERALL STATISTICS')
  console.log('='.repeat(60))
  console.log(`Total Webhooks: ${webhooks.length}`)
  console.log(`Enabled Webhooks: ${webhooks.filter((w) => w.enabled).length}`)
  console.log(`Total Deliveries: ${totalDeliveries}`)
  console.log(`Successful: ${totalSuccess}`)
  console.log(`Failed: ${totalFailed}`)
  console.log(`Success Rate: ${overallRate.toFixed(2)}%`)
  console.log('')

  console.log('='.repeat(60))
  console.log('PER-WEBHOOK STATISTICS')
  console.log('='.repeat(60))

  webhooks.forEach((webhook) => {
    const stats = webhook.statistics || {}
    const total = stats.totalDeliveries || 0
    const success = stats.successfulDeliveries || 0
    const failed = stats.failedDeliveries || 0
    const rate = total > 0 ? ((success / total) * 100).toFixed(2) : 'N/A'

    console.log(`\n${webhook.name} (${webhook.enabled ? 'Enabled' : 'Disabled'})`)
    console.log(`  Total: ${total} | Success: ${success} | Failed: ${failed} | Rate: ${rate}%`)

    if (stats.lastDeliveryAt) {
      console.log(`  Last Delivery: ${new Date(stats.lastDeliveryAt).toLocaleString()}`)
      console.log(`  Last Status: ${stats.lastDeliveryStatus || 'Unknown'}`)
    }
  })

  console.log('')
}

/**
 * Show webhook logs
 */
async function showLogs() {
  console.log('\n📜 Webhook Delivery Logs\n')

  const client = createClient({
    projectId,
    dataset: options.dataset,
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  })

  let query = `*[_type == "webhookLog"`

  if (options.webhookId) {
    query += ` && webhookId == $webhookId`
  }

  query += `] | order(timestamp desc) [0...${options.limit}] {
    _id,
    webhookName,
    event,
    documentTitle,
    timestamp,
    success,
    statusCode,
    duration,
    attemptNumber,
    error
  }`

  const logs = await client.fetch<any[]>(query, { webhookId: options.webhookId })

  if (logs.length === 0) {
    console.log('No webhook logs found\n')
    return
  }

  logs.forEach((log) => {
    const status = log.success ? '✅' : '❌'
    const date = new Date(log.timestamp).toLocaleString()
    const attempt = log.attemptNumber > 1 ? ` (Attempt ${log.attemptNumber})` : ''

    console.log(`${status} ${log.event}${attempt}`)
    console.log(`   Webhook: ${log.webhookName}`)
    console.log(`   Document: ${log.documentTitle || 'Unknown'}`)
    console.log(`   Time: ${date}`)
    console.log(`   Status Code: ${log.statusCode || 'N/A'}`)
    console.log(`   Duration: ${log.duration}ms`)

    if (log.error) {
      console.log(`   Error: ${log.error}`)
    }

    console.log('')
  })
}

/**
 * Test webhook delivery
 */
async function testWebhookDelivery() {
  if (!options.webhookId) {
    console.error('❌ Error: --id=WEBHOOK_ID is required')
    process.exit(1)
  }

  console.log('\n🧪 Testing Webhook\n')
  console.log(`Webhook ID: ${options.webhookId}\n`)

  const result = await testWebhook(options.webhookId)

  console.log('='.repeat(60))
  console.log('TEST RESULT')
  console.log('='.repeat(60))

  if (result.success) {
    console.log('✅ Webhook delivery successful')
    console.log(`   Status Code: ${result.statusCode}`)
    console.log(`   Duration: ${result.duration}ms`)

    if (result.responseBody) {
      console.log(`\n   Response:`)
      console.log(`   ${result.responseBody}`)
    }
  } else {
    console.log('❌ Webhook delivery failed')

    if (result.statusCode) {
      console.log(`   Status Code: ${result.statusCode}`)
    }

    if (result.error) {
      console.log(`   Error: ${result.error}`)
    }

    console.log(`   Duration: ${result.duration}ms`)
  }

  console.log('')
}

/**
 * Main function
 */
async function main() {
  if (options.list) {
    await listWebhooks()
  } else if (options.stats) {
    await showStatistics()
  } else if (options.logs) {
    await showLogs()
  } else if (options.webhookId) {
    await testWebhookDelivery()
  } else {
    console.log('\n🔗 Webhook Management\n')
    console.log('Usage:')
    console.log('  pnpm test-webhook --id=WEBHOOK_ID       Test webhook delivery')
    console.log('  pnpm test-webhook --list                List all webhooks')
    console.log('  pnpm test-webhook --stats               Show webhook statistics')
    console.log('  pnpm test-webhook --logs                Show recent webhook logs')
    console.log('  pnpm test-webhook --logs --webhook=ID   Show logs for specific webhook')
    console.log('  pnpm test-webhook --logs --limit=50     Show more logs')
    console.log('')
  }
}

// Run
main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Operation failed:', error)
    process.exit(1)
  })
