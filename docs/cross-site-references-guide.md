# Cross-Site Content References Guide

**Last Updated:** October 23, 2025

## Overview

The Cross-Site Reference system allows you to reference content from other datasets. This is useful for:
- **Shared FAQ libraries** across multiple business sites
- **Industry articles** that apply to multiple businesses
- **Template content** that can be reused
- **Common testimonials** or case studies

**IMPORTANT:** Use sparingly. The multi-tenant architecture is designed for dataset isolation. Only use cross-site references when you have a genuine need for shared content.

---

## Architecture

### How It Works

1. **Content stored in source dataset** (e.g., `site-shared`)
2. **Reference created in target dataset** (e.g., `site-budds`)
3. **Runtime resolution** fetches content from source dataset
4. **5-minute cache** reduces API calls
5. **Automatic preview** in Sanity Studio

---

## Use Cases

### ✅ Good Use Cases

1. **Shared FAQ Library**
   ```
   Dataset: site-shared
   Content: Industry FAQs about plumbing
   Referenced by: site-budds, site-hvac, site-plumber123
   ```

2. **Industry Articles**
   ```
   Dataset: site-content-library
   Content: Educational blog posts
   Referenced by: Multiple business sites
   ```

3. **Template Services**
   ```
   Dataset: site-templates
   Content: Common service descriptions
   Referenced by: New business sites during setup
   ```

### ❌ Bad Use Cases

1. **Site-specific content** (services, locations, business info)
   - Use regular documents instead
2. **Frequently changing content** (offers, promotions)
   - Cross-site cache may cause stale data
3. **User-generated content** (leads, reviews)
   - Must remain isolated per site

---

## Implementation Guide

### 1. Create Source Content

First, create the content you want to share in a source dataset (e.g., `site-shared`):

```typescript
// In site-shared dataset
{
  _type: 'faq',
  _id: 'faq-what-is-hvac',
  question: 'What is HVAC?',
  answer: 'HVAC stands for Heating, Ventilation, and Air Conditioning...'
}
```

### 2. Add Cross-Site Reference in Sanity Schema

Add the `crossSiteReference` type to any schema where you want to allow cross-site references:

```typescript
// Example: FAQ schema with optional cross-site reference
defineField({
  name: 'sharedFaqs',
  title: 'Shared FAQs from Library',
  type: 'array',
  of: [{ type: 'crossSiteReference' }],
  description: 'Reference FAQs from the shared content library'
})
```

### 3. Use in Sanity Studio

1. Open document in Studio
2. Add cross-site reference field
3. Select source dataset (e.g., `site-shared`)
4. Enter document ID (e.g., `faq-what-is-hvac`)
5. Optionally select document type for validation
6. Save

### 4. Resolve References in Code

Use the resolution utilities in your loaders:

```typescript
import { resolveCrossSiteReferences } from '@/lib/cross-site-reference'

// Example: Load page with cross-site references
export async function loadPageWithReferences(slug: string) {
  const page = await sanityFetch({
    query: `*[_type == "page" && slug.current == $slug][0]{
      ...,
      sharedFaqs[]
    }`,
    params: { slug }
  })

  // Resolve all cross-site references
  const resolvedPage = await resolveCrossSiteReferences(page)

  return resolvedPage
}
```

### 5. Fetch Specific Cross-Site Document

```typescript
import { fetchCrossSiteDocument } from '@/lib/cross-site-reference'

const faq = await fetchCrossSiteDocument({
  sourceDataset: 'site-shared',
  documentId: 'faq-what-is-hvac',
  documentType: 'faq' // Optional type validation
})
```

### 6. Query Multiple Documents

```typescript
import { queryCrossSiteContent } from '@/lib/cross-site-reference'

const allFaqs = await queryCrossSiteContent(
  'site-shared',
  `*[_type == "faq"]{ question, answer }`
)
```

---

## API Reference

### `fetchCrossSiteDocument<T>(config)`

Fetch a single document from another dataset.

**Parameters:**
```typescript
{
  sourceDataset: string    // Source dataset name
  documentId: string       // Document _id
  documentType?: string    // Optional type validation
}
```

