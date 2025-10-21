import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'trackingScript',
  title: 'Tracking Script',
  type: 'object',
  fields: [
    defineField({
      name: 'key',
      title: 'Key',
      type: 'string',
      description: 'Unique identifier used for per-page overrides (letters, numbers, dashes).',
      validation: (rule) =>
        rule
          .required()
          .regex(/^[a-z0-9-]+$/i, { name: 'key' })
          .error('Use letters, numbers, or dashes for the key.'),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Internal name to identify this script',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'code',
      title: 'Script Code',
      type: 'text',
      rows: 6,
      description: 'Full script tag or inline snippet injected on every page',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Injection Point',
      type: 'string',
      options: {
        list: [
          { title: 'Head', value: 'head' },
          { title: 'Body', value: 'body' },
        ],
        layout: 'radio',
      },
      initialValue: 'head',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'location',
    },
  },
})
