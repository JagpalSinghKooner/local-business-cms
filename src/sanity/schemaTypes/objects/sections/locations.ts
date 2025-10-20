import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'section.locations',
  title: 'Locations Grid',
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
      name: 'locations',
      title: 'Locations',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'location' }] })],
      description: 'Leave empty to display all locations.',
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
    select: { title: 'title' },
    prepare({ title }) {
      return {
        title: title || 'Locations Grid',
        subtitle: 'Locations Section',
      }
    },
  },
})
