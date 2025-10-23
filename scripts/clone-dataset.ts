#!/usr/bin/env tsx

/**
 * Dataset Cloning Utility
 *
 * Clones a Sanity dataset to create a new site quickly.
 * Uses Sanity CLI export/import under the hood.
 *
 * Usage:
 *   pnpm clone-site <source-dataset> <target-dataset> [--skip-assets]
 *
 * Examples:
 *   pnpm clone-site site-budds site-hvac
 *   pnpm clone-site production site-new-site --skip-assets
 *
 * Prerequisites:
 *   - Sanity CLI installed (@sanity/cli)
 *   - Authenticated with `sanity login`
 *   - SANITY_API_TOKEN with dataset.create permission
 */

import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

interface CloneOptions {
  sourceDataset: string
  targetDataset: string
  skipAssets?: boolean
  projectId?: string
}

const TEMP_DIR = path.join(process.cwd(), '.tmp-dataset-clone')

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
}

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function error(message: string) {
  console.error(`${colors.red}❌ ${message}${colors.reset}`)
}

function success(message: string) {
  log(`✅ ${message}`, 'green')
}

function info(message: string) {
  log(`ℹ️  ${message}`, 'blue')
}

function warning(message: string) {
  log(`⚠️  ${message}`, 'yellow')
}

/**
 * Execute shell command with error handling
 */
function execCommand(command: string, description: string): void {
  try {
    info(`${description}...`)
    execSync(command, { stdio: 'inherit', cwd: process.cwd() })
  } catch (err) {
    error(`Failed: ${description}`)
    throw err
  }
}

/**
 * Check if dataset exists
 */
function datasetExists(projectId: string, dataset: string): boolean {
  try {
    execSync(
      `npx sanity dataset list --project ${projectId} | grep -w "${dataset}"`,
      { stdio: 'pipe' }
    )
    return true
  } catch {
    return false
  }
}

/**
 * Create new dataset
 */
function createDataset(projectId: string, dataset: string): void {
  try {
    info(`Creating dataset "${dataset}"...`)
    execSync(`npx sanity dataset create ${dataset} --project ${projectId}`, {
      stdio: 'inherit',
    })
    success(`Dataset "${dataset}" created`)
  } catch (err) {
    error(`Failed to create dataset "${dataset}"`)
    throw err
  }
}

/**
 * Export dataset to file
 */
function exportDataset(
  projectId: string,
  dataset: string,
  exportPath: string,
  skipAssets: boolean
): void {
  const assetsFlag = skipAssets ? '--no-assets' : '--assets'

  execCommand(
    `npx sanity dataset export ${dataset} ${exportPath} --project ${projectId} ${assetsFlag}`,
    `Exporting "${dataset}"`
  )
}

/**
 * Import dataset from file
 */
function importDataset(
  projectId: string,
  dataset: string,
  importPath: string,
  skipAssets: boolean
): void {
  const assetsFlag = skipAssets ? '--skip-assets' : ''

  execCommand(
    `npx sanity dataset import ${importPath} ${dataset} --project ${projectId} --replace ${assetsFlag}`,
    `Importing to "${dataset}"`
  )
}

/**
 * Update siteConfig document with new site info
 */
async function updateSiteConfig(projectId: string, dataset: string, siteId: string): Promise<void> {
  info(`Updating siteConfig for new site...`)

  const updateScript = `
    const sanityClient = require('@sanity/client').createClient({
      projectId: '${projectId}',
      dataset: '${dataset}',
      apiVersion: '2025-10-16',
      token: process.env.SANITY_API_TOKEN,
      useCdn: false,
    })

    async function updateConfig() {
      // Find siteConfig document
      const configs = await sanityClient.fetch('*[_type == "siteConfig"][0]')

      if (!configs) {
        console.log('⚠️  No siteConfig found - please create one manually')
        return
      }

      // Update with new site info
      await sanityClient
        .patch(configs._id)
        .set({
          siteId: { _type: 'slug', current: '${siteId}' },
          datasetName: '${dataset}',
          status: 'development',
          deployedAt: new Date().toISOString(),
        })
        .commit()

      console.log('✅ Updated siteConfig')
    }

    updateConfig().catch(console.error)
  `

  try {
    execSync(`node -e "${updateScript.replace(/"/g, '\\"')}"`, { stdio: 'inherit' })
  } catch (err) {
    warning('Could not auto-update siteConfig. Please update manually in Studio.')
  }
}

