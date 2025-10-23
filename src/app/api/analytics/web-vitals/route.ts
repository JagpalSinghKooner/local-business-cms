/**
 * Web Vitals Analytics API Endpoint
 *
 * Receives Core Web Vitals metrics from the client and stores them.
 * In production, this should forward to your analytics platform (Vercel Analytics, DataDog, etc.)
 */

import { type NextRequest, NextResponse } from 'next/server'

interface WebVitalsPayload {
  metric: 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
  navigationType: string
  budgetViolated: boolean
  url: string
  path: string
  userAgent: string
  timestamp: number
  effectiveConnectionType?: string
  saveData?: boolean
  downlink?: number
  rtt?: number
}

export async function POST(request: NextRequest) {
  try {
    const payload: WebVitalsPayload = await request.json()

    // Validate payload
    if (!payload.metric || typeof payload.value !== 'number') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals API]', {
        metric: payload.metric,
        value: Math.round(payload.value),
        rating: payload.rating,
        budgetViolated: payload.budgetViolated,
        path: payload.path,
      })
    }

    // In production, forward to your analytics platform
    // Examples:
    // - Send to Vercel Analytics
    // - Send to DataDog
    // - Send to CloudWatch
    // - Store in database (Postgres, TimescaleDB, InfluxDB)
    // - Send to log aggregator (Logtail, Axiom)

    if (process.env.NODE_ENV === 'production') {
      // Example: Forward to external analytics service
      // await fetch('https://analytics.example.com/api/metrics', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${process.env.ANALYTICS_API_KEY}`,
      //   },
      //   body: JSON.stringify(payload),
      // })

      // Example: Store in database
      // await db.webVitals.create({ data: payload })

      // For now, just log budget violations
      if (payload.budgetViolated) {
        console.warn(
          `[Web Vitals] Budget violation: ${payload.metric} = ${Math.round(payload.value)}ms on ${payload.path}`
        )
      }
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[Web Vitals API] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Respond to OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
