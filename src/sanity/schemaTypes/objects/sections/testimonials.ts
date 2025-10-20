import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'section.testimonials',
  title: 'Testimonials',
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
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'testimonial' }] })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'style',
      title: 'Layout',
      type: 'string',
      initialValue: 'grid',
      options: {
        list: [
          { title: 'Grid', value: 'grid' },
          { title: 'Carousel', value: 'carousel' },
        ],
        layout: 'radio',
      },
    }),
  ],
  preview: {
    select: { title: 'title', count: 'testimonials.length' },
    prepare({ title, count }) {
      return {
        title: title || 'Testimonials',
        subtitle: count ? `${count} testimonial${count === 1 ? '' : 's'}` : 'Testimonials',
      }
    },
  },
})
