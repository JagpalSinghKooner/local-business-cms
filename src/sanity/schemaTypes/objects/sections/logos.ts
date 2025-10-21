import { defineArrayMember, defineField, defineType } from 'sanity'
import { sectionBaseFields } from './shared'

export default defineType({
  name: 'section.logos',
  title: 'Logo Wall',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'description', type: 'text', rows: 2 }),
    defineField({
      name: 'items',
      title: 'Logos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'name', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'logo', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'url', type: 'url' }),
          ],
        }),
      ],
      validation: (rule) => rule.required().min(3),
    }),
    ...sectionBaseFields,
  ],
  preview: {
    select: { title: 'title', count: 'items.length' },
    prepare({ title, count }) {
      return { title: title || 'Logo Wall', subtitle: count ? `${count} logos` : 'Logo Wall' }
    },
  },
})
