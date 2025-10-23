'use client'

import { useEffect, useState } from 'react'
import { PERFORMANCE_BUDGET, getPerformanceSummary, type Metric } from '@/lib/web-vitals'

interface MetricData {
  name: Metric['name']
  value: number | null
  rating: 'good' | 'needs-improvement' | 'poor' | 'pending'
  budget: number
}

/**
 * Performance Dashboard Component
 *
 * Displays real-time Core Web Vitals metrics in development mode.
 * Shows current values, ratings, and budget violations.
 *
 * Usage: Add to layout in development mode only
 */
export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<Record<Metric['name'], MetricData>>({
    LCP: { name: 'LCP', value: null, rating: 'pending', budget: PERFORMANCE_BUDGET.LCP },
    FID: { name: 'FID', value: null, rating: 'pending', budget: PERFORMANCE_BUDGET.FID },
    CLS: { name: 'CLS', value: null, rating: 'pending', budget: PERFORMANCE_BUDGET.CLS },
    INP: { name: 'INP', value: null, rating: 'pending', budget: PERFORMANCE_BUDGET.INP },
    TTFB: { name: 'TTFB', value: null, rating: 'pending', budget: PERFORMANCE_BUDGET.TTFB },
    FCP: { name: 'FCP', value: null, rating: 'pending', budget: PERFORMANCE_BUDGET.FCP },
  })
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') {
      setIsVisible(false)
      return
    }

    // Listen for web vitals metrics
    const handleMetric = (event: CustomEvent<Metric>) => {
      const metric = event.detail

      setMetrics((prev) => ({
        ...prev,
        [metric.name]: {
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          budget: PERFORMANCE_BUDGET[metric.name],
        },
      }))
    }

    // Create custom event listener
    window.addEventListener('web-vitals-metric' as any, handleMetric as EventListener)

    return () => {
      window.removeEventListener('web-vitals-metric' as any, handleMetric as EventListener)
    }
  }, [])

  if (!isVisible || process.env.NODE_ENV !== 'development') {
    return null
  }

  const formatValue = (name: Metric['name'], value: number | null) => {
    if (value === null) return '—'
    return name === 'CLS' ? value.toFixed(3) : `${Math.round(value)}ms`
  }

  const getRatingColor = (rating: MetricData['rating']) => {
    switch (rating) {
      case 'good':
        return 'text-green-600 bg-green-50'
      case 'needs-improvement':
        return 'text-yellow-600 bg-yellow-50'
      case 'poor':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-500 bg-gray-50'
    }
  }

  const getRatingEmoji = (rating: MetricData['rating']) => {
    switch (rating) {
      case 'good':
        return '✅'
      case 'needs-improvement':
        return '⚠️'
      case 'poor':
        return '❌'
      default:
        return '⏳'
    }
  }

  const budgetViolations = Object.values(metrics).filter(
    (m) => m.value !== null && m.value > m.budget
  ).length

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-gray-800 transition-colors"
          aria-label="Open performance dashboard"
        >
          <span className="text-lg">⚡</span>
          <span>Performance</span>
          {budgetViolations > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs">
              {budgetViolations}
            </span>
          )}
        </button>
      )}

      {/* Dashboard Panel */}
      {isOpen && (
        <div className="w-80 rounded-lg bg-white shadow-2xl ring-1 ring-gray-900/10">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <h3 className="text-sm font-semibold text-gray-900">Core Web Vitals</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close dashboard"
            >
              ✕
            </button>
          </div>

          {/* Metrics List */}
          <div className="divide-y divide-gray-100">
            {Object.values(metrics).map((metric) => (
              <div key={metric.name} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getRatingEmoji(metric.rating)}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{metric.name}</div>
                      <div className="text-xs text-gray-500">
                        Budget: {metric.name === 'CLS' ? metric.budget : `${metric.budget}ms`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex rounded px-2 py-1 text-xs font-medium ${getRatingColor(metric.rating)}`}>
                      {formatValue(metric.name, metric.value)}
                    </div>
                    <div className="mt-1 text-xs text-gray-500 capitalize">
                      {metric.rating === 'pending' ? 'Loading...' : metric.rating}
                    </div>
                  </div>
                </div>

                {/* Budget violation warning */}
                {metric.value !== null && metric.value > metric.budget && (
                  <div className="mt-2 text-xs text-red-600">
                    🚨 Exceeds budget by {formatValue(metric.name, metric.value - metric.budget)}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-600">
            <div className="space-y-1">
              <div>✅ Good • ⚠️ Needs Improvement • ❌ Poor</div>
              <div className="text-gray-500">Development mode only</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
