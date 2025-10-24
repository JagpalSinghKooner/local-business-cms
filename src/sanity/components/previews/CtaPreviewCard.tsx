import React from 'react'
import BasePreviewCard from './BasePreviewCard'

type CtaPreviewProps = {
  heading?: string
  body?: string
  background?: string
  ctas?: Array<{ label?: string }>
}

export default function CtaPreviewCard(props: CtaPreviewProps) {
  const { heading, body, background, ctas } = props

  const isComplete = Boolean(heading && ctas && ctas.length > 0)
  const ctaCount = ctas?.length || 0

  return (
    <BasePreviewCard
      title={heading || 'CTA Banner'}
      subtitle={background ? `Background: ${background}` : undefined}
      description={body}
      isComplete={isComplete}
      badge="CTA"
      badgeColor="orange"
    >
      {ctaCount > 0 && (
        <div className="text-xs text-gray-500">
          {ctaCount} button{ctaCount > 1 ? 's' : ''}
        </div>
      )}
    </BasePreviewCard>
  )
}
