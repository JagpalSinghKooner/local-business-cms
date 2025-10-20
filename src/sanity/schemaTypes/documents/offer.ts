import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'

export default defineType({
  name: 'offer',
  title: 'Offer',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'excerpt', type: 'text', rows: 2, validation: (r) => r.required().max(160) }),
    defineField({ name: 'body', type: 'richText', validation: (r) => r.required() }),
    defineField({ name: 'validFrom', type: 'datetime', validation: (r) => r.required() }),
    defineField({ name: 'validTo', type: 'datetime', validation: (r) => r.required() }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: { select: { title: 'title', subtitle: 'excerpt' } },
})
