# Next.js 15 Bundling & Performance Knowledge

## Critical Rule: Re-Exports Trigger Build-Time Bundling

### ❌ WRONG - Triggers 7.4MB Bundle:
\`\`\`typescript
// This imports ENTIRE package at BUILD TIME
export { metadata, viewport } from 'next-sanity/studio'
\`\`\`

### ✅ CORRECT - Define Inline:
\`\`\`typescript
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Sanity Studio',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}
\`\`\`

## Lazy Loading Patterns

### Dynamic Imports:
\`\`\`typescript
import dynamic from 'next/dynamic'

// Lazy load Studio (5MB) only when /studio is visited
const LazyStudio = dynamic(
  () => import('./StudioClient'),
  { ssr: false, loading: () => <div>Loading...</div> }
)
\`\`\`

## Bundle Analysis Commands

\`\`\`bash
# 1. Clean build
rm -rf .next

# 2. Build with analysis
ANALYZE=true pnpm build

# 3. Check main-app.js size (should be <200KB)
ls -lh .next/static/chunks/main-app*.js

# 4. Verify bundle budget
pnpm bundle
\`\`\`

## Common Bundle Bloat Causes

1. **Sanity Studio in Main Bundle**
   - Symptom: main-app.js is 7MB+
   - Cause: Importing Studio components/config in root layout
   - Fix: Isolate to /studio route with dynamic import

2. **Large Dependencies Not Code-Split**
   - Symptom: Chunks over 200KB
   - Cause: No `dynamic()` imports for heavy components
   - Fix: Use `next/dynamic` with `ssr: false`

3. **Re-Exporting from Packages**
   - Symptom: Unexpected dependencies in bundle
   - Cause: `export { X } from 'package'` triggers full import
   - Fix: Import and re-export explicitly

## Package Import Optimization

\`\`\`typescript
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      '@sanity/client',
      '@sanity/ui',
      '@portabletext/react',
    ]
  }
}
\`\`\`

## Verification Checklist

- [ ] `rm -rf .next && pnpm build` completes
- [ ] `ls -lh .next/static/chunks/main-app*.js` shows <200KB
- [ ] `pnpm bundle` passes with no errors
- [ ] Admin routes (Studio) isolated with lazy loading
- [ ] No build-time imports from large packages
