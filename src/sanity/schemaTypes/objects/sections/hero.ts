import { defineArrayMember, defineField, defineType } from 'sanity'
import { sectionBaseFields } from './shared'

export default defineType({
  name: 'section.hero',
  title: 'Hero Section',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Layout',
      type: 'string',
      initialValue: 'split',
      options: {
        list: [
          { title: 'Split (image + copy)', value: 'split' },
          { title: 'Centered', value: 'centered' },
          { title: 'Background Image', value: 'background' },
        ],
        layout: 'radio',
      },
    }),
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subtitle',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'media',
      title: 'Hero Media',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          hidden: ({ parent }) => !parent?.image,
        }),
        defineField({
          name: 'videoUrl',
          title: 'Embed URL',
          type: 'url',
          description: 'Optional background video or hero embed.',
        }),
      ],
    }),
    defineField({
      name: 'background',
      title: 'Background',
      type: 'string',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Muted', value: 'muted' },
          { title: 'Brand', value: 'brand' },
        ],
        layout: 'radio',
      },
      initialValue: 'default',
    }),
    defineField({
      name: 'ctas',
      title: 'Calls to Action',
      type: 'array',
      of: [defineArrayMember({ type: 'cta' })],
      validation: (rule) => rule.max(2),
    }),
    ...sectionBaseFields,
  ],
  preview: {
    select: { title: 'heading', subtitle: 'variant' },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Hero Section',
        subtitle: subtitle ? `Hero • ${subtitle}` : 'Hero Section',
      }
    },
  },
})
