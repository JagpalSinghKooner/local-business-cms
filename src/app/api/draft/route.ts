import { defineEnableDraftMode } from 'next-sanity/draft-mode'
import { client } from '@/sanity/client'

/**
 * Draft Mode API Route for Sanity Presentation Tool
 * Enables visual editing with real-time updates
 * Uses next-sanity's defineEnableDraftMode for proper setup
 */

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({
    token: process.env.SANITY_API_READ_TOKEN,
  }),
})
