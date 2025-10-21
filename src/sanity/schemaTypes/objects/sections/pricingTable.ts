import { defineArrayMember, defineField, defineType } from 'sanity'
import { sectionBaseFields } from './shared'

export default defineType({
  name: 'section.pricingTable',
  title: 'Pricing Table',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Supporting Copy',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'layoutMode',
      title: 'Layout',
      type: 'string',
      initialValue: 'cards',
      options: {
        list: [
          { title: 'Cards', value: 'cards' },
          { title: 'Side-by-side table', value: 'table' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'plans',
      title: 'Plans',
      type: 'array',
      validation: (rule) => rule.min(2),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'tagline',
              title: 'Tagline',
              type: 'string',
            }),
            defineField({
              name: 'price',
              title: 'Price',
              type: 'string',
              description: 'Displayed prominently (e.g. $299)',
            }),
            defineField({
              name: 'frequency',
              title: 'Billing Frequency',
              type: 'string',
              description: 'e.g. per month, annually, once-off',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'features',
              title: 'Features',
              type: 'array',
              of: [defineArrayMember({ type: 'string' })],
            }),
            defineField({
              name: 'isFeatured',
              title: 'Highlight plan',
              type: 'boolean',
            }),
            defineField({
              name: 'cta',
              title: 'Primary CTA',
              type: 'cta',
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'price' },
            prepare({ title, subtitle }) {
              return { title: title || 'Pricing plan', subtitle: subtitle || 'Plan' }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'footerNote',
      title: 'Footer Note',
      type: 'text',
      rows: 3,
      description: 'Displayed below the pricing table for disclaimers or guarantees.',
    }),
    ...sectionBaseFields,
  ],
  preview: {
    select: { title: 'heading', count: 'plans.length' },
    prepare({ title, count }) {
      return {
        title: title || 'Pricing table',
        subtitle: count ? `${count} plans` : 'Pricing layout',
      }
    },
  },
})
