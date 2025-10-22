import { createClient } from 'next-sanity'
import { env } from '@/lib/env'

export const sanity = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2025-10-16',
  useCdn: true,
})

// Export as 'client' for backwards compatibility
export const client = sanity
