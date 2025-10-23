/**
 * Webhook Test API Route
 *
 * Test webhook delivery without triggering real events
 */

import { NextRequest, NextResponse } from 'next/server'
import { testWebhook } from '@/sanity/lib/webhook-manager'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Verify request is authorized
function verifyAuthorization(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  const apiToken = process.env.SANITY_API_TOKEN

  if (!apiToken || token !== apiToken) {
    return false
  }

  return true
}

/**
 * POST /api/webhooks/test
 *
 * Test a webhook endpoint
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authorization
    if (!verifyAuthorization(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { webhookId } = body

    // Validate required fields
    if (!webhookId) {
      return NextResponse.json(
        {
          error: 'Missing required field: webhookId',
        },
        { status: 400 }
      )
    }

    // Test webhook
    const result = await testWebhook(webhookId)

    return NextResponse.json({
      success: result.success,
      statusCode: result.statusCode,
      responseBody: result.responseBody,
      error: result.error,
      duration: result.duration,
    })
  } catch (error: any) {
    console.error('Failed to test webhook:', error)

    return NextResponse.json(
      {
        error: 'Failed to test webhook',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
