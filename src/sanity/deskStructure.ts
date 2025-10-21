import { StructureBuilder } from 'sanity/structure'

const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Global Settings')
        .child(
          S.list()
            .title('Global Settings')
            .items([
              S.listItem()
                .title('Site Settings')
                .id('siteSettings')
                .schemaType('siteSettings')
                .child(
                  S.editor()
                    .id('siteSettings')
                    .schemaType('siteSettings')
                    .documentId('siteSettings')
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
      S.documentTypeListItem('lead').title('Lead Inbox'),
      S.divider(),
      S.documentTypeListItem('pageTemplate').title('Page Templates'),
      S.divider(),
      S.documentTypeListItem('page').title('Pages'),
      S.documentTypeListItem('service').title('Services'),
      S.documentTypeListItem('location').title('Locations'),
      S.documentTypeListItem('offer'),
      S.documentTypeListItem('testimonial'),
      S.documentTypeListItem('faq'),
      S.documentTypeListItem('caseStudy'),
      S.documentTypeListItem('post'),
      S.divider(),
      S.documentTypeListItem('serviceCategory'),
      S.documentTypeListItem('category'),
      S.documentTypeListItem('redirects'),
    ])

export default deskStructure
