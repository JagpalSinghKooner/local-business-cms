# Phase 3.3 - Performance Monitoring & Optimization

**Status**: 🔴 NOT STARTED
**Priority**: 🔴 HIGH - Quality Assurance
**Duration**: Week 2-3 of Phase 3
**Completion**: 0% (0/8 steps)

---

## Overview

Implement comprehensive performance monitoring, budget enforcement, and optimization across the platform. This ensures sustained high performance through automated testing and continuous monitoring.

**Target Metrics**:
- Core Web Vitals > 90 (LCP, FID, CLS, INP, TTFB)
- Lighthouse Performance > 95
- Bundle size < 250KB first load
- GROQ queries < 100ms average

---

## Implementation Steps

### ✅ 3.3.1 Implement Web Vitals Instrumentation

**Status**: ⬜ TODO
**Files**: `src/lib/web-vitals.ts`, `src/app/layout.tsx`

**Requirements**:
- Capture Core Web Vitals (LCP, FID, CLS, INP, TTFB)
- Send metrics to analytics endpoint
- Add client-side measurement hooks
- Support custom metrics (GROQ query time, redirect time)
- Add performance mark API usage
- Create metric aggregation utilities

**Web Vitals Implementation**:
```typescript
// src/lib/web-vitals.ts
import { onCLS, onFID, onLCP, onINP, onTTFB, Metric } from 'web-vitals';

interface AnalyticsPayload {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

function sendToAnalytics(metric: Metric) {
  const body: AnalyticsPayload = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
  };

  // Send to analytics endpoint
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/web-vitals', JSON.stringify(body));
  } else {
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      body: JSON.stringify(body),
      keepalive: true,
    });
  }
}

export function initWebVitals() {
  onCLS(sendToAnalytics);
  onFID(sendToAnalytics);
  onLCP(sendToAnalytics);
  onINP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}
```

**Client Component**:
```typescript
// src/components/analytics/WebVitals.tsx
'use client';

import { useEffect } from 'react';
import { initWebVitals } from '@/lib/web-vitals';

export function WebVitals() {
  useEffect(() => {
    initWebVitals();
  }, []);

  return null;
}
```

**Root Layout Integration**:
```tsx
// src/app/layout.tsx
import { WebVitals } from '@/components/analytics/WebVitals';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <WebVitals />
      </body>
    </html>
  );
}
```

**Custom Performance Marks**:
```typescript
// src/lib/performance-marks.ts
export function measureGROQQuery(queryName: string, duration: number) {
  if (typeof window !== 'undefined' && window.performance) {
    window.performance.mark(`groq-${queryName}-start`);
    window.performance.mark(`groq-${queryName}-end`);
    window.performance.measure(
      `groq-${queryName}`,
      `groq-${queryName}-start`,
      `groq-${queryName}-end`
    );
  }

  // Send to analytics
  fetch('/api/analytics/custom-metric', {
    method: 'POST',
    body: JSON.stringify({
      name: `groq-${queryName}`,
      value: duration,
      type: 'query-time',
    }),
  });
}
```

**Acceptance Criteria**:
- All Core Web Vitals captured
- Metrics sent to analytics endpoint
- Custom metrics tracked
- No performance impact from instrumentation

---

### ✅ 3.3.2 Set Up Performance Budget Enforcement

**Status**: ⬜ TODO
**Files**: `.lighthouserc.json`, `package.json`, `scripts/check-bundle-size.ts`

**Requirements**:
- Define performance budgets for all metrics
- Add bundle size limits per route
- Configure Lighthouse budget enforcement
- Add pre-commit hook for bundle size checks
- Create budget monitoring dashboard

