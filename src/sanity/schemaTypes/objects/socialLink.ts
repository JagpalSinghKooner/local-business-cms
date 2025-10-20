import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'socialLink',
  title: 'Social Link',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (rule) => rule.required().uri({ allowRelative: false, scheme: ['https'] }),
    }),
  ],
  preview: {
    select: {
      title: 'platform',
      subtitle: 'url',
    },
  },
})
