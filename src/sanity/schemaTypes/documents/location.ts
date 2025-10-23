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
        slugify: (v) =>
          v
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, ''),
      },
      validation: (Rule) =>
        Rule.required().custom(async (slug, context) => {
          if (!slug?.current) return true
          const { document, getClient } = context
          const client = getClient({ apiVersion: '2024-01-01' })
          const id = document._id.replace(/^drafts\./, '')
          const params = {
            draft: `drafts.${id}`,
            published: id,
            slug: slug.current,
            type: document._type,
          }
          const query = `!defined(*[_type == $type && slug.current == $slug && !(_id in [$draft, $published])][0]._id)`
          const isUnique = await client.fetch(query, params)
          return isUnique || 'Slug must be unique within this content type'
        }),
    }),
    defineField({ name: 'intro', type: 'richText', validation: (r) => r.required() }),
    defineField({ name: 'gallery', type: 'array', of: [{ type: 'galleryImage' }] }),
    defineField({
      name: 'map',
      title: 'Map',
      type: 'geo',
      description: 'Used for JSON-LD and map embeds',
    }),
    defineField({
      name: 'localSEO',
      title: 'Local SEO Data',
      type: 'object',
      description: 'Additional data for local SEO and Schema.org structured data',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'county', type: 'string', description: 'County or region name' }),
        defineField({
          name: 'state',
          type: 'string',
          description: 'State or province (e.g., "ON", "CA")',
        }),
        defineField({
          name: 'zipCodes',
          title: 'ZIP/Postal Codes',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'List of ZIP or postal codes served',
        }),
        defineField({
          name: 'neighborhoods',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'Neighborhoods or districts within this location',
        }),
        defineField({
          name: 'radius',
          type: 'number',
          description: 'Service radius in miles from this location',
          initialValue: 25,
        }),
        defineField({
          name: 'populationSize',
          title: 'Population Size',
          type: 'string',
          description: 'Used to prioritize locations in listings',
          options: {
            list: [
              { title: 'Small (< 50k)', value: 'small' },
              { title: 'Medium (50k - 250k)', value: 'medium' },
              { title: 'Large (> 250k)', value: 'large' },
            ],
          },
        }),
      ],
    }),
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
    defineField({
      name: '_schemaVersion',
      type: 'string',
      title: 'Schema Version',
      initialValue: '1',
      readOnly: true,
      hidden: true,
      description: 'Internal: tracks schema version for safe migrations',
    }),
  ],
  preview: { select: { title: 'city' }, prepare: ({ title }) => ({ title, subtitle: 'Location' }) },
})
