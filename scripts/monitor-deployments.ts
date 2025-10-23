#!/usr/bin/env tsx

/**
 * Deployment Monitoring Script
 *
 * Monitor all deployed sites for health, performance, and errors
 *
 * Usage:
 *   pnpm monitor --all
 *   pnpm monitor --site=budds
 *   pnpm monitor --continuous --interval=60
 *   pnpm monitor --output=report.json
 */

import { execSync } from 'child_process'

// Parse command line arguments
const args = process.argv.slice(2)
const options = {
  all: false,
  site: '',
  continuous: false,
  interval: 60, // seconds
  output: '',
  verbose: false,
}

for (const arg of args) {
  if (arg === '--all') {
    options.all = true
  } else if (arg.startsWith('--site=')) {
    options.site = arg.split('=')[1]
  } else if (arg === '--continuous') {
    options.continuous = true
  } else if (arg.startsWith('--interval=')) {
    options.interval = parseInt(arg.split('=')[1])
  } else if (arg.startsWith('--output=')) {
    options.output = arg.split('=')[1]
  } else if (arg === '--verbose' || arg === '-v') {
    options.verbose = true
  }
}

// Site configurations
interface SiteConfig {
  id: string
  name: string
  url: string
  dataset: string
}

const SITES: SiteConfig[] = [
  {
    id: 'budds',
    name: 'Budds Plumbing',
    url: 'https://buddsplumbing.com',
    dataset: 'site-budds',
  },
  {
    id: 'hvac',
    name: 'ACME HVAC',
    url: 'https://acme-hvac.com',
    dataset: 'site-hvac',
  },
  // Add more sites as needed
]

interface HealthCheckResult {
  site: string
  url: string
  status: 'healthy' | 'degraded' | 'down' | 'unknown'
  responseTime: number
  statusCode: number | null
  timestamp: string
  errors: string[]
  checks: {
    reachable: boolean
    ssl: boolean
    fastResponse: boolean
    validHtml: boolean
  }
}

interface MonitoringReport {
  timestamp: string
  totalSites: number
  healthySites: number
  degradedSites: number
  downSites: number
  sites: HealthCheckResult[]
}

/**
 * Perform health check on a site
 */
