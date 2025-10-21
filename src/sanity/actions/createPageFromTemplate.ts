import type { DocumentActionComponent } from 'sanity'

const key = () => Math.random().toString(36).slice(2, 10)

const slugifySegment = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const slugifyPath = (input: string) =>
  input
    .split('/')
    .map((segment) => slugifySegment(segment.trim()))
    .filter(Boolean)
    .join('/')

const regenerateKeys = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => regenerateKeys(item))
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).map(([prop, nestedValue]) => {
      if (prop === '_key') {
        return [prop, key()]
      }
      return [prop, regenerateKeys(nestedValue)]
    })
    return Object.fromEntries(entries)
  }

  return value
}

const createPageFromTemplateAction: DocumentActionComponent = (props) => {
  if (props.type !== 'pageTemplate') {
    return null
  }

  return {
    label: 'Create page from template',
    tone: 'positive',
    onHandle: async () => {
      try {
        const template = (props.draft || props.published) as Record<string, any> | null
        if (!template) {
          props.onComplete()
          return
        }

        const defaultTitle: string = template.pageTitle || template.title || 'New page'
        const title = window.prompt('Page title', defaultTitle)
        if (!title) {
          props.onComplete()
          return
        }

        const defaultSlug = template.slugSuggestion || slugifyPath(defaultTitle)
        const slugInput = window.prompt('Slug (no leading /)', defaultSlug)
        if (!slugInput) {
          props.onComplete()
          return
        }

        const normalizedSlug = slugifyPath(slugInput)
        if (!normalizedSlug) {
          window.alert('Please provide a valid slug')
          props.onComplete()
          return
        }

        const actionContext = props as any
        const client = actionContext.getClient({ apiVersion: '2024-05-01' })
        const baseId = crypto.randomUUID ? crypto.randomUUID() : key()
        const documentId = `drafts.${baseId}`

        const cloneSections = template.sections ? (regenerateKeys(template.sections) as unknown[]) : []
        const cloneBody = template.body ? (regenerateKeys(template.body) as unknown[]) : undefined
        const cloneBreadcrumbs = template.breadcrumbs ? regenerateKeys(template.breadcrumbs) : undefined

        const payload: Record<string, unknown> = {
          _id: documentId,
          _type: 'page',
          title,
          slug: { _type: 'slug', current: normalizedSlug },
          sections: cloneSections,
          body: cloneBody,
          breadcrumbs: cloneBreadcrumbs,
        }

        await client.create(payload)

        const baseDocumentId = documentId.replace(/^drafts\./, '')
        props.onComplete()
        actionContext.context?.navigateIntent?.('edit', { id: baseDocumentId, type: 'page' })
      } catch (error) {
        console.error('Failed to create page from template', error)
        window.alert('Something went wrong while creating the page. Check the console for details.')
        props.onComplete()
      }
    },
  }
}

export default createPageFromTemplateAction
