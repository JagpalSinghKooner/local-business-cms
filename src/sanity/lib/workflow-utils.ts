/**
 * Workflow Utilities
 *
 * Handles workflow state transitions, validation, and permissions
 */

import { WORKFLOW_STATES, type WorkflowState } from '../schemaTypes/objects/workflowState'

export interface WorkflowTransition {
  from: WorkflowState
  to: WorkflowState
  allowed: boolean
  requiredRole?: string[]
}

/**
 * Valid workflow state transitions
 * Defines which state transitions are allowed
 */
export const WORKFLOW_TRANSITIONS: Record<WorkflowState, WorkflowState[]> = {
  [WORKFLOW_STATES.DRAFT]: [WORKFLOW_STATES.IN_REVIEW, WORKFLOW_STATES.ARCHIVED],
  [WORKFLOW_STATES.IN_REVIEW]: [
    WORKFLOW_STATES.DRAFT, // Send back for revisions
    WORKFLOW_STATES.APPROVED,
    WORKFLOW_STATES.ARCHIVED,
  ],
  [WORKFLOW_STATES.APPROVED]: [
    WORKFLOW_STATES.IN_REVIEW, // Send back for re-review
    WORKFLOW_STATES.PUBLISHED,
    WORKFLOW_STATES.ARCHIVED,
  ],
  [WORKFLOW_STATES.PUBLISHED]: [
    WORKFLOW_STATES.DRAFT, // Unpublish and edit
    WORKFLOW_STATES.ARCHIVED,
  ],
  [WORKFLOW_STATES.ARCHIVED]: [
    WORKFLOW_STATES.DRAFT, // Restore to draft
  ],
}

/**
 * Check if a workflow state transition is valid
 */
export function isValidTransition(currentState: WorkflowState, newState: WorkflowState): boolean {
  const allowedTransitions = WORKFLOW_TRANSITIONS[currentState] || []
  return allowedTransitions.includes(newState)
}

/**
 * Get allowed next states for a given current state
 */
export function getAllowedNextStates(currentState: WorkflowState): WorkflowState[] {
  return WORKFLOW_TRANSITIONS[currentState] || []
}

/**
 * Validate workflow state transition
 */
export function validateWorkflowTransition(
  currentState: WorkflowState,
  newState: WorkflowState
): { valid: boolean; error?: string } {
  if (currentState === newState) {
    return { valid: true } // No change
  }

  if (!isValidTransition(currentState, newState)) {
    return {
      valid: false,
      error: `Cannot transition from ${currentState} to ${newState}`,
    }
  }

  return { valid: true }
}

/**
 * Get workflow state badge color for UI
 */
export function getWorkflowStateBadgeColor(state: WorkflowState): string {
  const colors: Record<WorkflowState, string> = {
    [WORKFLOW_STATES.DRAFT]: 'gray',
    [WORKFLOW_STATES.IN_REVIEW]: 'yellow',
    [WORKFLOW_STATES.APPROVED]: 'green',
    [WORKFLOW_STATES.PUBLISHED]: 'blue',
    [WORKFLOW_STATES.ARCHIVED]: 'red',
  }

  return colors[state] || 'gray'
}

/**
 * Check if a document can be published based on workflow state
 */
export function canPublish(state: WorkflowState): boolean {
  return state === WORKFLOW_STATES.APPROVED || state === WORKFLOW_STATES.PUBLISHED
}

/**
 * Check if a document can be edited based on workflow state
 */
export function canEdit(state: WorkflowState): boolean {
  // Published and archived documents should not be edited directly
  return state === WORKFLOW_STATES.DRAFT || state === WORKFLOW_STATES.IN_REVIEW
}

/**
 * Get workflow state description
 */
export function getWorkflowStateDescription(state: WorkflowState): string {
  const descriptions: Record<WorkflowState, string> = {
    [WORKFLOW_STATES.DRAFT]: 'Document is in draft mode and can be edited freely',
    [WORKFLOW_STATES.IN_REVIEW]: 'Document is being reviewed and awaiting approval',
    [WORKFLOW_STATES.APPROVED]: 'Document is approved and ready to be published',
    [WORKFLOW_STATES.PUBLISHED]: 'Document is live on the website',
    [WORKFLOW_STATES.ARCHIVED]: 'Document is archived and no longer active',
  }

  return descriptions[state] || 'Unknown state'
}

/**
 * Create initial workflow state
 */
export function createInitialWorkflowState(userId?: string): {
  state: WorkflowState
  changedAt: string
  changedBy?: string
  notes?: string
} {
  return {
    state: WORKFLOW_STATES.DRAFT,
    changedAt: new Date().toISOString(),
    changedBy: userId,
  }
}

/**
 * Update workflow state
 */
export function updateWorkflowState(
  currentState: WorkflowState,
  newState: WorkflowState,
  userId?: string,
  notes?: string
): {
  state: WorkflowState
  changedAt: string
  changedBy?: string
  notes?: string
} | null {
  const validation = validateWorkflowTransition(currentState, newState)

  if (!validation.valid) {
    console.error('Invalid workflow transition:', validation.error)
    return null
  }

  return {
    state: newState,
    changedAt: new Date().toISOString(),
    changedBy: userId,
    notes,
  }
}

/**
 * Filter documents by workflow state
 */
export function getWorkflowStateFilter(state: WorkflowState): string {
  return `workflow.state == "${state}"`
}

/**
 * Get GROQ filter for multiple workflow states
 */
export function getWorkflowStatesFilter(states: WorkflowState[]): string {
  const stateFilters = states.map((state) => `workflow.state == "${state}"`)
  return stateFilters.join(' || ')
}

/**
 * Get documents ready to publish
 */
export function getReadyToPublishFilter(): string {
  return `workflow.state == "${WORKFLOW_STATES.APPROVED}"`
}

/**
 * Get published documents filter
 */
export function getPublishedFilter(): string {
  return `workflow.state == "${WORKFLOW_STATES.PUBLISHED}"`
}
