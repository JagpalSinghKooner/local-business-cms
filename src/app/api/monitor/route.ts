/**
 * Monitoring API Endpoint
 *
 * Returns deployment status and health information
 *
 * GET /api/monitor - Get current status
 * GET /api/monitor?site=budds - Get specific site status
 */

import { NextRequest, NextResponse } from 'next/server'

interface SiteStatus {
  site: string
  dataset: string
  status: 'healthy' | 'degraded'
  timestamp: string
  checks: {
    database: boolean
    cms: boolean
    build: boolean
  }
  metadata: {
    buildDate?: string
    version?: string
    environment?: string
  }
}

interface MonitoringResponse {
  status: 'healthy' | 'degraded' | 'down'
  timestamp: string
  site: SiteStatus
  uptime?: number
}

// Cache the start time for uptime calculation
const startTime = Date.now()

/**
 * Check Sanity CMS connectivity
 */
async function checkCmsConnectivity(): Promise<boolean> {
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

    if (!projectId || !dataset) {
      return false
    }

    // Simple ping to Sanity API
    const response = await fetch(
      `https://${projectId}.api.sanity.io/v2021-10-21/data/query/${dataset}?query=*[_type == "siteConfig"][0]{_id}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 0 }, // Don't cache health checks
      }
    )

    return response.ok
  } catch (error) {
    console.error('CMS connectivity check failed:', error)
    return false
  }
}

/**
 * Get current site status
 */
async function getSiteStatus(): Promise<SiteStatus> {
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'unknown'
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Unknown Site'

  // Perform health checks
  const cmsConnected = await checkCmsConnectivity()

  // Basic checks
  const databaseCheck = cmsConnected
  const buildCheck = true // If this route is responding, build succeeded

  const status: SiteStatus = {
    site: siteName,
    dataset,
    status: databaseCheck ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    checks: {
      database: databaseCheck,
      cms: cmsConnected,
      build: buildCheck,
    },
    metadata: {
      buildDate: process.env.BUILD_DATE || new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.0',
      environment: process.env.NODE_ENV || 'development',
    },
  }

  return status
}

/**
 * GET /api/monitor
 */
export async function GET(request: NextRequest) {
  try {
    const siteStatus = await getSiteStatus()
    const uptime = Math.floor((Date.now() - startTime) / 1000)

    const response: MonitoringResponse = {
      status: siteStatus.status,
      timestamp: siteStatus.timestamp,
      site: siteStatus,
      uptime,
    }

    // Set cache headers (don't cache monitoring endpoints)
    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Type': 'application/json',
      },
    })
  } catch (error: any) {
    console.error('Monitoring endpoint error:', error)

    return NextResponse.json(
      {
        status: 'down',
        timestamp: new Date().toISOString(),
        error: error.message,
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
