/**
 * Health Check Endpoint
 *
 * Simple health check for uptime monitors (UptimeRobot, Pingdom, etc.)
 *
 * GET /api/health - Returns 200 if healthy, 503 if degraded
 */

import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic' // Don't cache health checks

export async function GET() {
  try {
    // Basic health check
    const healthy = true

    // You can add more sophisticated checks here
    // For example: check database connection, check external APIs, etc.

    if (healthy) {
      return NextResponse.json(
        {
          status: 'healthy',
          timestamp: new Date().toISOString(),
        },
        {
          status: 200,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          },
        }
      )
    } else {
      return NextResponse.json(
        {
          status: 'degraded',
          timestamp: new Date().toISOString(),
        },
        {
          status: 503,
          headers: {
            'Cache-Control': 'no-store',
          },
        }
      )
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  }
}
