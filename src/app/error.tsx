'use client'

import { useEffect } from 'react'
import Container from '@/components/layout/Container'

/**
 * Root error UI
 * Shown when an error occurs in the application
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console (can be extended to send to error tracking service)
    console.error('Application error:', error)
  }, [error])

  return (
    <main className="min-h-screen bg-surface py-16">
      <Container>
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="text-6xl">⚠️</div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-strong">Something went wrong</h1>
            <p className="text-base text-muted max-w-md">
              We encountered an unexpected error while loading this page. Please try again.
            </p>
          </div>
          <button
            onClick={reset}
            className="inline-flex items-center rounded-full bg-brand px-6 py-3 text-sm font-semibold transition hover:opacity-90"
          >
            Try again
          </button>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 max-w-2xl rounded-lg border border-divider bg-surface-muted p-4 text-left">
              <summary className="cursor-pointer text-sm font-semibold text-strong">
                Error details (dev only)
              </summary>
              <pre className="mt-2 overflow-auto text-xs text-muted whitespace-pre-wrap">
                {error.message}
                {error.digest && `\n\nDigest: ${error.digest}`}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
        </div>
      </Container>
    </main>
  )
}
