import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-10-16'
const token = process.env.SANITY_API_READ_TOKEN

function missingConfigResponse() {
  return NextResponse.json(
    { error: 'Sanity preview configuration is incomplete.' },
    { status: 500 },
  )
}

export async function POST(request: NextRequest) {
  const draft = await draftMode()

  if (!draft.isEnabled) {
    return NextResponse.json({ error: 'Draft mode is not enabled.' }, { status: 401 })
  }

  if (!projectId || !dataset || !token) {
    return missingConfigResponse()
  }

  let body: { query?: unknown; params?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (typeof body.query !== 'string') {
    return NextResponse.json({ error: 'A GROQ query string is required.' }, { status: 400 })
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
  })

  try {
    const data = await client.fetch(body.query, body.params ?? {}, {
      perspective: 'previewDrafts',
      tag: 'preview.fetch',
    })

    return NextResponse.json({ data } as const, { status: 200 })
  } catch (error) {
    console.error('Sanity preview fetch failed', error)
    return NextResponse.json({ error: 'Failed to execute preview query.' }, { status: 500 })
  }
}
