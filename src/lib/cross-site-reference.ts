/**
 * Cross-Site Content Reference System
 *
 * Allows referencing content from other datasets for shared content libraries
 * Use cases: Industry FAQs, template content, shared articles
 *
 * IMPORTANT: Use sparingly - multi-tenant isolation is preferred
 */

import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const token = process.env.SANITY_API_TOKEN

export interface CrossSiteReference {
  _type: 'crossSiteReference'
  dataset: string
  documentId: string
  documentType: string
  preview?: {
    title?: string
    description?: string
  }
}

export interface CrossSiteReferenceConfig {
  sourceDataset: string
  documentId: string
  documentType?: string
}

/**
 * In-memory cache for cross-site references
 * Cache for 5 minutes to reduce API calls
 */
const crossSiteCache = new Map<
  string,
  {
    data: any
    timestamp: number
  }
>()

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

/**
 * Generate cache key for cross-site reference
 */
function getCacheKey(dataset: string, documentId: string): string {
  return `${dataset}:${documentId}`
}

/**
 * Check if cached data is still valid
 */
function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_TTL
}

/**
 * Fetch document from another dataset
 */
export async function fetchCrossSiteDocument<T = any>(
  config: CrossSiteReferenceConfig
): Promise<T | null> {
  const { sourceDataset, documentId, documentType } = config

  // Check cache first
  const cacheKey = getCacheKey(sourceDataset, documentId)
  const cached = crossSiteCache.get(cacheKey)

  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data as T
  }

  // Create client for source dataset
  const client = createClient({
    projectId,
    dataset: sourceDataset,
    apiVersion: '2024-01-01',
    token,
    useCdn: false, // Don't use CDN for cross-site references
  })

  try {
    // Fetch document with optional type filter
    const query = documentType
      ? `*[_id == $id && _type == $type][0]`
      : `*[_id == $id][0]`

    const params = documentType ? { id: documentId, type: documentType } : { id: documentId }

    const document = await client.fetch<T>(query, params)

    // Cache the result
    if (document) {
      crossSiteCache.set(cacheKey, {
        data: document,
        timestamp: Date.now(),
      })
    }

    return document
  } catch (error) {
    console.error(`Failed to fetch cross-site document from ${sourceDataset}:`, error)
    return null
  }
}

/**
 * Fetch multiple documents from another dataset
 */
export async function fetchCrossSiteDocuments<T = any>(
  dataset: string,
  documentIds: string[],
  documentType?: string
): Promise<T[]> {
  const results = await Promise.all(
    documentIds.map((id) =>
      fetchCrossSiteDocument<T>({
        sourceDataset: dataset,
        documentId: id,
        documentType,
      })
    )
  )

  return results.filter((doc) => doc !== null) as T[]
}

/**
 * Query documents from another dataset using GROQ
 */
export async function queryCrossSiteContent<T = any>(
  dataset: string,
  query: string,
  params?: Record<string, any>
): Promise<T[]> {
  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  })

  try {
    const results = params
      ? await client.fetch<T[]>(query, params)
      : await client.fetch<T[]>(query)
    return results
  } catch (error) {
    console.error(`Failed to query cross-site content from ${dataset}:`, error)
    return []
  }
}

/**
 * Resolve cross-site reference in content
 * Replaces CrossSiteReference objects with actual content
 */
export async function resolveCrossSiteReferences<T = any>(
  content: any,
  options: {
    depth?: number
    currentDepth?: number
  } = {}
): Promise<T> {
  const { depth = 2, currentDepth = 0 } = options

  // Prevent infinite recursion
  if (currentDepth >= depth) {
    return content
  }

  // Handle null/undefined
  if (!content) {
    return content
  }

  // Handle arrays
  if (Array.isArray(content)) {
    return Promise.all(
      content.map((item) =>
        resolveCrossSiteReferences(item, { depth, currentDepth: currentDepth + 1 })
      )
    ) as Promise<T>
  }

  // Handle objects
  if (typeof content === 'object') {
    // Check if this is a cross-site reference
    if (content._type === 'crossSiteReference' && content.dataset && content.documentId) {
      const resolved = await fetchCrossSiteDocument({
        sourceDataset: content.dataset,
        documentId: content.documentId,
        documentType: content.documentType,
      })

      if (resolved) {
        // Recursively resolve references in the fetched document
        return resolveCrossSiteReferences(resolved, { depth, currentDepth: currentDepth + 1 })
      }

      // If fetch failed, return original reference
      return content
    }

    // Recursively resolve all object properties
    const resolved: any = {}
    for (const [key, value] of Object.entries(content)) {
      resolved[key] = await resolveCrossSiteReferences(value, {
        depth,
        currentDepth: currentDepth + 1,
      })
    }
    return resolved
  }

  // Return primitive values as-is
  return content
}

/**
 * Clear cross-site reference cache
 * Call this when you need fresh data or after content updates
 */
export function clearCrossSiteCache(dataset?: string, documentId?: string): void {
  if (dataset && documentId) {
    // Clear specific cache entry
    const cacheKey = getCacheKey(dataset, documentId)
    crossSiteCache.delete(cacheKey)
  } else if (dataset) {
    // Clear all entries for a dataset
    for (const key of crossSiteCache.keys()) {
      if (key.startsWith(`${dataset}:`)) {
        crossSiteCache.delete(key)
      }
    }
  } else {
    // Clear entire cache
    crossSiteCache.clear()
  }
}

/**
 * Get cache statistics (for debugging)
 */
export function getCrossSiteCacheStats() {
  return {
    size: crossSiteCache.size,
    keys: Array.from(crossSiteCache.keys()),
    ttl: CACHE_TTL,
  }
}

/**
 * Create a cross-site reference object
 * Use this in your content when you want to reference another dataset
 */
export function createCrossSiteReference(
  dataset: string,
  documentId: string,
  documentType?: string,
  preview?: {
    title?: string
    description?: string
  }
): CrossSiteReference {
  return {
    _type: 'crossSiteReference',
    dataset,
    documentId,
    documentType: documentType || 'unknown',
    preview,
  }
}

/**
 * Validate cross-site reference
 */
export async function validateCrossSiteReference(
  ref: CrossSiteReference
): Promise<{ valid: boolean; error?: string }> {
  if (!ref.dataset) {
    return { valid: false, error: 'Dataset is required' }
  }

  if (!ref.documentId) {
    return { valid: false, error: 'Document ID is required' }
  }

  try {
    const document = await fetchCrossSiteDocument({
      sourceDataset: ref.dataset,
      documentId: ref.documentId,
      documentType: ref.documentType,
    })

    if (!document) {
      return {
        valid: false,
        error: `Document ${ref.documentId} not found in dataset ${ref.dataset}`,
      }
    }

    return { valid: true }
  } catch (error: any) {
    return { valid: false, error: error.message }
  }
}
