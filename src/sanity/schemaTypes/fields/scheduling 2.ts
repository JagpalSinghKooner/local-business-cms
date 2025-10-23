/**
 * Scheduling Fields
 *
 * Fields for scheduling content to publish/unpublish at specific times
 */

import { defineField } from 'sanity'
import { CalendarIcon, ClockIcon } from '@sanity/icons'

/**
 * Publish At Field
 * Schedule when content should be published
 */
export const publishAtField = defineField({
  name: 'publishAt',
  title: 'Publish At',
  type: 'datetime',
  description: 'Schedule when this content should be published (leave empty to publish immediately)',
  icon: CalendarIcon,
  options: {
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm',
    timeStep: 15,
  },
  validation: (Rule) =>
    Rule.custom((value, context) => {
      if (!value) return true

      const publishAt = new Date(value)
      const now = new Date()

      // Warn if scheduling in the past
      if (publishAt < now) {
        return {
          level: 'warning',
          message: 'Publish date is in the past. Content will be published immediately.',
        }
      }

      // Warn if scheduling more than 1 year in the future
      const oneYearFromNow = new Date()
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

      if (publishAt > oneYearFromNow) {
        return {
          level: 'warning',
          message: 'Publish date is more than 1 year in the future. Is this intentional?',
        }
      }

      return true
    }),
})

/**
 * Unpublish At Field
 * Schedule when content should be automatically unpublished
 */
export const unpublishAtField = defineField({
  name: 'unpublishAt',
  title: 'Unpublish At',
  type: 'datetime',
  description: 'Schedule when this content should be automatically unpublished (optional)',
  icon: ClockIcon,
  options: {
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm',
    timeStep: 15,
  },
  validation: (Rule) =>
    Rule.custom((value, context) => {
      if (!value) return true

      const unpublishAt = new Date(value)
      const now = new Date()

      // Get publishAt from document if available
      const doc = context.document as any
      const publishAt = doc?.publishAt ? new Date(doc.publishAt) : now

      // Warn if unpublishing in the past
      if (unpublishAt < now) {
        return {
          level: 'warning',
          message: 'Unpublish date is in the past. Content will remain published.',
        }
      }

      // Error if unpublishing before publishing
      if (publishAt && unpublishAt < publishAt) {
        return 'Unpublish date must be after publish date'
      }

      return true
    }),
})

/**
 * Combined Scheduling Object
 * Use this for a grouped scheduling section
 */
export const schedulingObject = defineField({
  name: 'scheduling',
  title: 'Publishing Schedule',
  type: 'object',
  description: 'Schedule when this content should be published and unpublished',
  icon: CalendarIcon,
  fields: [
    {
      name: 'publishAt',
      title: 'Publish At',
      type: 'datetime',
      description: 'When to publish (leave empty for immediate)',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeStep: 15,
      },
    },
    {
      name: 'unpublishAt',
      title: 'Unpublish At',
      type: 'datetime',
      description: 'When to automatically unpublish (optional)',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeStep: 15,
      },
    },
    {
      name: 'timezone',
      title: 'Timezone',
      type: 'string',
      description: 'Timezone for scheduled dates',
      options: {
        list: [
          { title: 'Eastern Time (ET)', value: 'America/New_York' },
          { title: 'Central Time (CT)', value: 'America/Chicago' },
          { title: 'Mountain Time (MT)', value: 'America/Denver' },
          { title: 'Pacific Time (PT)', value: 'America/Los_Angeles' },
          { title: 'UTC', value: 'UTC' },
        ],
      },
      initialValue: 'America/New_York',
    },
  ],
  preview: {
    select: {
      publishAt: 'publishAt',
      unpublishAt: 'unpublishAt',
    },
    prepare({ publishAt, unpublishAt }) {
      const publishDate = publishAt ? new Date(publishAt).toLocaleString() : 'Not scheduled'
      const unpublishDate = unpublishAt ? new Date(unpublishAt).toLocaleString() : 'Never'

      return {
        title: `Publish: ${publishDate}`,
        subtitle: `Unpublish: ${unpublishDate}`,
      }
    },
  },
})
