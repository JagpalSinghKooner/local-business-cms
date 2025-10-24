import React from 'react'
import BasePreviewCard from './BasePreviewCard'

type MediaTextPreviewProps = {
  heading?: string
  body?: unknown
  media?: unknown
  mediaPosition?: string
}

export default function MediaTextPreviewCard(props: MediaTextPreviewProps) {
  const { heading, body, media, mediaPosition } = props

  const isComplete = Boolean(heading && body)

  return (
    <BasePreviewCard
      title={heading || 'Media + Text'}
      subtitle={mediaPosition ? `Media: ${mediaPosition}` : undefined}
      hasImage={Boolean(media)}
      isComplete={isComplete}
      badge="Media+Text"
      badgeColor="purple"
    />
  )
}
