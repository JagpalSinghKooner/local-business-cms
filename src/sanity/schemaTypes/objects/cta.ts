import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'cta',
  title: 'Call to Action',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'link',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      initialValue: 'primary',
      options: {
        list: [
          { title: 'Primary', value: 'primary' },
          { title: 'Secondary', value: 'secondary' },
          { title: 'Outline', value: 'outline' },
          { title: 'Link', value: 'link' },
        ],
        layout: 'radio',
      },
    }),
  ],
  preview: {
    select: { title: 'label', linkType: 'link.linkType', internalPath: 'link.internalPath', href: 'link.href' },
    prepare({ title, linkType, internalPath, href }) {
      const subtitle = linkType === 'external' ? href : internalPath
      return { title, subtitle }
    },
  },
})
