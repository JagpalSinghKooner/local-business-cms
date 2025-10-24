'use client'

import { NextStudio } from 'next-sanity/studio'
import { useEffect } from 'react'
import config from '../../../../sanity.config'

export default function StudioClient() {
  useEffect(() => {
    // Suppress Sanity version check errors (already disabled via unstable_noVersionCheck)
    const originalError = console.error
    console.error = (...args: unknown[]) => {
      const errorMessage = args[0]
      // Suppress "Failed to fetch version for package" errors
      if (
        typeof errorMessage === 'string' &&
        errorMessage.includes('Failed to fetch version for package')
      ) {
        return // Silently ignore this specific error
      }
      originalError.apply(console, args)
    }

    return () => {
      console.error = originalError
    }
  }, [])

  return <NextStudio config={config} />
}
