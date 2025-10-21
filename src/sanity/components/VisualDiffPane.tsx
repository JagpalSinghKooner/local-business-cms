import { useClient } from 'sanity'
import { useEffect, useMemo, useState } from 'react'

type DiffEntry = {
  path: string
  draftValue: unknown
  publishedValue: unknown
}

const collectDiffs = (published: unknown, draft: unknown, path = ''): DiffEntry[] => {
  if (published === draft) return []

  if (typeof published !== typeof draft) {
    return [{ path, draftValue: draft, publishedValue: published }]
  }

  if (published && typeof published === 'object' && draft && typeof draft === 'object') {
    if (Array.isArray(published) && Array.isArray(draft)) {
      const maxLength = Math.max(published.length, draft.length)
      const changes: DiffEntry[] = []
      for (let index = 0; index < maxLength; index += 1) {
        const nextPath = `${path}[${index}]`
        changes.push(...collectDiffs(published[index], draft[index], nextPath))
      }
      return changes
    }

    const keys = new Set([...Object.keys(published as Record<string, unknown>), ...Object.keys(draft as Record<string, unknown>)])
    const changes: DiffEntry[] = []
    keys.forEach((key) => {
      const nextPath = path ? `${path}.${key}` : key
      changes.push(...collectDiffs(
        (published as Record<string, unknown>)[key],
        (draft as Record<string, unknown>)[key],
        nextPath,
      ))
    })
    return changes
  }

  return [{ path, draftValue: draft, publishedValue: published }]
}

const formatValue = (value: unknown) =>
  typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
    ? value
    : JSON.stringify(value, null, 2)

export default function VisualDiffPane(props: any) {
  const documentId: string | undefined = props?.documentId
  const client = useClient({ apiVersion: '2024-05-01' })
  const [state, setState] = useState<{ published: unknown; draft: unknown; loading: boolean }>({
    published: null,
    draft: null,
    loading: true,
  })

  useEffect(() => {
    if (!documentId) return
    const draftId = `drafts.${documentId}`
    let cancelled = false

    async function fetchDiff() {
      setState((current) => ({ ...current, loading: true }))
      const result = await client.fetch<Array<Record<string, unknown>>>(
        '*[_id in [$draftId, $publishedId]]',
        { draftId, publishedId: documentId },
        { cache: 'no-store' },
      )
      if (cancelled) return
      const draft = result.find((doc) => doc._id === draftId) || null
      const published = result.find((doc) => doc._id === documentId) || null
      setState({ draft, published, loading: false })
    }

    fetchDiff().catch((error) => {
      console.error('Failed to load diff', error)
      setState({ published: null, draft: null, loading: false })
    })

    return () => {
      cancelled = true
    }
  }, [client, documentId])

  if (!documentId) {
    return <div className="p-4 text-sm">Save the document to view differences.</div>
  }
  const diffs = useMemo(() => {
    if (!state.draft && !state.published) return []
    return collectDiffs(state.published, state.draft).filter((entry) => entry.path)
  }, [state.draft, state.published])

  if (state.loading) {
    return <div className="flex h-full items-center justify-center text-sm text-muted">Loading diff…</div>
  }

  if (!state.draft && !state.published) {
    return <div className="p-4 text-sm">Publish this document or create a draft to compare changes.</div>
  }

  if (diffs.length === 0) {
    return <div className="p-4 text-sm">Draft matches the published document.</div>
  }

  return (
    <div className="h-full overflow-auto">
      <div className="grid gap-4 p-4">
        {diffs.map((diff) => (
          <div key={diff.path} className="rounded-lg border border-divider bg-surface p-4 shadow-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{diff.path}</p>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="mb-1 text-xs font-medium text-muted">Published</p>
                <pre className="overflow-auto rounded-md bg-surface-muted p-3 text-xs">{String(formatValue(diff.publishedValue))}</pre>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-muted">Draft</p>
                <pre className="overflow-auto rounded-md bg-surface-muted p-3 text-xs">{String(formatValue(diff.draftValue))}</pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
