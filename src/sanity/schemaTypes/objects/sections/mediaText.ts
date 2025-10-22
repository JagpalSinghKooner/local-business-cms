import { defineArrayMember, defineField, defineType } from 'sanity'
import { sectionBaseFields } from './shared'

export default defineType({
  name: 'section.mediaText',
  title: 'Media & Text',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'text' }),
    defineField({ name: 'body', title: 'Body', type: 'richText' }),
    defineField({
      name: 'media',
      title: 'Media',
      type: 'imageWithPriority',
    }),
    defineField({
      name: 'mediaPosition',
      title: 'Image position',
      type: 'string',
      options: {
        list: [
          { title: 'Image left', value: 'image-left' },
          { title: 'Image right', value: 'image-right' },
        ],
        layout: 'radio',
      },
      initialValue: 'image-right',
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
      title: 'Calls to action',
      type: 'array',
      of: [defineArrayMember({ type: 'cta' })],
    }),
    ...sectionBaseFields,
  ],
  preview: {
    select: { title: 'heading', subtitle: 'eyebrow', media: 'media.image' },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Media & Text',
        subtitle: subtitle || 'Two-column content block',
        media,
      }
    },
  },
})
