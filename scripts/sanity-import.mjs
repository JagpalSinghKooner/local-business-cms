#!/usr/bin/env node
import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import importDataset from '@sanity/import'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const projectId = process.env.SANITY_IMPORT_PROJECT_ID
const dataset = process.env.SANITY_IMPORT_DATASET ?? 'production'
const token = process.env.SANITY_IMPORT_WRITE_TOKEN
const sourceFile = process.env.SANITY_IMPORT_FILE ?? path.resolve(__dirname, '../tmp/sanity-export/export.tar.gz')

if (!projectId || !dataset || !token) {
  console.error('Missing import configuration. Ensure SANITY_IMPORT_PROJECT_ID, SANITY_IMPORT_DATASET, and SANITY_IMPORT_WRITE_TOKEN are set.')
  process.exit(1)
}

async function run() {
  try {
    await fs.access(sourceFile)
  } catch {
    console.error(`Export file not found: ${sourceFile}`)
    console.error('Set SANITY_IMPORT_FILE to the exported tarball path.')
    process.exit(1)
  }

  console.log(`Importing dataset into project ${projectId}/${dataset} from ${sourceFile}`)

  await importDataset({
    file: sourceFile,
    projectId,
    dataset,
    token,
    onProgress: (progress) => {
      const pct = Math.floor((progress.current / progress.total) * 100)
      process.stdout.write(`\\rUploading: ${pct}%`)
    },
    allowAssets: true,
    replace: true,
  })

  console.log('\\nImport complete.')
}

run().catch((error) => {
  console.error('Sanity import failed', error)
  process.exit(1)
})
