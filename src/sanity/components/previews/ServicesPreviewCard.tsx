import React from 'react'
import BasePreviewCard from './BasePreviewCard'

type ServicesPreviewProps = {
  title?: string
  description?: string
  services?: Array<unknown>
  displayAll?: boolean
  layout?: string
}

export default function ServicesPreviewCard(props: ServicesPreviewProps) {
  const { title, description, services, displayAll, layout } = props

  const serviceCount = services?.length || 0
  const displayText = displayAll ? 'All services' : `${serviceCount} service${serviceCount !== 1 ? 's' : ''}`

  return (
    <BasePreviewCard
      title={title || 'Services'}
      subtitle={displayText}
      description={description}
      isComplete={true}
      badge="Services"
      badgeColor="blue"
    >
      {layout && (
        <div className="text-xs text-gray-500">Layout: {layout}</div>
      )}
    </BasePreviewCard>
  )
}
