/**
 * Webhook Trigger API Route
 *
 * Manually trigger webhooks (useful for testing and retries)
 */

import { NextRequest, NextResponse } from 'next/server'
import { triggerWebhooks, type WebhookEvent } from '@/sanity/lib/webhook-manager'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Verify request is authorized
function verifyAuthorization(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  const apiToken = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN

  if (!apiToken || token !== apiToken) {
    return false
  }

  return true
}

/**
 * POST /api/webhooks/trigger
 *
 * Trigger webhooks for a document event
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authorization
    if (!verifyAuthorization(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()

    const {
      event,
      documentId,
      documentType,
      documentTitle,
      document,
      previousData,
      metadata,
    } = body

    // Validate required fields
    if (!event || !documentId || !documentType) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          required: ['event', 'documentId', 'documentType'],
        },
        { status: 400 }
      )
    }

    // Trigger webhooks
    await triggerWebhooks(
      event as WebhookEvent,
      documentId,
      documentType,
      documentTitle,
      document,
      previousData,
      metadata
    )

    return NextResponse.json({
      success: true,
      message: 'Webhooks triggered successfully',
      event,
      documentId,
      documentType,
    })
  } catch (error: any) {
    console.error('Failed to trigger webhooks:', error)

    return NextResponse.json(
      {
        error: 'Failed to trigger webhooks',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
