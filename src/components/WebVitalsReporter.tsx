'use client'

import { useReportWebVitals } from 'next/web-vitals'
import { reportWebVitals, type Metric } from '@/lib/web-vitals'

/**
 * Web Vitals Reporter Component
 *
 * Client component that reports Core Web Vitals metrics using Next.js useReportWebVitals hook.
 * Must be included in root layout to track all pages.
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
    reportWebVitals(metric as unknown as Metric)
  })

  return null
}
