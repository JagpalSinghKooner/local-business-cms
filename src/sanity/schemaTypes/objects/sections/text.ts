import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'section.text',
  title: 'Text Block',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        defineArrayMember({ type: 'block' }),
        defineArrayMember({ type: 'image', options: { hotspot: true } }),
      ],
    }),
    defineField({
      name: 'alignment',
      title: 'Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'eyebrow' },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Text Block',
        subtitle: subtitle || 'Rich text',
      }
    },
  },
})
