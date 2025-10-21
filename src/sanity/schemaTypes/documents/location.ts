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
    defineField({
      name: 'breadcrumbs',
      title: 'Breadcrumbs',
      type: 'breadcrumbSettings',
      options: { collapsible: true, collapsed: true },
    }),
    defineField({
      name: 'displayOptions',
      title: 'Display Options',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: 'showGallery',
          title: 'Show gallery',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'showPopularServices',
          title: 'Show popular services',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'showOtherLocations',
          title: 'Show other nearby locations',
          type: 'boolean',
          initialValue: true,
        }),
      ],
    }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: { select: { title: 'city' }, prepare: ({ title }) => ({ title, subtitle: 'Location' }) },
})
