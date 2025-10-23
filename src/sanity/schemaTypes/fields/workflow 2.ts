/**
 * Workflow Field
 *
 * Reusable workflow field definition for document schemas
 * Add this field to any document type that needs workflow management
 */

import { defineField } from 'sanity'

export const workflowField = defineField({
  name: 'workflow',
  title: 'Workflow',
  type: 'workflowState',
  description: 'Manage the publishing workflow for this content',
  group: 'settings',
})

export default workflowField
