import { useEffect, useMemo, useState } from 'react'

const PREVIEW_ORIGIN =
  process.env.SANITY_STUDIO_PREVIEW_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
const PREVIEW_SECRET = process.env.SANITY_PREVIEW_SECRET

interface IframePreviewProps {
  document?: {
    type?: string
    displayed?: Record<string, unknown>
  }
}

const resolvePreviewPath = (type: string, slug?: string | null): string | null => {
  if (!slug) return null
  const cleanSlug = slug.replace(/^\/+|\/+$/g, '')
  switch (type) {
    case 'page':
      return cleanSlug === 'home' ? '/' : `/${cleanSlug}`
    case 'service':
      return `/services/${cleanSlug}`
    case 'location':
      return `/locations/${cleanSlug}`
    case 'offer':
      return `/offers/${cleanSlug}`
    default:
      return `/${cleanSlug}`
  }
}

const resolvePreviewType = (schemaType: string): string => {
  if (schemaType === 'page' || schemaType === 'pageTemplate') return 'page'
  if (schemaType === 'service') return 'service'
  if (schemaType === 'location') return 'location'
  if (schemaType === 'offer') return 'offer'
  return 'page'
}

export default function IframePreview(props: IframePreviewProps) {
  const document = props?.document
  const [ready, setReady] = useState(false)
  const schemaType = document?.type
  const current = document?.displayed
  const previewType = resolvePreviewType(schemaType || 'page')
  const slugValue = current?.slug as { current?: string } | undefined
  const slug: string | undefined = slugValue?.current
  const previewPath = useMemo(() => resolvePreviewPath(previewType, slug), [previewType, slug])

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 100)
    return () => clearTimeout(timer)
  }, [slug])

  if (!PREVIEW_SECRET) {
    return <p className="p-4 text-sm">Set <code>SANITY_PREVIEW_SECRET</code> in your Studio environment to enable live previews.</p>
  }

  if (!previewPath) {
    return <p className="p-4 text-sm">Add a slug to preview this document.</p>
  }

  const previewUrl = `${PREVIEW_ORIGIN}/api/preview?secret=${encodeURIComponent(PREVIEW_SECRET)}&type=${previewType}&slug=${encodeURIComponent(previewPath.replace(/^\//, ''))}`

  return (
    <div className="h-full w-full">
      {ready ? (
        <iframe
          key={previewUrl}
          src={previewUrl}
          title="Preview"
          className="h-full w-full border-0"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-muted">Preparing preview…</div>
      )}
    </div>
  )
}
