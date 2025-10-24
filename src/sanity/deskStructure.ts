import { StructureBuilder } from 'sanity/structure'
import { ConfigContext } from 'sanity'

/**
 * Role-based desk structure for Sanity Studio
 * Provides hierarchical organization with conditional access controls
 */
const deskStructure = (S: StructureBuilder, context: ConfigContext) => {
  // Check if the current user has administrator role
  const currentUser = context.currentUser
  const isAdmin = currentUser?.roles?.some(
    (role) => role.name === 'administrator' || role.name === 'admin'
  )

  // Build the base content structure
  const baseItems = [
    // Global Settings Section
    S.listItem()
      .title('Global Settings')
      .child(
        S.list()
          .title('Global Settings')
          .items([
            S.listItem()
              .title('Site Configuration')
              .id('siteConfig')
              .schemaType('siteConfig')
              .child(S.editor().id('siteConfig').schemaType('siteConfig').documentId('siteConfig')),
            S.listItem()
              .title('Site Settings (Legacy)')
              .id('siteSettings')
              .schemaType('siteSettings')
              .child(
                S.editor().id('siteSettings').schemaType('siteSettings').documentId('siteSettings')
              ),
            S.listItem()
              .title('Navigation')
              .schemaType('navigation')
              .child(S.document().schemaType('navigation').documentId('navigation')),
            S.listItem()
              .title('Brand Tokens')
              .schemaType('tokens')
              .child(S.document().schemaType('tokens').documentId('tokens')),
          ])
      ),
    S.divider(),

    // Lead Inbox - Accessible to all
    S.documentTypeListItem('lead').title('Lead Inbox'),
    S.divider(),

    // Page Templates - Accessible to all
    S.documentTypeListItem('pageTemplate').title('Page Templates'),
    S.divider(),

    // Main Content Types - Accessible to all
    S.documentTypeListItem('page').title('Pages'),
    S.documentTypeListItem('service').title('Services'),
    S.documentTypeListItem('location').title('Locations'),
    S.documentTypeListItem('offer'),
    S.documentTypeListItem('testimonial'),
    S.documentTypeListItem('faq'),
    S.documentTypeListItem('caseStudy'),
    S.documentTypeListItem('post'),
    S.divider(),

    // Categories - Accessible to all
    S.documentTypeListItem('serviceCategory'),
    S.documentTypeListItem('category'),
  ]

  // Admin-only section (conditionally added)
  const adminItems = isAdmin
    ? [
        S.divider(),
        S.listItem()
          .title('🔐 Admin Only')
          .child(
            S.list()
              .title('Administrator Tools')
              .items([
                S.documentTypeListItem('redirects').title('URL Redirects'),
                S.documentTypeListItem('webhook').title('Webhooks'),
                S.documentTypeListItem('auditLog').title('Audit Logs'),
                S.documentTypeListItem('role').title('Roles & Permissions'),
              ])
          ),
      ]
    : []

  return S.list()
    .title('Content')
    .items([...baseItems, ...adminItems])
}

export default deskStructure
