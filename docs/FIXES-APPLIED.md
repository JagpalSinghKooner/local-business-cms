# Recent Fixes Applied

**Date**: 2025-10-24
**Issues Fixed**: 2

---

## Issue #1: Next.js Viewport Metadata Warning

### Problem
```
⚠ Unsupported metadata viewport is configured in metadata export in /.
Please move it to viewport export instead.
```

### Root Cause
Next.js 15 deprecated the `viewport` property in the `metadata` export and requires it to be in a separate `viewport` export for better optimization and Web Vitals performance.

### Fix Applied
**File**: `src/app/layout.tsx`

**Before**:
```typescript
export const metadata: Metadata = {
  title: {
    default: 'Local Business',
    template: '%s | Local Business',
  },
  description: 'A CMS-driven marketing site for local service businesses.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
}
```

**After**:
```typescript
export const metadata: Metadata = {
  title: {
    default: 'Local Business',
    template: '%s | Local Business',
  },
  description: 'A CMS-driven marketing site for local service businesses.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}
```

### Reference
- [Next.js Documentation - generateViewport](https://nextjs.org/docs/app/api-reference/functions/generate-viewport)

---

## Issue #2: Dashboard Document Loading Error

### Problem
```
Error Loading Document
Document not found
File path: docs/md-files/roadmap-cms-modernization.md
```

### Root Cause
The dashboard HTML files (`docs/audit-report.html` and `docs/index.html`) were using `BASE_PATH = './'` which created incorrect paths when fetching documents.

**Path Resolution Issue**:
- Dashboard served from: `http://localhost:8080/docs/audit-report.html`
- Trying to fetch: `./docs/md-files/roadmap-cms-modernization.md`
- Resulting URL: `http://localhost:8080/docs/docs/md-files/...` ❌ (double `docs/`)
- Correct URL: `http://localhost:8080/docs/md-files/...` ✅

### Fix Applied

**File**: `docs/audit-report.html` (line 1143)
**File**: `docs/index.html` (line 949)

**Before**:
```javascript
const BASE_PATH = './'
```

**After**:
```javascript
// Since this HTML is served from /docs/, go up one level to reach project root
const BASE_PATH = '../'
```

### Verification
Now when fetching `docs/md-files/roadmap-cms-modernization.md`:
- From `/docs/audit-report.html`
- With `BASE_PATH = '../'`
- Resolves to: `http://localhost:8080/docs/md-files/roadmap-cms-modernization.md` ✅

---

## Additional Improvements

### Enhanced HTTP Server (scripts/dev-with-dashboard.mjs)

Added CORS headers and better error messages:

```javascript
res.writeHead(200, {
  'Content-Type': contentType,
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'no-cache',
})
```

**Benefits**:
- Allows dashboard to fetch files from different origins
- Prevents caching issues during development
- Better error messages showing exact failed paths

---

## Testing

To verify fixes work:

1. **Start dev environment**:
   ```bash
   pnpm dev
   ```

2. **Verify Next.js warning is gone**:
   - Check terminal output - no viewport warnings
   - Dev server should start cleanly

3. **Verify dashboard loads documents**:
   - Navigate to: http://localhost:8080/docs/audit-report.html
   - Click "CMS Modernization" in sidebar
   - Document should load without "Document not found" error

4. **Test all dashboard sections**:
   - Click through Planning & Strategy docs
   - Click through Architecture & Technical docs
   - Verify no 404 errors in browser console

---

## Impact

### Next.js Viewport Fix
- ✅ Eliminates console warning
- ✅ Follows Next.js 15 best practices
- ✅ Improves Web Vitals performance
- ✅ Future-proof for Next.js updates

### Dashboard Loading Fix
- ✅ All markdown documents load correctly
- ✅ No more "Document not found" errors
- ✅ Proper path resolution from project root
- ✅ CORS headers enable cross-origin requests

---

## Related Files

- `src/app/layout.tsx` - Viewport export
- `docs/audit-report.html` - Technical dashboard
- `docs/index.html` - User-friendly portal
- `scripts/dev-with-dashboard.mjs` - HTTP server with CORS

---

## Rollback (if needed)

If these changes cause issues:

```bash
# Revert layout.tsx
git checkout HEAD -- src/app/layout.tsx

# Revert dashboard files
git checkout HEAD -- docs/audit-report.html docs/index.html

# Restart dev server
pnpm dev
```

---

## Next Steps

All issues resolved! The development environment now:
- ✅ Starts cleanly without warnings
- ✅ Opens both app and docs in browser
- ✅ Loads all documentation correctly
- ✅ Provides seamless developer experience

Continue with schema improvements from `docs/md-files/schema-improvement-roadmap.md`! 🚀
