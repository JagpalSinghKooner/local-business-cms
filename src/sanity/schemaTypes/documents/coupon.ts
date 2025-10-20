import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'

export default defineType({
  name: 'coupon',
  title: 'Coupon',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'code', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'discountText', type: 'string', description: 'e.g. £25 off drain cleaning' }),
    defineField({ name: 'validTo', type: 'datetime' }),
    defineField({
      name: 'appliesTo',
      title: 'Applies To Services',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'service' }] }],
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'code' } },
})
