import { defineField, defineType } from 'sanity'
import { InternalLinkInput } from '../../components/inputs/InternalLinkInput'

export default defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'linkType',
      title: 'Link type',
      type: 'string',
      options: {
        list: [
          { title: 'Internal link', value: 'internal' },
          { title: 'External URL', value: 'external' },
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
    }),
    defineField({
      name: 'internalPath',
      title: 'Internal path',
      type: 'string',
      description: 'Select or enter a relative path such as /contact.',
      components: {
        input: InternalLinkInput,
      },
      hidden: ({ parent }) => parent?.linkType !== 'internal',
    }),
    defineField({
      name: 'href',
      title: 'External URL',
      type: 'url',
      description: 'Use a full URL including https://. Mailto: and tel: are also supported.',
      hidden: ({ parent }) => parent?.linkType !== 'external',
      validation: (rule) =>
        rule.uri({ allowRelative: false, scheme: ['http', 'https', 'mailto', 'tel'] }),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  validation: (rule) =>
    rule.custom((value) => {
      if (!value) return 'Link is required'
      if (value.linkType === 'external') {
        return value.href ? true : 'Add a destination URL'
      }
      return value.internalPath ? true : 'Select an internal path'
    }),
  preview: {
    select: {
      linkType: 'linkType',
      internalPath: 'internalPath',
      href: 'href',
    },
    prepare({ linkType, internalPath, href }) {
      const value = linkType === 'external' ? href : internalPath
      return {
        title: value || 'Link',
        subtitle: linkType === 'external' ? 'External' : 'Internal',
      }
    },
  },
})
