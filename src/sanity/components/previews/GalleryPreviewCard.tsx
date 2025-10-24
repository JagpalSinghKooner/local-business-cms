import React from 'react'
import BasePreviewCard from './BasePreviewCard'

type GalleryPreviewProps = {
  title?: string
  description?: string
  images?: Array<unknown>
  columns?: number
}

export default function GalleryPreviewCard(props: GalleryPreviewProps) {
  const { title, description, images, columns } = props

  const isComplete = Boolean(images && images.length > 0)
  const imageCount = images?.length || 0

  return (
    <BasePreviewCard
      title={title || 'Image Gallery'}
      subtitle={`${imageCount} image${imageCount !== 1 ? 's' : ''}`}
      description={description}
      hasImage={imageCount > 0}
      isComplete={isComplete}
      badge="Gallery"
      badgeColor="pink"
    >
      {columns && (
        <div className="text-xs text-gray-500">{columns} columns</div>
      )}
    </BasePreviewCard>
  )
}