**Returns:** `Promise<T | null>`

**Example:**
```typescript
const service = await fetchCrossSiteDocument<Service>({
  sourceDataset: 'site-templates',
  documentId: 'service-plumbing-repair',
  documentType: 'service'
})
```

---

### `fetchCrossSiteDocuments<T>(dataset, ids, type?)`

Fetch multiple documents by IDs.

**Parameters:**
- `dataset: string` - Source dataset
- `documentIds: string[]` - Array of document IDs
- `documentType?: string` - Optional type filter

**Returns:** `Promise<T[]>`

**Example:**
```typescript
const faqs = await fetchCrossSiteDocuments<FAQ>(
  'site-shared',
  ['faq-1', 'faq-2', 'faq-3'],
  'faq'
)
```

---

### `queryCrossSiteContent<T>(dataset, query, params?)`

Query content using GROQ.

**Parameters:**
- `dataset: string` - Source dataset
- `query: string` - GROQ query
- `params?: Record<string, any>` - Query parameters

**Returns:** `Promise<T[]>`

**Example:**
```typescript
const featuredPosts = await queryCrossSiteContent<Post>(
  'site-content-library',
  `*[_type == "post" && featured == true][0...5]{ title, slug, excerpt }`,
)
```

---

### `resolveCrossSiteReferences<T>(content, options?)`

Recursively resolve all cross-site references in content.

**Parameters:**
```typescript
{
  content: any
  options?: {
    depth?: number        // Max recursion depth (default: 2)
    currentDepth?: number // Internal use only
  }
}
```

**Returns:** `Promise<T>`

**Example:**
```typescript
const page = await sanityFetch({ query: pageQuery })
const resolvedPage = await resolveCrossSiteReferences(page, { depth: 3 })
```

---

### `clearCrossSiteCache(dataset?, documentId?)`

Clear the cross-site reference cache.

**Parameters:**
- `dataset?: string` - Clear specific dataset (optional)
- `documentId?: string` - Clear specific document (optional)

**Example:**
```typescript
// Clear entire cache
clearCrossSiteCache()

// Clear cache for specific dataset
clearCrossSiteCache('site-shared')

// Clear cache for specific document
clearCrossSiteCache('site-shared', 'faq-what-is-hvac')
```

---

### `validateCrossSiteReference(ref)`

Validate that a cross-site reference points to an existing document.

**Returns:**
```typescript
{
  valid: boolean
  error?: string
}
```

**Example:**
```typescript
const validation = await validateCrossSiteReference({
  _type: 'crossSiteReference',
  dataset: 'site-shared',
  documentId: 'faq-123',
  documentType: 'faq'
})

if (!validation.valid) {
  console.error(validation.error)
}
```

---

## Caching Strategy

Cross-site references use a **5-minute in-memory cache** to reduce API calls:

- **Cache Key:** `{dataset}:{documentId}`
- **TTL:** 5 minutes (300,000ms)
- **Invalidation:** Automatic after TTL, or manual via `clearCrossSiteCache()`

**Best Practices:**
1. Use longer cache for stable content (industry FAQs)
2. Clear cache after content updates
3. Consider using webhook to auto-clear cache on publish

---

## Performance Considerations

### Cache Strategy

Cross-site references add network latency. Mitigate with:
1. **5-minute cache** reduces repeated fetches
2. **Batch fetching** when loading multiple references
3. **Static generation** at build time when possible
4. **ISR revalidation** for dynamic pages

### Example: Optimized Page Loader

```typescript
export async function loadPageWithOptimizedReferences(slug: string) {
  // Fetch page data
  const page = await sanityFetch({ query: pageQuery, params: { slug } })

  // Resolve references with caching
  const resolved = await resolveCrossSiteReferences(page)

  return {
    ...resolved,
    // Next.js ISR
    revalidate: 3600 // 1 hour
  }
}
```

---

## Security Considerations

