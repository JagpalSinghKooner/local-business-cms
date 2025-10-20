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
