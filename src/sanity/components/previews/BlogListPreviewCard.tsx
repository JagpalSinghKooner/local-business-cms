import React from 'react'
import BasePreviewCard from './BasePreviewCard'

type BlogListPreviewProps = {
  title?: string
  description?: string
  postsToShow?: number
  showFeaturedFirst?: boolean
}

export default function BlogListPreviewCard(props: BlogListPreviewProps) {
  const { title, description, postsToShow = 6, showFeaturedFirst } = props

  return (
    <BasePreviewCard
      title={title || 'Blog Posts'}
      subtitle={`Showing ${postsToShow} posts`}
      description={description}
      isComplete={true}
      badge="Blog"
      badgeColor="blue"
    >
      {showFeaturedFirst && (
        <div className="text-xs text-gray-500">✓ Featured posts first</div>
      )}
    </BasePreviewCard>
  )
}
