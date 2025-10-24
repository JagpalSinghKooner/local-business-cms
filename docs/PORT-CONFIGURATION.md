# Port Configuration Guide

## Overview

This project is configured to **always run on port 3001** during development to prevent port conflicts and ensure consistency across all development tools.

---

## Why Port 3001?

### Problem
By default, Next.js tries to use port 3000. However:
- Other applications may already be using port 3000
- Next.js automatically switches to the next available port (3001, 3002, etc.)
- This causes **configuration mismatches** between:
  - Dev server
  - Test suites (Playwright)
  - Performance tools (Lighthouse)
  - Environment variables
  - Sanity preview

### Solution
We **force the dev server to always use port 3001** by adding the `-p 3001` flag to the dev command.

---

## Configuration Files

All configuration files are now synchronized to use port 3001:

### 1. **package.json**
```json
{
  "scripts": {
    "dev": "next dev -p 3001"
  }
}
```
✅ **Effect**: Forces Next.js to always start on port 3001

### 2. **.env.local**
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3001
SANITY_STUDIO_PREVIEW_URL=http://localhost:3001
```
✅ **Effect**: Environment variables reference correct port

### 3. **playwright.config.ts**
```typescript
use: {
  baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001',
},
webServer: {
  command: 'pnpm dev',
  url: 'http://localhost:3001',
}
```
✅ **Effect**: Tests run against port 3001

### 4. **lighthouserc.json**
```json
{
  "url": [
    "http://localhost:3001/",
    "http://localhost:3001/services",
    "http://localhost:3001/locations",
    "http://localhost:3001/services/ductless-hvac-systems",
    "http://localhost:3001/locations/avalon-nj"
  ]
}
```
✅ **Effect**: Performance tests use port 3001

### 5. **src/sanity/components/IframePreview.tsx**
```typescript
const PREVIEW_ORIGIN =
  process.env.SANITY_STUDIO_PREVIEW_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'http://localhost:3001'
```
✅ **Effect**: Sanity preview uses port 3001

### 6. **tests/seo/technical-seo.spec.ts**
```typescript
if (currentUrl !== 'http://localhost:3001/' &&
    currentUrl !== 'http://localhost:3001') {
  expect(currentUrl).not.toMatch(/\/$/);
}
```
✅ **Effect**: SEO tests reference correct port

---

## Commands

### Development Server
```bash
# Always starts on port 3001
pnpm dev

# Or using npm/yarn
npm run dev
```

### Running Tests
```bash
# Tests automatically connect to port 3001
pnpm test:seo
pnpm test:integration
```

### Performance Testing
```bash
# Lighthouse automatically connects to port 3001
pnpm lhci:autorun
```

---

## Verifying Port Configuration

### Check Dev Server
After running `pnpm dev`, you should see:
```
▲ Next.js 15.5.5
- Local:        http://localhost:3001
- Network:      http://192.168.5.52:3001
```

### Check Sitemap URLs
```bash
curl http://localhost:3001/sitemap.xml | grep '<loc>'
```
All URLs should use `http://localhost:3001`

### Check Environment Variables
```bash
# View your .env.local
cat .env.local | grep SITE_URL
```
Should output: `NEXT_PUBLIC_SITE_URL=http://localhost:3001`

---

## Production Deployment

**Important**: This port configuration is for **development only**.

### For Production
Update your production environment variables:
```env
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
SANITY_STUDIO_PREVIEW_URL=https://your-production-domain.com
```

The `-p 3001` flag in `package.json` only affects `pnpm dev`. Production deployments use:
- **Vercel**: Automatically uses their routing
- **Docker**: Configure via PORT environment variable
- **Custom hosting**: Use standard Next.js `pnpm start` (port 3000 by default)

---

## Troubleshooting

### Issue: Port 3001 is already in use
**Solution**: Kill the process using port 3001
```bash
# Find process using port 3001
lsof -ti:3001

# Kill the process
kill -9 $(lsof -ti:3001)

# Restart dev server
pnpm dev
```

### Issue: Tests fail with "Connection refused"
**Cause**: Dev server isn't running on port 3001

**Solution**:
1. Stop all running processes
2. Run `pnpm dev` (should show port 3001)
3. Run tests in separate terminal

### Issue: Sitemap shows wrong port
**Cause**: Environment variable not updated or needs restart

**Solution**:
1. Verify `.env.local` has `NEXT_PUBLIC_SITE_URL=http://localhost:3001`
2. Restart dev server: `pnpm dev`
3. Clear cache: `rm -rf .next && pnpm dev`

### Issue: Sanity preview doesn't work
**Cause**: CORS origin not configured for port 3001

**Solution**:
```bash
npx sanity cors add http://localhost:3001 --credentials
```

---

## Benefits of This Configuration

✅ **Consistency**: All tools use the same port
✅ **Reliability**: No more port conflicts
✅ **Predictability**: Server always starts on 3001
✅ **Fewer errors**: Tests and tools connect successfully
✅ **Better DX**: No manual port checking needed

---

## Related Documentation

- [Testing Guide](./TESTING-GUIDE.md) - Running tests on port 3001
- [Placeholder URLs](./md-files/studio-ux-placeholder-urls.md) - URL configuration details
- [Phase 4 Progress](./phase-4-progress.md) - Testing infrastructure setup

---

## Quick Reference

| Configuration | Port | Notes |
|---------------|------|-------|
| Development Server | 3001 | Always (via `-p 3001` flag) |
| Playwright Tests | 3001 | Matches dev server |
| Lighthouse CI | 3001 | Performance testing |
| Sanity Preview | 3001 | Uses env variable |
| Environment Variables | 3001 | Development only |
| Production | Dynamic | Use production domain |

**Last Updated**: 2025-10-22
