import { defineArrayMember, defineField, defineType } from 'sanity'
import { sectionBaseFields } from './shared'

export default defineType({
  name: 'section.blogList',
  title: 'Blog List',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Supporting Copy',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'sourceMode',
      title: 'Source',
      type: 'string',
      initialValue: 'latest',
      options: {
        list: [
          { title: 'Latest posts', value: 'latest' },
          { title: 'Selected posts', value: 'selected' },
          { title: 'By category', value: 'category' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      hidden: ({ parent }) => parent?.sourceMode !== 'category',
    }),
    defineField({
      name: 'posts',
      title: 'Selected Posts',
      type: 'array',
      hidden: ({ parent }) => parent?.sourceMode !== 'selected',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'post' }] })],
    }),
    defineField({
      name: 'limit',
      title: 'Maximum Posts',
      type: 'number',
      initialValue: 3,
      validation: (rule) => rule.min(1).max(12),
    }),
    defineField({
      name: 'layoutMode',
      title: 'Layout',
      type: 'string',
      initialValue: 'cards',
      options: {
        list: [
          { title: 'Cards', value: 'cards' },
          { title: 'List', value: 'list' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'showAuthor',
      title: 'Show author details',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showPublishedDate',
      title: 'Show publish date',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'cta',
      title: 'Section CTA',
      type: 'cta',
    }),
    ...sectionBaseFields,
  ],
  preview: {
    select: { title: 'heading', mode: 'sourceMode' },
    prepare({ title, mode }) {
      const source = mode ? mode.charAt(0).toUpperCase() + mode.slice(1) : 'Latest'
      return {
        title: title || 'Blog list',
        subtitle: `${source} posts`,
      }
    },
  },
})
