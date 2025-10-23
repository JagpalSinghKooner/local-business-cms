/**
 * Reference Resolution Utilities
 *
 * Handles updating document references during content migration
 * Ensures references point to correct documents in target dataset
 */

import type { SanityDocument } from '@sanity/client'

export type ReferenceMapping = Map<string, string> // oldId -> newId

/**
 * Find all references in a document
 */
export function findReferences(doc: any, path: string = ''): string[] {
  const refs: string[] = []

  if (!doc || typeof doc !== 'object') {
    return refs
  }

  // Check if this is a reference object
  if (doc._ref && typeof doc._ref === 'string') {
    refs.push(doc._ref)
  }

  // Recursively check nested objects and arrays
  for (const [key, value] of Object.entries(doc)) {
    if (key.startsWith('_') && key !== '_ref') {
      continue // Skip Sanity system fields except _ref
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        refs.push(...findReferences(item, `${path}${key}[${index}]`))
      })
    } else if (value && typeof value === 'object') {
      refs.push(...findReferences(value, `${path}${key}.`))
    }
  }

  return refs
}

/**
 * Update all references in a document using a reference mapping
 */
export function updateReferences(doc: any, mapping: ReferenceMapping): any {
  if (!doc || typeof doc !== 'object') {
    return doc
  }

  // Handle reference object
  if (doc._ref && typeof doc._ref === 'string') {
    const newRef = mapping.get(doc._ref)
    if (newRef) {
      return { ...doc, _ref: newRef }
    }
    return doc
  }

  // Handle arrays
  if (Array.isArray(doc)) {
    return doc.map((item) => updateReferences(item, mapping))
  }

  // Handle objects
  const updated: any = {}
  for (const [key, value] of Object.entries(doc)) {
    updated[key] = updateReferences(value, mapping)
  }

  return updated
}

/**
 * Build reference mapping from old IDs to new IDs
 */
export function buildReferenceMapping(
  oldDocs: SanityDocument[],
  newDocs: SanityDocument[]
): ReferenceMapping {
  const mapping = new Map<string, string>()

  if (oldDocs.length !== newDocs.length) {
    console.warn('Document count mismatch: oldDocs and newDocs should have same length')
  }

  for (let i = 0; i < Math.min(oldDocs.length, newDocs.length); i++) {
    mapping.set(oldDocs[i]._id, newDocs[i]._id)
  }

  return mapping
}

/**
 * Check if a reference exists in target dataset
 */
export async function validateReference(
  refId: string,
  client: any,
  dataset: string
): Promise<boolean> {
  try {
    const doc = await client.withConfig({ dataset }).fetch(`*[_id == $refId][0]._id`, { refId })
    return !!doc
  } catch (error) {
    return false
  }
}

/**
 * Find broken references in a document
 */
export async function findBrokenReferences(
  doc: SanityDocument,
  client: any,
  dataset: string
): Promise<string[]> {
  const refs = findReferences(doc)
  const brokenRefs: string[] = []

  for (const ref of refs) {
    const exists = await validateReference(ref, client, dataset)
    if (!exists) {
      brokenRefs.push(ref)
    }
  }

  return brokenRefs
}

/**
 * Generate reference mapping report
 */
export function generateReferenceReport(doc: SanityDocument, mapping: ReferenceMapping): {
  totalRefs: number
  mappedRefs: number
  unmappedRefs: string[]
} {
  const allRefs = findReferences(doc)
  const uniqueRefs = [...new Set(allRefs)]
  const unmappedRefs = uniqueRefs.filter((ref) => !mapping.has(ref))

  return {
    totalRefs: allRefs.length,
    mappedRefs: allRefs.length - unmappedRefs.length,
    unmappedRefs,
  }
}

/**
 * Replace reference with new ID if it exists in mapping
 */
export function replaceReference(ref: string, mapping: ReferenceMapping): string {
  return mapping.get(ref) || ref
}

/**
 * Get all document types that are referenced
 */
export function getReferencedTypes(docs: SanityDocument[]): Set<string> {
  const types = new Set<string>()

  for (const doc of docs) {
    const refs = findReferences(doc)
    // Extract type from draft IDs (drafts.xxx)
    refs.forEach((ref) => {
      const parts = ref.split('.')
      if (parts.length > 1) {
        types.add(parts[1])
      }
    })
  }

  return types
}

/**
 * Create a dependency graph of documents based on references
 */
export function buildDependencyGraph(docs: SanityDocument[]): Map<string, Set<string>> {
  const graph = new Map<string, Set<string>>()

  for (const doc of docs) {
    const refs = findReferences(doc)
    graph.set(doc._id, new Set(refs))
  }

  return graph
}

/**
 * Topologically sort documents based on dependencies
 * Documents with no dependencies come first
 */
export function sortByDependencies(docs: SanityDocument[]): SanityDocument[] {
  const graph = buildDependencyGraph(docs)
  const sorted: SanityDocument[] = []
  const visited = new Set<string>()
  const visiting = new Set<string>()

  function visit(docId: string) {
    if (visited.has(docId)) return
    if (visiting.has(docId)) {
      // Circular dependency detected, continue anyway
      return
    }

    visiting.add(docId)

    const deps = graph.get(docId) || new Set()
    for (const depId of deps) {
      visit(depId)
    }

    visiting.delete(docId)
    visited.add(docId)

    const doc = docs.find((d) => d._id === docId)
    if (doc) {
      sorted.unshift(doc) // Add to beginning (reverse topological order)
    }
  }

  // Visit all documents
  for (const doc of docs) {
    visit(doc._id)
  }

  return sorted
}