**Lighthouse Budget Config**:
```json
// .lighthouserc.json
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:3001/",
        "http://localhost:3001/services/plumbing",
        "http://localhost:3001/locations/avalon-nj"
      ],
      "numberOfRuns": 3,
      "settings": {
        "preset": "desktop",
        "throttling": {
          "rttMs": 40,
          "throughputKbps": 10240,
          "cpuSlowdownMultiplier": 1
        }
      }
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.95 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],

        "first-contentful-paint": ["error", { "maxNumericValue": 1500 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-blocking-time": ["error", { "maxNumericValue": 300 }],
        "speed-index": ["error", { "maxNumericValue": 3000 }],

        "interactive": ["error", { "maxNumericValue": 3500 }],
        "max-potential-fid": ["error", { "maxNumericValue": 130 }],

        "resource-summary:script:size": ["error", { "maxNumericValue": 250000 }],
        "resource-summary:image:size": ["error", { "maxNumericValue": 500000 }],
        "resource-summary:stylesheet:size": ["error", { "maxNumericValue": 50000 }],
        "resource-summary:font:size": ["error", { "maxNumericValue": 100000 }],
        "resource-summary:total:size": ["error", { "maxNumericValue": 1000000 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

**Bundle Size Check Script**:
```typescript
// scripts/check-bundle-size.ts
import fs from 'fs';
import path from 'path';

interface BundleLimit {
  path: string;
  maxSize: number; // bytes
}

const BUNDLE_LIMITS: BundleLimit[] = [
  { path: '_app', maxSize: 250 * 1024 }, // 250KB
  { path: 'main', maxSize: 150 * 1024 }, // 150KB
  { path: 'framework', maxSize: 150 * 1024 }, // 150KB
];

function checkBundleSizes() {
  const buildDir = path.join(process.cwd(), '.next/static/chunks');
  let hasError = false;

  for (const limit of BUNDLE_LIMITS) {
    const files = fs.readdirSync(buildDir).filter(f => f.includes(limit.path));

    for (const file of files) {
      const filePath = path.join(buildDir, file);
      const stats = fs.statSync(filePath);

      if (stats.size > limit.maxSize) {
        console.error(
          `❌ Bundle size exceeded: ${file}\n` +
          `   Size: ${(stats.size / 1024).toFixed(2)}KB\n` +
          `   Limit: ${(limit.maxSize / 1024).toFixed(2)}KB`
        );
        hasError = true;
      } else {
        console.log(
          `✅ ${file}: ${(stats.size / 1024).toFixed(2)}KB / ${(limit.maxSize / 1024).toFixed(2)}KB`
        );
      }
    }
  }

  if (hasError) {
    process.exit(1);
  }
}

checkBundleSizes();
```

**Package.json Scripts**:
```json
{
  "scripts": {
    "check:bundle": "tsx scripts/check-bundle-size.ts",
    "lighthouse": "lhci autorun",
    "lighthouse:ci": "lhci autorun --config=.lighthouserc.json"
  }
}
```

**Acceptance Criteria**:
- Performance budgets defined
- Bundle size limits enforced
- Lighthouse CI configured
- Pre-commit checks run successfully

---

### ✅ 3.3.3 Configure Lighthouse CI in GitHub Actions

**Status**: ⬜ TODO
**Files**: `.github/workflows/lighthouse-ci.yml`

**Requirements**:
- Run Lighthouse CI on every PR
- Test multiple page types (homepage, service, location)
- Upload results to temporary storage
- Add status check to PR
- Fail CI if budgets exceeded

**GitHub Actions Workflow**:
```yaml
# .github/workflows/lighthouse-ci.yml
name: Lighthouse CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build project
        run: pnpm build
        env:
          NEXT_PUBLIC_SANITY_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_SANITY_PROJECT_ID }}
          NEXT_PUBLIC_SANITY_DATASET: production
          NEXT_PUBLIC_SITE_URL: http://localhost:3001

      - name: Start server
        run: pnpm start &
        env:
          PORT: 3001

      - name: Wait for server
        run: npx wait-on http://localhost:3001 -t 60000

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

      - name: Upload Lighthouse results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: lighthouse-results
          path: .lighthouseci
