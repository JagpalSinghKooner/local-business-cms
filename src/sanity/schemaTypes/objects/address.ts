import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'address',
  title: 'Address',
  type: 'object',
  fields: [
    defineField({
      name: 'street1',
      title: 'Street Address',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'street2',
      title: 'Suite / Unit',
      type: 'string',
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'state',
      title: 'State / Province',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'postcode',
      title: 'Postal Code',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      initialValue: 'United States',
      validation: (rule) => rule.required(),
    }),
  ],
})
