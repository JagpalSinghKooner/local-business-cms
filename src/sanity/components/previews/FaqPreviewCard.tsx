import React from 'react'
import BasePreviewCard from './BasePreviewCard'

type FaqPreviewProps = {
  title?: string
  description?: string
  faqs?: Array<unknown>
  display?: string
}

export default function FaqPreviewCard(props: FaqPreviewProps) {
  const { title, description, faqs, display } = props

  const isComplete = Boolean(faqs && faqs.length > 0)
  const faqCount = faqs?.length || 0

  return (
    <BasePreviewCard
      title={title || 'FAQ Section'}
      subtitle={`${faqCount} question${faqCount !== 1 ? 's' : ''}`}
      description={description}
      isComplete={isComplete}
      badge="FAQ"
      badgeColor="purple"
    >
      {display && (
        <div className="text-xs text-gray-500">Display: {display}</div>
      )}
    </BasePreviewCard>
  )
}
