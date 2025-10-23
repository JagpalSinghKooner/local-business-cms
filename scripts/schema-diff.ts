#!/usr/bin/env tsx

/**
 * Schema Diff Tool
 *
 * Compare Sanity schemas between datasets to ensure consistency
 *
 * Usage:
 *   pnpm schema-diff --compare site-budds,site-hvac
 *   pnpm schema-diff --all
 *   pnpm schema-diff --compare site-budds,site-hvac --output=report.txt
 */

import { createClient } from '@sanity/client'
import { writeFileSync } from 'fs'
import {
  compareSchemas,
  formatDifferencesReport,
  areSchemasCompatible,
  groupBySeverity,
  extractSchemaSummary,
  type SchemaType,
  type SchemaDifference,
} from './lib/schema-comparator'

// Parse command line arguments
const args = process.argv.slice(2)
const options = {
  compare: [] as string[],
  all: false,
  output: '',
  verbose: false,
}

for (const arg of args) {
  if (arg.startsWith('--compare=')) {
    options.compare = arg.split('=')[1].split(',').map((d) => d.trim())
  } else if (arg === '--all') {
    options.all = true
  } else if (arg.startsWith('--output=')) {
    options.output = arg.split('=')[1]
  } else if (arg === '--verbose' || arg === '-v') {
    options.verbose = true
  }
}

// Validate options
if (!options.all && options.compare.length < 2) {
  console.error('❌ Error: Either --all or --compare with at least 2 datasets is required')
  console.log('\nUsage:')
  console.log('  pnpm schema-diff --compare dataset1,dataset2')
  console.log('  pnpm schema-diff --compare dataset1,dataset2,dataset3')
  console.log('  pnpm schema-diff --all')
  console.log('\nOptions:')
  console.log('  --compare=D1,D2     Compare specific datasets (comma-separated)')
  console.log('  --all               Compare all configured datasets')
  console.log('  --output=FILE       Write report to file')
  console.log('  --verbose, -v       Show detailed schema information')
  console.log('\nExamples:')
  console.log('  pnpm schema-diff --compare site-budds,site-hvac')
  console.log('  pnpm schema-diff --all --output=schema-report.txt')
  process.exit(1)
}

// Create Sanity client
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const token = process.env.SANITY_API_TOKEN

if (!projectId) {
  console.error('❌ Error: NEXT_PUBLIC_SANITY_PROJECT_ID must be set')
  process.exit(1)
}

/**
 * Fetch schema from a dataset
 */
async function fetchSchema(dataset: string): Promise<any[]> {
  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  })

  try {
    // Fetch all document types from the dataset
    // Note: This fetches the schema by querying the actual structure
    const types = await client.fetch(`
      array::unique(*[]._type)
    `)

    if (options.verbose) {
      console.log(`   Found ${types.length} document types in ${dataset}`)
    }

    // For each type, get field structure by sampling documents
    const schema: any[] = []

    for (const typeName of types) {
      // Get a sample document to infer schema
      const sample = await client.fetch(`*[_type == $type][0]`, { type: typeName })

      if (sample) {
        const fields = Object.keys(sample)
          .filter((key) => !key.startsWith('_') || key === '_type')
          .map((key) => ({
            name: key,
            type: typeof sample[key],
            value: sample[key],
          }))

        schema.push({
          name: typeName,
          type: 'document',
          fields,
        })
      }
    }

    return schema
  } catch (error: any) {
    console.error(`❌ Error fetching schema from ${dataset}: ${error.message}`)
    return []
  }
}

/**
 * Get list of datasets to compare
 */
function getDatasetsToCompare(): string[] {
  if (options.all) {
    // You can load this from environment or config file
    // For now, return example datasets
    console.warn('⚠️  --all option: Using example datasets. Configure in code for your setup.')
    return ['production', 'staging'] // Customize this
  }

  return options.compare
}

/**
 * Main function
 */
