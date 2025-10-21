import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client } from '@/sanity/client'

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
let redirectsCache: Array<{ from: string; to: string; statusCode: number }> = []
let cacheTimestamp = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function getRedirects(): Promise<Array<{ from: string; to: string; statusCode: number }>> {
  const now = Date.now()
  
  // Return cached data if still valid
  if (redirectsCache.length > 0 && now - cacheTimestamp < CACHE_DURATION) {
    return redirectsCache
  }

  try {
    const redirects = await client.fetch(`
      *[_type == "redirect" && isActive == true] {
        from,
        to,
        statusCode
      }
    `)
    
    redirectsCache = redirects || []
    cacheTimestamp = now
    
    return redirectsCache
  } catch (error) {
    console.error('Error fetching redirects:', error)
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

  // Handle custom redirects from CMS
  const redirects = await getRedirects()
  const currentPath = url.pathname
  
  for (const redirect of redirects) {
    if (redirect.from === currentPath) {
      // Handle relative URLs
      if (redirect.to.startsWith('/')) {
        url.pathname = redirect.to
        return NextResponse.redirect(url, redirect.statusCode)
      } else {
        // Handle absolute URLs
        return NextResponse.redirect(redirect.to, redirect.statusCode)
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|.*\\.(?:png|jpg|jpeg|gif|ico|svg|webp|avif|txt|xml)).*)'],
}