```

**Acceptance Criteria**:
- Workflow runs on every PR
- Multiple pages tested
- Results uploaded successfully
- PR status check added
- CI fails if budgets exceeded

---

### ✅ 3.3.4 Add Bundle Size Monitoring

**Status**: ⬜ TODO
**Files**: `scripts/bundle-analyzer.ts`, `.github/workflows/bundle-analysis.yml`

**Requirements**:
- Generate bundle analysis report
- Track bundle size over time
- Compare PR bundle size vs main
- Add bundle size bot comment on PRs
- Visualize bundle composition

**Bundle Analysis Script**:
```typescript
// scripts/bundle-analyzer.ts
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export function analyzeBundles() {
  return new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    reportFilename: './bundle-analysis.html',
    openAnalyzer: false,
    generateStatsFile: true,
    statsFilename: './bundle-stats.json',
  });
}
```

**Next.js Config Integration**:
```typescript
// next.config.ts
import { analyzeBundles } from './scripts/bundle-analyzer';

const config: NextConfig = {
  webpack: (config, { isServer }) => {
    if (process.env.ANALYZE === 'true' && !isServer) {
      config.plugins.push(analyzeBundles());
    }
    return config;
  },
};
```

**GitHub Actions Workflow**:
```yaml
# .github/workflows/bundle-analysis.yml
name: Bundle Analysis

on:
  pull_request:
    branches: [main]

jobs:
  analyze:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build and analyze
        run: ANALYZE=true pnpm build
        env:
          NEXT_PUBLIC_SANITY_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_SANITY_PROJECT_ID }}

      - name: Upload bundle stats
        uses: actions/upload-artifact@v4
        with:
          name: bundle-stats
          path: .next/bundle-stats.json

      - name: Compare with base
        uses: github/webpack-bundle-analyzer-action@v1
        with:
          base-stats-path: .next/bundle-stats.json
          compare-stats-path: .next/bundle-stats.json
```

**Acceptance Criteria**:
- Bundle analysis generates report
- Size tracking over time works
- PR comments show bundle diff
- Visualization available

---

### ✅ 3.3.5 Optimize GROQ Queries with Projections

**Status**: ⬜ TODO
**Files**: `src/sanity/queries.ts`, `src/lib/groq-optimizer.ts`

**Requirements**:
- Audit all GROQ queries for over-fetching
- Add projections to limit field selection
- Implement query caching strategy
- Add query performance logging
- Create query optimization guide

**Query Optimization Examples**:

**Before (Over-fetching)**:
```typescript
const query = groq`
  *[_type == "service"] {
    ...,
    category->{
      ...
    }
  }
`;
```

**After (Optimized with Projections)**:
```typescript
const query = groq`
  *[_type == "service"] {
    _id,
    title,
    slug,
    shortDescription,
    category->{
      _id,
      name,
      slug
    }
  }
`;
```

**Query Performance Logging**:
```typescript
// src/lib/groq-optimizer.ts
export async function measureQuery<T>(
  query: string,
  params: Record<string, unknown>,
  client: SanityClient
): Promise<{ data: T; duration: number }> {
  const startTime = performance.now();
  const data = await client.fetch<T>(query, params);
  const duration = performance.now() - startTime;

  if (duration > 100) {
    console.warn(`Slow GROQ query (${duration.toFixed(2)}ms):`, query);
  }

  // Send to monitoring
  if (typeof window !== 'undefined') {
    fetch('/api/analytics/query-performance', {
      method: 'POST',
      body: JSON.stringify({ query, duration, timestamp: Date.now() }),
    });
  }

  return { data, duration };
}
```

**Query Optimization Checklist**:
```markdown
## GROQ Query Optimization Checklist

- [ ] Only fetch required fields (avoid `...` spread operator)
- [ ] Use projections for referenced documents
- [ ] Add filters early in the query pipeline
- [ ] Limit array expansions (`[0...10]`)
- [ ] Use `select()` for conditional fields
- [ ] Avoid nested reference resolution > 2 levels
- [ ] Cache queries with `next: { revalidate: 120 }`
- [ ] Test query performance in production dataset
```

**Acceptance Criteria**:
- All queries use projections
- No queries > 100ms average
- Query performance logged
- Optimization guide created

---

### ✅ 3.3.6 Implement React Cache Deduplication

**Status**: ⬜ TODO
**Files**: `src/sanity/loaders.ts`, `src/lib/cache-utils.ts`

**Requirements**:
- Wrap loader functions with React `cache()`
- Implement request-level deduplication
- Add cache invalidation strategy
- Monitor cache hit rate
- Document caching patterns

**React Cache Implementation**:
```typescript
// src/sanity/loaders.ts
import { cache } from 'react';
import { client } from './client';
import * as queries from './queries';

