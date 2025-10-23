import { defineArrayMember, defineField, defineType } from 'sanity'
import { seoFields } from './fields/seo'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (r) => r.required(),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
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
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({ type: 'section.hero' }),
        defineArrayMember({ type: 'section.text' }),
        defineArrayMember({ type: 'section.services' }),
        defineArrayMember({ type: 'section.locations' }),
        defineArrayMember({ type: 'section.testimonials' }),
        defineArrayMember({ type: 'section.faq' }),
        defineArrayMember({ type: 'section.offers' }),
        defineArrayMember({ type: 'section.cta' }),
        defineArrayMember({ type: 'section.contact' }),
        defineArrayMember({ type: 'section.features' }),
        defineArrayMember({ type: 'section.mediaText' }),
        defineArrayMember({ type: 'section.steps' }),
        defineArrayMember({ type: 'section.stats' }),
        defineArrayMember({ type: 'section.logos' }),
        defineArrayMember({ type: 'section.timeline' }),
        defineArrayMember({ type: 'section.pricingTable' }),
        defineArrayMember({ type: 'section.gallery' }),
        defineArrayMember({ type: 'section.quote' }),
        defineArrayMember({ type: 'section.blogList' }),
        defineArrayMember({ type: 'section.layout' }),
      ],
    }),
    defineField({
      name: 'breadcrumbs',
      title: 'Breadcrumbs',
      description: 'Override automatic breadcrumbs or inject additional items.',
      type: 'breadcrumbSettings',
      group: 'content',
    }),
    defineField({
      name: 'scriptOverrides',
      title: 'Global Script Overrides',
      type: 'array',
      description: 'Enable or disable global scripts (use the keys defined in Site Settings).',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'scriptKey',
              title: 'Script key',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'enabled',
              title: 'Enabled',
              type: 'boolean',
              initialValue: true,
            }),
          ],
          preview: {
            select: { title: 'scriptKey', enabled: 'enabled' },
            prepare({ title, enabled }) {
              return { title: title || 'Script', subtitle: enabled ? 'Enabled' : 'Disabled' }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Legacy Body',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
      description: 'Optional fallback content. Prefer building pages with sections.',
      group: 'content',
    }),
    ...seoFields.map((f) => ({ ...f, group: 'seo' })),
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
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
})
