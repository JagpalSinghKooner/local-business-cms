import { defineType, defineField } from 'sanity'
import { seoFields } from './fields/seo'

export default defineType({
  name: 'post',
  title: 'Blog Post',
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
    defineField({ name: 'author', type: 'string', group: 'content' }),
    defineField({ name: 'date', type: 'datetime', group: 'content' }),
    defineField({
      name: 'categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      group: 'content',
    }),
    defineField({
      name: 'hero',
      type: 'image',
      options: { hotspot: true },
      group: 'content',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          validation: (Rule) => Rule.required().error('Alt text required for accessibility'),
        },
      ],
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
      group: 'content',
    }),
    defineField({
      name: 'breadcrumbs',
      title: 'Breadcrumbs',
      type: 'breadcrumbSettings',
      options: { collapsible: true, collapsed: true },
      group: 'content',
    }),
    ...seoFields.map((f) => ({ ...f, group: 'seo' })),
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
  preview: { select: { title: 'title', subtitle: 'slug.current', media: 'hero' } },
})
