import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'section.steps',
  title: 'Process Steps',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'description', type: 'text', rows: 3 }),
    defineField({
      name: 'items',
      title: 'Steps',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'body', type: 'richText' }),
          ],
        }),
      ],
      validation: (rule) => rule.required().min(2),
    }),
  ],
  preview: {
    select: { title: 'title', count: 'items.length' },
    prepare({ title, count }) {
      return { title: title || 'Process Steps', subtitle: count ? `${count} steps` : 'Steps' }
    },
  },
})
