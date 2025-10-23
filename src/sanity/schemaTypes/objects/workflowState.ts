/**
 * Workflow State Schema
 *
 * Manages content lifecycle: draft → in_review → approved → published → archived
 */

import { defineType, defineField } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export const WORKFLOW_STATES = {
  DRAFT: 'draft',
  IN_REVIEW: 'in_review',
  APPROVED: 'approved',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const

export type WorkflowState = (typeof WORKFLOW_STATES)[keyof typeof WORKFLOW_STATES]

export const WORKFLOW_STATE_LABELS: Record<WorkflowState, string> = {
  [WORKFLOW_STATES.DRAFT]: 'Draft',
  [WORKFLOW_STATES.IN_REVIEW]: 'In Review',
  [WORKFLOW_STATES.APPROVED]: 'Approved',
  [WORKFLOW_STATES.PUBLISHED]: 'Published',
  [WORKFLOW_STATES.ARCHIVED]: 'Archived',
}

export const WORKFLOW_STATE_COLORS: Record<WorkflowState, string> = {
  [WORKFLOW_STATES.DRAFT]: '#9CA3AF', // Gray
  [WORKFLOW_STATES.IN_REVIEW]: '#F59E0B', // Amber
  [WORKFLOW_STATES.APPROVED]: '#10B981', // Green
  [WORKFLOW_STATES.PUBLISHED]: '#3B82F6', // Blue
  [WORKFLOW_STATES.ARCHIVED]: '#6B7280', // Dark gray
}

export default defineType({
  name: 'workflowState',
  title: 'Workflow State',
  type: 'object',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'state',
      title: 'Current State',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: WORKFLOW_STATES.DRAFT },
          { title: 'In Review', value: WORKFLOW_STATES.IN_REVIEW },
          { title: 'Approved', value: WORKFLOW_STATES.APPROVED },
          { title: 'Published', value: WORKFLOW_STATES.PUBLISHED },
          { title: 'Archived', value: WORKFLOW_STATES.ARCHIVED },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      initialValue: WORKFLOW_STATES.DRAFT,
    }),
    defineField({
      name: 'changedAt',
      title: 'State Changed At',
      type: 'datetime',
      description: 'When the workflow state was last changed',
      readOnly: true,
    }),
    defineField({
      name: 'changedBy',
      title: 'Changed By',
      type: 'string',
      description: 'User who changed the workflow state',
      readOnly: true,
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 3,
      description: 'Optional notes about the current state',
    }),
  ],
  preview: {
    select: {
      state: 'state',
      changedAt: 'changedAt',
    },
    prepare({ state, changedAt }) {
      const label = WORKFLOW_STATE_LABELS[state as WorkflowState] || state
      const date = changedAt ? new Date(changedAt).toLocaleDateString() : 'Not set'

      return {
        title: label,
        subtitle: `Last changed: ${date}`,
        media: DocumentIcon,
      }
    },
  },
})
