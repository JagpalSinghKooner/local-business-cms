import { defineField, defineType } from 'sanity'
import { sectionBaseFields } from './shared'

export default defineType({
  name: 'section.quote',
  title: 'Quote',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'role', title: 'Author Title / Role', type: 'string' }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
    }),
    defineField({
      name: 'avatar',
      title: 'Author Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'logo',
      title: 'Company Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'alignment',
      title: 'Layout',
      type: 'string',
      initialValue: 'center',
      options: {
        list: [
          { title: 'Center', value: 'center' },
          { title: 'Left', value: 'left' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'cta',
      title: 'Optional CTA',
      type: 'cta',
    }),
    ...sectionBaseFields,
  ],
  preview: {
    select: { title: 'author', subtitle: 'company' },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Quote',
        subtitle: subtitle || 'Testimonial quote',
      }
    },
  },
})
