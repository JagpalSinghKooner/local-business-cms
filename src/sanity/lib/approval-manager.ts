/**
 * Approval Manager
 *
 * Manage approval requests for content that needs review
 */

import { createClient } from '@sanity/client'
import { logWorkflowChanged } from './audit-logger'
import { WORKFLOW_STATES, type WorkflowState } from '../schemaTypes/objects/workflowState'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const token = process.env.SANITY_API_TOKEN

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'
export type ApprovalType = 'single' | 'all' | 'majority'
export type ApprovalDecision = 'approved' | 'rejected'
export type Priority = 'low' | 'normal' | 'high' | 'urgent'

export interface Approver {
  userId: string
  userName?: string
  userEmail?: string
  role?: string
}

export interface ApprovalDecisionRecord {
  userId: string
  userName?: string
  decision: ApprovalDecision
  comment?: string
  decidedAt: string
}

export interface CreateApprovalRequestParams {
  documentId: string
  documentTitle: string
  documentType: string
  requestedBy: {
    userId: string
    userName?: string
    userEmail?: string
  }
  approvers: Approver[]
  approvalType?: ApprovalType
  requestNotes?: string
  dueDate?: string
  priority?: Priority
  tags?: string[]
}

/**
 * Create a new approval request
 */
export async function createApprovalRequest(
  params: CreateApprovalRequestParams
): Promise<string> {
  if (!token) {
    throw new Error('SANITY_API_TOKEN not set')
  }

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      token,
      useCdn: false,
    })

    const doc = await client.create({
      _type: 'approvalRequest',
      document: {
        _type: 'reference',
        _ref: params.documentId,
      },
      documentTitle: params.documentTitle,
      documentType: params.documentType,
      status: 'pending',
      requestedBy: params.requestedBy,
      requestedAt: new Date().toISOString(),
      approvers: params.approvers,
      approvalType: params.approvalType || 'single',
      approvals: [],
      requestNotes: params.requestNotes,
      dueDate: params.dueDate,
      priority: params.priority || 'normal',
      tags: params.tags,
    })

    // Update document workflow state to "in_review"
    await client
      .patch(params.documentId)
      .set({
        'workflow.state': WORKFLOW_STATES.IN_REVIEW,
        'workflow.changedAt': new Date().toISOString(),
        'workflow.changedBy': params.requestedBy.userId,
        'workflow.notes': `Approval requested from ${params.approvers.length} approver(s)`,
      })
      .commit()

    // Log workflow change
    await logWorkflowChanged(
      params.documentId,
      params.documentType,
      params.documentTitle,
      WORKFLOW_STATES.DRAFT, // Assuming coming from draft
      WORKFLOW_STATES.IN_REVIEW,
      params.requestedBy.userId,
      params.requestedBy.userName,
      `Approval request created: ${doc._id}`
    )

    return doc._id
  } catch (error) {
    console.error('Failed to create approval request:', error)
    throw error
  }
}

/**
 * Submit approval decision
 */
