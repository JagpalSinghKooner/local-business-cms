/**
 * Redirect Performance Monitoring
 *
 * Simple in-memory metrics tracking for redirect performance.
 * In production, these would be sent to an analytics service.
 */

interface RedirectMetric {
  path: string
  destination: string
  matchType: string
  processingTime: number
  timestamp: Date
}

// In-memory storage (resets on server restart)
const metrics: RedirectMetric[] = []
const MAX_METRICS = 1000 // Keep last 1000 redirects

export function trackRedirect(
  path: string,
  destination: string,
  matchType: string,
  processingTime: number
) {
  metrics.push({
    path,
    destination,
    matchType,
    processingTime,
    timestamp: new Date(),
  })

  // Keep only last MAX_METRICS
  if (metrics.length > MAX_METRICS) {
    metrics.shift()
  }

  // Log slow redirects (> 50ms)
  if (processingTime > 50) {
    console.warn(
      `⚠️  Slow redirect detected: ${path} → ${destination} (${processingTime.toFixed(2)}ms)`
    )
  }
}

export function getMetrics() {
  return {
    total: metrics.length,
    avgProcessingTime:
      metrics.length > 0
        ? metrics.reduce((sum, m) => sum + m.processingTime, 0) / metrics.length
        : 0,
    slowRedirects: metrics.filter((m) => m.processingTime > 50).length,
    recentRedirects: metrics.slice(-10),
  }
}
