import React from 'react'
import BasePreviewCard from './BasePreviewCard'

type OffersPreviewProps = {
  title?: string
  description?: string
  offers?: Array<unknown>
  displayAll?: boolean
  layout?: string
}

export default function OffersPreviewCard(props: OffersPreviewProps) {
  const { title, description, offers, displayAll, layout } = props

  const offerCount = offers?.length || 0
  const displayText = displayAll ? 'All offers' : `${offerCount} offer${offerCount !== 1 ? 's' : ''}`

  return (
    <BasePreviewCard
      title={title || 'Special Offers'}
      subtitle={displayText}
      description={description}
      isComplete={true}
      badge="Offers"
      badgeColor="orange"
    >
      {layout && (
        <div className="text-xs text-gray-500">Layout: {layout}</div>
      )}
    </BasePreviewCard>
  )
}
