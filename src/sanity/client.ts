import { createClient } from 'next-sanity'
import { env } from '@/lib/env'

/**
 * Sanity Client Configuration
 * 
 * Stega encoding is disabled to prevent webpack bundling issues with Sanity Studio.
 * Visual editing will be handled separately via the Presentation Tool.
 */
export const sanity = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2025-10-16',
  useCdn: true,
  perspective: 'published',
})

/**
 * Export as 'client' for backwards compatibility
 */
export const client = sanity
