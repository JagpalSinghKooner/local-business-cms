# Phase 3.1 - Advanced Redirect System

**Status**: 🔴 NOT STARTED
**Priority**: 🔴 HIGH - Technical Infrastructure
**Duration**: Week 1 of Phase 3
**Completion**: 0% (0/8 steps)

---

## Overview

Build a production-grade redirect system with pattern matching, loop detection, and performance monitoring. This infrastructure is critical for SEO (handling URL migrations, canonical enforcement) and user experience (preventing 404s).

---

## Implementation Steps

### ✅ 3.1.1 Enhance Redirect Schema with Pattern Types

**Status**: ⬜ TODO
**Files**: `src/sanity/schemaTypes/documents/redirect.ts`

**Requirements**:
- Add `patternType` field: `'exact' | 'wildcard' | 'regex'`
- Add validation for regex patterns (test compilation)
- Add `caseSensitive` boolean flag
- Add `queryStringHandling`: `'preserve' | 'remove' | 'ignore'`
- Update TypeScript types via `pnpm sanitize:types`

**Example Schema**:
```typescript
{
  name: 'redirect',
  type: 'document',
  fields: [
    { name: 'source', type: 'string', validation: required },
    { name: 'destination', type: 'string', validation: required },
    {
      name: 'patternType',
      type: 'string',
      options: { list: ['exact', 'wildcard', 'regex'] },
      initialValue: 'exact'
    },
    { name: 'statusCode', type: 'number' }, // 301, 302, 307, 308
    { name: 'caseSensitive', type: 'boolean', initialValue: false },
    { name: 'queryStringHandling', type: 'string' },
    { name: 'priority', type: 'number' }, // Added in 3.1.2
    { name: 'enabled', type: 'boolean', initialValue: true }
  ]
}
```

**Acceptance Criteria**:
- Schema compiles without errors
- Regex patterns validated before save
- Types regenerated successfully

---

### ✅ 3.1.2 Add Redirect Priority/Order System

**Status**: ⬜ TODO
**Files**: `src/sanity/schemaTypes/documents/redirect.ts`, `src/middleware.ts`

**Requirements**:
- Add `priority` field (number, default: 0, higher = evaluated first)
- Add `order` field (auto-incremented position)
- Update middleware to sort redirects by priority, then order
- Add UI hint in Studio showing evaluation order

**Logic**:
```typescript
// In middleware redirect processing
redirects.sort((a, b) => {
  if (a.priority !== b.priority) return b.priority - a.priority;
  return a.order - b.order;
});
```

**Acceptance Criteria**:
- Redirects evaluated in correct priority order
- Studio displays order number in list view
- Higher priority redirects override lower ones

---

### ✅ 3.1.3 Implement Loop Detection Algorithm

**Status**: ⬜ TODO
**Files**: `src/middleware.ts`, `src/lib/redirect-utils.ts`

**Requirements**:
- Detect redirect chains (A → B → C)
- Prevent redirect loops (A → B → A)
- Limit chain depth (max 3 redirects)
- Add warning banner in Studio for problematic redirects
- Add validation during redirect save

**Algorithm**:
```typescript
function detectRedirectLoop(
  source: string,
  redirects: Redirect[],
  visited = new Set<string>()
): boolean {
  if (visited.has(source)) return true; // Loop detected
  if (visited.size >= 3) return true; // Chain too long

  visited.add(source);
  const redirect = redirects.find(r => r.source === source);

  if (!redirect) return false;
  return detectRedirectLoop(redirect.destination, redirects, visited);
}
```

**Acceptance Criteria**:
- Loop detection prevents infinite redirects
- Max chain depth enforced (3 hops)
- Studio shows loop warnings
- Runtime detection in middleware

---

### ✅ 3.1.4 Build Redirect Chain Validator

**Status**: ⬜ TODO
**Files**: `src/lib/redirect-validator.ts`, `src/sanity/plugins/redirect-validator-plugin.ts`

**Requirements**:
- Validate redirect on save (pre-commit hook in Studio)
- Check for loops before saving
- Detect conflicting rules (same source, different patterns)
- Show validation errors in Studio UI
- Add bulk validation script

**Validation Rules**:
1. Source ≠ Destination
2. No circular references
3. Valid regex syntax (if pattern type = regex)
4. No duplicate sources (unless priority differs)
5. Destination URL is valid format

**Acceptance Criteria**:
- Invalid redirects cannot be saved
- Clear error messages shown
- Bulk validation script works on all redirects

---

### ✅ 3.1.5 Create Bulk Import/Export Scripts

**Status**: ⬜ TODO
**Files**: `scripts/redirect-bulk-import.ts`, `scripts/redirect-bulk-export.ts`

**Requirements**:
- **Export**: Generate CSV/JSON of all redirects
- **Import**: Parse CSV/JSON and create redirect documents
- Support all redirect fields (pattern type, priority, etc.)
- Add dry-run mode (preview without saving)
- Add validation before import
- Support both create and update operations

**CSV Format**:
```csv
source,destination,statusCode,patternType,priority,enabled
/old-page,/new-page,301,exact,0,true
/blog/*,/articles/$1,301,wildcard,1,true
^/product/(\d+)$,/item/$1,301,regex,2,true
```

**CLI Usage**:
```bash
# Export
pnpm redirect:export --output redirects.csv

# Import (dry run)
pnpm redirect:import --input redirects.csv --dry-run

# Import (live)
pnpm redirect:import --input redirects.csv
```

**Acceptance Criteria**:
- Export generates valid CSV/JSON
- Import validates before saving
- Dry-run mode shows preview
- Error handling for malformed data

