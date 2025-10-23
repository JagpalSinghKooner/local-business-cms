/**
 * Webhook Log Document Schema
 *
 * Track webhook delivery attempts for debugging and monitoring
 */

import { defineType, defineField } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export default defineType({
  name: 'webhookLog',
  title: 'Webhook Log',
  type: 'document',
  icon: DocumentIcon,
  readOnly: true, // Prevent manual editing
  fields: [
    defineField({
      name: 'webhookId',
      title: 'Webhook ID',
      type: 'string',
      description: 'Reference to the webhook configuration',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'webhookName',
      title: 'Webhook Name',
      type: 'string',
      description: 'Name of the webhook at time of delivery',
    }),
    defineField({
      name: 'event',
      title: 'Event',
      type: 'string',
      description: 'The event that triggered this webhook',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'documentId',
      title: 'Document ID',
      type: 'string',
      description: 'ID of the document that triggered the webhook',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'documentType',
      title: 'Document Type',
      type: 'string',
      description: 'Type of the document',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'documentTitle',
      title: 'Document Title',
      type: 'string',
      description: 'Title of the document',
    }),
    defineField({
      name: 'timestamp',
      title: 'Timestamp',
      type: 'datetime',
      description: 'When the webhook was triggered',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'The endpoint URL that was called',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'method',
      title: 'HTTP Method',
      type: 'string',
      description: 'HTTP method used',
      initialValue: 'POST',
    }),
    defineField({
      name: 'payload',
      title: 'Payload',
      type: 'text',
      rows: 10,
      description: 'The JSON payload that was sent',
    }),
    defineField({
      name: 'headers',
      title: 'Headers',
      type: 'text',
      rows: 5,
      description: 'HTTP headers sent with the request',
    }),
    defineField({
      name: 'statusCode',
      title: 'Status Code',
      type: 'number',
      description: 'HTTP response status code',
    }),
    defineField({
      name: 'responseBody',
      title: 'Response Body',
      type: 'text',
      rows: 5,
      description: 'Response body from the webhook endpoint',
    }),
    defineField({
      name: 'success',
      title: 'Success',
      type: 'boolean',
      description: 'Whether the delivery was successful',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'error',
      title: 'Error',
      type: 'text',
      rows: 3,
      description: 'Error message if delivery failed',
    }),
    defineField({
      name: 'duration',
      title: 'Duration (ms)',
      type: 'number',
      description: 'How long the request took in milliseconds',
    }),
    defineField({
      name: 'attemptNumber',
      title: 'Attempt Number',
      type: 'number',
      description: 'Retry attempt number (1 for initial attempt)',
      initialValue: 1,
    }),
    defineField({
      name: 'willRetry',
      title: 'Will Retry',
      type: 'boolean',
      description: 'Whether this delivery will be retried',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      event: 'event',
      webhookName: 'webhookName',
      documentTitle: 'documentTitle',
      success: 'success',
      statusCode: 'statusCode',
      timestamp: 'timestamp',
      attemptNumber: 'attemptNumber',
    },
    prepare({ event, webhookName, documentTitle, success, statusCode, timestamp, attemptNumber }) {
      const status = success ? '✅' : '❌'
      const code = statusCode ? `${statusCode}` : 'N/A'
      const date = timestamp ? new Date(timestamp).toLocaleString() : 'Unknown'
      const attempt = attemptNumber > 1 ? ` (Attempt ${attemptNumber})` : ''

      return {
        title: `${status} ${event}${attempt}`,
        subtitle: `${webhookName} · ${documentTitle || 'Unknown'} · ${code} · ${date}`,
        media: DocumentIcon,
      }
    },
  },
})
