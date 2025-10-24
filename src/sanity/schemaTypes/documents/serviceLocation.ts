import { defineArrayMember, defineField, defineType } from 'sanity'
import { PinIcon } from '@sanity/icons'

export default defineType({
  name: 'serviceLocation',
  title: 'Service Location',
  type: 'document',
  icon: PinIcon,
  description: 'Service-specific content for a particular location (e.g., "Plumbing in Toronto")',
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'seo', title: 'SEO' },
    { name: 'settings', title: 'Settings' },
  ],
  fields: [
    // Core References
    defineField({
      name: 'service',
      title: 'Service',
      type: 'reference',
      to: [{ type: 'service' }],
      validation: (rule) => rule.required().error('Service is required'),
      description: 'The service being offered',
      group: 'content',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'reference',
      to: [{ type: 'location' }],
      validation: (rule) => rule.required().error('Location is required'),
      description: 'The location where this service is offered',
      group: 'content',
    }),

    // Auto-Generated Slug
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Auto-generated from service + location slugs (e.g., "plumbing-toronto")',
      options: {
        source: async (doc, context) => {
          const client = context.getClient({ apiVersion: '2024-01-01' })

          // Fetch service slug
          const serviceRef = doc.service as { _ref?: string } | undefined
          const locationRef = doc.location as { _ref?: string } | undefined

          if (!serviceRef?._ref || !locationRef?._ref) {
            return ''
          }

          const [service, location] = await Promise.all([
            client.fetch(`*[_id == $id][0].slug.current`, { id: serviceRef._ref }),
            client.fetch(`*[_id == $id][0].slug.current`, { id: locationRef._ref }),
          ])

          if (!service || !location) {
            return ''
          }

          return `${service}-${location}`
        },
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, ''),
      },
      validation: (Rule) =>
        Rule.required().custom(async (slug, context) => {
          if (!slug?.current) return true
          const { document, getClient } = context
          if (!document?._id || !document?._type) return true
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
      group: 'content',
    }),

    // Content Source Control
    defineField({
      name: 'contentSource',
      title: 'Content Source',
      type: 'string',
      description: 'How content for this page is generated',
      options: {
        list: [
          { title: 'Inherit from Service', value: 'inherit' },
          { title: 'Custom (Manually Authored)', value: 'custom' },
          { title: 'AI-Assisted (Future)', value: 'ai' },
        ],
        layout: 'radio',
      },
      initialValue: 'inherit',
      validation: (rule) => rule.required(),
      group: 'content',
    }),

    // Unique Content
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'richText',
      description:
        'Unique opening paragraph for this service in this location (50-150 words). Critical for SEO differentiation.',
      validation: (rule) =>
        rule.required().error('Intro is required for SEO. Write unique content for this service+location.'),
      group: 'content',
    }),

    // Modular Sections Array
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      description: 'Custom sections for this service+location page. Leave empty to inherit from service page.',
      group: 'content',
      of: [
        defineArrayMember({ type: 'section.hero' }),
        defineArrayMember({ type: 'section.features' }),
        defineArrayMember({ type: 'section.testimonials' }),
        defineArrayMember({ type: 'section.faq' }),
        defineArrayMember({ type: 'section.cta' }),
        defineArrayMember({ type: 'section.contact' }),
        defineArrayMember({ type: 'section.gallery' }),
        defineArrayMember({ type: 'section.offers' }),
        defineArrayMember({ type: 'section.stats' }),
        defineArrayMember({ type: 'section.text' }),
        defineArrayMember({ type: 'section.mediaText' }),
        defineArrayMember({ type: 'section.timeline' }),
        defineArrayMember({ type: 'section.quote' }),
        defineArrayMember({ type: 'section.layout' }),
        defineArrayMember({ type: 'section.steps' }),
        defineArrayMember({ type: 'section.logos' }),
        defineArrayMember({ type: 'section.pricingTable' }),
        defineArrayMember({ type: 'section.services' }),
        defineArrayMember({ type: 'section.locations' }),
        defineArrayMember({ type: 'section.blogList' }),
      ],
    }),

    // Display Options
    defineField({
      name: 'displayOptions',
      title: 'Display Options',
      type: 'object',
      description: 'Control which related content sections are shown',
      group: 'settings',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'showNearbyLocations',
          title: 'Show nearby locations',
          type: 'boolean',
          description: 'Display other locations where this service is available',
          initialValue: true,
        }),
        defineField({
          name: 'showRelatedServices',
          title: 'Show related services',
          type: 'boolean',
          description: 'Display other services available in this location',
          initialValue: true,
        }),
      ],
    }),

    // SEO (Using unified system)
    defineField({
      name: 'seo',
      type: 'seoUnified',
      description: 'Auto-generated from service + location data if left empty. Override for custom SEO.',
      group: 'seo',
    }),

    // Internal Schema Version
    defineField({
      name: 'schemaVersion',
      type: 'string',
      title: 'Schema Version',
      initialValue: '1',
      readOnly: true,
      hidden: true,
      description: 'Internal: tracks schema version for safe migrations',
    }),
  ],

  // Preview
  preview: {
    select: {
      serviceTitle: 'service.title',
      locationCity: 'location.city',
      slug: 'slug.current',
      contentSource: 'contentSource',
    },
    prepare({ serviceTitle, locationCity, slug, contentSource }) {
      const title = `${serviceTitle || '?'} in ${locationCity || '?'}`
      const subtitle = slug ? `/services/${slug}` : 'No slug generated'
      const sourceLabel = contentSource === 'custom' ? ' [Custom]' : contentSource === 'inherit' ? ' [Inherit]' : ''

      return {
        title: title + sourceLabel,
        subtitle,
      }
    },
  },

  // Orderings
  orderings: [
    {
      name: 'serviceAsc',
      title: 'Service A→Z',
      by: [{ field: 'service.title', direction: 'asc' }],
    },
    {
      name: 'locationAsc',
      title: 'Location A→Z',
      by: [{ field: 'location.city', direction: 'asc' }],
    },
    {
      name: 'recentlyCreated',
      title: 'Recently Created',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
})
