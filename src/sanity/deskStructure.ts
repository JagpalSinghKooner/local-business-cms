import { StructureBuilder } from 'sanity/structure'
import { ConfigContext } from 'sanity'

/**
 * Hierarchical desk structure for Sanity Studio
 * Organized by business domain with clear grouping and role-based access
 */
const deskStructure = (S: StructureBuilder, context: ConfigContext) => {
  // Check if the current user has administrator role
  const currentUser = context.currentUser
  const isAdmin = currentUser?.roles?.some(
    (role) => role.name === 'administrator' || role.name === 'admin'
  )

  // Build the hierarchical structure
  const baseItems = [
    // 🏠 SITE MANAGEMENT
    S.listItem()
      .title('🏠 SITE MANAGEMENT')
      .child(
        S.list()
          .title('Site Management')
          .items([
            S.listItem()
              .title('Site Settings')
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

    // 📄 PAGES
    S.listItem()
      .title('📄 PAGES')
      .child(
        S.list()
          .title('Pages')
          .items([
            S.documentTypeListItem('page').title('All Pages'),
            S.documentTypeListItem('pageTemplate').title('Page Templates'),
          ])
      ),
    S.divider(),

    // 🔧 SERVICES
    S.listItem()
      .title('🔧 SERVICES')
      .child(
        S.list()
          .title('Services')
          .items([
            S.documentTypeListItem('service').title('All Services'),
            S.documentTypeListItem('serviceCategory').title('Service Categories'),
            S.documentTypeListItem('serviceLocation').title('Service + Location Pages'),
          ])
      ),
    S.divider(),

    // 📍 LOCATIONS
    S.listItem()
      .title('📍 LOCATIONS')
      .child(
        S.list()
          .title('Locations')
          .items([S.documentTypeListItem('location').title('All Locations')])
      ),
    S.divider(),

    // 💼 OFFERS & CONTENT
    S.listItem()
      .title('💼 OFFERS & CONTENT')
      .child(
        S.list()
          .title('Offers & Content')
          .items([
            S.documentTypeListItem('offer').title('Special Offers'),
            S.documentTypeListItem('testimonial').title('Testimonials'),
            S.documentTypeListItem('faq').title('FAQs'),
            S.documentTypeListItem('caseStudy').title('Case Studies'),
            S.documentTypeListItem('post').title('Blog Posts'),
            S.documentTypeListItem('category').title('Post Categories'),
          ])
      ),
    S.divider(),

    // 📥 LEADS & DATA
    S.listItem()
      .title('📥 LEADS & DATA')
      .child(
        S.list()
          .title('Leads & Data')
          .items([S.documentTypeListItem('lead').title('Lead Inbox')])
      ),
  ]

  // 🔐 ADMIN (visible only to admins)
  const adminItems = isAdmin
    ? [
        S.divider(),
        S.listItem()
          .title('🔐 ADMIN')
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
