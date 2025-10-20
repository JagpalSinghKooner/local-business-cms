#!/usr/bin/env node
import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import exportDataset from '@sanity/export'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const projectId = process.env.SANITY_EXPORT_PROJECT_ID ?? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.SANITY_EXPORT_DATASET ?? process.env.NEXT_PUBLIC_SANITY_DATASET
const token =
  process.env.SANITY_EXPORT_READ_TOKEN ??
  process.env.SANITY_API_READ_TOKEN ??
  process.env.SANITY_AUTH_TOKEN

if (!projectId || !dataset || !token) {
  console.error(
    'Missing configuration. Ensure SANITY_EXPORT_PROJECT_ID/NEXT_PUBLIC_SANITY_PROJECT_ID, SANITY_EXPORT_DATASET/NEXT_PUBLIC_SANITY_DATASET, and SANITY_EXPORT_READ_TOKEN/SANITY_API_READ_TOKEN are set.'
  )
  process.exit(1)
}

const outputDirEnv = process.env.SANITY_EXPORT_DIR
const outputDir =
  outputDirEnv && outputDirEnv.trim().length > 0
    ? path.resolve(outputDirEnv)
    : path.resolve(__dirname, '../tmp/sanity-export')

async function run() {
  await fs.mkdir(outputDir, { recursive: true })

  console.log(`Exporting Sanity dataset:\n  project: ${projectId}\n  dataset: ${dataset}\n  output: ${outputDir}`)

  await exportDataset({
    projectId,
    dataset,
    token,
    outputPath: outputDir,
    includeTypes: ['*'],
    compress: true,
  })

  console.log('Export complete.')
  console.log('The exported tarball can be found in:', outputDir)
}

run().catch((error) => {
  console.error('Sanity export failed', error)
  process.exit(1)
})
