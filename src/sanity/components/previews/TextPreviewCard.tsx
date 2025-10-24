import React from 'react'
import BasePreviewCard from './BasePreviewCard'

type TextPreviewProps = {
  heading?: string
  body?: unknown // Portable Text
  align?: string
}

export default function TextPreviewCard(props: TextPreviewProps) {
  const { heading, body, align } = props

  const isComplete = Boolean(body)

  return (
    <BasePreviewCard
      title={heading || 'Text Content'}
      subtitle={align ? `Alignment: ${align}` : undefined}
      isComplete={isComplete}
      badge="Text"
      badgeColor="blue"
    />
  )
}
