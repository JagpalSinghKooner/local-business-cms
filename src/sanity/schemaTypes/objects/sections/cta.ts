import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'section.cta',
  title: 'CTA Banner',
  type: 'object',
  fields: [
    defineField({
      name: 'background',
      title: 'Background',
      type: 'string',
      initialValue: 'brand',
      options: {
        list: [
          { title: 'Brand', value: 'brand' },
          { title: 'Dark', value: 'dark' },
          { title: 'Light', value: 'light' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'ctas',
      title: 'Buttons',
      type: 'array',
      of: [defineArrayMember({ type: 'cta' })],
      validation: (rule) => rule.required().min(1).max(2),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return {
        title: title || 'CTA Banner',
        subtitle: 'Call to action',
      }
    },
  },
})
