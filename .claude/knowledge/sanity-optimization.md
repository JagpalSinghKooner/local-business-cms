# Sanity CMS Optimization Knowledge

## GROQ Query Optimization

### ❌ SLOW - Fetches Everything:
\`\`\`groq
*[_type == "location"] {
  ...  // Fetches ALL fields including large content
}
\`\`\`

**Problem**: Fetches descriptions, content blocks, images metadata for every location

### ✅ FAST - Minimal Projection:
\`\`\`groq
*[_type == "location"] {
  _id,
  slug,
  city,
  state,
  intro[0..1]  // Only first 2 paragraphs
} | order(city asc)
\`\`\`

**Impact**: 70-90% reduction in query time and data transfer

## Pagination for Large Datasets

\`\`\`groq
// Don't fetch 100+ locations at once
*[_type == "location"][0...50] {
  _id,
  slug,
  city
}
\`\`\`

## Caching Strategy

\`\`\`typescript
// src/sanity/loaders.ts
export const listLocations = defineLive({
  fetch: async (client) => {
    return client.fetch(locationsListQ)
  },
  revalidate: 3600,  // 1 hour (locations change rarely)
})

export const getPage = defineLive({
  fetch: async (client, slug: string) => {
    return client.fetch(pageQ, { slug })
  },
  revalidate: 120,  // 2 minutes (pages change more often)
})
\`\`\`

## Multi-Tenant Query Patterns

### Cross-Dataset Queries (Site Switching):
\`\`\`typescript
// Get sites from shared config dataset
const sites = await configClient
  .withConfig({ dataset: 'shared-config' })
  .fetch(allSitesQ)

// Get content from specific dataset
const content = await client
  .withConfig({ dataset: siteDataset })
  .fetch(pageQ, { slug })
\`\`\`

### Dataset Isolation (Security):
\`\`\`groq
// ALWAYS filter by current dataset
*[_type == "lead" && !(_id in path("drafts.**"))] {
  _id,
  email,
  message
}
\`\`\`

**⚠️ Never fetch from wrong dataset - zero data leaks**

## Performance Verification

\`\`\`bash
# 1. Test query in Sanity Vision (measure time)
# Navigate to: https://www.sanity.io/manage
# Use Vision tool

# 2. Measure TTFB in production
curl -w "TTFB: %{time_starttransfer}s\n" -o /dev/null -s http://localhost:3001/locations

# Target: <200ms TTFB
# Before optimization: 1,735ms
# After optimization: 22ms (98.7% improvement)
\`\`\`

## Common Performance Issues

1. **Fetching Too Many Fields**
   - Symptom: Slow page loads, high TTFB
   - Fix: Use projection `{ _id, title, slug }` instead of `{ ... }`

2. **No Pagination**
   - Symptom: 500ms+ query time
   - Fix: Add `[0...50]` slice operator

3. **Nested References Not Optimized**
   - Symptom: N+1 query problem
   - Fix: Use `->` operator with projection

4. **Cache Duration Too Short**
   - Symptom: Repeated slow queries
   - Fix: Increase revalidate time for static content

## Verification Checklist

- [ ] GROQ query uses field projection (not `...`)
- [ ] Large datasets paginated with slice operator
- [ ] Cache duration appropriate for content type
- [ ] TTFB measured before/after optimization
- [ ] Query tested in Sanity Vision
- [ ] Multi-tenant filters applied correctly