/**
 * Clean up temporary files
 */
function cleanup(): void {
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true })
  }
}

/**
 * Clone dataset
 */
async function cloneDataset(options: CloneOptions): Promise<void> {
  const {
    sourceDataset,
    targetDataset,
    skipAssets = false,
    projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  } = options

  if (!projectId) {
    error('NEXT_PUBLIC_SANITY_PROJECT_ID not found in environment')
    process.exit(1)
  }

  if (!process.env.SANITY_API_TOKEN) {
    error('SANITY_API_TOKEN not found in environment')
    info('Set SANITY_API_TOKEN with dataset.create permission')
    process.exit(1)
  }

  log('\n🌐 Sanity Dataset Cloning Utility\n', 'cyan')

  info(`Project ID: ${projectId}`)
  info(`Source Dataset: ${sourceDataset}`)
  info(`Target Dataset: ${targetDataset}`)
  info(`Skip Assets: ${skipAssets}\n`)

  // Validate source dataset exists
  if (!datasetExists(projectId, sourceDataset)) {
    error(`Source dataset "${sourceDataset}" does not exist`)
    process.exit(1)
  }

  // Check if target dataset already exists
  if (datasetExists(projectId, targetDataset)) {
    warning(`Target dataset "${targetDataset}" already exists!`)
    warning('This will REPLACE all data in the target dataset.')

    // In production, add confirmation prompt here
    // For now, we'll just warn
  }

  try {
    // Create temp directory
    if (!fs.existsSync(TEMP_DIR)) {
      fs.mkdirSync(TEMP_DIR, { recursive: true })
    }

    const exportPath = path.join(TEMP_DIR, `${sourceDataset}-export.tar.gz`)

    // Step 1: Export source dataset
    log('\n📦 Step 1: Exporting source dataset\n', 'cyan')
    exportDataset(projectId, sourceDataset, exportPath, skipAssets)

    // Step 2: Create target dataset if doesn't exist
    log('\n🏗️  Step 2: Creating target dataset\n', 'cyan')
    if (!datasetExists(projectId, targetDataset)) {
      createDataset(projectId, targetDataset)
    }

    // Step 3: Import to target dataset
    log('\n📥 Step 3: Importing to target dataset\n', 'cyan')
    importDataset(projectId, targetDataset, exportPath, skipAssets)

    // Step 4: Update siteConfig
    log('\n⚙️  Step 4: Updating site configuration\n', 'cyan')
    const newSiteId = targetDataset.replace(/^site-/, '')
    await updateSiteConfig(projectId, targetDataset, newSiteId)

    // Cleanup
    cleanup()

    // Success!
    log('\n' + '='.repeat(60), 'green')
    success('Dataset cloned successfully!')
    log('='.repeat(60) + '\n', 'green')

    log('📋 Next steps:', 'cyan')
    log('1. Update siteConfig in Sanity Studio:')
    log(`   - Site ID: ${newSiteId}`)
    log(`   - Dataset: ${targetDataset}`)
    log(`   - Deployment URL, domain, etc.`)
    log('\n2. Create .env file for new site:')
    log(`   NEXT_PUBLIC_SANITY_DATASET=${targetDataset}`)
    log(`   SITE_ID=${newSiteId}`)
    log(`   NEXT_PUBLIC_SITE_URL=https://your-domain.com`)
    log('\n3. Deploy to Vercel/hosting platform')
    log('\n4. Update content in Studio for new business\n')
  } catch (err) {
    cleanup()
    error('Dataset cloning failed')
    throw err
  }
}

// CLI
const args = process.argv.slice(2)

if (args.length < 2 || args.includes('--help')) {
  console.log(`
🌐 Sanity Dataset Cloning Utility

Usage:
  pnpm clone-site <source-dataset> <target-dataset> [options]

Options:
  --skip-assets     Skip asset files (faster, smaller export)
  --help            Show this help message

Examples:
  pnpm clone-site site-budds site-hvac
  pnpm clone-site production site-new-business --skip-assets

Prerequisites:
  - Sanity CLI installed (@sanity/cli)
  - Authenticated with \`sanity login\`
  - SANITY_API_TOKEN in .env with dataset.create permission
  `)
  process.exit(0)
}

const sourceDataset = args[0]
const targetDataset = args[1]
const skipAssets = args.includes('--skip-assets')

cloneDataset({ sourceDataset, targetDataset, skipAssets })
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
