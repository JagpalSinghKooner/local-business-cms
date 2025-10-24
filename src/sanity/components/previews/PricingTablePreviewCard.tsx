import React from 'react'
import BasePreviewCard from './BasePreviewCard'

type PricingTablePreviewProps = {
  title?: string
  description?: string
  plans?: Array<{ name?: string }>
}

export default function PricingTablePreviewCard(props: PricingTablePreviewProps) {
  const { title, description, plans } = props

  const isComplete = Boolean(plans && plans.length > 0)
  const planCount = plans?.length || 0

  return (
    <BasePreviewCard
      title={title || 'Pricing Table'}
      subtitle={`${planCount} plan${planCount !== 1 ? 's' : ''}`}
      description={description}
      isComplete={isComplete}
      badge="Pricing"
      badgeColor="green"
    />
  )
}
