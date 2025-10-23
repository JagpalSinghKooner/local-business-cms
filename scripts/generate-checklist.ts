#!/usr/bin/env tsx

/**
 * Deployment Checklist Generator
 *
 * Automatically generates a pre-deployment checklist based on git changes
 *
 * Usage:
 *   pnpm generate-checklist                    # Current changes vs HEAD
 *   pnpm generate-checklist --compare main     # Current branch vs main
 *   pnpm generate-checklist --staged           # Only staged changes
 *   pnpm generate-checklist --output=FILE      # Save to file
 */

import { writeFileSync } from 'fs'
import {
  getGitDiff,
  getStagedChanges,
  getUnstagedChanges,
  parseGitDiff,
  analyzeChanges,
  getCurrentBranch,
  getCommitMessages,
  isWorkingDirectoryClean,
  type FileChange,
  type ChangeAnalysis,
} from './lib/git-analyzer'

// Parse command line arguments
const args = process.argv.slice(2)
const options = {
  compare: '',
  staged: false,
  output: '',
  verbose: false,
}

for (const arg of args) {
  if (arg.startsWith('--compare=')) {
    options.compare = arg.split('=')[1]
  } else if (arg === '--staged') {
    options.staged = true
  } else if (arg.startsWith('--output=')) {
    options.output = arg.split('=')[1]
  } else if (arg === '--verbose' || arg === '-v') {
    options.verbose = true
  }
}

/**
 * Generate checklist items based on change analysis
 */
function generateChecklistItems(analysis: ChangeAnalysis): string[] {
  const items: string[] = []

  // Always include basic checks
  items.push('[ ] Pull latest changes from main branch')
  items.push('[ ] Ensure all dependencies are up to date (`pnpm install`)')

  // Schema changes
  if (analysis.hasSchemaChanges) {
    items.push('[ ] **Schema Changes Detected** - Deploy schema to all datasets')
    items.push('    - Run `pnpm deploy-schema-all` to sync schemas across all sites')
    items.push('    - Verify schema deployment completed successfully')
    items.push('    - Run `pnpm schema-diff --all` to verify no inconsistencies')
  }

  // Validation changes
  if (analysis.hasValidationChanges) {
    items.push('[ ] **Validation Changes Detected** - Test in Sanity Studio')
    items.push('    - Open Studio and test validation on affected fields')
    items.push('    - Verify error messages are clear and helpful')
  }

  // Query changes
  if (analysis.hasQueryChanges) {
    items.push('[ ] **Query Changes Detected** - Verify GROQ queries')
    items.push('    - Test queries in Sanity Vision or API')
    items.push('    - Ensure queries return expected data structure')
    items.push('    - Check for performance issues with large datasets')
  }

  // Route changes
  if (analysis.hasRouteChanges) {
    items.push('[ ] **Route Changes Detected** - Test affected pages')
    items.push('    - Verify pages load correctly in dev mode')
    items.push('    - Check dynamic routing works as expected')
    items.push('    - Test with different URL parameters/slugs')
  }

  // Middleware changes
  if (analysis.hasMiddlewareChanges) {
    items.push('[ ] **Middleware Changes Detected** - Critical testing required')
    items.push('    - Test redirect functionality')
    items.push('    - Verify canonical URL handling')
    items.push('    - Check trailing slash behavior')
    items.push('    - Test with multiple domains if applicable')
  }

  // SEO changes
  if (analysis.hasSeoChanges) {
    items.push('[ ] **SEO Changes Detected** - Run SEO test suite')
    items.push('    - Run `pnpm test:seo` to verify all SEO tests pass')
    items.push('    - Check sitemap.xml generation')
    items.push('    - Verify robots.txt content')
    items.push('    - Test meta tags and Open Graph data')
    items.push('    - Validate structured data (JSON-LD)')
  }

  // Config changes
  if (analysis.hasConfigChanges) {
    items.push('[ ] **Config Changes Detected** - Verify environment setup')
    items.push('    - Update environment variables in production if needed')
    items.push('    - Verify all config values are correct')
    items.push('    - Test build process locally (`pnpm build`)')
  }

  // Component changes
  if (analysis.categories.has('component')) {
    items.push('[ ] **Component Changes Detected** - Visual regression testing')
    items.push('    - Review component changes in dev mode')
    items.push('    - Test responsive design (mobile, tablet, desktop)')
    items.push('    - Verify accessibility (keyboard navigation, ARIA labels)')
  }

  // Always include type check and lint
  items.push('[ ] Run type check: `pnpm type-check` (must pass with 0 errors)')
  items.push('[ ] Run linter: `pnpm lint` (must pass with 0 errors)')

  // Test recommendations based on changes
  if (analysis.hasTestChanges) {
    items.push('[ ] **Test Changes Detected** - Run full test suite')
    items.push('    - Run `pnpm test` to execute all tests')
  } else {
    items.push('[ ] Run relevant test suite')
    if (analysis.hasSeoChanges || analysis.hasRouteChanges) {
      items.push('    - Run `pnpm test:seo` for SEO verification')
    }
    if (analysis.hasSchemaChanges || analysis.hasQueryChanges) {
      items.push('    - Run `pnpm test:integration` to test data flow')
    }
  }

  // Build and deployment
  items.push('[ ] Build for production: `pnpm build`')
  items.push('    - Verify build completes without errors')
  items.push('    - Check build output for unexpected warnings')
  items.push('[ ] Test production build locally: `pnpm start`')
  items.push('    - Verify site works correctly in production mode')
  items.push('    - Test critical user paths')

  // Post-deployment checks
  items.push('[ ] **After Deployment:**')
  items.push('    - Verify deployment succeeded on Vercel/hosting platform')
  items.push('    - Check production URL loads correctly')
  items.push('    - Run smoke tests: `pnpm test:smoke --url=PRODUCTION_URL`')
  items.push('    - Monitor error tracking (Sentry, Vercel logs)')
  items.push('    - Check analytics are tracking correctly')

  // Multi-tenant specific
  if (analysis.hasSchemaChanges || analysis.hasMiddlewareChanges) {
    items.push('[ ] **Multi-Tenant Verification:**')
    items.push('    - Test all configured sites/datasets')
    items.push('    - Verify content isolation (no cross-site leaks)')
    items.push('    - Run `pnpm test:smoke:all` to test all sites')
  }

  // Rollback plan
  items.push('[ ] **Rollback Plan Ready:**')
  items.push('    - Know how to revert deployment (Vercel instant rollback)')
  items.push('    - Keep previous git commit hash for emergency revert')
  if (analysis.hasSchemaChanges) {
    items.push('    - Note: Schema changes may require manual rollback in Sanity')
  }

  return items
}