async function main() {
  console.log('\n🔍 Schema Diff Tool\n')

  const datasets = getDatasetsToCompare()

  if (datasets.length < 2) {
    console.error('❌ Error: At least 2 datasets are required for comparison')
    process.exit(1)
  }

  console.log(`📋 Comparing ${datasets.length} dataset(s):\n`)
  datasets.forEach((d, i) => console.log(`   ${i + 1}. ${d}`))
  console.log('')

  // Fetch schemas
  const schemas = new Map<string, any[]>()

  for (const dataset of datasets) {
    console.log(`📥 Fetching schema from ${dataset}...`)
    const schema = await fetchSchema(dataset)
    schemas.set(dataset, schema)
  }

  console.log('')

  // Compare each pair of datasets
  const allDifferences: Array<{
    dataset1: string
    dataset2: string
    differences: SchemaDifference[]
  }> = []

  for (let i = 0; i < datasets.length; i++) {
    for (let j = i + 1; j < datasets.length; j++) {
      const dataset1 = datasets[i]
      const dataset2 = datasets[j]

      console.log(`🔄 Comparing ${dataset1} vs ${dataset2}...`)

      const schema1 = extractSchemaSummary(schemas.get(dataset1) || [])
      const schema2 = extractSchemaSummary(schemas.get(dataset2) || [])

      const differences = compareSchemas(schema1, schema2, dataset1, dataset2)

      allDifferences.push({ dataset1, dataset2, differences })

      if (differences.length === 0) {
        console.log(`   ✅ Schemas are identical\n`)
      } else {
        const grouped = groupBySeverity(differences)
        console.log(`   ⚠️  Found ${differences.length} difference(s)`)
        console.log(`      Errors: ${grouped.errors.length}`)
        console.log(`      Warnings: ${grouped.warnings.length}`)
        console.log(`      Info: ${grouped.info.length}\n`)
      }
    }
  }

  // Generate full report
  let fullReport = '\n' + '='.repeat(70) + '\n'
  fullReport += 'SCHEMA COMPARISON REPORT\n'
  fullReport += '='.repeat(70) + '\n'
  fullReport += `Generated: ${new Date().toISOString()}\n`
  fullReport += `Datasets: ${datasets.join(', ')}\n`
  fullReport += '='.repeat(70) + '\n'

  for (const { dataset1, dataset2, differences } of allDifferences) {
    fullReport += formatDifferencesReport(differences, dataset1, dataset2)
  }

  // Overall summary
  fullReport += '\n' + '='.repeat(70) + '\n'
  fullReport += 'OVERALL SUMMARY\n'
  fullReport += '='.repeat(70) + '\n'

  const totalDifferences = allDifferences.reduce((sum, d) => sum + d.differences.length, 0)
  const totalErrors = allDifferences.reduce(
    (sum, d) => sum + groupBySeverity(d.differences).errors.length,
    0
  )
  const totalWarnings = allDifferences.reduce(
    (sum, d) => sum + groupBySeverity(d.differences).warnings.length,
    0
  )

  fullReport += `Total Comparisons: ${allDifferences.length}\n`
  fullReport += `Total Differences: ${totalDifferences}\n`
  fullReport += `Total Errors: ${totalErrors}\n`
  fullReport += `Total Warnings: ${totalWarnings}\n\n`

  const allCompatible = allDifferences.every((d) => areSchemasCompatible(d.differences))

  if (allCompatible) {
    fullReport += '✅ All schemas are compatible (no critical errors)\n'
  } else {
    fullReport += '❌ Some schemas have critical incompatibilities\n'
    fullReport += '\n💡 Recommendation: Run `pnpm deploy-schema-all` to sync schemas\n'
  }

  fullReport += '='.repeat(70) + '\n'

  // Output report
  console.log(fullReport)

  // Write to file if requested
  if (options.output) {
    writeFileSync(options.output, fullReport, 'utf-8')
    console.log(`\n📝 Report written to: ${options.output}\n`)
  }

  // Exit with error code if there are critical differences
  if (!allCompatible) {
    process.exit(1)
  }
}

// Run
main()
  .then(() => {
    console.log('✅ Schema comparison completed\n')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Schema comparison failed:', error)
    process.exit(1)
  })
