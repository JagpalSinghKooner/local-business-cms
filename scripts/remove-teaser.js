#!/usr/bin/env node
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

async function removeTeaser() {
  const docs = await client.fetch('*[_type == "service" && defined(teaser)][]._id')
  if (!docs.length) {
    console.log('No teaser fields to remove')
    return
  }

  const patches = docs.map((id) => ({ patch: { id, unset: ['teaser'] } }))
  await client.transaction(patches).commit()
  console.log(`Removed teaser from ${docs.length} service documents`)
}

removeTeaser().catch((err) => {
  console.error(err)
  process.exit(1)
})