async function checkSiteHealth(site: SiteConfig): Promise<HealthCheckResult> {
  const result: HealthCheckResult = {
    site: site.name,
    url: site.url,
    status: 'unknown',
    responseTime: 0,
    statusCode: null,
    timestamp: new Date().toISOString(),
    errors: [],
    checks: {
      reachable: false,
      ssl: false,
      fastResponse: false,
      validHtml: false,
    },
  }

  try {
    // Check if site is reachable
    const startTime = Date.now()

    const curlCommand = `curl -s -o /dev/null -w "%{http_code}|%{time_total}" --max-time 10 "${site.url}"`

    const output = execSync(curlCommand, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim()

    const [statusCode, totalTime] = output.split('|')
    const responseTime = Math.round(parseFloat(totalTime) * 1000)

    result.statusCode = parseInt(statusCode)
    result.responseTime = responseTime

    // Check: Reachable
    result.checks.reachable = result.statusCode >= 200 && result.statusCode < 500

    // Check: SSL (HTTPS)
    result.checks.ssl = site.url.startsWith('https://')

    // Check: Fast response (< 2 seconds)
    result.checks.fastResponse = responseTime < 2000

    // Check: Valid HTML (status 200)
    result.checks.validHtml = result.statusCode === 200

    // Determine overall status
    if (!result.checks.reachable) {
      result.status = 'down'
      result.errors.push('Site is not reachable')
    } else if (result.statusCode !== 200) {
      result.status = 'degraded'
      result.errors.push(`HTTP status ${result.statusCode}`)
    } else if (!result.checks.fastResponse) {
      result.status = 'degraded'
      result.errors.push(`Slow response: ${responseTime}ms`)
    } else {
      result.status = 'healthy'
    }

    // Additional checks
    if (!result.checks.ssl) {
      result.errors.push('SSL not enabled')
    }
  } catch (error: any) {
    result.status = 'down'
    result.errors.push(error.message || 'Connection failed')
  }

  return result
}

/**
 * Monitor all sites
 */
async function monitorAllSites(): Promise<MonitoringReport> {
  console.log('🔍 Checking site health...\n')

  const sitesToCheck = options.all
    ? SITES
    : options.site
      ? SITES.filter((s) => s.id === options.site)
      : SITES

  if (sitesToCheck.length === 0) {
    console.error('❌ No sites to monitor')
    process.exit(1)
  }

  const results = await Promise.all(sitesToCheck.map((site) => checkSiteHealth(site)))

  const report: MonitoringReport = {
    timestamp: new Date().toISOString(),
    totalSites: results.length,
    healthySites: results.filter((r) => r.status === 'healthy').length,
    degradedSites: results.filter((r) => r.status === 'degraded').length,
    downSites: results.filter((r) => r.status === 'down').length,
    sites: results,
  }

  return report
}

/**
 * Display monitoring report
 */
function displayReport(report: MonitoringReport): void {
  console.log('='.repeat(80))
  console.log('DEPLOYMENT MONITORING REPORT')
  console.log('='.repeat(80))
  console.log(`Generated: ${new Date(report.timestamp).toLocaleString()}`)
  console.log('')

  // Summary
  console.log('📊 Summary:')
  console.log(`   Total Sites: ${report.totalSites}`)
  console.log(`   ✅ Healthy: ${report.healthySites}`)
  console.log(`   ⚠️  Degraded: ${report.degradedSites}`)
  console.log(`   ❌ Down: ${report.downSites}`)
  console.log('')

  // Site details
  console.log('🌐 Site Status:')
  console.log('')

  for (const site of report.sites) {
    const statusIcon =
      site.status === 'healthy' ? '✅' : site.status === 'degraded' ? '⚠️ ' : '❌'
    const statusColor =
      site.status === 'healthy' ? 'HEALTHY' : site.status === 'degraded' ? 'DEGRADED' : 'DOWN'

    console.log(`${statusIcon} ${site.site}`)
    console.log(`   URL: ${site.url}`)
    console.log(`   Status: ${statusColor}`)

    if (site.statusCode !== null) {
      console.log(`   HTTP Code: ${site.statusCode}`)
    }

    if (site.responseTime > 0) {
      console.log(`   Response Time: ${site.responseTime}ms`)
    }

    // Checks
    if (options.verbose) {
      console.log(`   Checks:`)
      console.log(`     - Reachable: ${site.checks.reachable ? '✅' : '❌'}`)
      console.log(`     - SSL Enabled: ${site.checks.ssl ? '✅' : '❌'}`)
      console.log(`     - Fast Response: ${site.checks.fastResponse ? '✅' : '❌'}`)
      console.log(`     - Valid HTML: ${site.checks.validHtml ? '✅' : '❌'}`)
    }

    // Errors
    if (site.errors.length > 0) {
      console.log(`   Issues:`)
      for (const error of site.errors) {
        console.log(`     - ${error}`)
      }
    }

    console.log('')
  }

  console.log('='.repeat(80))

  // Overall status
  if (report.downSites > 0) {
    console.log(`\n🚨 ALERT: ${report.downSites} site(s) are down!\n`)
  } else if (report.degradedSites > 0) {
    console.log(`\n⚠️  WARNING: ${report.degradedSites} site(s) degraded\n`)
  } else {
    console.log('\n✅ All sites healthy\n')
  }
}

/**
 * Save report to file
 */
function saveReport(report: MonitoringReport): void {
  if (!options.output) return

  const fs = require('fs')
  fs.writeFileSync(options.output, JSON.stringify(report, null, 2), 'utf-8')
  console.log(`📝 Report saved to: ${options.output}\n`)
}

/**
 * Continuous monitoring mode
 */
async function continuousMonitoring(): Promise<void> {
  console.log('🔄 Continuous monitoring mode (press Ctrl+C to stop)\n')
  console.log(`Checking every ${options.interval} seconds...\n`)

  while (true) {
    const report = await monitorAllSites()
    displayReport(report)

    if (options.output) {
      saveReport(report)
    }

    // Wait for next check
    await new Promise((resolve) => setTimeout(resolve, options.interval * 1000))
  }
}

/**
 * Main function
 */
async function main() {
  console.log('\n🖥️  Deployment Monitoring Dashboard\n')

  if (options.continuous) {
    await continuousMonitoring()
  } else {
    const report = await monitorAllSites()
    displayReport(report)

    if (options.output) {
      saveReport(report)
    }

    // Exit code based on status
    if (report.downSites > 0) {
      process.exit(1) // Critical: sites are down
    } else if (report.degradedSites > 0) {
      process.exit(0) // Warning but not failing
    } else {
      process.exit(0) // All healthy
    }
  }
}

// Run
main().catch((error) => {
  console.error('\n❌ Monitoring failed:', error)
  process.exit(1)
})
