# Placeholder URLs in Test Files

## Overview

This document explains the placeholder URLs used throughout the codebase and which ones are intentional vs. need updating for your specific business.

## ✅ Fixed Configuration Files

The following files have been updated to use your actual HVAC service and location URLs:

### 1. **package.json** ✅
- **Updated**: `"dev": "next dev -p 3001"` - Forces dev server to always use port 3001
- **Reason**: Prevents port conflicts and ensures consistent development environment

### 2. **lighthouserc.json** ✅
- **Updated**: Replaced generic `/services/plumbing-toronto` with actual URLs:
  - `/services/ductless-hvac-systems` (your actual HVAC service)
  - `/locations/avalon-nj` (your actual NJ shore location)
- **Port**: Uses port 3001 (consistent with dev server)

### 3. **playwright.config.ts** ✅
- **Status**: Properly configured for port 3001
- **baseURL**: `http://localhost:3001`
- **webServer url**: `http://localhost:3001`

### 4. **.env.local** ✅
- **Status**: Configured with correct environment variables
- **NEXT_PUBLIC_SITE_URL**: `http://localhost:3001` (development)
- **SANITY_STUDIO_PREVIEW_URL**: `http://localhost:3001`
- **Note**: Update these for production deployment

### 5. **src/sanity/components/IframePreview.tsx** ✅
- **Status**: Uses environment variables with proper fallback
- **Fallback**: `http://localhost:3001` (matches dev server)

### 6. **tests/seo/technical-seo.spec.ts** ✅
- **Status**: Configured to match dev server port
- **Port**: Uses `http://localhost:3001`

---

## ℹ️ Intentional Placeholder URLs (Do Not Change)

The following files contain placeholder URLs like `plumbing-toronto`, `mississauga`, `drain-cleaning`, etc. **These are intentional examples** that are meant to be generic and work across different business types:

### Test Files with Generic Examples:

1. **tests/seo/service-location-seo.spec.ts**
   - Uses: `plumbing-toronto`, `plumbing-mississauga`, etc.
   - **Why**: Generic examples for testing service+location combinations
   - **Action**: Tests will use your actual Sanity data when run

2. **tests/integration/static-generation.spec.ts**
   - Uses: `plumbing-toronto`, `drain-cleaning-mississauga`, etc.
   - **Why**: Example URLs to test static generation patterns
   - **Action**: Tests dynamically fetch actual data from your Sanity dataset

3. **tests/integration/preview-mode.spec.ts**
   - Uses: `plumbing-toronto`
   - **Why**: Generic example for preview mode testing
   - **Action**: Can be used with any valid slug from your CMS

4. **tests/visual/components.spec.ts**
   - Uses: `plumbing-toronto`
   - **Why**: Example for visual regression testing
   - **Action**: Replace with actual service+location if needed

5. **tests/visual/responsive.spec.ts**
   - Uses: `plumbing-toronto`
   - **Why**: Example for responsive design testing
   - **Action**: Tests will work with any valid page

6. **tests/seo/json-ld-validation.spec.ts**
   - Uses: `plumbing-toronto`
   - **Why**: Example for schema validation
   - **Action**: Tests validate structure, not specific content

7. **tests/seo/internal-links.spec.ts**
   - Uses: `plumbing-toronto`
   - **Why**: Example for link auditing
   - **Action**: Tests check patterns, not specific URLs

---

## 📝 Documentation Files

These files contain examples and should be kept as-is for reference:

1. **docs/TESTING-GUIDE.md**
   - Contains example commands with placeholder URLs
   - **Action**: Keep as-is - examples help other developers

2. **docs/phase-4-progress.md**
   - References example URLs in test descriptions
   - **Action**: Keep as-is - historical documentation

3. **CLAUDE.md**
   - Project instructions with example patterns
   - **Action**: Keep as-is - templates for future use

---

## Your Actual Business Data

Based on your Sanity CMS, here are your **actual** services and locations:

### Services (Examples from sitemap):
- `furnace-repair`
- `ductless-hvac-systems`
- `air-conditioning-repair`
- `heating-installation`
- (and more HVAC-related services)

### Locations (Examples from sitemap):
- `avalon-nj`
- `stone-harbor-nj`
- `cape-may-nj`
- `sea-isle-city-nj`
- `wildwood-nj`
- (and more New Jersey shore towns)

### Service+Location Combinations:
Your framework automatically generates URLs like:
- `/services/furnace-repair-avalon-nj`
- `/services/ductless-hvac-systems-stone-harbor-nj`
- `/services/air-conditioning-repair-cape-may-nj`

---

## When to Update Test URLs

You should update test URLs in these scenarios:

### Scenario 1: Visual Regression Baselines
If you want accurate visual regression screenshots, update the URLs in:
- `tests/visual/components.spec.ts`
- `tests/visual/responsive.spec.ts`

**Example**:
```typescript
// Change from:
await page.goto('/services/plumbing-toronto')

// To your actual service+location:
await page.goto('/services/furnace-repair-avalon-nj')
```

### Scenario 2: Performance Testing
Your Lighthouse configuration is already updated to use actual URLs:
- ✅ `/services/ductless-hvac-systems`
- ✅ `/locations/avalon-nj`

### Scenario 3: Integration Tests
Most integration tests are dynamic and will work with any Sanity data. However, if you want to test specific pages, you can update:

```typescript
// In tests/integration/static-generation.spec.ts
const samplePages = [
  '/services/furnace-repair-avalon-nj',
  '/services/ductless-hvac-systems-stone-harbor-nj',
  // ... your actual combinations
]
```

---

## Summary

✅ **Configuration files**: All updated to use port 3001 and actual URLs
⚠️ **Test files**: Intentionally use generic examples - work with any Sanity data
📚 **Documentation**: Keep examples as-is for reference

The test suite is designed to be **business-agnostic** and will work with your HVAC business data without modification. The placeholder URLs (`plumbing-toronto`) are just examples in the test descriptions.

---

## Need Help?

If you want to update test URLs to match your business:

1. Check your sitemap: `http://localhost:3001/sitemap.xml`
2. Find your actual service+location combinations
3. Update the specific test file URLs
4. Run tests to verify: `pnpm test:seo`
