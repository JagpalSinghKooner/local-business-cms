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
  order?: number
  caseSensitive?: boolean
  queryStringHandling?: 'preserve' | 'remove' | 'ignore'
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

      const caseSensitive = r.caseSensitive ?? false
      const testCurrent = caseSensitive ? current : current.toLowerCase()
      const testFrom = caseSensitive ? r.from : r.from.toLowerCase()

      switch (r.matchType) {
        case 'exact':
          return testFrom === testCurrent
        case 'wildcard':
          return matchWildcard(testCurrent, testFrom, caseSensitive)
        case 'regex':
          try {
            const flags = caseSensitive ? '' : 'i'
            return new RegExp(r.from, flags).test(current)
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
function matchWildcard(path: string, pattern: string, caseSensitive = false): boolean {
  const regexPattern = pattern.replace(/\*/g, '(.*)')
  const flags = caseSensitive ? '' : 'i'
  return new RegExp(`^${regexPattern}$`, flags).test(path)
}

/**
 * Validate a redirect rule
 */
export function validateRedirect(redirect: RedirectRule, allRedirects: RedirectRule[]): ValidationResult {
  const warnings: string[] = []
  const errors: string[] = []

  // Rule 1: Source ≠ Destination
  if (redirect.from === redirect.to) {
    errors.push('Redirect points to itself (from and to are identical)')
  }

  // Rule 2: No circular references (check full chain)
  const chainValidation = validateRedirectChain(redirect.from, allRedirects)
  if (chainValidation.hasLoop) {
    errors.push(`Redirect loop detected: ${chainValidation.chain.join(' → ')}`)
  }

  // Warn about long redirect chains (Rule 2 continued)
  if (chainValidation.tooLong) {
    warnings.push(`Redirect chain too long (${chainValidation.chain.length} hops): ${chainValidation.chain.join(' → ')}`)
  } else if (chainValidation.chain.length > 3) {
    warnings.push(`Long redirect chain (${chainValidation.chain.length} hops): ${chainValidation.chain.join(' → ')}`)
  }

  // Rule 3: Valid regex syntax
  if (redirect.matchType === 'regex') {
    try {
      new RegExp(redirect.from)
    } catch (err) {
      errors.push(`Invalid regex pattern: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  // Rule 4: No duplicate sources (unless priority differs or one is inactive)
  const duplicates = allRedirects.filter(
    (r) =>
      r._id !== redirect._id &&
      r.isActive &&
      r.from === redirect.from &&
      r.matchType === redirect.matchType &&
      (r.priority ?? 0) === (redirect.priority ?? 0)
  )
  if (duplicates.length > 0) {
    errors.push(`Duplicate redirect from "${redirect.from}" with same priority - this rule may never be reached`)
  }

  // Rule 5: Destination URL is valid format
  if (!redirect.to || redirect.to.trim() === '') {
    errors.push('Destination URL cannot be empty')
  } else {
    // Check if destination is absolute URL (should be valid URL)
    if (!redirect.to.startsWith('/')) {
      try {
        new URL(redirect.to)
      } catch {
        errors.push(`Invalid destination URL: "${redirect.to}" - must be a valid absolute URL or start with /`)
      }
    }
  }

  // Additional validation: Check for suspicious patterns
  if (redirect.from.includes('*') && redirect.matchType !== 'wildcard') {
    warnings.push('Pattern contains * but match type is not "wildcard" - did you mean to use wildcard matching?')
  }

  if (redirect.from.startsWith('^') && redirect.matchType !== 'regex') {
    warnings.push('Pattern starts with ^ but match type is not "regex" - did you mean to use regex matching?')
  }

  // Check for trailing slash inconsistencies
  if (redirect.from.endsWith('/') && redirect.from.length > 1) {
    warnings.push('Source path has trailing slash - note that middleware removes trailing slashes before matching')
  }

  // Check for query strings in source
  if (redirect.from.includes('?') && redirect.matchType === 'exact') {
    warnings.push('Source contains query string - consider using queryStringHandling field instead')
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
  // Sort by priority DESC (higher first), then order ASC
  const sorted = [...redirects]
    .filter((r) => r.isActive)
    .sort((a, b) => {
      const priorityA = a.priority ?? 0
      const priorityB = b.priority ?? 0

      // Higher priority first
      if (priorityA !== priorityB) {
        return priorityB - priorityA
      }

      // Same priority, sort by order ASC
      const orderA = a.order ?? 0
      const orderB = b.order ?? 0
      return orderA - orderB
    })

  for (const redirect of sorted) {
    const caseSensitive = redirect.caseSensitive ?? false
    const testPath = caseSensitive ? path : path.toLowerCase()
    const testFrom = caseSensitive ? redirect.from : redirect.from.toLowerCase()

    switch (redirect.matchType) {
      case 'exact':
        if (testFrom === testPath) return redirect
        break
      case 'wildcard':
        if (matchWildcard(testPath, testFrom, caseSensitive)) return redirect
        break
      case 'regex':
        try {
          const flags = caseSensitive ? '' : 'i'
          if (new RegExp(redirect.from, flags).test(path)) return redirect
        } catch {
          // Invalid regex, skip
        }
        break
    }
  }

  return null
}

/**
 * Check if following a redirect chain would result in a loop or exceed max depth
 * Returns the full chain and whether it's problematic
 */
export function validateRedirectChain(
  startPath: string,
  redirects: RedirectRule[],
  maxDepth = 3
): { isValid: boolean; chain: string[]; hasLoop: boolean; tooLong: boolean } {
  const visited = new Set<string>()
  const chain: string[] = [startPath]
  let currentPath = startPath
  let depth = 0

  while (depth < maxDepth + 1) {
    // Check for loop
    if (visited.has(currentPath)) {
      return {
        isValid: false,
        chain: [...chain, currentPath],
        hasLoop: true,
        tooLong: false,
      }
    }

    visited.add(currentPath)

    // Find matching redirect
    const matchedRedirect = findMatchingRedirect(currentPath, redirects)

    if (!matchedRedirect) {
      // No more redirects, chain ends here
      return {
        isValid: true,
        chain,
        hasLoop: false,
        tooLong: false,
      }
    }

    // Get destination
    const destination = applyRedirectCaptureGroups(currentPath, matchedRedirect)

    // External redirect - chain ends
    if (!destination.startsWith('/')) {
      chain.push(destination)
      return {
        isValid: true,
        chain,
        hasLoop: false,
        tooLong: false,
      }
    }

    chain.push(destination)
    currentPath = destination
    depth++

    // Check if chain is too long
    if (depth > maxDepth) {
      return {
        isValid: false,
        chain,
        hasLoop: false,
        tooLong: true,
      }
    }
  }

  // Shouldn't reach here, but return invalid if we do
  return {
    isValid: false,
    chain,
    hasLoop: false,
    tooLong: true,
  }
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
