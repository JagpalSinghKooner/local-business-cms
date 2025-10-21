import { defineArrayMember, defineField, defineType } from 'sanity'
import { sectionBaseFields } from './shared'

export default defineType({
  name: 'section.faq',
  title: 'FAQ Section',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'description',
      title: 'Intro Copy',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'faq' }] })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'display',
      title: 'Display Style',
      type: 'string',
      initialValue: 'accordion',
      options: {
        list: [
          { title: 'Accordion', value: 'accordion' },
          { title: 'Columns', value: 'columns' },
        ],
      },
    }),
    ...sectionBaseFields,
  ],
  preview: {
    select: { title: 'title', count: 'faqs.length' },
    prepare({ title, count }) {
      return {
        title: title || 'FAQs',
        subtitle: count ? `${count} question${count === 1 ? '' : 's'}` : 'FAQ Section',
      }
    },
  },
})
