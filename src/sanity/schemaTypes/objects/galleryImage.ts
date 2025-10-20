import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'galleryImage',
  title: 'Gallery Image',
  type: 'object',
  fields: [
    defineField({ name: 'image', type: 'image', options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: 'alt', type: 'string', validation: (r) => r.required().max(120) }),
  ],
})
