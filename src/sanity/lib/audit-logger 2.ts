/**
 * Audit Logger
 *
 * Utility for creating audit log entries to track content changes
 */

import { createClient } from '@sanity/client'
import { triggerWebhooks, type WebhookEvent } from './webhook-manager'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const token = process.env.SANITY_API_TOKEN

export type AuditAction =
  | 'created'
  | 'updated'
  | 'deleted'
  | 'published'
  | 'unpublished'
  | 'workflow_changed'
  | 'scheduled'

export interface AuditLogEntry {
  action: AuditAction
  documentId: string
  documentType: string
  documentTitle?: string
  userId?: string
  userName?: string
  userEmail?: string
  changes?: Array<{
    field: string
    oldValue?: string
    newValue?: string
  }>
  metadata?: {
    ipAddress?: string
    userAgent?: string
    dataset?: string
    previousWorkflowState?: string
    newWorkflowState?: string
  }
  notes?: string
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(entry: AuditLogEntry): Promise<void> {
  if (!token) {
    console.warn('SANITY_API_TOKEN not set, skipping audit log')
    return
  }

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      token,
      useCdn: false,
    })

    await client.create({
      _type: 'auditLog',
      action: entry.action,
      documentId: entry.documentId,
      documentType: entry.documentType,
      documentTitle: entry.documentTitle,
      userId: entry.userId,
      userName: entry.userName,
      userEmail: entry.userEmail,
      timestamp: new Date().toISOString(),
      changes: entry.changes,
      metadata: {
        ...entry.metadata,
        dataset: dataset,
      },
      notes: entry.notes,
    })

    // Trigger webhooks for this event
    const webhookEvent = mapAuditActionToWebhookEvent(entry.action)
    if (webhookEvent) {
      await triggerWebhooks(
        webhookEvent,
        entry.documentId,
        entry.documentType,
        entry.documentTitle,
        undefined, // document data not available here
        undefined, // previous data not available here
        {
          userId: entry.userId,
          userName: entry.userName,
          workflowState: entry.metadata?.newWorkflowState,
          previousWorkflowState: entry.metadata?.previousWorkflowState,
          changes: entry.changes,
        }
      )
    }
  } catch (error) {
    console.error('Failed to create audit log:', error)
    // Don't throw - audit logging shouldn't break the main operation
  }
}

/**
 * Map audit action to webhook event
 */
function mapAuditActionToWebhookEvent(action: AuditAction): WebhookEvent | null {
  const mapping: Record<AuditAction, WebhookEvent | null> = {
    created: 'document.created',
    updated: 'document.updated',
    deleted: 'document.deleted',
    published: 'document.published',
    unpublished: 'document.unpublished',
    workflow_changed: 'workflow.changed',
    scheduled: 'scheduled.publish',
  }

  return mapping[action]
}

/**
 * Log document creation
 */
export async function logDocumentCreated(
  documentId: string,
  documentType: string,
  documentTitle?: string,
  userId?: string,
  userName?: string
): Promise<void> {
  await createAuditLog({
    action: 'created',
    documentId,
    documentType,
    documentTitle,
    userId,
    userName,
    notes: `Document created`,
  })
}

/**
 * Log document update
 */
export async function logDocumentUpdated(
  documentId: string,
  documentType: string,
  documentTitle?: string,
  changes?: Array<{ field: string; oldValue?: string; newValue?: string }>,
  userId?: string,
  userName?: string
): Promise<void> {
  await createAuditLog({
    action: 'updated',
    documentId,
    documentType,
    documentTitle,
    userId,
    userName,
    changes,
    notes: `Document updated - ${changes?.length || 0} field(s) changed`,
  })
}

/**
 * Log document deletion
 */
export async function logDocumentDeleted(
  documentId: string,
  documentType: string,
  documentTitle?: string,
  userId?: string,
  userName?: string
): Promise<void> {
  await createAuditLog({
    action: 'deleted',
    documentId,
    documentType,
    documentTitle,
    userId,
    userName,
    notes: `Document deleted`,
  })
}

/**
 * Log workflow state change
 */
export async function logWorkflowChanged(
  documentId: string,
  documentType: string,
  documentTitle: string | undefined,
  previousState: string,
  newState: string,
  userId?: string,
  userName?: string,
  notes?: string
): Promise<void> {
  await createAuditLog({
    action: 'workflow_changed',
    documentId,
    documentType,
    documentTitle,
    userId,
    userName,
    metadata: {
      previousWorkflowState: previousState,
      newWorkflowState: newState,
    },
    notes: notes || `Workflow state changed from ${previousState} to ${newState}`,
  })
}

