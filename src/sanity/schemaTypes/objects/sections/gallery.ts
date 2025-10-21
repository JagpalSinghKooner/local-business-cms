import { defineArrayMember, defineField, defineType } from 'sanity'
import { sectionBaseFields } from './shared'

export default defineType({
  name: 'section.gallery',
  title: 'Media Gallery',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Supporting Copy',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'layoutMode',
      title: 'Layout',
      type: 'string',
      initialValue: 'grid',
      options: {
        list: [
          { title: 'Grid', value: 'grid' },
          { title: 'Masonry', value: 'masonry' },
          { title: 'Carousel', value: 'carousel' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'enableLightbox',
      title: 'Enable lightbox',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'galleryImage',
        }),
      ],
      validation: (rule) => rule.min(3),
    }),
    ...sectionBaseFields,
  ],
  preview: {
    select: { title: 'heading', count: 'images.length' },
    prepare({ title, count }) {
      return {
        title: title || 'Gallery',
        subtitle: count ? `${count} media item${count === 1 ? '' : 's'}` : 'Gallery',
      }
    },
  },
})
