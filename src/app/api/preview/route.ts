import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Preview API Route for Sanity Studio Live Preview
 * Enables draft mode and redirects to the appropriate page
 * Supports both iframe preview and external preview links
 */

const resolvePreviewPath = (type: string | null, slug: string | null): string => {
  const normalizedSlug = slug?.replace(/^\/+|\/+$/g, '') ?? ''
  if (type === 'service') {
    return `/services/${normalizedSlug}`
  }
  if (type === 'location') {
    return `/locations/${normalizedSlug}`
  }
  if (type === 'serviceLocation') {
    return `/services/${normalizedSlug}`
  }
  if (type === 'offer') {
    return `/offers/${normalizedSlug}`
  }
  if (type === 'post') {
    return `/blog/${normalizedSlug}`
  }
  if (type === 'page') {
    if (!normalizedSlug || normalizedSlug === 'home') return '/'
    return `/${normalizedSlug}`
  }
  if (!normalizedSlug) return '/'
  return `/${normalizedSlug}`
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const secret = searchParams.get('secret')
  const type = searchParams.get('type')
  const slug = searchParams.get('slug')

  // Check if this is a Studio iframe preview (no secret required for Studio)
  const isStudioPreview = request.headers.get('referer')?.includes('/studio')

  // Require secret for external preview links (not from Studio)
  if (!isStudioPreview) {
    if (!process.env.SANITY_PREVIEW_SECRET) {
      return new NextResponse('Preview secret is not configured', { status: 500 })
    }

    if (secret !== process.env.SANITY_PREVIEW_SECRET) {
      return new NextResponse('Invalid preview secret', { status: 401 })
    }
  }

  // Enable draft mode
  const draft = await draftMode()
  draft.enable()

  // Resolve and redirect to the preview path
  const redirectPath = resolvePreviewPath(type, slug)
  const location = new URL(redirectPath, request.nextUrl.origin)

  return NextResponse.redirect(location)
}
