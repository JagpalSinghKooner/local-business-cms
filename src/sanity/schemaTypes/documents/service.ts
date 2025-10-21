import { defineArrayMember, defineField, defineType } from 'sanity'
import { WrenchIcon } from '@sanity/icons'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  icon: WrenchIcon,
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'serviceCategory' }],
      description: 'Assign the category used for navigation, filtering and mega menu grouping',
      validation: (rule) => rule.required().error('Please select a category'),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        slugify: (v) => v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heroImage',
      type: 'image',
      options: { hotspot: true },
      description: '16:9 recommended',
    }),
    defineField({
      name: 'breadcrumbs',
      title: 'Breadcrumbs',
      type: 'breadcrumbSettings',
      options: { collapsible: true, collapsed: true },
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      description: 'Optional modular sections rendered beneath the hero',
      of: [
        defineArrayMember({ type: 'section.features' }),
        defineArrayMember({ type: 'section.steps' }),
        defineArrayMember({ type: 'section.stats' }),
        defineArrayMember({ type: 'section.logos' }),
        defineArrayMember({ type: 'section.text' }),
        defineArrayMember({ type: 'section.services' }),
        defineArrayMember({ type: 'section.locations' }),
        defineArrayMember({ type: 'section.testimonials' }),
        defineArrayMember({ type: 'section.faq' }),
        defineArrayMember({ type: 'section.offers' }),
        defineArrayMember({ type: 'section.cta' }),
        defineArrayMember({ type: 'section.contact' }),
        defineArrayMember({ type: 'section.mediaText' }),
        defineArrayMember({ type: 'section.timeline' }),
        defineArrayMember({ type: 'section.pricingTable' }),
        defineArrayMember({ type: 'section.gallery' }),
        defineArrayMember({ type: 'section.quote' }),
        defineArrayMember({ type: 'section.blogList' }),
        defineArrayMember({ type: 'section.layout' }),
      ],
    }),
    defineField({
      name: 'displayOptions',
      title: 'Display Options',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: 'showRelatedLocations',
          title: 'Show related locations',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'showOtherServices',
          title: 'Show other services',
          type: 'boolean',
          initialValue: true,
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'richText',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'locations',
      title: 'Served Locations',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'location' }] }],
    }),
    defineField({
      name: 'scriptOverrides',
      title: 'Global Script Overrides',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'scriptKey', title: 'Script key', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true }),
          ],
        }),
      ],
    }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  orderings: [{ name: 'titleAsc', title: 'Title A→Z', by: [{ field: 'title', direction: 'asc' }] }],
  preview: { select: { title: 'title', media: 'heroImage', subtitle: 'category->title' } },
})
