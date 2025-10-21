import { defineArrayMember, defineField, defineType } from 'sanity'
import { InternalLinkInput } from '../../components/inputs/InternalLinkInput'

export default defineType({
  name: 'richText',
  title: 'Rich Text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      marks: {
        annotations: [
          defineField({
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
                    { title: 'External link', value: 'external' },
                  ],
                  layout: 'radio',
                },
                initialValue: 'internal',
              }),
              defineField({
                name: 'internalPath',
                title: 'Internal path',
                type: 'string',
                description: 'Select an internal page or enter a relative path (e.g. /contact).',
                hidden: ({ parent }) => parent?.linkType !== 'internal',
                components: {
                  input: InternalLinkInput,
                },
                validation: (rule) =>
                  rule.custom((value, context) => {
                    const parent = context.parent as { linkType?: string } | undefined
                    if (parent?.linkType === 'internal' && !value) {
                      return 'Select an internal path'
                    }
                    if (value && !value.startsWith('/')) {
                      return 'Internal paths should start with "/"'
                    }
                    return true
                  }),
              }),
              defineField({
                name: 'href',
                title: 'External URL',
                type: 'url',
                description: 'Use a full URL (https://example.com).',
                hidden: ({ parent }) => parent?.linkType !== 'external',
                validation: (rule) =>
                  rule.uri({
                    allowRelative: false,
                    scheme: ['http', 'https', 'mailto', 'tel'],
                  }),
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
                if (!value) return true
                if (value.linkType === 'internal' && !value.internalPath) {
                  return 'Select an internal path'
                }
                if (value.linkType === 'external' && !value.href) {
                  return 'Enter a URL'
                }
                return true
              }),
          }),
        ],
      },
    }),
    defineArrayMember({ type: 'image', options: { hotspot: true } }),
  ],
})
