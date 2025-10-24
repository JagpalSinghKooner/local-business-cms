import React from 'react'
import { CheckCircleIcon, AlertTriangleIcon, ImageIcon } from 'lucide-react'

/**
 * Base Preview Card Component
 * Reusable styled card for section previews in Sanity Studio
 */

type PreviewCardProps = {
  title?: string
  subtitle?: string
  description?: string
  hasImage?: boolean
  isComplete?: boolean
  badge?: string
  badgeColor?: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'yellow'
  children?: React.ReactNode
}

const badgeColors = {
  blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  green: 'bg-green-500/20 text-green-400 border-green-500/30',
  purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  pink: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
}

export default function BasePreviewCard({
  title = 'Untitled Section',
  subtitle,
  description,
  hasImage = false,
  isComplete = true,
  badge,
  badgeColor = 'blue',
  children,
}: PreviewCardProps) {
  return (
    <div className="group relative rounded-lg border border-gray-700 bg-gray-900 p-4 shadow-sm transition-all hover:border-gray-600 hover:shadow-md">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-base text-gray-100 truncate">{title}</h4>
          {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
        </div>

        {/* Status & Badge */}
        <div className="flex items-center gap-2 shrink-0">
          {badge && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${badgeColors[badgeColor]}`}
            >
              {badge}
            </span>
          )}
          {isComplete ? (
            <CheckCircleIcon className="w-5 h-5 text-green-400" />
          ) : (
            <AlertTriangleIcon className="w-5 h-5 text-yellow-400" />
          )}
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{description}</p>
      )}

      {/* Custom Content */}
      {children && <div className="mt-3 space-y-2">{children}</div>}

      {/* Media Indicator */}
      {hasImage && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Image attached</span>
        </div>
      )}
    </div>
  )
}
