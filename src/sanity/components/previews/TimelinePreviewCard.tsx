import React from 'react'
import BasePreviewCard from './BasePreviewCard'

type TimelinePreviewProps = {
  title?: string
  description?: string
  events?: Array<{ heading?: string }>
}

export default function TimelinePreviewCard(props: TimelinePreviewProps) {
  const { title, description, events } = props

  const isComplete = Boolean(events && events.length > 0)
  const eventCount = events?.length || 0

  return (
    <BasePreviewCard
      title={title || 'Timeline'}
      subtitle={`${eventCount} event${eventCount !== 1 ? 's' : ''}`}
      description={description}
      isComplete={isComplete}
      badge="Timeline"
      badgeColor="blue"
    />
  )
}
