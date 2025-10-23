/**
 * Git Analysis Utilities
 *
 * Analyze git diff to detect file changes and categorize them
 * for automated deployment checklist generation
 */

import { execSync } from 'child_process'

export interface FileChange {
  path: string
  status: 'added' | 'modified' | 'deleted' | 'renamed'
  category: FileCategory
  oldPath?: string // For renamed files
}

export type FileCategory =
  | 'schema'
  | 'component'
  | 'query'
  | 'loader'
  | 'route'
  | 'middleware'
  | 'config'
  | 'test'
  | 'script'
  | 'validation'
  | 'type'
  | 'seo'
  | 'style'
  | 'documentation'
  | 'other'

export interface ChangeAnalysis {
  files: FileChange[]
  categories: Set<FileCategory>
  hasSchemaChanges: boolean
  hasQueryChanges: boolean
  hasRouteChanges: boolean
  hasMiddlewareChanges: boolean
  hasTestChanges: boolean
  hasConfigChanges: boolean
  hasSeoChanges: boolean
  hasValidationChanges: boolean
}

/**
 * Get git diff between two refs (branches, commits, tags)
 */
export function getGitDiff(base: string = 'HEAD', compare: string = ''): string {
  try {
    const command = compare
      ? `git diff --name-status ${base}...${compare}`
      : `git diff --name-status ${base}`

    const output = execSync(command, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    })

    return output.trim()
  } catch (error: any) {
    // If no changes, git diff returns empty
    return ''
  }
}

/**
 * Get list of staged changes
 */
export function getStagedChanges(): string {
  try {
    const output = execSync('git diff --staged --name-status', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    })

    return output.trim()
  } catch (error: any) {
    return ''
  }
}

/**
 * Get list of unstaged changes
 */
export function getUnstagedChanges(): string {
  try {
    const output = execSync('git diff --name-status', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    })

    return output.trim()
  } catch (error: any) {
    return ''
  }
}

/**
 * Parse git diff output into structured file changes
 */
export function parseGitDiff(diffOutput: string): FileChange[] {
  if (!diffOutput) return []

  const lines = diffOutput.split('\n')
  const changes: FileChange[] = []

  for (const line of lines) {
    if (!line.trim()) continue

    const parts = line.split('\t')
    const status = parts[0].trim()
    const path = parts[1]?.trim()

    if (!path) continue

    let changeStatus: FileChange['status']
    let oldPath: string | undefined

    // Parse git status codes
    if (status.startsWith('A')) {
      changeStatus = 'added'
    } else if (status.startsWith('M')) {
      changeStatus = 'modified'
    } else if (status.startsWith('D')) {
      changeStatus = 'deleted'
    } else if (status.startsWith('R')) {
      changeStatus = 'renamed'
      oldPath = path
      // For renamed files, git shows: R100  old/path  new/path
      const newPath = parts[2]?.trim()
      if (newPath) {
        changes.push({
          path: newPath,
          status: changeStatus,
          category: categorizeFile(newPath),
          oldPath,
        })
        continue
      }
    } else {
      // Unknown status, skip
      continue
    }

    changes.push({
      path,
      status: changeStatus,
      category: categorizeFile(path),
      oldPath,
    })
  }

  return changes
}

/**
 * Categorize a file based on its path
 */
export function categorizeFile(filePath: string): FileCategory {
  const path = filePath.toLowerCase()

  // Schema files
  if (path.includes('sanity/schematypes') || path.includes('sanity/schema')) {
    return 'schema'
  }

  // Query files
  if (path.includes('sanity/queries')) {
    return 'query'
  }

  // Loader files
  if (path.includes('sanity/loaders')) {
    return 'loader'
  }

  // Validation files
  if (path.includes('sanity/validation') || path.includes('validation.ts')) {
    return 'validation'
  }

  // Component files
  if (path.includes('/components/') && (path.endsWith('.tsx') || path.endsWith('.jsx'))) {
    return 'component'
  }

  // Route files
  if (path.includes('/app/') && (path.includes('page.tsx') || path.includes('layout.tsx'))) {
    return 'route'
  }

  // Middleware
  if (path.includes('middleware.ts') || path.includes('middleware.js')) {
    return 'middleware'
  }

  // Config files
  if (
    path.includes('next.config') ||
    path.includes('sanity.config') ||
    path.includes('tailwind.config') ||
    path.includes('tsconfig') ||
    path.includes('.env')
  ) {
    return 'config'
  }

  // Test files
  if (path.includes('/tests/') || path.includes('.spec.') || path.includes('.test.')) {
    return 'test'
  }

  // Script files
  if (path.includes('/scripts/')) {
    return 'script'
  }

  // Type definition files
  if (path.endsWith('.d.ts') || path.includes('/types/')) {
    return 'type'
  }

  // SEO files
  if (
    path.includes('sitemap') ||
    path.includes('robots') ||
    path.includes('metadata') ||
    path.includes('/seo/')
  ) {
    return 'seo'
  }

  // Style files
  if (path.endsWith('.css') || path.endsWith('.scss') || path.endsWith('.sass')) {
    return 'style'
  }

  // Documentation
  if (path.endsWith('.md') || path.includes('/docs/')) {
    return 'documentation'
  }

  return 'other'
}

/**
 * Analyze file changes and return structured analysis
 */
export function analyzeChanges(changes: FileChange[]): ChangeAnalysis {
  const categories = new Set<FileCategory>()

  for (const change of changes) {
    categories.add(change.category)
  }

  return {
    files: changes,
    categories,
    hasSchemaChanges: categories.has('schema'),
    hasQueryChanges: categories.has('query'),
    hasRouteChanges: categories.has('route'),
    hasMiddlewareChanges: categories.has('middleware'),
    hasTestChanges: categories.has('test'),
    hasConfigChanges: categories.has('config'),
    hasSeoChanges: categories.has('seo'),
    hasValidationChanges: categories.has('validation'),
  }
}

/**
 * Get current branch name
 */
export function getCurrentBranch(): string {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    })

    return branch.trim()
  } catch (error: any) {
    return 'unknown'
  }
}

/**
 * Get commit messages between two refs
 */
export function getCommitMessages(base: string = 'HEAD~5', compare: string = 'HEAD'): string[] {
  try {
    const output = execSync(`git log ${base}..${compare} --pretty=format:"%s"`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    })

    return output.trim().split('\n').filter(Boolean)
  } catch (error: any) {
    return []
  }
}

/**
 * Check if working directory is clean
 */
export function isWorkingDirectoryClean(): boolean {
  try {
    const output = execSync('git status --porcelain', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    })

    return output.trim() === ''
  } catch (error: any) {
    return false
  }
}
