import { defineArrayMember, defineField, defineType } from 'sanity'
import { sectionBaseFields, layoutField } from './shared'

const spacingOptions = [
  { title: 'None', value: 'none' },
  { title: 'XS', value: 'xs' },
  { title: 'SM', value: 'sm' },
  { title: 'MD', value: 'md' },
  { title: 'LG', value: 'lg' },
  { title: 'XL', value: 'xl' },
  { title: 'Section', value: 'section' },
]

export default defineType({
  name: 'section.layout',
  title: 'Layout Group',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      description: 'Only used in Studio to identify this layout block.',
    }),
    defineField({
      name: 'layoutSettings',
      title: 'Layout Settings',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [layoutField],
    }),
    defineField({
      name: 'gap',
      title: 'Gap Between Sections',
      type: 'string',
      initialValue: 'md',
      options: { list: spacingOptions },
    }),
    defineField({
      name: 'sections',
      title: 'Nested Sections',
      type: 'array',
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
      ],
    }),
  ],
  preview: {
    select: { title: 'title', sections: 'sections.length' },
    prepare({ title, sections }) {
      return {
        title: title || 'Layout Group',
        subtitle: sections ? `${sections} section${sections === 1 ? '' : 's'}` : 'No sections',
      }
    },
  },
})
