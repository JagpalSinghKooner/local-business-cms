'use client'

import { useDraftModeEnvironment } from 'next-sanity/hooks'

/**
 * Disable Draft Mode Component
 * Shows a button to exit draft mode when viewing outside Presentation tool
 */
export function DisableDraftMode() {
  const environment = useDraftModeEnvironment()

  // Only show in real browser, not in Presentation tool iframe
  if (environment !== 'live') {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        zIndex: 999999,
      }}
    >
      <a
        href="/api/draft/disable"
        style={{
          background: '#000',
          color: '#fff',
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem',
          fontSize: '0.875rem',
          textDecoration: 'none',
          display: 'block',
        }}
      >
        Exit Draft Mode
      </a>
    </div>
  )
}
