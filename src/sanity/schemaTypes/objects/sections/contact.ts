import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'section.contact',
  title: 'Contact / Lead Capture',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'formType',
      title: 'Form Type',
      type: 'string',
      initialValue: 'inline',
      options: {
        list: [
          { title: 'Inline contact form', value: 'inline' },
          { title: 'Embed HTML', value: 'embed' },
          { title: 'External link', value: 'external' },
        ],
      },
    }),
    defineField({
      name: 'embedCode',
      title: 'Embed HTML',
      type: 'text',
      rows: 6,
      hidden: ({ parent }) => parent?.formType !== 'embed',
    }),
    defineField({
      name: 'externalLink',
      title: 'External form link',
      type: 'string',
      hidden: ({ parent }) => parent?.formType !== 'external',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'formType' },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Contact Section',
        subtitle: subtitle ? `Form: ${subtitle}` : 'Contact Section',
      }
    },
  },
})
