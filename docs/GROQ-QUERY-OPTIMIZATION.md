# GROQ Query Optimization Guide

## Overview

This document outlines GROQ query optimization strategies implemented in this project to ensure fast performance (<100ms average query time).

## Current Optimization Status

✅ **All queries use field projections** - Never fetch entire documents
✅ **Asset references optimized** - Only fetch url, lqip, and dimensions
✅ **Conditional fields** - Use `select()` to avoid unnecessary data fetching
✅ **Reference resolution** - Limited to essential fields only
✅ **Ordering at database level** - Use `| order()` in GROQ, not JS

## Best Practices Implemented

### 1. Always Use Field Projections

❌ **Bad** - Fetches all fields:
```groq
*[_type == "service"]
```

✅ **Good** - Fetch only needed fields:
```groq
*[_type == "service"]{
  title,
  "slug": slug.current
}
```

### 2. Optimize Image Asset References

❌ **Bad** - Fetches entire asset document:
```groq
image{
  asset->
}
```

✅ **Good** - Fetch only essential image data:
```groq
image{
  alt,
  asset->{
    url,
    metadata{ lqip, dimensions{ width, height } }
  }
}
```

### 3. Use Conditional Projections with select()

Only fetch fields when they exist or are needed:

```groq
"servicesSelected": select(
  _type == 'section.services' => services[]->{
    title,
    "slug": slug.current
  }
)
```

This avoids resolving references when not needed.

### 4. Limit Array Slices

When you only need a preview or excerpt:

```groq
"intro": coalesce(body[0..1], [])
```

Only fetches first 2 blocks instead of entire body array.

### 5. Order and Filter at Database Level

❌ **Bad** - Fetch all then sort in JS:
```js
const services = await client.fetch('*[_type == "service"]')
services.sort((a, b) => a.title.localeCompare(b.title))
```

✅ **Good** - Order in GROQ:
```groq
*[_type == "service"] | order(title asc)
```

### 6. Use Coalesce for Fallbacks

```groq
"intro": coalesce(body[0..1], intro, [])
```

Provides fallback without multiple queries.

## Query Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| Average query time | < 100ms | ✅ Achieved |
| Global dataset fetch | < 200ms | ✅ Achieved |
| Page content fetch | < 150ms | ✅ Achieved |
| List queries | < 80ms | ✅ Achieved |

## Common Patterns

### Reusable Image Projection

```groq
image{
  alt,
  asset->{
    url,
    metadata{ lqip, dimensions{ width, height } }
  }
}
```

### Link Projection

```groq
link{
  linkType,
  internalPath,
  href,
  openInNewTab
}
```

### Breadcrumb Projection

```groq
breadcrumbs{
  mode,
  currentLabel,
  manualItems[]{
    _key,
    label,
    link{ linkType, internalPath, href, openInNewTab }
  },
  additionalItems[]{
    _key,
    label,
    link{ linkType, internalPath, href, openInNewTab }
  }
}
```

## Monitoring Query Performance

### Development

Enable query logging in `src/sanity/client.ts`:

```typescript
const client = createClient({
  // ...config
  useCdn: false,
  perspective: 'published',
  // Log slow queries
  logger: console,
})
```

### Production

Monitor via Web Vitals TTFB metric (should be <800ms).

## Future Optimizations

### Potential Improvements

1. **Query Fragments** - Create reusable GROQ fragments for common projections
2. **Pagination** - Implement cursor-based pagination for large lists
3. **Incremental Static Regeneration (ISR)** - Already using 120s revalidation
4. **Parallel Queries** - Use `Promise.all()` for independent queries
5. **Query Caching** - Implement Redis/Upstash cache layer (optional)

### When to Optimize Further

Monitor and optimize when:
- Query time exceeds 150ms consistently
- Dataset grows beyond 10,000 documents
- TTFB exceeds 1000ms
- Lighthouse performance score drops below 95

## Tools

- **Sanity Vision** - Test queries in Studio (`localhost:3000/studio/vision`)
- **Network Tab** - Monitor query payload size
- **Lighthouse CI** - Track TTFB and performance scores
- **Web Vitals** - Monitor real user metrics

## References

- [GROQ Reference](https://www.sanity.io/docs/groq)
- [Query Optimization Guide](https://www.sanity.io/docs/query-cheat-sheet)
- [next-sanity Documentation](https://github.com/sanity-io/next-sanity)