---

### ✅ 3.1.6 Add Redirect Performance Monitoring

**Status**: ⬜ TODO
**Files**: `src/lib/redirect-monitoring.ts`, `src/middleware.ts`

**Requirements**:
- Track redirect hit count
- Measure redirect processing time
- Log slow redirects (> 50ms)
- Add last-used timestamp
- Create monitoring dashboard data

**Metrics to Track**:
```typescript
interface RedirectMetrics {
  redirectId: string;
  hitCount: number;
  avgProcessingTime: number;
  lastUsed: Date;
  slowHits: number; // hits > 50ms
}
```

**Implementation**:
- Use in-memory cache for metrics (Redis optional)
- Persist metrics to Sanity periodically
- Add middleware timing logic

**Acceptance Criteria**:
- Redirect timing logged accurately
- Hit counts tracked
- Performance data available for analysis

---

### ✅ 3.1.7 Implement Redirect Testing in Middleware

**Status**: ⬜ TODO
**Files**: `tests/integration/redirects.spec.ts`, `src/middleware.ts`

**Requirements**:
- Test exact match redirects
- Test wildcard pattern redirects (`/blog/*` → `/articles/*`)
- Test regex pattern redirects
- Test query string handling
- Test case sensitivity
- Test priority ordering
- Test loop prevention

**Test Cases**:
```typescript
test('exact match redirect', async ({ page }) => {
  const response = await page.goto('/old-page');
  expect(response.status()).toBe(301);
  expect(response.url()).toContain('/new-page');
});

test('wildcard redirect', async ({ page }) => {
  const response = await page.goto('/blog/post-1');
  expect(response.url()).toContain('/articles/post-1');
});

test('regex redirect with capture groups', async ({ page }) => {
  const response = await page.goto('/product/123');
  expect(response.url()).toContain('/item/123');
});

test('prevents redirect loops', async ({ page }) => {
  // A → B → A should stop after max depth
  const response = await page.goto('/loop-a');
  expect(response.status()).not.toBe(500);
});
```

**Acceptance Criteria**:
- 10+ test cases covering all pattern types
- Loop prevention validated
- Priority ordering tested
- All tests pass

---

### ✅ 3.1.8 Add Sanity Studio Preview for Redirect Rules

**Status**: ⬜ TODO
**Files**: `src/sanity/plugins/redirect-preview-plugin.ts`, `src/components/studio/RedirectPreview.tsx`

**Requirements**:
- Live preview of redirect matching
- Test URL input to see which redirect matches
- Display matched redirect with pattern type
- Show redirect chain if applicable
- Highlight loop warnings
- Show evaluation order

**UI Features**:
```
┌─────────────────────────────────────┐
│ Test Redirect Matching              │
├─────────────────────────────────────┤
│ Test URL: [/old-blog/post-123    ] │
│           [Test →]                  │
├─────────────────────────────────────┤
│ ✅ Match Found                       │
│ Pattern: /old-blog/* (wildcard)     │
│ Destination: /articles/post-123     │
│ Status: 301 (Permanent)             │
│ Priority: 5                         │
└─────────────────────────────────────┘
```

**Acceptance Criteria**:
- Preview component renders in Studio
- Test URL matching works correctly
- Shows which redirect rule matches
- Displays full redirect chain

---

## Deliverables

### New Files Created (8)
1. `src/lib/redirect-utils.ts` - Pattern matching, loop detection
2. `src/lib/redirect-validator.ts` - Validation logic
3. `src/lib/redirect-monitoring.ts` - Performance tracking
4. `scripts/redirect-bulk-import.ts` - CSV/JSON import
5. `scripts/redirect-bulk-export.ts` - CSV/JSON export
6. `src/sanity/plugins/redirect-validator-plugin.ts` - Studio validation
7. `src/sanity/plugins/redirect-preview-plugin.ts` - Studio preview
8. `src/components/studio/RedirectPreview.tsx` - Preview UI component

### Modified Files (3)
1. `src/sanity/schemaTypes/documents/redirect.ts` - Enhanced schema
2. `src/middleware.ts` - Pattern matching, priority, monitoring
3. `tests/integration/redirects.spec.ts` - Comprehensive tests

### Package.json Scripts to Add
```json
{
  "scripts": {
    "redirect:export": "tsx scripts/redirect-bulk-export.ts",
    "redirect:import": "tsx scripts/redirect-bulk-import.ts",
    "redirect:validate": "tsx scripts/redirect-validate-all.ts"
  }
}
```

---

## Testing Checklist

- [ ] Exact match redirects work correctly
- [ ] Wildcard patterns (`/blog/*`) work with capture groups
- [ ] Regex patterns work with capture groups
- [ ] Priority ordering enforced correctly
- [ ] Redirect loops prevented (runtime)
- [ ] Redirect chains limited to 3 hops
- [ ] Case sensitivity respected
- [ ] Query string handling works
- [ ] Import/export scripts validated
- [ ] Studio preview shows correct matches
- [ ] Performance monitoring logs data
- [ ] All integration tests pass

---

## Success Metrics

- ✅ Zero redirect loops in production
- ✅ Redirect processing time < 10ms average
- ✅ 100% test coverage for redirect patterns
- ✅ Bulk import/export supports 1000+ redirects
- ✅ Studio validation prevents invalid rules

---

## Next Steps After Completion

Once Phase 3.1 is complete, move to:
- **Phase 3.2**: Image Optimization Pipeline
- **Phase 3.3**: Performance Monitoring & Web Vitals
