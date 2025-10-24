import { defineArrayMember, defineField, defineType } from 'sanity'
import { sectionBaseFields } from './shared'
import { Wrench } from 'lucide-react'
import ServicesPreviewCard from '../../../components/previews/ServicesPreviewCard'

export default defineType({
  name: 'section.services',
  title: 'Services Grid',
  type: 'object',
  icon: Wrench,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Intro Copy',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'display',
      title: 'Display',
      type: 'string',
      initialValue: 'selected',
      options: {
        list: [
          { title: 'Selected services', value: 'selected' },
          { title: 'All services', value: 'all' },
          { title: 'By category', value: 'category' },
        ],
      },
    }),
    defineField({
      name: 'category',
      title: 'Filter by Category',
      type: 'reference',
      to: [{ type: 'serviceCategory' }],
      hidden: ({ parent }) => parent?.display !== 'category',
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'service' }] })],
      hidden: ({ parent }) => parent?.display !== 'selected',
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      initialValue: 3,
      validation: (rule) => rule.min(1).max(4),
    }),
    ...sectionBaseFields,
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
      services: 'services',
      displayAll: 'displayAll',
      layout: 'layout',
    },  },
  components: {
    preview: ServicesPreviewCard as any,
  },
})
