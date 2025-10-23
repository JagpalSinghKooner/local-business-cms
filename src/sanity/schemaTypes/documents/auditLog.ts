/**
 * Audit Log Document Schema
 *
 * Tracks all content changes for compliance and security
 */

import { defineType, defineField } from 'sanity'
import { ActivityIcon } from '@sanity/icons'

export default defineType({
  name: 'auditLog',
  title: 'Audit Log',
  type: 'document',
  icon: ActivityIcon,
  readOnly: true, // Prevent manual editing
  fields: [
    defineField({
      name: 'action',
      title: 'Action',
      type: 'string',
      description: 'Type of action performed',
      options: {
        list: [
          { title: 'Created', value: 'created' },
          { title: 'Updated', value: 'updated' },
          { title: 'Deleted', value: 'deleted' },
          { title: 'Published', value: 'published' },
          { title: 'Unpublished', value: 'unpublished' },
          { title: 'Workflow Changed', value: 'workflow_changed' },
          { title: 'Scheduled', value: 'scheduled' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'documentId',
      title: 'Document ID',
      type: 'string',
      description: 'ID of the document that was changed',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'documentType',
      title: 'Document Type',
      type: 'string',
      description: 'Type of document (service, page, offer, etc.)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'documentTitle',
      title: 'Document Title',
      type: 'string',
      description: 'Title of the document at time of change',
    }),
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'string',
      description: 'ID of user who performed the action',
    }),
    defineField({
      name: 'userName',
      title: 'User Name',
      type: 'string',
      description: 'Name of user who performed the action',
    }),
    defineField({
      name: 'userEmail',
      title: 'User Email',
      type: 'string',
      description: 'Email of user who performed the action',
    }),
    defineField({
      name: 'timestamp',
      title: 'Timestamp',
      type: 'datetime',
      description: 'When the action occurred',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'changes',
      title: 'Changes',
      type: 'array',
      description: 'List of fields that were changed',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'field',
              title: 'Field Name',
              type: 'string',
            },
            {
              name: 'oldValue',
              title: 'Old Value',
              type: 'text',
              rows: 3,
            },
            {
              name: 'newValue',
              title: 'New Value',
              type: 'text',
              rows: 3,
            },
          ],
          preview: {
            select: {
              field: 'field',
              newValue: 'newValue',
            },
            prepare({ field, newValue }) {
              return {
                title: field,
                subtitle: `New: ${newValue?.substring(0, 50) || 'N/A'}`,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'metadata',
      title: 'Metadata',
      type: 'object',
      description: 'Additional context about the change',
      fields: [
        {
          name: 'ipAddress',
          title: 'IP Address',
          type: 'string',
        },
        {
          name: 'userAgent',
          title: 'User Agent',
          type: 'string',
        },
        {
          name: 'dataset',
          title: 'Dataset',
          type: 'string',
        },
        {
          name: 'previousWorkflowState',
          title: 'Previous Workflow State',
          type: 'string',
        },
        {
          name: 'newWorkflowState',
          title: 'New Workflow State',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 3,
      description: 'Additional notes about the change',
    }),
  ],
  preview: {
    select: {
      action: 'action',
      documentTitle: 'documentTitle',
      documentType: 'documentType',
      userName: 'userName',
      timestamp: 'timestamp',
    },
    prepare({ action, documentTitle, documentType, userName, timestamp }) {
      const date = timestamp ? new Date(timestamp).toLocaleString() : 'Unknown'
      const title = documentTitle || 'Untitled'

      return {
        title: `${action?.toUpperCase()} - ${title}`,
        subtitle: `${documentType} by ${userName || 'Unknown'} at ${date}`,
        media: ActivityIcon,
      }
    },
  },
})
