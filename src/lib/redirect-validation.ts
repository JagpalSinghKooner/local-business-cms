/**
 * Redirect Validation and Loop Detection
 *
 * Validates redirect rules and detects potential issues:
 * - Redirect loops (A → B → A)
 * - Redirect chains (A → B → C → D)
 * - Circular references
 * - Conflicting rules
 */

export type RedirectRule = {
  _id: string
  from: string
  to: string
  matchType: 'exact' | 'wildcard' | 'regex'
  statusCode: number
  isActive?: boolean
  priority?: number
}

export type ValidationResult = {
  isValid: boolean
  warnings: string[]
  errors: string[]
}

/**
 * Detect redirect loops
 *
 * A loop occurs when following redirects leads back to the original URL.
 * Example: /a → /b, /b → /c, /c → /a (loop)
 */
export function detectRedirectLoop(
  redirect: RedirectRule,
  allRedirects: RedirectRule[],
  maxDepth = 10
): { hasLoop: boolean; chain: string[] } {
  const visited = new Set<string>()
  const chain: string[] = [redirect.from]
  let current = redirect.to

  // Only check internal redirects (starting with /)
  if (!current.startsWith('/')) {
    return { hasLoop: false, chain }
  }

  let depth = 0

  while (depth < maxDepth) {
    // Found a loop
    if (visited.has(current)) {
      chain.push(current)
      return { hasLoop: true, chain }
    }

    visited.add(current)
    chain.push(current)

    // Find next redirect in chain
    const nextRedirect = allRedirects.find((r) => {
      if (!r.isActive) return false
      if (r._id === redirect._id) return false // Skip self

      switch (r.matchType) {
        case 'exact':
          return r.from === current
        case 'wildcard':
          return matchWildcard(current, r.from)
        case 'regex':
          try {
            return new RegExp(r.from).test(current)
          } catch {
            return false
          }
        default:
          return false
      }
    })

    // No more redirects in chain
    if (!nextRedirect) {
      return { hasLoop: false, chain }
    }

    // External redirect - stop checking
    if (!nextRedirect.to.startsWith('/')) {
      chain.push(nextRedirect.to)
      return { hasLoop: false, chain }
    }

    current = nextRedirect.to
    depth++
  }

  // Hit max depth - might be infinite loop
  return { hasLoop: true, chain }
}

/**
 * Match wildcard pattern
 */
function matchWildcard(path: string, pattern: string): boolean {
  const regexPattern = pattern.replace(/\*/g, '(.*)')
  return new RegExp(`^${regexPattern}$`).test(path)
}

/**
 * Validate a redirect rule
 */
export function validateRedirect(redirect: RedirectRule, allRedirects: RedirectRule[]): ValidationResult {
  const warnings: string[] = []
  const errors: string[] = []

  // Check for self-redirect
  if (redirect.from === redirect.to) {
    errors.push('Redirect points to itself')
  }

  // Check for redirect loop
  const { hasLoop, chain } = detectRedirectLoop(redirect, allRedirects)
  if (hasLoop) {
    errors.push(`Redirect loop detected: ${chain.join(' → ')}`)
  }

  // Warn about long redirect chains
  if (chain.length > 3) {
    warnings.push(`Long redirect chain (${chain.length} hops): ${chain.join(' → ')}`)
  }

  // Check for duplicate "from" paths
  const duplicates = allRedirects.filter(
    (r) => r._id !== redirect._id && r.isActive && r.from === redirect.from && r.matchType === 'exact'
  )
  if (duplicates.length > 0) {
    warnings.push(`Duplicate redirect from "${redirect.from}" - this rule may never be reached`)
  }

  // Validate regex patterns
  if (redirect.matchType === 'regex') {
    try {
      new RegExp(redirect.from)
    } catch (err) {
      errors.push(`Invalid regex pattern: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  // Check for suspicious patterns
  if (redirect.from.includes('*') && redirect.matchType !== 'wildcard') {
    warnings.push('Pattern contains * but match type is not "wildcard"')
  }

  if (redirect.from.startsWith('^') && redirect.matchType !== 'regex') {
    warnings.push('Pattern starts with ^ but match type is not "regex"')
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  }
}

/**
 * Validate all redirects
 */
export function validateAllRedirects(redirects: RedirectRule[]): Map<string, ValidationResult> {
  const results = new Map<string, ValidationResult>()

  for (const redirect of redirects) {
    if (!redirect.isActive) continue
    const result = validateRedirect(redirect, redirects)
    results.set(redirect._id, result)
  }

  return results
}

/**
 * Process redirect matching
 */
export function findMatchingRedirect(path: string, redirects: RedirectRule[]): RedirectRule | null {
  // Sort by priority (lower first)
  const sorted = [...redirects]
    .filter((r) => r.isActive)
    .sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100))

  for (const redirect of sorted) {
    switch (redirect.matchType) {
      case 'exact':
        if (redirect.from === path) return redirect
        break
      case 'wildcard':
        if (matchWildcard(path, redirect.from)) return redirect
        break
      case 'regex':
        try {
          if (new RegExp(redirect.from).test(path)) return redirect
        } catch {
          // Invalid regex, skip
        }
        break
    }
  }

  return null
}

/**
 * Apply capture groups to destination URL
 */
export function applyRedirectCaptureGroups(path: string, redirect: RedirectRule): string {
  let destination = redirect.to

  switch (redirect.matchType) {
    case 'wildcard': {
      const regexPattern = redirect.from.replace(/\*/g, '(.*)')
      const match = path.match(new RegExp(`^${regexPattern}$`))
      if (match) {
        // Replace $1, $2, etc. with captured groups
        match.slice(1).forEach((group, index) => {
          destination = destination.replace(new RegExp(`\\$${index + 1}`, 'g'), group)
        })
      }
      break
    }
    case 'regex': {
      const match = path.match(new RegExp(redirect.from))
      if (match) {
        // Replace $1, $2, etc. with captured groups
        match.slice(1).forEach((group, index) => {
          destination = destination.replace(new RegExp(`\\$${index + 1}`, 'g'), group)
        })
      }
      break
    }
  }

  return destination
}
