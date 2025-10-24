import React from 'react'
import BasePreviewCard from './BasePreviewCard'

type LocationsPreviewProps = {
  title?: string
  description?: string
  locations?: Array<unknown>
  displayAll?: boolean
  showMap?: boolean
}

export default function LocationsPreviewCard(props: LocationsPreviewProps) {
  const { title, description, locations, displayAll, showMap } = props

  const locationCount = locations?.length || 0
  const displayText = displayAll ? 'All locations' : `${locationCount} location${locationCount !== 1 ? 's' : ''}`

  return (
    <BasePreviewCard
      title={title || 'Locations'}
      subtitle={displayText}
      description={description}
      isComplete={true}
      badge="Locations"
      badgeColor="purple"
    >
      {showMap && <div className="text-xs text-gray-500">✓ Map view enabled</div>}
    </BasePreviewCard>
  )
}
