import { defineType } from 'sanity'

export default defineType({
  name: 'richText',
  title: 'Rich Text',
  type: 'array',
  of: [
    { type: 'block' },
    { type: 'image', options: { hotspot: true } },
  ],
})
