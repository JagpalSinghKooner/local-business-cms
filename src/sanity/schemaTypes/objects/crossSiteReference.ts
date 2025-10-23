/**
 * Cross-Site Reference Schema
 *
 * Allows referencing content from other datasets
 * Use cases: Shared FAQ libraries, template content, industry articles
 */

import { defineType, defineField } from 'sanity'
import { LinkIcon } from '@sanity/icons'

export default defineType({
  name: 'crossSiteReference',
  title: 'Cross-Site Reference',
  type: 'object',
  icon: LinkIcon,
  description: 'Reference content from another dataset (use sparingly - prefer dataset isolation)',
  fields: [
    defineField({
      name: 'dataset',
      title: 'Source Dataset',
      type: 'string',
      description: 'The dataset to fetch content from (e.g., site-shared, site-budds)',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'Shared Content Library', value: 'site-shared' },
          { title: 'Budds Plumbing', value: 'site-budds' },
          { title: 'ACME HVAC', value: 'site-hvac' },
          // Add more datasets as needed
        ],
      },
    }),
    defineField({
      name: 'documentId',
      title: 'Document ID',
      type: 'string',
      description: 'The _id of the document to reference',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'documentType',
      title: 'Document Type',
      type: 'string',
      description: 'Optional: The _type of the document (for validation)',
      options: {
        list: [
          { title: 'FAQ', value: 'faq' },
          { title: 'Service', value: 'service' },
          { title: 'Blog Post', value: 'post' },
          { title: 'Testimonial', value: 'testimonial' },
          { title: 'Page', value: 'page' },
        ],
      },
    }),
    defineField({
      name: 'preview',
      title: 'Preview',
      type: 'object',
      description: 'Preview information (auto-populated)',
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 2,
        }),
      ],
    }),
  ],
  preview: {
    select: {
      dataset: 'dataset',
      documentId: 'documentId',
      documentType: 'documentType',
      title: 'preview.title',
    },
    prepare({ dataset, documentId, documentType, title }) {
      return {
        title: title || `${documentType || 'Document'} from ${dataset}`,
        subtitle: `ID: ${documentId}`,
        media: LinkIcon,
      }
    },
  },
})
