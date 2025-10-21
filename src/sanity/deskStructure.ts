import { StructureBuilder } from 'sanity/desk'
import IframePreview from './components/IframePreview'
import VisualDiffPane from './components/VisualDiffPane'

const documentWithPreview = (S: StructureBuilder, schemaType: string) =>
  S.document()
    .schemaType(schemaType)
    .views([
      S.view.form(),
      S.view.component(IframePreview).title('Preview'),
      S.view.component(VisualDiffPane).title('Visual diff'),
    ])

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
      S.documentTypeListItem('page').child(documentWithPreview(S, 'page')),
      S.documentTypeListItem('service').child(documentWithPreview(S, 'service')),
      S.documentTypeListItem('location').child(documentWithPreview(S, 'location')),
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
