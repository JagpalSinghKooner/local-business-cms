#!/usr/bin/env tsx

/**
 * Deploy Schema to All Datasets
 *
 * This script deploys the Sanity schema to all datasets in the project.
 * Critical for multi-tenant architecture where:
 * - Schema is SHARED across all sites
 * - Content is ISOLATED per dataset
 *
 * Usage:
 *   pnpm deploy-schema-all
 *   pnpm deploy-schema-all --dry-run
 *   pnpm deploy-schema-all --datasets site-budds,site-hvac
 *
 * Important:
 * - All datasets get the SAME schema definition
 * - Content remains isolated and unchanged
 * - Schema changes are backwards compatible when possible
 */

import { execSync } from 'child_process'
import { createClient } from '@sanity/client'

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
}

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logStep(step: string) {
  log(`\n▶ ${step}`, 'cyan')
}

function logSuccess(message: string) {
  log(`✓ ${message}`, 'green')
}

function logWarning(message: string) {
  log(`⚠ ${message}`, 'yellow')
}

function logError(message: string) {
  log(`✗ ${message}`, 'red')
}

interface DeployOptions {
  dryRun: boolean
  datasets?: string[]
}

async function getAllDatasets(projectId: string, token: string): Promise<string[]> {
  const client = createClient({
    projectId,
    dataset: 'production', // Any dataset works for management API
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  })

  try {
    // Fetch project info to get datasets
    const response = await fetch(
      `https://api.sanity.io/v2021-06-07/projects/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch project info: ${response.statusText}`)
    }

    const project = await response.json()
    const datasets = project.members?.datasets || []

    return datasets.map((ds: any) => ds.name).filter((name: string) => {
      // Only include multi-tenant datasets (site-*) and production
      return name.startsWith('site-') || name === 'production'
    })
  } catch (error) {
    logError(`Failed to fetch datasets: ${error}`)
    throw error
  }
}

async function deploySchemaToDataset(
  projectId: string,
  dataset: string,
  dryRun: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const command = dryRun
      ? `sanity schema extract --enforce-required-fields --path=./schema-${dataset}.json`
      : `sanity deploy`

    const env = {
      ...process.env,
      SANITY_STUDIO_PROJECT_ID: projectId,
      SANITY_STUDIO_DATASET: dataset,
    }

    logStep(`Deploying to dataset: ${dataset}`)

    if (dryRun) {
      log(`  [DRY RUN] Would deploy schema to ${dataset}`, 'yellow')
      return { success: true }
    }

    // Execute sanity deploy command
    execSync(command, {
      stdio: 'inherit',
      env,
      cwd: process.cwd(),
    })

    logSuccess(`Schema deployed to ${dataset}`)
    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logError(`Failed to deploy to ${dataset}: ${errorMessage}`)
    return { success: false, error: errorMessage }
  }
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const datasetsArg = args.find((arg) => arg.startsWith('--datasets='))
  const specificDatasets = datasetsArg?.split('=')[1]?.split(',')

  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'bright')
  log('  Deploy Sanity Schema to All Datasets', 'bright')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'bright')

  // Validate environment
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const token = process.env.SANITY_API_TOKEN

  if (!projectId) {
    logError('NEXT_PUBLIC_SANITY_PROJECT_ID is required')
    process.exit(1)
  }

  if (!token) {
    logError('SANITY_API_TOKEN is required')
    logWarning('Set SANITY_API_TOKEN in your .env file')
    process.exit(1)
  }

  log(`Project ID: ${projectId}`, 'gray')
  if (dryRun) {
    log('Mode: DRY RUN (no actual deployment)', 'yellow')
  }

  // Get all datasets
  logStep('Fetching datasets from Sanity project...')
  let datasets: string[]

  if (specificDatasets) {
    datasets = specificDatasets
    log(`Using specified datasets: ${datasets.join(', ')}`, 'gray')
  } else {
    datasets = await getAllDatasets(projectId, token)
    logSuccess(`Found ${datasets.length} datasets`)
    log(`Datasets: ${datasets.join(', ')}`, 'gray')
  }

  if (datasets.length === 0) {
    logWarning('No datasets found. Nothing to deploy.')
    process.exit(0)
  }

  // Confirm deployment
  if (!dryRun) {
    log('\n⚠️  WARNING: This will deploy the schema to ALL datasets listed above.', 'yellow')
    log('   Content will remain isolated, but schema structure will be updated.\n', 'yellow')

    // In production, you'd want to add a confirmation prompt here
    // For now, proceeding automatically
  }

  // Deploy to each dataset
  const results = {
    successful: [] as string[],
    failed: [] as { dataset: string; error: string }[],
  }

  for (const dataset of datasets) {
    const result = await deploySchemaToDataset(projectId, dataset, dryRun)

    if (result.success) {
      results.successful.push(dataset)
    } else {
      results.failed.push({ dataset, error: result.error || 'Unknown error' })
    }
  }

  // Summary
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'bright')
  log('  Deployment Summary', 'bright')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'bright')

  if (results.successful.length > 0) {
    logSuccess(`Successfully deployed to ${results.successful.length} datasets:`)
    results.successful.forEach((dataset) => {
      log(`  - ${dataset}`, 'green')
    })
  }

  if (results.failed.length > 0) {
    log('')
    logError(`Failed to deploy to ${results.failed.length} datasets:`)
    results.failed.forEach(({ dataset, error }) => {
      log(`  - ${dataset}: ${error}`, 'red')
    })
  }

  log('')

  if (results.failed.length > 0) {
    process.exit(1)
  } else {
    logSuccess('All schema deployments completed successfully! 🎉')
  }
}

main().catch((error) => {
  logError(`Deployment failed: ${error}`)
  process.exit(1)
})
