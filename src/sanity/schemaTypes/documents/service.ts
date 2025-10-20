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
    defineField({ name: 'seo', type: 'seo' }),
  ],
  orderings: [{ name: 'titleAsc', title: 'Title A→Z', by: [{ field: 'title', direction: 'asc' }] }],
  preview: { select: { title: 'title', media: 'heroImage', subtitle: 'category->title' } },
})