/**
 * Log content published
 */
export async function logContentPublished(
  documentId: string,
  documentType: string,
  documentTitle?: string,
  userId?: string,
  userName?: string
): Promise<void> {
  await createAuditLog({
    action: 'published',
    documentId,
    documentType,
    documentTitle,
    userId,
    userName,
    notes: `Content published`,
  })
}

/**
 * Log content unpublished
 */
export async function logContentUnpublished(
  documentId: string,
  documentType: string,
  documentTitle?: string,
  userId?: string,
  userName?: string
): Promise<void> {
  await createAuditLog({
    action: 'unpublished',
    documentId,
    documentType,
    documentTitle,
    userId,
    userName,
    notes: `Content unpublished`,
  })
}

/**
 * Log scheduled publish
 */
export async function logScheduledPublish(
  documentId: string,
  documentType: string,
  documentTitle: string | undefined,
  publishAt: string,
  unpublishAt?: string
): Promise<void> {
  const publishDate = new Date(publishAt).toLocaleString()
  const unpublishNote = unpublishAt
    ? ` Unpublish at: ${new Date(unpublishAt).toLocaleString()}`
    : ''

  await createAuditLog({
    action: 'scheduled',
    documentId,
    documentType,
    documentTitle,
    notes: `Content scheduled to publish at ${publishDate}.${unpublishNote}`,
  })
}

/**
 * Query audit logs for a document
 */
export async function getAuditLogsForDocument(
  documentId: string,
  limit: number = 50
): Promise<any[]> {
  if (!token) {
    return []
  }

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      token,
      useCdn: false,
    })

    const logs = await client.fetch(
      `*[_type == "auditLog" && documentId == $documentId] | order(timestamp desc) [0...${limit}]`,
      { documentId }
    )

    return logs
  } catch (error) {
    console.error('Failed to fetch audit logs:', error)
    return []
  }
}

/**
 * Query recent audit logs
 */
export async function getRecentAuditLogs(limit: number = 100): Promise<any[]> {
  if (!token) {
    return []
  }

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      token,
      useCdn: false,
    })

    const logs = await client.fetch(
      `*[_type == "auditLog"] | order(timestamp desc) [0...${limit}]`
    )

    return logs
  } catch (error) {
    console.error('Failed to fetch recent audit logs:', error)
    return []
  }
}

/**
 * Query audit logs by action type
 */
export async function getAuditLogsByAction(
  action: AuditAction,
  limit: number = 50
): Promise<any[]> {
  if (!token) {
    return []
  }

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      token,
      useCdn: false,
    })

    const logs = await client.fetch(
      `*[_type == "auditLog" && action == $action] | order(timestamp desc) [0...${limit}]`,
      { action }
    )

    return logs
  } catch (error) {
    console.error('Failed to fetch audit logs by action:', error)
    return []
  }
}

/**
 * Query audit logs by user
 */
export async function getAuditLogsByUser(
  userId: string,
  limit: number = 50
): Promise<any[]> {
  if (!token) {
    return []
  }

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      token,
      useCdn: false,
    })

    const logs = await client.fetch(
      `*[_type == "auditLog" && userId == $userId] | order(timestamp desc) [0...${limit}]`,
      { userId }
    )

    return logs
  } catch (error) {
    console.error('Failed to fetch audit logs by user:', error)
    return []
  }
}

/**
 * Export audit logs to JSON
 */
export async function exportAuditLogs(
  startDate?: string,
  endDate?: string
): Promise<any[]> {
  if (!token) {
    return []
  }

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      token,
      useCdn: false,
    })

    let query = `*[_type == "auditLog"`

    if (startDate && endDate) {
      query += ` && timestamp >= $startDate && timestamp <= $endDate`
    } else if (startDate) {
      query += ` && timestamp >= $startDate`
    } else if (endDate) {
      query += ` && timestamp <= $endDate`
    }

    query += `] | order(timestamp desc)`

    const logs = await client.fetch(query, { startDate, endDate })

    return logs
  } catch (error) {
    console.error('Failed to export audit logs:', error)
    return []
  }
}
