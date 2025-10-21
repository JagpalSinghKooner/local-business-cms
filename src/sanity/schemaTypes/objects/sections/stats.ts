import { defineArrayMember, defineField, defineType } from 'sanity'
import { sectionBaseFields } from './shared'

export default defineType({
  name: 'section.stats',
  title: 'Stats Banner',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'description', type: 'text', rows: 2 }),
    defineField({
      name: 'items',
      title: 'Stats',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'value', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'label', type: 'string', validation: (rule) => rule.required() }),
          ],
        }),
      ],
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: 'alignment',
      title: 'Alignment',
      type: 'string',
      options: { list: ['left', 'center'], layout: 'radio' },
      initialValue: 'center',
    }),
    ...sectionBaseFields,
  ],
  preview: {
    select: { title: 'title', count: 'items.length' },
    prepare({ title, count }) {
      return { title: title || 'Stats', subtitle: count ? `${count} stat${count === 1 ? '' : 's'}` : 'Stats' }
    },
  },
})
