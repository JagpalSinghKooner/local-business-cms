import React from 'react'
import BasePreviewCard from './BasePreviewCard'

type TestimonialPreviewProps = {
  title?: string
  description?: string
  testimonials?: Array<unknown>
  layout?: string
}

export default function TestimonialPreviewCard(props: TestimonialPreviewProps) {
  const { title, description, testimonials, layout } = props

  const isComplete = Boolean(testimonials && testimonials.length > 0)
  const count = testimonials?.length || 0

  return (
    <BasePreviewCard
      title={title || 'Testimonials'}
      subtitle={`${count} testimonial${count !== 1 ? 's' : ''}`}
      description={description}
      isComplete={isComplete}
      badge="Testimonials"
      badgeColor="green"
    >
      {layout && (
        <div className="text-xs text-gray-500">Layout: {layout}</div>
      )}
    </BasePreviewCard>
  )
}
