import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-10-16'
const token = process.env.SANITY_API_WRITE_TOKEN

export const writeClient = projectId && dataset && token
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      token,
      useCdn: false,
    })
  : null