export async function submitApprovalDecision(
  approvalRequestId: string,
  userId: string,
  userName: string,
  decision: ApprovalDecision,
  comment?: string
): Promise<void> {
  if (!token) {
    throw new Error('SANITY_API_TOKEN not set')
  }

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      token,
      useCdn: false,
    })

    // Get approval request
    const approvalRequest = await client.fetch<any>(
      `*[_type == "approvalRequest" && _id == $id][0]`,
      { id: approvalRequestId }
    )

    if (!approvalRequest) {
      throw new Error('Approval request not found')
    }

    if (approvalRequest.status !== 'pending') {
      throw new Error(`Approval request is already ${approvalRequest.status}`)
    }

    // Verify user is an approver
    const isApprover = approvalRequest.approvers.some((a: Approver) => a.userId === userId)

    if (!isApprover) {
      throw new Error('User is not an approver for this request')
    }

    // Check if user already submitted decision
    const existingApproval = approvalRequest.approvals?.find((a: any) => a.userId === userId)

    if (existingApproval) {
      throw new Error('User has already submitted a decision')
    }

    // Add approval decision
    const newApproval: ApprovalDecisionRecord = {
      userId,
      userName,
      decision,
      comment,
      decidedAt: new Date().toISOString(),
    }

    const updatedApprovals = [...(approvalRequest.approvals || []), newApproval]

    // Check if request should be resolved
    const shouldResolve = checkIfResolved(
      approvalRequest.approvalType,
      approvalRequest.approvers.length,
      updatedApprovals
    )

    if (shouldResolve) {
      const finalDecision = determineFinalDecision(
        approvalRequest.approvalType,
        updatedApprovals
      )

      // Update approval request as resolved
      await client
        .patch(approvalRequestId)
        .set({
          approvals: updatedApprovals,
          status: finalDecision,
          resolvedAt: new Date().toISOString(),
        })
        .commit()

      // Update document workflow state
      const newWorkflowState =
        finalDecision === 'approved' ? WORKFLOW_STATES.APPROVED : WORKFLOW_STATES.DRAFT

      await client
        .patch(approvalRequest.document._ref)
        .set({
          'workflow.state': newWorkflowState,
          'workflow.changedAt': new Date().toISOString(),
          'workflow.changedBy': userId,
          'workflow.notes': `Approval request ${finalDecision}`,
        })
        .commit()

      // Log workflow change
      await logWorkflowChanged(
        approvalRequest.document._ref,
        approvalRequest.documentType,
        approvalRequest.documentTitle,
        WORKFLOW_STATES.IN_REVIEW,
        newWorkflowState,
        userId,
        userName,
        `Approval request ${finalDecision} by ${userName}`
      )
    } else {
      // Just add the approval, not resolved yet
      await client
        .patch(approvalRequestId)
        .set({
          approvals: updatedApprovals,
        })
        .commit()
    }
  } catch (error) {
    console.error('Failed to submit approval decision:', error)
    throw error
  }
}

/**
 * Check if approval request should be resolved
 */
function checkIfResolved(
  approvalType: ApprovalType,
  totalApprovers: number,
  approvals: ApprovalDecisionRecord[]
): boolean {
  const approvalCount = approvals.filter((a) => a.decision === 'approved').length
  const rejectionCount = approvals.filter((a) => a.decision === 'rejected').length

  switch (approvalType) {
    case 'single':
      // Resolve if any approval or rejection
      return approvals.length > 0

    case 'all':
      // Resolve if all approvers submitted OR any rejection
      return approvals.length === totalApprovers || rejectionCount > 0

    case 'majority':
      // Resolve if majority approved OR majority rejected
      const majority = Math.ceil(totalApprovers / 2)
      return approvalCount >= majority || rejectionCount >= majority

    default:
      return false
  }
}

/**
 * Determine final decision based on approval type
 */
function determineFinalDecision(
  approvalType: ApprovalType,
  approvals: ApprovalDecisionRecord[]
): ApprovalStatus {
  const approvalCount = approvals.filter((a) => a.decision === 'approved').length
  const rejectionCount = approvals.filter((a) => a.decision === 'rejected').length

  switch (approvalType) {
    case 'single':
      // First decision wins
      return approvals[0].decision

    case 'all':
      // All must approve, any rejection fails
      return rejectionCount > 0 ? 'rejected' : 'approved'

    case 'majority':
      // Majority wins
      return approvalCount > rejectionCount ? 'approved' : 'rejected'

    default:
      return 'rejected'
  }
}

/**
 * Cancel approval request
 */
