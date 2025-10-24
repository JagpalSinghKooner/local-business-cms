import React from 'react'
import BasePreviewCard from './BasePreviewCard'

type StepsPreviewProps = {
  title?: string
  description?: string
  steps?: Array<{ heading?: string }>
}

export default function StepsPreviewCard(props: StepsPreviewProps) {
  const { title, description, steps } = props

  const isComplete = Boolean(steps && steps.length > 0)
  const stepCount = steps?.length || 0

  return (
    <BasePreviewCard
      title={title || 'Process Steps'}
      subtitle={`${stepCount} step${stepCount !== 1 ? 's' : ''}`}
      description={description}
      isComplete={isComplete}
      badge="Steps"
      badgeColor="purple"
    />
  )
}
