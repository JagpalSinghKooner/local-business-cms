// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
import { defineLive } from "next-sanity/live";
import { client } from './client'

export const { sanityFetch, SanityLive } = defineLive({
  client,
});
