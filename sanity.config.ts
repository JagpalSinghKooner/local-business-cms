import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import deskStructure from './src/sanity/deskStructure'
import { defaultDocumentNode } from './src/sanity/defaultDocumentNode'
import { schema } from './src/sanity/schemaTypes'
import createPageFromTemplateAction from './src/sanity/actions/createPageFromTemplate'
import { generateServiceLocationsAction } from './src/sanity/documentActions/generateServiceLocations'
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

  // Disable version check in embedded Next.js Studio (prevents CSP fetch errors)
  unstable_noVersionCheck: true,

  plugins: [
    structureTool({
      structure: deskStructure,
      defaultDocumentNode,
    }),
    // Presentation Tool removed - using iframe preview via defaultDocumentNode instead
    // This provides stable preview without visual editing complexity
    siteSwitcherTool(),
    workflowStatusTool(),
    auditLogTool(),
    webhookTool(),
    approvalTool(),
    versionHistoryTool(),
  ],
  document: {
    actions: (prev, context) => {
      // Add template creation action for pageTemplate
      if (context.schemaType === 'pageTemplate') {
        return [...prev, createPageFromTemplateAction]
      }
      // Add auto-generation action for service and location
      if (context.schemaType === 'service' || context.schemaType === 'location') {
        return [...prev, generateServiceLocationsAction]
      }
      return prev
    },
  },
  schema,
})
