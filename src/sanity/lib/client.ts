import 'server-only'
import { createClient, type QueryParams } from 'next-sanity'
import { draftMode } from 'next/headers'
import { env } from '@/lib/env'

/**
 * Server-side Sanity client with automatic draft mode detection
 * Enterprise-level solution for visual editing integration
 */

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = '2025-10-16'

// Client for published content (no stega)
const publishedClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
})

// Client for draft content with stega encoding (visual editing)
const draftClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'previewDrafts',
  token: process.env.SANITY_API_TOKEN,
  stega: {
    enabled: true,
    studioUrl: '/studio',
  },
})

/**
 * Get the appropriate client based on draft mode
 */
export async function getClient() {
  const draft = await draftMode()
  return draft.isEnabled ? draftClient : publishedClient
}

/**
 * Fetch data with automatic draft mode detection
 */
export async function sanityFetch<T = any>({
  query,
  params = {},
  tags = [],
}: {
  query: string
  params?: QueryParams
  tags?: string[]
}): Promise<T> {
  const draft = await draftMode()
  const client = draft.isEnabled ? draftClient : publishedClient

  return client.fetch<T>(query, params, {
    next: {
      revalidate: draft.isEnabled ? 0 : 120,
      tags,
    },
  })
}