/**
 * Generate file changes summary
 */
function generateFilesSummary(analysis: ChangeAnalysis): string {
  let summary = '### Files Changed\n\n'

  if (analysis.files.length === 0) {
    summary += '_No files changed_\n\n'
    return summary
  }

  // Group by category
  const grouped = new Map<string, FileChange[]>()

  for (const file of analysis.files) {
    const category = file.category
    if (!grouped.has(category)) {
      grouped.set(category, [])
    }
    grouped.get(category)!.push(file)
  }

  // Sort categories
  const sortedCategories = Array.from(grouped.keys()).sort()

  for (const category of sortedCategories) {
    const files = grouped.get(category)!
    summary += `**${category.charAt(0).toUpperCase() + category.slice(1)}** (${files.length} file${files.length > 1 ? 's' : ''}):\n`

    for (const file of files) {
      const statusIcon =
        file.status === 'added'
          ? '+'
          : file.status === 'deleted'
            ? '-'
            : file.status === 'renamed'
              ? '→'
              : '~'
      summary += `- ${statusIcon} \`${file.path}\``

      if (file.status === 'renamed' && file.oldPath) {
        summary += ` (from \`${file.oldPath}\`)`
      }

      summary += '\n'
    }

    summary += '\n'
  }

  return summary
}

/**
 * Generate impact assessment
 */
function generateImpactAssessment(analysis: ChangeAnalysis): string {
  let assessment = '### Impact Assessment\n\n'

  const impacts: string[] = []

  if (analysis.hasSchemaChanges) {
    impacts.push('🔴 **HIGH** - Schema changes require deployment to all datasets')
  }

  if (analysis.hasMiddlewareChanges) {
    impacts.push('🔴 **HIGH** - Middleware changes affect all routes and redirects')
  }

  if (analysis.hasConfigChanges) {
    impacts.push('🟡 **MEDIUM** - Config changes may require environment variable updates')
  }

  if (analysis.hasSeoChanges) {
    impacts.push('🟡 **MEDIUM** - SEO changes may affect search rankings')
  }

  if (analysis.hasRouteChanges || analysis.hasQueryChanges) {
    impacts.push('🟡 **MEDIUM** - Data fetching or routing logic changed')
  }

  if (analysis.categories.has('component') || analysis.categories.has('style')) {
    impacts.push('🟢 **LOW** - Visual/component changes (user-facing)')
  }

  if (analysis.categories.has('documentation')) {
    impacts.push('🟢 **LOW** - Documentation updates only')
  }

  if (impacts.length === 0) {
    impacts.push('🟢 **LOW** - Minor changes with minimal impact')
  }

  assessment += impacts.join('\n') + '\n\n'

  return assessment
}

