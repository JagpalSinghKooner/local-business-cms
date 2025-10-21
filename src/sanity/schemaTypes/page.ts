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
      validation: (r) => r.required(),
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
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
      ],
      description: 'Optional fallback content. Prefer building pages with sections.',
      group: 'content',
    }),
    ...seoFields.map((f) => ({ ...f, group: 'seo' })),
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
})