export async function cancelApprovalRequest(
  approvalRequestId: string,
  userId: string,
  userName: string,
  reason?: string
): Promise<void> {
  if (!token) {
    throw new Error('SANITY_API_TOKEN not set')
  }

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      token,
      useCdn: false,
    })

    // Get approval request
    const approvalRequest = await client.fetch<any>(
      `*[_type == "approvalRequest" && _id == $id][0]`,
      { id: approvalRequestId }
    )

    if (!approvalRequest) {
      throw new Error('Approval request not found')
    }

    if (approvalRequest.status !== 'pending') {
      throw new Error(`Approval request is already ${approvalRequest.status}`)
    }

    // Update approval request as cancelled
    await client
      .patch(approvalRequestId)
      .set({
        status: 'cancelled',
        resolvedAt: new Date().toISOString(),
        finalComment: reason || 'Cancelled by requester',
      })
      .commit()

    // Update document workflow state back to draft
    await client
      .patch(approvalRequest.document._ref)
      .set({
        'workflow.state': WORKFLOW_STATES.DRAFT,
        'workflow.changedAt': new Date().toISOString(),
        'workflow.changedBy': userId,
        'workflow.notes': 'Approval request cancelled',
      })
      .commit()

    // Log workflow change
    await logWorkflowChanged(
      approvalRequest.document._ref,
      approvalRequest.documentType,
      approvalRequest.documentTitle,
      WORKFLOW_STATES.IN_REVIEW,
      WORKFLOW_STATES.DRAFT,
      userId,
      userName,
      `Approval request cancelled: ${reason || 'No reason provided'}`
    )
  } catch (error) {
    console.error('Failed to cancel approval request:', error)
    throw error
  }
}

/**
 * Get pending approvals for a user
 */
export async function getPendingApprovalsForUser(userId: string): Promise<any[]> {
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

    const approvals = await client.fetch<any[]>(
      `
      *[
        _type == "approvalRequest" &&
        status == "pending" &&
        $userId in approvers[].userId &&
        !($userId in approvals[].userId)
      ] | order(priority desc, requestedAt asc) {
        _id,
        documentTitle,
        documentType,
        status,
        requestedBy,
        requestedAt,
        approvers,
        approvalType,
        requestNotes,
        dueDate,
        priority,
        tags,
        approvals
      }
    `,
      { userId }
    )

    return approvals
  } catch (error) {
    console.error('Failed to get pending approvals:', error)
    return []
  }
}

/**
 * Get approval requests for a document
 */
export async function getApprovalRequestsForDocument(documentId: string): Promise<any[]> {
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

    const approvals = await client.fetch<any[]>(
      `
      *[
        _type == "approvalRequest" &&
        document._ref == $documentId
      ] | order(requestedAt desc) {
        _id,
        documentTitle,
        documentType,
        status,
        requestedBy,
        requestedAt,
        approvers,
        approvalType,
        requestNotes,
        approvals,
        resolvedAt,
        dueDate,
        priority,
        finalComment
      }
    `,
      { documentId }
    )

    return approvals
  } catch (error) {
    console.error('Failed to get approval requests for document:', error)
    return []
  }
}

/**
 * Get approval statistics
 */
export async function getApprovalStatistics(userId?: string): Promise<{
  pending: number
  approved: number
  rejected: number
  cancelled: number
  overdue: number
}> {
  if (!token) {
    return {
      pending: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0,
      overdue: 0,
    }
  }

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      token,
      useCdn: false,
    })

    let baseFilter = '*[_type == "approvalRequest"'

    if (userId) {
      baseFilter += ` && $userId in approvers[].userId`
    }

    baseFilter += ']'

    const params = userId ? { userId } : {}

    const [pending, approved, rejected, cancelled, overdue] = await Promise.all([
      client.fetch<number>(`count(${baseFilter} && status == "pending")`, params),
      client.fetch<number>(`count(${baseFilter} && status == "approved")`, params),
      client.fetch<number>(`count(${baseFilter} && status == "rejected")`, params),
      client.fetch<number>(`count(${baseFilter} && status == "cancelled")`, params),
      client.fetch<number>(
        `count(${baseFilter} && status == "pending" && dueDate != null && dueDate < now())`,
        params
      ),
    ])

    return {
      pending,
      approved,
      rejected,
      cancelled,
      overdue,
    }
  } catch (error) {
    console.error('Failed to get approval statistics:', error)
    return {
      pending: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0,
      overdue: 0,
    }
  }
}
