import { DefaultDocumentNodeResolver } from 'sanity/structure'
import { Iframe } from 'sanity-plugin-iframe-pane'

/**
 * Configure default document node with live preview iframe
 * Enables Framer-like visual editing experience for pages
 */
export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, { schemaType }) => {
  // Document types that support visual preview
  const previewableTypes = [
    'page',
    'service',
    'location',
    'serviceLocation',
    'post',
    'offer',
  ]

  if (previewableTypes.includes(schemaType)) {
    return S.document().views([
      // Standard form editor
      S.view.form().title('Editor'),

      // Live preview iframe
      S.view
        .component(Iframe)
        .options({
          url: (doc: any) => {
            // Get base URL from environment or use localhost for development
            const baseUrl =
              process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'

            // Construct preview URL based on document type
            let previewPath = ''

            switch (schemaType) {
              case 'page':
                previewPath = doc.slug?.current || ''
                break
              case 'service':
                previewPath = `services/${doc.slug?.current || ''}`
                break
              case 'location':
                previewPath = `locations/${doc.slug?.current || ''}`
                break
              case 'serviceLocation':
                previewPath = `services/${doc.slug?.current || ''}`
                break
              case 'post':
                previewPath = `blog/${doc.slug?.current || ''}`
                break
              case 'offer':
                previewPath = `offers/${doc.slug?.current || ''}`
                break
              default:
                previewPath = doc.slug?.current || ''
            }

            // Add draft mode and document ID query params
            const url = new URL(`${baseUrl}/api/preview`)
            url.searchParams.set('slug', previewPath)
            url.searchParams.set('documentId', doc._id)
            url.searchParams.set('type', schemaType)

            return url.toString()
          },
          // Reload iframe when document changes (debounced)
          reload: {
            button: true, // Show manual reload button
          },
          // Responsive viewport toggles
          defaultSize: 'desktop',
        })
        .title('Live Preview'),
    ])
  }

  // Default to form view only
  return S.document().views([S.view.form()])
}
