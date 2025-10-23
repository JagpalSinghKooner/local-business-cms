#!/usr/bin/env tsx

/**
 * Smoke Test Runner
 *
 * Runs smoke tests against any deployed site to verify functionality
 *
 * Usage:
 *   pnpm test:smoke --url=https://buddsplumbing.com
 *   pnpm test:smoke --url=https://buddsplumbing.com --dataset=site-budds
 *   pnpm test:smoke:all  # Test all configured sites
 */

import { spawn } from 'child_process'
import { readFileSync } from 'fs'
import { join } from 'path'

// Parse command line arguments
const args = process.argv.slice(2)
const options = {
  url: '',
  dataset: '',
  all: false,
  headed: false,
  verbose: false,
}

for (const arg of args) {
  if (arg.startsWith('--url=')) {
    options.url = arg.split('=')[1]
  } else if (arg.startsWith('--dataset=')) {
    options.dataset = arg.split('=')[1]
  } else if (arg === '--all') {
    options.all = true
  } else if (arg === '--headed') {
    options.headed = true
  } else if (arg === '--verbose' || arg === '-v') {
    options.verbose = true
  }
}

/**
 * Site configuration for multi-site testing
 */
interface SiteConfig {
  name: string
  url: string
  dataset: string
}

/**
 * Load site configurations (you can customize this)
 */
function loadSiteConfigs(): SiteConfig[] {
  // This could be loaded from a JSON file, environment variables, or database
  // For now, return example configuration
  const configs: SiteConfig[] = []

  // Try to load from environment or use defaults
  const sites = [
    {
      name: 'Production',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001',
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    },
  ]

  // You can add more sites here:
  // sites.push({ name: 'Site 2', url: 'https://site2.com', dataset: 'site-2' })

  return sites
}

/**
 * Run Playwright tests with specific base URL
 */
function runTests(url: string, dataset: string, siteName: string): Promise<number> {
  return new Promise((resolve) => {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`🧪 Running smoke tests for: ${siteName}`)
    console.log(`   URL: ${url}`)
    console.log(`   Dataset: ${dataset}`)
    console.log('='.repeat(60) + '\n')

    const playwrightArgs = [
      'playwright',
      'test',
      'tests/smoke/',
      '--config=playwright.config.ts',
    ]

    // Add headed mode if requested
    if (options.headed) {
      playwrightArgs.push('--headed')
    }

    // Add reporter
    playwrightArgs.push('--reporter=list')

    const env = {
      ...process.env,
      BASE_URL: url,
      NEXT_PUBLIC_SANITY_DATASET: dataset,
    }

    const proc = spawn('pnpm', playwrightArgs, {
      stdio: 'inherit',
      env,
      shell: true,
    })

    proc.on('close', (code) => {
      resolve(code || 0)
    })

    proc.on('error', (error) => {
      console.error(`❌ Error running tests: ${error.message}`)
      resolve(1)
    })
  })
}

/**
 * Main function
 */
async function main() {
  console.log('\n🚀 Smoke Test Runner\n')

  let sitesToTest: SiteConfig[] = []

  if (options.all) {
    // Test all configured sites
    sitesToTest = loadSiteConfigs()
    console.log(`📋 Testing ${sitesToTest.length} site(s)\n`)
  } else if (options.url) {
    // Test single URL
    sitesToTest = [
      {
        name: 'Custom Site',
        url: options.url,
        dataset: options.dataset || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      },
    ]
  } else {
    // Test default site (localhost or production)
    console.error('❌ Error: --url or --all is required')
    console.log('\nUsage:')
    console.log('  pnpm test:smoke --url=https://example.com')
    console.log('  pnpm test:smoke --url=https://example.com --dataset=site-name')
    console.log('  pnpm test:smoke:all')
    console.log('\nOptions:')
    console.log('  --url=URL        Site URL to test')
    console.log('  --dataset=NAME   Dataset name (optional)')
    console.log('  --all            Test all configured sites')
    console.log('  --headed         Run tests in headed mode (visible browser)')
    console.log('  --verbose, -v    Show detailed output')
    process.exit(1)
  }

  const results: Array<{ site: string; passed: boolean; exitCode: number }> = []

  // Run tests for each site
  for (const site of sitesToTest) {
    const exitCode = await runTests(site.url, site.dataset, site.name)

    results.push({
      site: site.name,
      passed: exitCode === 0,
      exitCode,
    })

    // Small delay between sites
    if (sitesToTest.length > 1) {
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 Smoke Test Summary')
  console.log('='.repeat(60) + '\n')

  let allPassed = true

  for (const result of results) {
    const status = result.passed ? '✅ PASSED' : '❌ FAILED'
    console.log(`${status}  ${result.site}`)

    if (!result.passed) {
      allPassed = false
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log(`Total Sites: ${results.length}`)
  console.log(`Passed: ${results.filter((r) => r.passed).length}`)
  console.log(`Failed: ${results.filter((r) => !r.passed).length}`)
  console.log('='.repeat(60) + '\n')

  if (allPassed) {
    console.log('✅ All smoke tests passed!\n')
    process.exit(0)
  } else {
    console.log('❌ Some smoke tests failed. Check the output above for details.\n')
    process.exit(1)
  }
}

// Run main function
main().catch((error) => {
  console.error('❌ Smoke test runner failed:', error)
  process.exit(1)
})
