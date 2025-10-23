/**
 * Privacy Policy Configuration
 *
 * Manage privacy policy with versioning
 */

import { defineType, defineField } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export default defineType({
  name: 'privacyPolicy',
  title: 'Privacy Policy',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Privacy Policy',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Privacy policy content',
    }),
    defineField({
      name: 'effectiveDate',
      title: 'Effective Date',
      type: 'date',
      description: 'When this version becomes effective',
    }),
    defineField({
      name: 'version',
      title: 'Version',
      type: 'string',
      description: 'Version number (e.g., 1.0, 2.0)',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'sections',
      title: 'Policy Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'heading',
              title: 'Heading',
              type: 'string',
            },
            {
              name: 'content',
              title: 'Content',
              type: 'array',
              of: [{ type: 'block' }],
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      version: 'version',
      effectiveDate: 'effectiveDate',
    },
    prepare({ title, version, effectiveDate }) {
      const date = effectiveDate ? new Date(effectiveDate).toLocaleDateString() : 'No date'
      return {
        title: `${title} v${version || '1.0'}`,
        subtitle: `Effective: ${date}`,
      }
    },
  },
})
