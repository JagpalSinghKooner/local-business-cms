import React from 'react'
import BasePreviewCard from './BasePreviewCard'

type QuotePreviewProps = {
  quote?: string
  author?: string
  role?: string
}

export default function QuotePreviewCard(props: QuotePreviewProps) {
  const { quote, author, role } = props

  const isComplete = Boolean(quote)
  const subtitle = author ? `— ${author}${role ? `, ${role}` : ''}` : undefined

  return (
    <BasePreviewCard
      title={quote ? `"${quote.substring(0, 60)}${quote.length > 60 ? '...' : ''}"` : 'Quote'}
      subtitle={subtitle}
      isComplete={isComplete}
      badge="Quote"
      badgeColor="yellow"
    />
  )
}
