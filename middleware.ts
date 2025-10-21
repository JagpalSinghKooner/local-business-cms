import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

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

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()

  if (canonicalHost && url.hostname !== canonicalHost) {
    url.hostname = canonicalHost
    return NextResponse.redirect(url, 308)
  }

  if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1)
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|.*\\.(?:png|jpg|jpeg|gif|ico|svg|webp|avif|txt|xml)).*)'],
}
