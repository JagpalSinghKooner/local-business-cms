import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import deskStructure from './src/sanity/deskStructure'
import { schema } from './src/sanity/schemaTypes'
import createPageFromTemplateAction from './src/sanity/actions/createPageFromTemplate'
import { siteSwitcherTool } from './src/sanity/plugins/siteSwitcherTool'
import { workflowStatusTool } from './src/sanity/plugins/workflowStatusTool'
import { auditLogTool } from './src/sanity/plugins/auditLogTool'
import { webhookTool } from './src/sanity/plugins/webhookTool'
import { approvalTool } from './src/sanity/plugins/approvalTool'
import { versionHistoryTool } from './src/sanity/plugins/versionHistoryTool'

export default defineConfig({
  name: 'default',
  title: 'Budds Plumbing',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  basePath: '/studio',

  // Suppress version check errors in production (CSP restrictions)
  unstable_clientOnly: true,
  plugins: [
    structureTool({ structure: deskStructure }),
    siteSwitcherTool(),
    workflowStatusTool(),
    auditLogTool(),
    webhookTool(),
    approvalTool(),
    versionHistoryTool(),
  ].filter(Boolean), // Filter out any undefined plugins
  document: {
    actions: (prev, context) =>
      context.schemaType === 'pageTemplate' ? [...prev, createPageFromTemplateAction] : prev,
  },
  schema,
})
