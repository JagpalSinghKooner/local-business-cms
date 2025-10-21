import { defineArrayMember, defineField, defineType } from 'sanity'
import { sectionBaseFields } from './shared'

export default defineType({
  name: 'section.features',
  title: 'Feature Grid',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'description', type: 'text', rows: 3 }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      initialValue: 3,
      validation: (rule) => rule.min(1).max(4),
    }),
    defineField({
      name: 'items',
      title: 'Features',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'icon', type: 'string', description: 'Emoji or short text tag (optional)' }),
            defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'body', type: 'richText' }),
            defineField({ name: 'linkLabel', type: 'string' }),
            defineField({ name: 'link', type: 'link' }),
          ],
        }),
      ],
      validation: (rule) => rule.required().min(2),
    }),
    ...sectionBaseFields,
  ],
  preview: {
    select: { title: 'title', count: 'items.length' },
    prepare({ title, count }) {
      return { title: title || 'Feature Grid', subtitle: count ? `${count} items` : 'Feature Grid' }
    },
  },
})
