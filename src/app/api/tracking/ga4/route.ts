/**
 * GA4 Tracking API Route
 *
 * Proxy for client-side tracking through server
 */

import { NextRequest, NextResponse } from 'next/server'
import { sendGA4Event, type GA4Event, type GA4Config } from '@/lib/ga4-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { events, clientId, userId, sessionId } = body

    if (!events || !Array.isArray(events)) {
      return NextResponse.json(
        {
          error: 'Missing or invalid events array',
        },
        { status: 400 }
      )
    }

    const measurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID
    const apiSecret = process.env.GA4_API_SECRET

    if (!measurementId || !apiSecret) {
      return NextResponse.json(
        {
          error: 'GA4 not configured',
        },
        { status: 500 }
      )
    }

    const config: GA4Config = {
      measurementId,
      apiSecret,
      clientId: clientId || request.headers.get('x-client-id') || undefined,
      userId,
      sessionId,
    }

    const success = await sendGA4Event(config, events as GA4Event[])

    if (!success) {
      return NextResponse.json(
        {
          error: 'Failed to send events to GA4',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      eventCount: events.length,
    })
  } catch (error: any) {
    console.error('GA4 tracking failed:', error)

    return NextResponse.json(
      {
        error: 'Failed to track events',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
