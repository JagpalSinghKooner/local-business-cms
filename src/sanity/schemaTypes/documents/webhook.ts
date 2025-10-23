/**
 * Webhook Document Schema
 *
 * Configure webhooks to trigger external integrations on content changes
 */

import { defineType, defineField } from 'sanity'
import { PlugIcon } from '@sanity/icons'

export default defineType({
  name: 'webhook',
  title: 'Webhook',
  type: 'document',
  icon: PlugIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Descriptive name for this webhook',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Webhook URL',
      type: 'url',
      description: 'The endpoint URL to send webhook events to',
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ['https', 'http'],
        }),
    }),
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      description: 'Enable or disable this webhook',
      initialValue: true,
    }),
    defineField({
      name: 'events',
      title: 'Events',
      type: 'array',
      description: 'Which events should trigger this webhook',
      of: [
        {
          type: 'string',
        },
      ],
      options: {
        list: [
          { title: 'Document Created', value: 'document.created' },
          { title: 'Document Updated', value: 'document.updated' },
          { title: 'Document Deleted', value: 'document.deleted' },
          { title: 'Document Published', value: 'document.published' },
          { title: 'Document Unpublished', value: 'document.unpublished' },
          { title: 'Workflow Changed', value: 'workflow.changed' },
          { title: 'Scheduled Publish', value: 'scheduled.publish' },
        ],
      },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'documentTypes',
      title: 'Document Types',
      type: 'array',
      description: 'Filter by document types (leave empty for all types)',
      of: [
        {
          type: 'string',
        },
      ],
      options: {
        list: [
          { title: 'All Types', value: '*' },
          { title: 'Page', value: 'page' },
          { title: 'Post', value: 'post' },
          { title: 'Service', value: 'service' },
          { title: 'Location', value: 'location' },
          { title: 'Offer', value: 'offer' },
          { title: 'Coupon', value: 'coupon' },
          { title: 'Case Study', value: 'caseStudy' },
          { title: 'Testimonial', value: 'testimonial' },
          { title: 'FAQ', value: 'faq' },
          { title: 'Lead', value: 'lead' },
        ],
      },
    }),
    defineField({
      name: 'secret',
      title: 'Secret Key',
      type: 'string',
      description: 'Secret key for signing webhook payloads (HMAC-SHA256)',
      validation: (Rule) => Rule.min(32).max(256),
    }),
    defineField({
      name: 'headers',
      title: 'Custom Headers',
      type: 'array',
      description: 'Additional HTTP headers to send with webhook requests',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'key',
              title: 'Header Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'value',
              title: 'Header Value',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              key: 'key',
              value: 'value',
            },
            prepare({ key, value }) {
              return {
                title: key,
                subtitle: value,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'retryConfig',
      title: 'Retry Configuration',
      type: 'object',
      description: 'Configure retry behavior for failed webhook deliveries',
      fields: [
        {
          name: 'maxRetries',
          title: 'Max Retries',
          type: 'number',
          description: 'Maximum number of retry attempts',
          initialValue: 3,
          validation: (Rule) => Rule.min(0).max(10),
        },
        {
          name: 'retryDelay',
          title: 'Retry Delay (seconds)',
          type: 'number',
          description: 'Initial delay between retries (exponential backoff)',
          initialValue: 5,
          validation: (Rule) => Rule.min(1).max(3600),
        },
      ],
    }),
    defineField({
      name: 'timeout',
      title: 'Timeout (seconds)',
      type: 'number',
      description: 'Request timeout in seconds',
      initialValue: 30,
      validation: (Rule) => Rule.min(5).max(300),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Notes about this webhook integration',
    }),
    defineField({
      name: 'statistics',
      title: 'Statistics',
      type: 'object',
      description: 'Webhook delivery statistics',
      readOnly: true,
      fields: [
        {
          name: 'totalDeliveries',
          title: 'Total Deliveries',
          type: 'number',
          initialValue: 0,
        },
        {
          name: 'successfulDeliveries',
          title: 'Successful Deliveries',
          type: 'number',
          initialValue: 0,
        },
        {
          name: 'failedDeliveries',
          title: 'Failed Deliveries',
          type: 'number',
          initialValue: 0,
        },
        {
          name: 'lastDeliveryAt',
          title: 'Last Delivery At',
          type: 'datetime',
        },
        {
          name: 'lastDeliveryStatus',
          title: 'Last Delivery Status',
          type: 'string',
        },
      ],
    }),
  ],
  preview: {
    select: {
      name: 'name',
      url: 'url',
      enabled: 'enabled',
      events: 'events',
      successRate: 'statistics.successfulDeliveries',
      totalDeliveries: 'statistics.totalDeliveries',
    },
    prepare({ name, url, enabled, events, successRate = 0, totalDeliveries = 0 }) {
      const status = enabled ? '✅' : '❌'
      const eventCount = events?.length || 0
      const rate =
        totalDeliveries > 0 ? `${Math.round((successRate / totalDeliveries) * 100)}%` : 'N/A'

      return {
        title: `${status} ${name}`,
        subtitle: `${url} · ${eventCount} events · ${rate} success rate`,
        media: PlugIcon,
      }
    },
  },
})
