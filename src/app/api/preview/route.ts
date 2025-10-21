import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const resolvePreviewPath = (type: string | null, slug: string | null): string => {
  const normalizedSlug = slug?.replace(/^\/+|\/+$/g, '') ?? ''
  if (type === 'service') {
    return `/services/${normalizedSlug}`
  }
  if (type === 'location') {
    return `/locations/${normalizedSlug}`
  }
  if (type === 'offer') {
    return `/offers/${normalizedSlug}`
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

  if (!process.env.SANITY_PREVIEW_SECRET) {
    return new NextResponse('Preview secret is not configured', { status: 500 })
  }

  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new NextResponse('Invalid preview secret', { status: 401 })
  }

  const draft = await draftMode()
  draft.enable()

  const redirectPath = resolvePreviewPath(type, slug)
  const location = new URL(redirectPath, request.nextUrl.origin)

  return NextResponse.redirect(location)
}
