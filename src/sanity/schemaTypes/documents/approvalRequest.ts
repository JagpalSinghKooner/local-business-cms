/**
 * Approval Request Document Schema
 *
 * Track approval requests for content that needs review
 */

import { defineType, defineField } from 'sanity'
import { CheckmarkCircleIcon } from '@sanity/icons'

export default defineType({
  name: 'approvalRequest',
  title: 'Approval Request',
  type: 'document',
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: 'document',
      title: 'Document',
      type: 'reference',
      to: [
        { type: 'page' },
        { type: 'post' },
        { type: 'service' },
        { type: 'location' },
        { type: 'offer' },
        { type: 'coupon' },
        { type: 'caseStudy' },
      ],
      description: 'The document requiring approval',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'documentTitle',
      title: 'Document Title',
      type: 'string',
      description: 'Title of the document at time of request',
      readOnly: true,
    }),
    defineField({
      name: 'documentType',
      title: 'Document Type',
      type: 'string',
      description: 'Type of the document',
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      description: 'Current status of the approval request',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Approved', value: 'approved' },
          { title: 'Rejected', value: 'rejected' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
      initialValue: 'pending',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'requestedBy',
      title: 'Requested By',
      type: 'object',
      description: 'User who requested approval',
      fields: [
        {
          name: 'userId',
          title: 'User ID',
          type: 'string',
        },
        {
          name: 'userName',
          title: 'User Name',
          type: 'string',
        },
        {
          name: 'userEmail',
          title: 'User Email',
          type: 'string',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'requestedAt',
      title: 'Requested At',
      type: 'datetime',
      description: 'When the approval was requested',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'approvers',
      title: 'Approvers',
      type: 'array',
      description: 'Users who can approve this request',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'userId',
              title: 'User ID',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'userName',
              title: 'User Name',
              type: 'string',
            },
            {
              name: 'userEmail',
              title: 'User Email',
              type: 'string',
            },
            {
              name: 'role',
              title: 'Role',
              type: 'string',
              description: 'Approver role (e.g., Content Manager, Editor)',
            },
          ],
          preview: {
            select: {
              userName: 'userName',
              userEmail: 'userEmail',
              role: 'role',
            },
            prepare({ userName, userEmail, role }) {
              return {
                title: userName || 'Unknown User',
                subtitle: `${userEmail || 'No email'} · ${role || 'No role'}`,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'approvalType',
      title: 'Approval Type',
      type: 'string',
      description: 'Type of approval required',
      options: {
        list: [
          { title: 'Single Approval', value: 'single' },
          { title: 'All Approvers', value: 'all' },
          { title: 'Majority', value: 'majority' },
        ],
      },
      initialValue: 'single',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'approvals',
      title: 'Approvals',
      type: 'array',
      description: 'Individual approval decisions',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'userId',
              title: 'User ID',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'userName',
              title: 'User Name',
              type: 'string',
            },
            {
              name: 'decision',
              title: 'Decision',
              type: 'string',
              options: {
                list: [
                  { title: 'Approved', value: 'approved' },
                  { title: 'Rejected', value: 'rejected' },
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'comment',
              title: 'Comment',
              type: 'text',
              rows: 3,
            },
            {
              name: 'decidedAt',
              title: 'Decided At',
              type: 'datetime',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              userName: 'userName',
              decision: 'decision',
              comment: 'comment',
              decidedAt: 'decidedAt',
            },
            prepare({ userName, decision, comment, decidedAt }) {
              const icon = decision === 'approved' ? '✅' : '❌'
              const date = decidedAt ? new Date(decidedAt).toLocaleString() : 'Unknown'

              return {
                title: `${icon} ${userName || 'Unknown'} - ${decision}`,
                subtitle: `${date} · ${comment || 'No comment'}`,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'requestNotes',
      title: 'Request Notes',
      type: 'text',
      rows: 3,
      description: 'Notes from the requester',
    }),
    defineField({
      name: 'finalComment',
      title: 'Final Comment',
      type: 'text',
      rows: 3,
      description: 'Final comment when request is resolved',
    }),
    defineField({
      name: 'resolvedAt',
      title: 'Resolved At',
      type: 'datetime',
      description: 'When the request was resolved (approved/rejected/cancelled)',
    }),
    defineField({
      name: 'dueDate',
      title: 'Due Date',
      type: 'datetime',
      description: 'When approval is needed by',
    }),
    defineField({
      name: 'priority',
      title: 'Priority',
      type: 'string',
      description: 'Priority level for this approval',
      options: {
        list: [
          { title: 'Low', value: 'low' },
          { title: 'Normal', value: 'normal' },
          { title: 'High', value: 'high' },
          { title: 'Urgent', value: 'urgent' },
        ],
      },
      initialValue: 'normal',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Tags for categorizing approvals',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
  ],
  preview: {
    select: {
      documentTitle: 'documentTitle',
      status: 'status',
      requestedBy: 'requestedBy.userName',
      requestedAt: 'requestedAt',
      priority: 'priority',
      approvalType: 'approvalType',
    },
    prepare({ documentTitle, status, requestedBy, requestedAt, priority, approvalType }) {
      const statusIcons = {
        pending: '⏳',
        approved: '✅',
        rejected: '❌',
        cancelled: '🚫',
      }

      const priorityIcons = {
        low: '🟢',
        normal: '🟡',
        high: '🟠',
        urgent: '🔴',
      }

      const icon = statusIcons[status as keyof typeof statusIcons] || '❓'
      const priorityIcon = priorityIcons[priority as keyof typeof priorityIcons] || ''
      const date = requestedAt ? new Date(requestedAt).toLocaleString() : 'Unknown'

      return {
        title: `${icon} ${priorityIcon} ${documentTitle || 'Untitled'}`,
        subtitle: `${status.toUpperCase()} · ${requestedBy || 'Unknown'} · ${approvalType} · ${date}`,
        media: CheckmarkCircleIcon,
      }
    },
  },
})
