import React from 'react'
import BasePreviewCard from './BasePreviewCard'

type FeaturesPreviewProps = {
  title?: string
  description?: string
  features?: Array<{ heading?: string }>
  layout?: string
}

export default function FeaturesPreviewCard(props: FeaturesPreviewProps) {
  const { title, description, features, layout } = props

  const isComplete = Boolean(features && features.length > 0)
  const featureCount = features?.length || 0

  return (
    <BasePreviewCard
      title={title || 'Features'}
      subtitle={`${featureCount} feature${featureCount !== 1 ? 's' : ''}`}
      description={description}
      isComplete={isComplete}
      badge="Features"
      badgeColor="blue"
    >
      {layout && (
        <div className="text-xs text-gray-500">Layout: {layout}</div>
      )}
    </BasePreviewCard>
  )
}
