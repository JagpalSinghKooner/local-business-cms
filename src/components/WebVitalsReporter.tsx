'use client'

import { useReportWebVitals } from 'next/web-vitals'
import { reportWebVitals, type Metric } from '@/lib/web-vitals'

/**
 * Web Vitals Reporter Component
 *
 * Client component that reports Core Web Vitals metrics using Next.js useReportWebVitals hook.
 * Must be included in root layout to track all pages.
 *
 * Features:
 * - Reports metrics to analytics endpoint
 * - Emits custom events for performance dashboard (dev mode)
 * - Checks performance budgets
 *
 * Usage:
 * ```tsx
 * // app/layout.tsx
 * import WebVitalsReporter from '@/components/WebVitalsReporter'
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <WebVitalsReporter />
 *         {children}
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */
export default function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    // Type assertion needed due to Next.js types not matching web-vitals types exactly
    const typedMetric = metric as unknown as Metric

    // Report to analytics
    reportWebVitals(typedMetric)

    // Emit custom event for performance dashboard (development only)
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      const event = new CustomEvent('web-vitals-metric', { detail: typedMetric })
      window.dispatchEvent(event)
    }
  })

  return null
}
