import { defineArrayMember, defineField, defineType } from 'sanity'
import { sectionBaseFields } from './shared'
import { Sparkles } from 'lucide-react'
import HeroPreviewCard from '../../../components/previews/HeroPreviewCard'

export default defineType({
  name: 'section.hero',
  title: 'Hero Section',
  type: 'object',
  icon: Sparkles,
  fields: [
    defineField({
      name: 'variant',
      title: 'Layout',
      type: 'string',
      initialValue: 'split',
      options: {
        list: [
          { title: 'Split (image + copy)', value: 'split' },
          { title: 'Centered', value: 'centered' },
          { title: 'Background Image', value: 'background' },
        ],
        layout: 'radio',
      },
    }),
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subtitle',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'media',
      title: 'Hero Media',
      type: 'imageWithPriority',
      description: 'Hero images should use "Eager" loading priority for optimal LCP performance.',
    }),
    defineField({
      name: 'background',
      title: 'Background',
      type: 'string',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Muted', value: 'muted' },
          { title: 'Brand', value: 'brand' },
        ],
        layout: 'radio',
      },
      initialValue: 'default',
    }),
    defineField({
      name: 'ctas',
      title: 'Calls to Action',
      type: 'array',
      of: [defineArrayMember({ type: 'cta' })],
      validation: (rule) => rule.max(2),
    }),
    ...sectionBaseFields,
  ],
  preview: {
    select: {
      eyebrow: 'eyebrow',
      heading: 'heading',
      subheading: 'subheading',
      variant: 'variant',
      media: 'media',
      ctas: 'ctas',
    },
  },
  components: {
    preview: HeroPreviewCard as any,
  },
})
