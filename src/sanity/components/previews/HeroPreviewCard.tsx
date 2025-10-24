import React from 'react'
import BasePreviewCard from './BasePreviewCard'

type HeroPreviewProps = {
  eyebrow?: string
  heading?: string
  subheading?: string
  variant?: string
  media?: unknown
  ctas?: Array<{ label?: string }>
}

export default function HeroPreviewCard(props: HeroPreviewProps) {
  const { eyebrow, heading, subheading, variant, media, ctas } = props

  const isComplete = Boolean(heading && (media || variant === 'centered'))
  const ctaCount = ctas?.length || 0

  return (
    <BasePreviewCard
      title={heading || 'Hero Section'}
      subtitle={variant ? `Layout: ${variant}` : undefined}
      description={subheading || eyebrow}
      hasImage={Boolean(media)}
      isComplete={isComplete}
      badge="Hero"
      badgeColor="blue"
    >
      {ctaCount > 0 && (
        <div className="text-xs text-gray-500">
          {ctaCount} CTA button{ctaCount > 1 ? 's' : ''}
        </div>
      )}
    </BasePreviewCard>
  )
}