1. **API Token Required:** Cross-site fetching requires `SANITY_API_TOKEN`
2. **Dataset Access:** Ensure token has read access to source datasets
3. **No CDN:** Cross-site fetches bypass CDN for freshness
4. **Cache Control:** Clear cache when updating sensitive data

---

## Troubleshooting

### Reference Not Resolving

**Problem:** Cross-site reference returns `null`

**Solutions:**
1. Check document exists in source dataset
2. Verify `SANITY_API_TOKEN` is set
3. Ensure token has read access to source dataset
4. Check document ID is correct
5. Clear cache: `clearCrossSiteCache()`

### Stale Data

**Problem:** Changes in source dataset not appearing

**Solutions:**
1. Wait for cache to expire (5 minutes)
2. Manually clear cache: `clearCrossSiteCache(dataset, documentId)`
3. Implement webhook to auto-clear on publish

### Performance Issues

**Problem:** Slow page loads with many references

**Solutions:**
1. Use `fetchCrossSiteDocuments()` for batch fetching
2. Implement static generation at build time
3. Increase ISR revalidation time
4. Consider duplicating frequently-accessed content instead

---

## Migration Guide

### Moving from Regular References to Cross-Site

If you have existing content that needs to be shared:

1. **Create shared dataset** (e.g., `site-shared`)
2. **Export content** from source site:
   ```bash
   pnpm sanity:export --dataset site-budds
   ```
3. **Import to shared dataset**:
   ```bash
   pnpm sanity:import --dataset site-shared
   ```
4. **Update schema** to use `crossSiteReference`
5. **Update documents** to reference shared content
6. **Test thoroughly** before removing duplicates

---

## Best Practices

### ✅ DO

1. Use for truly shared, stable content
2. Document all cross-site dependencies
3. Clear cache after content updates
4. Validate references before deployment
5. Monitor cache hit rates

### ❌ DON'T

1. Use for site-specific content
2. Create circular references
3. Reference frequently-changing content
4. Exceed depth limit (default: 2 levels)
5. Skip validation in production

---

## Examples

### Example 1: Shared FAQ Section

```typescript
// Schema: page.ts
defineField({
  name: 'industryFaqs',
  title: 'Industry FAQs',
  type: 'array',
  of: [{ type: 'crossSiteReference' }]
})

// Loader: load-page.ts
const page = await sanityFetch({ query: pageQuery })
const resolved = await resolveCrossSiteReferences(page)

// Component: FaqSection.tsx
export function FaqSection({ faqs }: { faqs: FAQ[] }) {
  return (
    <div>
      {faqs.map((faq) => (
        <div key={faq._id}>
          <h3>{faq.question}</h3>
          <p>{faq.answer}</p>
        </div>
      ))}
    </div>
  )
}
```

### Example 2: Template Content Library

```typescript
// Fetch template services during new site setup
const templates = await queryCrossSiteContent<Service>(
  'site-templates',
  `*[_type == "service" && isTemplate == true]{
    title,
    description,
    pricing,
    features
  }`
)

// Clone templates to new site
for (const template of templates) {
  await writeClient.create({
    ...template,
    _id: undefined, // Generate new ID
    isTemplate: false
  })
}
```

---

## Monitoring

Track cross-site reference usage:

```typescript
import { getCrossSiteCacheStats } from '@/lib/cross-site-reference'

// In API route or monitoring
export async function GET() {
  const stats = getCrossSiteCacheStats()

  return Response.json({
    cacheSize: stats.size,
    cachedKeys: stats.keys,
    ttl: stats.ttl
  })
}
```

---

## Future Enhancements

Potential improvements:

1. **Redis cache** for multi-instance deployments
2. **GraphQL federation** for advanced cross-dataset queries
3. **Real-time sync** via webhooks
4. **Visual dependency graph** in Studio
5. **Bulk reference validator** CLI tool

---

## Support

For issues or questions:
1. Check troubleshooting section
2. Review API reference
3. Test with `validateCrossSiteReference()`
4. Check cache stats with `getCrossSiteCacheStats()`

---

**Remember:** Cross-site references are powerful but should be used sparingly. When in doubt, prefer dataset isolation for better performance and simpler debugging.
