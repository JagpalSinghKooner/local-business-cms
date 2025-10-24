import { defineField, defineType } from 'sanity'
import { sectionBaseFields } from './shared'
import { Mail } from 'lucide-react'
import ContactPreviewCard from '../../../components/previews/ContactPreviewCard'

export default defineType({
  name: 'section.contact',
  title: 'Contact / Lead Capture',
  type: 'object',
  icon: Mail,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
    }),
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
      type: 'link',
      hidden: ({ parent }) => parent?.formType !== 'external',
    }),
    ...sectionBaseFields,
  ],
  preview: {
    select: {
      heading: 'heading',
      description: 'description',
      showMap: 'showMap',
      showContactInfo: 'showContactInfo',
    },  },
  components: {
    preview: ContactPreviewCard as any,
  },
})
