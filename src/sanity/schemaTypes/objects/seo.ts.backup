import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Meta Title',
      type: 'string',
      validation: (r) => r.required().max(60),
    }),
    defineField({
      name: 'description',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      validation: (r) => r.required().min(50).max(160),
    }),
    defineField({
      name: 'canonical',
      title: 'Canonical URL',
      type: 'url',
      validation: (r) => r.uri({ allowRelative: true, scheme: ['https'] }),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  options: { collapsible: true, collapsed: true },
})
