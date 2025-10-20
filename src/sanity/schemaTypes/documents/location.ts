import { defineField, defineType } from 'sanity'
import { PinIcon } from '@sanity/icons'

export default defineType({
  name: 'location',
  title: 'Location',
  type: 'document',
  icon: PinIcon,
  fields: [
    defineField({ name: 'city', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'city',
        slugify: (v) => v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'intro', type: 'richText', validation: (r) => r.required() }),
    defineField({ name: 'gallery', type: 'array', of: [{ type: 'galleryImage' }] }),
    defineField({ name: 'map', title: 'Map', type: 'geo', description: 'Used for JSON-LD and map embeds' }),
    defineField({
      name: 'services',
      title: 'Popular Services',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'service' }] }],
    }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: { select: { title: 'city' }, prepare: ({ title }) => ({ title, subtitle: 'Location' }) },
})
