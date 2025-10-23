/**
 * Web Vitals Tracking
 *
 * Monitors Core Web Vitals and sends to analytics.
 * Metrics tracked:
 * - LCP (Largest Contentful Paint) - Loading performance
 * - FID (First Input Delay) - Interactivity (deprecated, use INP)
 * - CLS (Cumulative Layout Shift) - Visual stability
 * - INP (Interaction to Next Paint) - Responsiveness
 * - TTFB (Time to First Byte) - Server response time
 * - FCP (First Contentful Paint) - Initial rendering
 */

export type Metric = {
  name: 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
  navigationType: 'navigate' | 'reload' | 'back_forward' | 'back-forward' | 'prerender' | 'restore'
}

// Performance thresholds (Google recommended values)
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  INP: { good: 200, poor: 500 },
  CLS: { good: 0.1, poor: 0.25 },
  TTFB: { good: 800, poor: 1800 },
  FCP: { good: 1800, poor: 3000 },
}

function getRating(name: Metric['name'], value: number): Metric['rating'] {
  const threshold = THRESHOLDS[name]
  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

/**
 * Performance Budget Configuration
 * Define maximum acceptable values for each metric
 */
export const PERFORMANCE_BUDGET = {
  LCP: 2500,  // Target: good threshold
  FID: 100,   // Target: good threshold
  INP: 200,   // Target: good threshold
  CLS: 0.1,   // Target: good threshold
  TTFB: 800,  // Target: good threshold
  FCP: 1800,  // Target: good threshold
} as const

/**
 * Check if metric violates performance budget
 */
export function checkPerformanceBudget(metric: Metric): boolean {
  const budget = PERFORMANCE_BUDGET[metric.name]
  const violated = metric.value > budget

  if (violated) {
    console.warn(
      `[Performance Budget] ${metric.name} violated:`,
      `${Math.round(metric.value)}${metric.name === 'CLS' ? '' : 'ms'}`,
      `(budget: ${budget}${metric.name === 'CLS' ? '' : 'ms'})`
    )
  }

  return violated
}

/**
 * Get network information if available
 */
function getNetworkInfo() {
  if (typeof navigator === 'undefined') return {}

  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

  return {
    effectiveConnectionType: connection?.effectiveType,
    saveData: connection?.saveData,
    downlink: connection?.downlink,
    rtt: connection?.rtt,
  }
}

/**
 * Report Web Vitals to analytics
 */
export function reportWebVitals(metric: Metric) {
  const rating = getRating(metric.name, metric.value)
  const budgetViolated = checkPerformanceBudget(metric)

  // Enhanced logging in development
  if (process.env.NODE_ENV === 'development') {
    const emoji = rating === 'good' ? '✅' : rating === 'needs-improvement' ? '⚠️' : '❌'
    const budgetEmoji = budgetViolated ? '🚨' : '✅'

    // eslint-disable-next-line no-console
    console.log(
      `${emoji} [Web Vitals] ${metric.name}:`,
      `${Math.round(metric.value)}${metric.name === 'CLS' ? '' : 'ms'}`,
      `(${rating})`,
      `${budgetEmoji} Budget: ${PERFORMANCE_BUDGET[metric.name]}${metric.name === 'CLS' ? '' : 'ms'}`,
      `| ${metric.navigationType}`
    )
  }

  // Send to Google Analytics if available
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
      metric_rating: rating,
      metric_delta: Math.round(metric.name === 'CLS' ? metric.delta * 1000 : metric.delta),
    })
  }

  // Send to custom analytics endpoint
  if (typeof window !== 'undefined') {
    const body = JSON.stringify({
      metric: metric.name,
      value: metric.value,
      rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
      budgetViolated,
      url: window.location.href,
      path: window.location.pathname,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      ...getNetworkInfo(),
    })

    const endpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT || '/api/analytics/web-vitals'

    // Use sendBeacon for reliability (doesn't block page unload)
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, body)
    } else {
      fetch(endpoint, {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      }).catch(() => {
        // Silently fail - don't affect user experience
      })
    }
  }
}

/**
 * Get performance summary for all metrics
 */
export function getPerformanceSummary(): Record<Metric['name'], { budget: number; threshold: typeof THRESHOLDS[Metric['name']] }> {
  return {
    LCP: { budget: PERFORMANCE_BUDGET.LCP, threshold: THRESHOLDS.LCP },
    FID: { budget: PERFORMANCE_BUDGET.FID, threshold: THRESHOLDS.FID },
    INP: { budget: PERFORMANCE_BUDGET.INP, threshold: THRESHOLDS.INP },
    CLS: { budget: PERFORMANCE_BUDGET.CLS, threshold: THRESHOLDS.CLS },
    TTFB: { budget: PERFORMANCE_BUDGET.TTFB, threshold: THRESHOLDS.TTFB },
    FCP: { budget: PERFORMANCE_BUDGET.FCP, threshold: THRESHOLDS.FCP },
  }
}

// Extend Window type for gtag
declare global {
  interface Window {
    gtag?: (
      command: 'event',
      eventName: string,
      eventParams: {
        event_category: string
        event_label: string
        value: number
        non_interaction: boolean
        metric_rating: string
        metric_delta: number
      }
    ) => void
  }
}
