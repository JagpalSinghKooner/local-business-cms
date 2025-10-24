import React from 'react'
import BasePreviewCard from './BasePreviewCard'

type LogosPreviewProps = {
  title?: string
  logos?: Array<unknown>
}

export default function LogosPreviewCard(props: LogosPreviewProps) {
  const { title, logos } = props

  const isComplete = Boolean(logos && logos.length > 0)
  const logoCount = logos?.length || 0

  return (
    <BasePreviewCard
      title={title || 'Logo Grid'}
      subtitle={`${logoCount} logo${logoCount !== 1 ? 's' : ''}`}
      hasImage={logoCount > 0}
      isComplete={isComplete}
      badge="Logos"
      badgeColor="blue"
    />
  )
}
