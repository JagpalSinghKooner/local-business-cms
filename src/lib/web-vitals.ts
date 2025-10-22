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
 * Report Web Vitals to analytics
 */
export function reportWebVitals(metric: Metric) {
  const rating = getRating(metric.name, metric.value)

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating,
      delta: metric.delta,
      id: metric.id,
    })
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

  // Send to custom analytics endpoint (optional)
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
    const body = JSON.stringify({
      metric: metric.name,
      value: metric.value,
      rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
    })

    // Use sendBeacon for reliability (doesn't block page unload)
    if (navigator.sendBeacon) {
      navigator.sendBeacon(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, body)
    } else {
      fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      }).catch(console.error)
    }
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