/**
 * Generate full deployment checklist
 */
function generateChecklist(analysis: ChangeAnalysis, branch: string, commits: string[]): string {
  const date = new Date().toISOString().split('T')[0]

  let checklist = `# Deployment Checklist\n\n`
  checklist += `**Generated:** ${date}\n`
  checklist += `**Branch:** ${branch}\n`
  checklist += `**Files Changed:** ${analysis.files.length}\n\n`

  checklist += '---\n\n'

  // Recent commits
  if (commits.length > 0) {
    checklist += '### Recent Commits\n\n'
    for (const commit of commits.slice(0, 10)) {
      checklist += `- ${commit}\n`
    }
    checklist += '\n---\n\n'
  }

  // Impact assessment
  checklist += generateImpactAssessment(analysis)

  checklist += '---\n\n'

  // Files changed
  checklist += generateFilesSummary(analysis)

  checklist += '---\n\n'

  // Checklist items
  checklist += '## Pre-Deployment Checklist\n\n'
  const items = generateChecklistItems(analysis)
  checklist += items.join('\n') + '\n\n'

  checklist += '---\n\n'

  // Sign-off
  checklist += '## Sign-Off\n\n'
  checklist += '- [ ] Checklist reviewed by: ________________\n'
  checklist += '- [ ] Deployment approved by: ________________\n'
  checklist += '- [ ] Deployment date/time: ________________\n\n'

  checklist += '---\n\n'
  checklist += '_Generated by `pnpm generate-checklist`_\n'

  return checklist
}

/**
 * Main function
 */
async function main() {
  console.log('\n📋 Deployment Checklist Generator\n')

  // Check if git repo
  try {
    const branch = getCurrentBranch()
    console.log(`Current branch: ${branch}\n`)
  } catch (error: any) {
    console.error('❌ Error: Not a git repository')
    process.exit(1)
  }

  // Get changes
  let diffOutput: string

  if (options.staged) {
    console.log('📥 Analyzing staged changes...\n')
    diffOutput = getStagedChanges()
  } else if (options.compare) {
    console.log(`📥 Analyzing changes: current branch vs ${options.compare}...\n`)
    diffOutput = getGitDiff(options.compare, getCurrentBranch())
  } else {
    console.log('📥 Analyzing unstaged + staged changes...\n')
    const staged = getStagedChanges()
    const unstaged = getUnstagedChanges()
    diffOutput = staged + '\n' + unstaged
  }

  // Parse changes
  const changes = parseGitDiff(diffOutput)

  if (changes.length === 0) {
    console.log('✅ No changes detected. Working directory is clean.\n')
    console.log('Tip: Use --compare=main to compare current branch vs main\n')
    process.exit(0)
  }

  console.log(`Found ${changes.length} file(s) changed\n`)

  // Analyze changes
  const analysis = analyzeChanges(changes)

  if (options.verbose) {
    console.log('Categories detected:')
    for (const category of analysis.categories) {
      const count = changes.filter((c) => c.category === category).length
      console.log(`  - ${category}: ${count} file(s)`)
    }
    console.log('')
  }

  // Get recent commits
  const commits = options.compare
    ? getCommitMessages(options.compare, 'HEAD')
    : getCommitMessages('HEAD~5', 'HEAD')

  // Generate checklist
  const branch = getCurrentBranch()
  const checklist = generateChecklist(analysis, branch, commits)

  // Output
  if (options.output) {
    writeFileSync(options.output, checklist, 'utf-8')
    console.log(`✅ Checklist written to: ${options.output}\n`)
  } else {
    console.log(checklist)
  }

  console.log('✅ Checklist generated successfully\n')
}

// Run
main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Failed to generate checklist:', error)
    process.exit(1)
  })
