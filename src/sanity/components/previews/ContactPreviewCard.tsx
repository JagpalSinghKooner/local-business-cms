import React from 'react'
import BasePreviewCard from './BasePreviewCard'

type ContactPreviewProps = {
  heading?: string
  description?: string
  showMap?: boolean
  showContactInfo?: boolean
}

export default function ContactPreviewCard(props: ContactPreviewProps) {
  const { heading, description, showMap, showContactInfo } = props

  return (
    <BasePreviewCard
      title={heading || 'Contact Form'}
      description={description}
      isComplete={true}
      badge="Contact"
      badgeColor="green"
    >
      <div className="flex gap-3 text-xs text-gray-500">
        {showMap && <span>✓ Map</span>}
        {showContactInfo && <span>✓ Contact Info</span>}
      </div>
    </BasePreviewCard>
  )
}
