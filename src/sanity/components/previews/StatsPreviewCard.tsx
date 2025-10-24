import React from 'react'
import BasePreviewCard from './BasePreviewCard'

type StatsPreviewProps = {
  title?: string
  description?: string
  stats?: Array<{ label?: string; value?: string }>
}

export default function StatsPreviewCard(props: StatsPreviewProps) {
  const { title, description, stats } = props

  const isComplete = Boolean(stats && stats.length > 0)
  const statCount = stats?.length || 0

  return (
    <BasePreviewCard
      title={title || 'Statistics'}
      subtitle={`${statCount} stat${statCount !== 1 ? 's' : ''}`}
      description={description}
      isComplete={isComplete}
      badge="Stats"
      badgeColor="green"
    />
  )
}
