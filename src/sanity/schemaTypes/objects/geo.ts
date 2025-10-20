import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'geo',
  title: 'Map Coordinates',
  type: 'object',
  fields: [
    defineField({ name: 'lat', title: 'Latitude', type: 'number', validation: (r) => r.required() }),
    defineField({ name: 'lng', title: 'Longitude', type: 'number', validation: (r) => r.required() }),
  ],
})
