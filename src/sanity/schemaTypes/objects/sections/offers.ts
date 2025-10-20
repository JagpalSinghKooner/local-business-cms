import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'section.offers',
  title: 'Offers & Coupons',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'description',
      title: 'Intro Copy',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'offers',
      title: 'Offers',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'offer' }] })],
      description: 'Leave empty to show all published offers.',
    }),
    defineField({
      name: 'limit',
      title: 'Max Offers to Show',
      type: 'number',
      initialValue: 3,
      validation: (rule) => rule.min(1).max(12),
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: title || 'Offers & Coupons' }
    },
  },
})
