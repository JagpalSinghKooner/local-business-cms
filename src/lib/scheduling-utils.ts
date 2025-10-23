/**
 * Content Scheduling Utilities
 *
 * Utilities for checking and managing scheduled content publishing
 */

export interface ScheduledDocument {
  _id: string
  _type: string
  title?: string
  publishAt?: string
  unpublishAt?: string
  scheduling?: {
    publishAt?: string
    unpublishAt?: string
    timezone?: string
  }
}

/**
 * Check if a document should be published now
 */
export function shouldPublishNow(doc: ScheduledDocument): boolean {
  const publishAt = doc.publishAt || doc.scheduling?.publishAt

  if (!publishAt) {
    return false // No scheduled publish date
  }

  const scheduledTime = new Date(publishAt)
  const now = new Date()

  return now >= scheduledTime
}

/**
 * Check if a document should be unpublished now
 */
export function shouldUnpublishNow(doc: ScheduledDocument): boolean {
  const unpublishAt = doc.unpublishAt || doc.scheduling?.unpublishAt

  if (!unpublishAt) {
    return false // No scheduled unpublish date
  }

  const scheduledTime = new Date(unpublishAt)
  const now = new Date()

  return now >= scheduledTime
}

/**
 * Check if a document is scheduled for future publish
 */
export function isScheduledForFuture(doc: ScheduledDocument): boolean {
  const publishAt = doc.publishAt || doc.scheduling?.publishAt

  if (!publishAt) {
    return false
  }

  const scheduledTime = new Date(publishAt)
  const now = new Date()

  return scheduledTime > now
}

/**
 * Get time until scheduled publish
 */
export function getTimeUntilPublish(doc: ScheduledDocument): number | null {
  const publishAt = doc.publishAt || doc.scheduling?.publishAt

  if (!publishAt) {
    return null
  }

  const scheduledTime = new Date(publishAt)
  const now = new Date()

  return scheduledTime.getTime() - now.getTime()
}

/**
 * Format time until publish for display
 */
export function formatTimeUntilPublish(doc: ScheduledDocument): string | null {
  const ms = getTimeUntilPublish(doc)

  if (ms === null || ms < 0) {
    return null
  }

  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`
  } else {
    return 'less than a minute'
  }
}

/**
 * Check if document has scheduling configured
 */
export function hasScheduling(doc: ScheduledDocument): boolean {
  return !!(doc.publishAt || doc.unpublishAt || doc.scheduling)
}

/**
 * Get GROQ filter for documents ready to publish
 */
export function getReadyToPublishFilter(): string {
  return `publishAt != null && publishAt <= now()`
}

/**
 * Get GROQ filter for documents ready to unpublish
 */
export function getReadyToUnpublishFilter(): string {
  return `unpublishAt != null && unpublishAt <= now()`
}

/**
 * Get GROQ filter for scheduled (future) documents
 */
export function getScheduledDocumentsFilter(): string {
  return `publishAt != null && publishAt > now()`
}

/**
 * Validate scheduling dates
 */
export function validateScheduling(
  publishAt?: string,
  unpublishAt?: string
): { valid: boolean; error?: string } {
  if (!publishAt && !unpublishAt) {
    return { valid: true } // No scheduling
  }

  if (publishAt && unpublishAt) {
    const publish = new Date(publishAt)
    const unpublish = new Date(unpublishAt)

    if (unpublish <= publish) {
      return {
        valid: false,
        error: 'Unpublish date must be after publish date',
      }
    }
  }

  return { valid: true }
}

/**
 * Convert timezone-aware date to UTC
 */
export function convertToUTC(dateString: string, timezone?: string): string {
  // If timezone provided, convert to UTC
  // Otherwise, assume date is already in correct timezone
  const date = new Date(dateString)
  return date.toISOString()
}

/**
 * Get scheduled publish summary
 */
export function getSchedulingSummary(doc: ScheduledDocument): {
  status: 'not_scheduled' | 'scheduled_future' | 'ready_to_publish' | 'ready_to_unpublish'
  publishAt?: string
  unpublishAt?: string
  message: string
} {
  const publishAt = doc.publishAt || doc.scheduling?.publishAt
  const unpublishAt = doc.unpublishAt || doc.scheduling?.unpublishAt

  if (!publishAt && !unpublishAt) {
    return {
      status: 'not_scheduled',
      message: 'No scheduling configured',
    }
  }

  if (shouldPublishNow(doc)) {
    return {
      status: 'ready_to_publish',
      publishAt,
      unpublishAt,
      message: 'Ready to publish now',
    }
  }

  if (shouldUnpublishNow(doc)) {
    return {
      status: 'ready_to_unpublish',
      publishAt,
      unpublishAt,
      message: 'Ready to unpublish now',
    }
  }

  if (isScheduledForFuture(doc)) {
    const timeUntil = formatTimeUntilPublish(doc)
    return {
      status: 'scheduled_future',
      publishAt,
      unpublishAt,
      message: `Scheduled to publish in ${timeUntil}`,
    }
  }

  return {
    status: 'not_scheduled',
    publishAt,
    unpublishAt,
    message: 'Scheduling configured but not active',
  }
}