// Deduplicate requests during SSR
export const getHomePage = cache(async () => {
  return client.fetch(queries.homePageQuery, {}, {
    next: { revalidate: 120 },
  });
});

export const getServiceBySlug = cache(async (slug: string) => {
  return client.fetch(queries.serviceBySlugQuery, { slug }, {
    next: { revalidate: 120, tags: [`service:${slug}`] },
  });
});

export const getGlobalDataset = cache(async () => {
  return client.fetch(queries.globalDataQuery, {}, {
    next: { revalidate: 300 }, // 5 minutes
  });
});
```

**Cache Utilities**:
```typescript
// src/lib/cache-utils.ts
import { revalidateTag } from 'next/cache';

export function invalidateCache(type: 'service' | 'location' | 'page', slug?: string) {
  if (slug) {
    revalidateTag(`${type}:${slug}`);
  } else {
    revalidateTag(type);
  }
}

export function invalidateAllCaches() {
  revalidateTag('global');
}
```

**Cache Monitoring**:
```typescript
// src/lib/cache-monitor.ts
export function trackCacheHit(key: string) {
  fetch('/api/analytics/cache-hit', {
    method: 'POST',
    body: JSON.stringify({ key, timestamp: Date.now() }),
  });
}

export function trackCacheMiss(key: string) {
  fetch('/api/analytics/cache-miss', {
    method: 'POST',
    body: JSON.stringify({ key, timestamp: Date.now() }),
  });
}
```

**Acceptance Criteria**:
- All loaders use React cache
- Request deduplication works
- Cache invalidation functional
- Cache hit rate > 80%

---

### ✅ 3.3.7 Add Route Segment Config Optimization

**Status**: ⬜ TODO
**Files**: All page routes (`src/app/**/page.tsx`)

**Requirements**:
- Add `revalidate` to all routes
- Configure `dynamic` behavior
- Set appropriate `fetchCache` strategy
- Add `runtime` configuration where needed
- Document segment config options

**Route Segment Config Examples**:
```typescript
// src/app/page.tsx (Homepage)
export const revalidate = 120; // 2 minutes
export const dynamic = 'force-static';
export const fetchCache = 'default-cache';

export default async function HomePage() {
  const data = await getHomePage();
  return <PageContent data={data} />;
}
```

```typescript
// src/app/services/[service]/page.tsx
export const revalidate = 120;
export const dynamic = 'force-static';
export const dynamicParams = true; // Allow new params at runtime

export async function generateStaticParams() {
  const services = await getAllServices();
  return services.map(s => ({ service: s.slug }));
}

export default async function ServicePage({ params }: Props) {
  const data = await getServiceBySlug(params.service);
  return <ServiceContent data={data} />;
}
```

```typescript
// src/app/api/preview/route.ts
export const runtime = 'edge'; // Use Edge Runtime for preview
export const dynamic = 'force-dynamic'; // Always dynamic

