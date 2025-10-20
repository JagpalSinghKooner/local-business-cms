import { defineField, defineType } from 'sanity'
import { ComposeIcon } from '@sanity/icons'

export default defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  icon: ComposeIcon,
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'heroImage', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'summary', type: 'text', rows: 3, validation: (r) => r.required().max(220) }),
    defineField({ name: 'body', type: 'richText', validation: (r) => r.required() }),
    defineField({
      name: 'relatedServices',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'service' }] }],
    }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: { select: { title: 'title', media: 'heroImage', subtitle: 'summary' } },
})
