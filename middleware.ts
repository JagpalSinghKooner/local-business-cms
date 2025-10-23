import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client } from '@/sanity/client'
import { findMatchingRedirect, applyRedirectCaptureGroups, type RedirectRule } from '@/lib/redirect-validation'
import { trackRedirect } from '@/lib/redirect-monitoring'
import { getDatasetForDomain, isDomainRegistered } from '@/lib/site-detection'

const FALLBACK_HOST = 'www.buddsplumbing.com'

function resolveCanonicalHost(): string {
  const explicit = process.env.CANONICAL_HOST?.trim()
  if (explicit) return explicit

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (siteUrl) {
    try {
      return new URL(siteUrl).hostname
    } catch {
      // ignore invalid URLs, fall back below
    }
  }

  return FALLBACK_HOST
}

const canonicalHost = resolveCanonicalHost()

// Cache for redirects to avoid hitting Sanity on every request
let redirectsCache: RedirectRule[] = []
let cacheTimestamp = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function getRedirects(): Promise<RedirectRule[]> {
  const now = Date.now()

  // Return cached data if still valid
  if (redirectsCache.length > 0 && now - cacheTimestamp < CACHE_DURATION) {
    return redirectsCache
  }

  try {
    const redirects = await client.fetch<RedirectRule[]>(`
      *[_type == "redirect" && isActive == true] | order(priority desc, order asc) {
        _id,
        from,
        to,
        matchType,
        statusCode,
        isActive,
        priority,
        order,
        caseSensitive,
        queryStringHandling
      }
    `)

    redirectsCache = redirects || []
    cacheTimestamp = now

    return redirectsCache
  } catch (error) {
    console.error('Error fetching redirects from Sanity:', error)

    // Return stale cache if available (better than nothing)
    if (redirectsCache.length > 0) {
      console.warn('Using stale redirect cache due to fetch error')
      return redirectsCache
    }

    // No cache available, return empty array
    return []
  }
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()

  // Multi-tenant: Domain-based site detection (optional advanced routing)
  // Note: This is for monitoring and logging. The actual dataset is determined
  // by NEXT_PUBLIC_SANITY_DATASET at build time. For dynamic multi-site routing,
  // deploy separate Next.js instances with different env vars per site.
  const requestDomain = url.hostname
  const isMultiTenantMode = process.env.MULTI_TENANT_ENABLED === 'true'
  let siteHeaders: Record<string, string> = {}

  if (isMultiTenantMode) {
    // Check if domain has explicit dataset mapping
    const mappedDataset = getDatasetForDomain(requestDomain)
    const currentDataset = process.env.NEXT_PUBLIC_SANITY_DATASET

    if (mappedDataset) {
      // Domain is registered in multi-tenant config
      if (mappedDataset !== currentDataset) {
        // WARNING: Domain maps to different dataset than current deployment
        console.warn(
          `[Multi-Tenant] Domain "${requestDomain}" maps to dataset "${mappedDataset}" ` +
          `but this deployment is using "${currentDataset}". ` +
          `Deploy separate instance or update DOMAIN_DATASET_MAP in site-detection.ts`
        )
      }
    } else if (requestDomain !== 'localhost' && !requestDomain.startsWith('127.0.0.1')) {
      // Domain not registered and not localhost - potential misconfiguration
      console.warn(
        `[Multi-Tenant] Unregistered domain: "${requestDomain}". ` +
        `Add to DOMAIN_DATASET_MAP in site-detection.ts or deploy separate instance.`
      )
    }

    // Prepare headers for downstream consumption (can be used in API routes, server components)
    siteHeaders = {
      'x-site-domain': requestDomain,
      'x-site-dataset': currentDataset || 'unknown',
      ...(mappedDataset ? { 'x-site-dataset-expected': mappedDataset } : {}),
    }
  }

  // Handle canonical host redirects
  if (canonicalHost && url.hostname !== canonicalHost) {
    url.hostname = canonicalHost
    return NextResponse.redirect(url, 308)
  }

  // Handle trailing slash removal
  if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1)
    return NextResponse.redirect(url, 308)
  }

  // Handle custom redirects from CMS (with wildcard/regex support and loop detection)
  const redirects = await getRedirects()
  const currentPath = url.pathname

  // Performance tracking
  const redirectStartTime = performance.now()

  // Loop detection: track visited paths to prevent infinite redirects
  const visited = new Set<string>()
  const MAX_REDIRECT_DEPTH = 3
  let depth = 0
  let testPath = currentPath

  while (depth < MAX_REDIRECT_DEPTH) {
    // Check if we've already visited this path (loop detected)
    if (visited.has(testPath)) {
      console.error(`Redirect loop detected: ${Array.from(visited).join(' → ')} → ${testPath}`)
      return NextResponse.next() // Break the loop, continue to original destination
    }

    visited.add(testPath)

    // Try to find a matching redirect
    const matchedRedirect = findMatchingRedirect(testPath, redirects)

    if (!matchedRedirect) {
      // No more redirects in chain
      break
    }

    // Apply capture groups to get the destination
    let destination = applyRedirectCaptureGroups(testPath, matchedRedirect)

    // If this is an external redirect (absolute URL), we're done
    if (!destination.startsWith('/')) {
      // Handle query string for external redirects
      const queryStringHandling = matchedRedirect.queryStringHandling ?? 'preserve'
      if (queryStringHandling === 'preserve' && url.search) {
        const separator = destination.includes('?') ? '&' : '?'
        destination = `${destination}${separator}${url.search.slice(1)}`
      }

      // Track performance
      const processingTime = performance.now() - redirectStartTime
      trackRedirect(currentPath, destination, matchedRedirect.matchType, processingTime)

      return NextResponse.redirect(destination, matchedRedirect.statusCode)
    }

    // Check if this is the final destination (no more redirects)
    testPath = destination
    depth++

    // If this is the last iteration and we found a redirect, apply it
    if (depth === MAX_REDIRECT_DEPTH) {
      console.warn(`Redirect chain too long (${MAX_REDIRECT_DEPTH} hops): ${Array.from(visited).join(' → ')} → ${testPath}`)
      // Apply the final redirect anyway
    }
  }

  // If we have a final destination different from original, apply the redirect
  if (testPath !== currentPath) {
    const finalRedirect = findMatchingRedirect(Array.from(visited)[visited.size - 1], redirects)

    if (finalRedirect) {
      url.pathname = testPath

      // Handle query strings
      const queryStringHandling = finalRedirect.queryStringHandling ?? 'preserve'
      if (queryStringHandling === 'remove') {
        url.search = ''
      } else if (queryStringHandling === 'preserve') {
        // Keep existing query parameters (default behavior)
      }

      // Track performance
      const processingTime = performance.now() - redirectStartTime
      trackRedirect(currentPath, testPath, finalRedirect.matchType, processingTime)

      return NextResponse.redirect(url, finalRedirect.statusCode)
    }
  }

  // No redirects, proceed with request
  const response = NextResponse.next()

  // Add multi-tenant headers if enabled
  if (isMultiTenantMode && Object.keys(siteHeaders).length > 0) {
    Object.entries(siteHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
  }

  return response
}

export const config = {
  matcher: ['/((?!_next|.*\\.(?:png|jpg|jpeg|gif|ico|svg|webp|avif|txt|xml)).*)'],
}