export async function GET(request: Request) {
  // Preview logic
}
```

**Segment Config Options**:
```typescript
// Available configurations
export const revalidate = 120; // ISR revalidation (seconds)
export const dynamic = 'auto' | 'force-dynamic' | 'force-static' | 'error';
export const dynamicParams = true | false; // Allow new params
export const fetchCache = 'auto' | 'default-cache' | 'only-cache' | 'force-cache' | 'force-no-store' | 'default-no-store' | 'only-no-store';
export const runtime = 'nodejs' | 'edge';
export const preferredRegion = 'auto' | 'global' | 'home' | string[];
export const maxDuration = 1 | 10 | 60 | 300; // Vercel function timeout
```

**Acceptance Criteria**:
- All routes have segment config
- ISR revalidation configured
- Static pages marked correctly
- Dynamic routes optimized

---

### ✅ 3.3.8 Create Performance Dashboard

**Status**: ⬜ TODO
**Files**: `src/app/admin/performance/page.tsx`, `src/app/api/analytics/*`

**Requirements**:
- Display Core Web Vitals over time
- Show bundle size trends
- Display GROQ query performance
- Show cache hit rate
- Add redirect performance metrics
- Create alerting system for degradation

**Performance Dashboard UI**:
```typescript
// src/app/admin/performance/page.tsx
import { Suspense } from 'react';
import { getWebVitalsData, getBundleSizeData, getQueryPerformanceData } from '@/lib/analytics';

export default async function PerformanceDashboard() {
  const [webVitals, bundleSize, queryPerf] = await Promise.all([
    getWebVitalsData(),
    getBundleSizeData(),
    getQueryPerformanceData(),
  ]);

  return (
    <div className="performance-dashboard">
      <h1>Performance Dashboard</h1>

      <section>
        <h2>Core Web Vitals (Last 7 Days)</h2>
        <WebVitalsChart data={webVitals} />
      </section>

      <section>
        <h2>Bundle Size Trends</h2>
        <BundleSizeChart data={bundleSize} />
      </section>

      <section>
        <h2>GROQ Query Performance</h2>
        <QueryPerformanceTable data={queryPerf} />
      </section>
    </div>
  );
}
```

**Analytics API Routes**:
```typescript
// src/app/api/analytics/web-vitals/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const metric = await request.json();

  // Store in database or send to analytics service
  console.log('Web Vital:', metric);

  return NextResponse.json({ success: true });
}
```

**Acceptance Criteria**:
- Dashboard displays all metrics
- Real-time data updates
- Trends visualized clearly
- Alerting system functional

---

## Deliverables

### New Files Created (12)
1. `src/lib/web-vitals.ts` - Web Vitals instrumentation
2. `src/components/analytics/WebVitals.tsx` - Client component
3. `src/lib/performance-marks.ts` - Custom performance tracking
4. `scripts/check-bundle-size.ts` - Bundle size validation
5. `scripts/bundle-analyzer.ts` - Bundle analysis
6. `.github/workflows/lighthouse-ci.yml` - Lighthouse CI workflow
7. `.github/workflows/bundle-analysis.yml` - Bundle analysis workflow
8. `src/lib/groq-optimizer.ts` - Query optimization utilities
9. `src/lib/cache-utils.ts` - Cache utilities
10. `src/lib/cache-monitor.ts` - Cache monitoring
11. `src/app/admin/performance/page.tsx` - Performance dashboard
12. `src/app/api/analytics/web-vitals/route.ts` - Analytics endpoint

### Modified Files (5)
1. `.lighthouserc.json` - Performance budgets
2. `src/app/layout.tsx` - Web Vitals integration
3. `src/sanity/loaders.ts` - React cache implementation
4. `next.config.ts` - Bundle analysis config
5. All page routes - Route segment config

### Package.json Scripts to Add
```json
{
  "scripts": {
    "check:bundle": "tsx scripts/check-bundle-size.ts",
    "lighthouse": "lhci autorun",
    "lighthouse:ci": "lhci autorun --config=.lighthouserc.json",
    "analyze": "ANALYZE=true pnpm build"
  },
  "dependencies": {
    "web-vitals": "^3.5.0",
    "@lhci/cli": "^0.12.0"
  },
  "devDependencies": {
    "webpack-bundle-analyzer": "^4.10.0"
  }
}
```

---

## Testing Checklist

- [ ] Core Web Vitals captured correctly
- [ ] Performance budgets enforced
- [ ] Lighthouse CI runs on PRs
- [ ] Bundle size monitoring works
- [ ] GROQ queries < 100ms
- [ ] React cache deduplication works
- [ ] Route segment configs optimized
- [ ] Performance dashboard displays data
- [ ] Alerting system functional

---

## Success Metrics

- ✅ Core Web Vitals > 90 (LCP, FID, CLS, INP, TTFB)
- ✅ Lighthouse Performance > 95
- ✅ Bundle size < 250KB first load
- ✅ GROQ queries < 100ms average
- ✅ Cache hit rate > 80%
- ✅ Zero performance regressions in CI
- ✅ Performance dashboard operational

---

## Next Steps After Completion

Once Phase 3.3 is complete, **Phase 3 is 100% complete**. Move to:
- **Phase 5**: Multi-Tenant Architecture
