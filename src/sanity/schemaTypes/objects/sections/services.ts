import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'section.services',
  title: 'Services Grid',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Intro Copy',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'display',
      title: 'Display',
      type: 'string',
      initialValue: 'selected',
      options: {
        list: [
          { title: 'Selected services', value: 'selected' },
          { title: 'All services', value: 'all' },
          { title: 'By category', value: 'category' },
        ],
      },
    }),
    defineField({
      name: 'category',
      title: 'Filter by Category',
      type: 'reference',
      to: [{ type: 'serviceCategory' }],
      hidden: ({ parent }) => parent?.display !== 'category',
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'service' }] })],
      hidden: ({ parent }) => parent?.display !== 'selected',
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      initialValue: 3,
      validation: (rule) => rule.min(1).max(4),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'display' },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Services Grid',
        subtitle: subtitle ? `Display: ${subtitle}` : 'Services Grid',
      }
    },
  },
})
