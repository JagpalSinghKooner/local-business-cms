import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import deskStructure from './src/sanity/deskStructure'
import { schema } from './src/sanity/schemaTypes'
import createPageFromTemplateAction from './src/sanity/actions/createPageFromTemplate'

export default defineConfig({
  name: 'default',
  title: 'Budds Plumbing',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  basePath: '/studio',
  plugins: [deskTool({ structure: deskStructure })],
  document: {
    actions: (prev, context) =>
      context.schemaType === 'pageTemplate' ? [...prev, createPageFromTemplateAction] : prev,
  },
  schema,
})
