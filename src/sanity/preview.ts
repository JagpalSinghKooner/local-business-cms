'use client'

import { useEffect, useMemo, useState } from 'react'

type PreviewParams = Record<string, unknown> | undefined

type PreviewResponse<T> = {
  data: T
}

export function usePreview<T>(initialData: T, query: string, params?: PreviewParams): T {
  const [data, setData] = useState<T>(initialData)

  useEffect(() => {
    setData(initialData)
  }, [initialData])

  const requestPayload = useMemo(
    () => JSON.stringify({ query, params: params ?? {} }),
    [params, query],
  )

  useEffect(() => {
    let cancelled = false

    async function fetchPreview() {
      try {
        const response = await fetch('/api/preview/fetch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: requestPayload,
        })

        if (!response.ok) {
          const message = await response.text()
          console.error('Failed to fetch preview data', message)
          return
        }

        const payload = (await response.json()) as PreviewResponse<T>
        if (!cancelled) {
          setData(payload.data)
        }
      } catch (error) {
        console.error('Unexpected preview fetch error', error)
      }
    }

    fetchPreview()
    const interval = setInterval(fetchPreview, 4000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [requestPayload])

  return data
}
