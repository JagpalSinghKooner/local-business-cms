import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client } from '@/sanity/client'
import { findMatchingRedirect, applyRedirectCaptureGroups, type RedirectRule } from '@/lib/redirect-validation'

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
      *[_type == "redirect" && isActive == true] | order(priority asc) {
        _id,
        from,
        to,
        matchType,
        statusCode,
        isActive,
        priority
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

  // Handle custom redirects from CMS (with wildcard/regex support)
  const redirects = await getRedirects()
  const currentPath = url.pathname

  const matchedRedirect = findMatchingRedirect(currentPath, redirects)

  if (matchedRedirect) {
    const destination = applyRedirectCaptureGroups(currentPath, matchedRedirect)

    // Handle relative URLs
    if (destination.startsWith('/')) {
      url.pathname = destination
      return NextResponse.redirect(url, matchedRedirect.statusCode)
    } else {
      // Handle absolute URLs
      return NextResponse.redirect(destination, matchedRedirect.statusCode)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|.*\\.(?:png|jpg|jpeg|gif|ico|svg|webp|avif|txt|xml)).*)'],
}
