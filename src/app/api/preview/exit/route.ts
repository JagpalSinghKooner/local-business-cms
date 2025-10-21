import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const draft = await draftMode()
  draft.disable()
  const redirect = request.nextUrl.searchParams.get('redirect') ?? '/'
  const location = new URL(redirect.startsWith('/') ? redirect : `/${redirect}`, request.nextUrl.origin)
  return NextResponse.redirect(location)
}
