# ServiceLocation Migration Guide

**Document Type**: Migration Guide
**Created**: 2025-10-24
**Status**: Production Ready
**Affects**: All sites using multi-tenant Local Business CMS Framework

---

## 📋 Overview

This guide covers migrating from the legacy auto-generated service+location pages to the new dedicated `serviceLocation` document type, which enables:

- ✅ **5,000+ unique landing pages** with custom content
- ✅ **Elite SEO** with auto-generated metadata and multi-schema JSON-LD
- ✅ **Editor control** over all content aspects
- ✅ **Content inheritance** from parent services
- ✅ **Gradual migration** with zero downtime

**Migration Complexity**: Low (backward compatible)
**Estimated Time**: 1-2 hours per site
**Rollback**: Simple (no data loss)

---

## 🎯 What Changed

### Schema Changes (Phase 1-4 Complete)

#### ✅ Phase 1: Schema Cleanup & Consolidation
- **Merged**: `siteSettings` + `siteConfig` → unified `siteSettings` singleton
- **Deleted**: Duplicate SEO systems (348 lines → 120 lines, 65% reduction)
- **Created**: `seoUnified` object (consistent across all content types)
- **Updated**: All document types now use `seoUnified` for SEO fields

#### ✅ Phase 2: ServiceLocation Model
- **Created**: `serviceLocation` document type (237 lines)
- **Added**: 4 GROQ queries for querying serviceLocation data
- **Added**: 4 loader functions for data fetching
- **Features**: Auto-slug generation, content inheritance, modular sections

#### ✅ Phase 3: Studio UX Redesign
- **Reorganized**: Desk structure with 6 logical groups
- **Added**: ServiceLocation list under Services section
- **Improved**: Navigation with emoji icons and clear hierarchy

#### ✅ Phase 4: SEO Automation & Integration
- **Enhanced**: SEO builder with `buildSeoForServiceLocation()` function
- **Created**: JSON-LD builder generating 1-4 schemas dynamically
- **Updated**: Sitemap to include serviceLocation documents (priority 0.9)
- **Updated**: Service route handler with priority-based rendering
- **Added**: Full backward compatibility with legacy auto-generated pages

### Breaking Changes

**NONE** - This migration is 100% backward compatible.

- ✅ Existing URLs continue to work
- ✅ Legacy service+location combinations still auto-generate
- ✅ No content loss or data corruption
- ✅ Gradual migration path available

### Non-Breaking Changes

- `siteConfig` singleton merged into `siteSettings` (data preserved)
- SEO fields consolidated to `seoUnified` (TypeScript catches at compile-time)
- ServiceLocation documents take priority over auto-generated pages

---

## 🚀 Migration Steps

### Step 1: Pre-Migration Checklist

**Before starting migration:**

1. **Backup your data**:
```bash
pnpm sanity:export
# Exports to: sanity-export-YYYY-MM-DD.tar.gz
```

2. **Verify current state**:
```bash
pnpm typecheck  # Should pass
pnpm build      # Should succeed
```

3. **Check production site**:
   - Visit a few service+location pages
   - Verify they render correctly
   - Note any custom content that should be preserved

4. **Review analytics**:
   - Identify high-traffic service+location combinations
   - Prioritize these for custom serviceLocation documents

---

### Step 2: Deploy Schema Updates

**For single site** (already deployed if on latest codebase):
```bash
# Pull latest code
git pull origin main

# Regenerate TypeScript types
pnpm sanitize:types

# Verify compilation
pnpm typecheck

# Build and test locally
pnpm build
pnpm start  # Test on localhost:3000

# Deploy to production
# (Follow your deployment process - Vercel, etc.)
```

**For multi-tenant deployments** (deploy to all datasets):
```bash
# Preview deployment
pnpm deploy-schema-all --dry-run

# Deploy to all datasets
pnpm deploy-schema-all

# Output will show:
# ✓ Deploying schema to: production
# ✓ Deploying schema to: staging
# ✓ Deploying schema to: site-new
# ...
```

---

### Step 3: Verify Schema Deployment

1. **Open Sanity Studio** (`/studio`)

2. **Check for new document type**:
   - Navigate to: Services → Service + Location Pages
   - You should see the new list view

3. **Verify existing content**:
   - Check Services - all services should still be there
   - Check Locations - all locations should still be there
   - Check Site Settings - merged data should be present

4. **Test creating serviceLocation**:
   - Click "Create" in Service + Location Pages
   - Select a service and location
   - Verify slug auto-generates
   - Save as draft

---

### Step 4: Migrate High-Priority Pages

**Identify high-value combinations** (from analytics):
- Highest traffic service+location pages
- Pages with highest conversion rates
- Local SEO targets (e.g., "{service} in {major city}")

**For each high-priority combination**:

1. **Create serviceLocation document**:
   - Navigate to Services → Service + Location Pages
   - Click "Create"
   - Select service (e.g., "Plumbing")
   - Select location (e.g., "Toronto")
   - Slug auto-generates: "plumbing-toronto"

2. **Add custom intro** (SEO-critical):
   ```
   Expert plumbing services in Toronto. Our licensed plumbers provide
   24/7 emergency repairs, installations, and maintenance throughout
   the Greater Toronto Area. Call now for same-day service!
   ```
   - First 155 characters become meta description
   - Use location-specific keywords
   - Include value proposition

3. **Configure content source**:
   - **Custom**: Create unique sections for this market
   - **Inherit**: Use parent service sections (faster)

4. **Add custom sections** (if contentSource = custom):
   - Testimonials from Toronto customers
   - FAQs about Toronto plumbing codes
   - Special offers for Toronto residents
   - Case studies from Toronto projects

5. **Override SEO** (optional):
   - Custom meta title: "Toronto Plumbing Services | 24/7 Emergency Repairs"
   - Custom OG image: Toronto service area map
   - Custom canonical URL (if needed)

6. **Configure display options**:
   - Show nearby locations: Yes
   - Show related services: Yes

7. **Publish**

8. **Verify**:
   - Visit `/services/plumbing-toronto`
   - Page should now render custom content
   - Check meta tags in page source
   - Verify JSON-LD schemas present

---

### Step 5: Bulk Migration (Optional)

For sites with 100+ service+location combinations:

**Strategy 1: Inherit Mode (Fast)**

Create serviceLocation documents with `contentSource: inherit`:
- Uses parent service sections
- Custom intro text only
- 5-10 minutes per document

**Strategy 2: AI-Assisted (Future)**

The schema supports `contentSource: ai` for future AI-generated content:
- Reserved for future implementation
- Would auto-generate intro and sections
- Content moderation workflow TBD

**Strategy 3: Scripted Creation**

For developers, create a migration script:

```typescript
// Example: scripts/create-service-locations.ts
import { writeClient } from '@/sanity/writeClient'

const serviceIds = ['service-1', 'service-2'] // Your service IDs
const locationIds = ['location-1', 'location-2'] // Your location IDs

for (const serviceId of serviceIds) {
  for (const locationId of locationIds) {
    await writeClient.create({
      _type: 'serviceLocation',
      service: { _type: 'reference', _ref: serviceId },
      location: { _type: 'reference', _ref: locationId },
      intro: [/* Portable Text intro */],
      contentSource: 'inherit',
      displayOptions: {
        showNearbyLocations: true,
        showOtherServices: true,
      },
      schemaVersion: 1,
    })
  }
}
```

---

### Step 6: Update Sitemap (Automatic)

The sitemap automatically includes serviceLocation documents:
- Priority: **0.9** (highest)
- Legacy auto-generated: **0.85** (fallback)
- Change frequency: weekly

**Verify sitemap**:
```bash
# Start dev server
pnpm dev

# Visit sitemap
open http://localhost:3001/sitemap.xml

# Search for serviceLocation entries
# Should see: /services/plumbing-toronto (priority 0.9)
```

---

### Step 7: Monitor & Optimize

**Week 1: Monitor performance**
- Check Google Search Console for indexing
- Monitor traffic to new serviceLocation pages
- Compare bounce rates vs legacy auto-generated pages

**Week 2: A/B test content**
- Test different intro text variations
- Compare custom sections vs inherited sections
- Identify highest-converting patterns

**Week 3: Scale up**
- Migrate medium-priority combinations
- Apply learnings from high-priority pages
- Document best practices for your business

**Week 4: Full rollout**
- Migrate remaining combinations (if desired)
- Legacy auto-generated pages remain as fallback
- No need to migrate 100% (gradual is OK)

---

## 🔄 Rollback Procedure

If you need to rollback (data loss is impossible):

### Emergency Rollback (Revert Code)

```bash
# Revert to previous commit
git revert HEAD

# Redeploy
# (Follow your deployment process)
```

**What happens**:
- ServiceLocation documents remain in CMS (no data loss)
- Route handler reverts to legacy auto-generation only
- All URLs continue working

### Soft Rollback (Keep Code, Unpublish Documents)

1. Open Sanity Studio
2. Navigate to Service + Location Pages
3. Select all serviceLocation documents
4. Unpublish or delete

**What happens**:
- Code remains updated
- Route handler falls back to legacy auto-generation
- No URL breakage

### Data Preservation

**Important**: ServiceLocation documents are stored in your dataset. Even if you rollback code, data remains safe.

To export serviceLocation documents only:
```bash
# Export entire dataset
pnpm sanity:export

# Or use Sanity CLI to export specific document type
npx sanity dataset export production ./serviceLocations.ndjson \
  --types serviceLocation
```

---

## ✅ Testing Checklist

After migration, verify:

### Functional Testing
- [ ] Homepage loads without errors
- [ ] Single service pages render correctly (`/services/plumbing`)
- [ ] Single location pages render correctly (`/locations/toronto`)
- [ ] ServiceLocation pages render custom content (`/services/plumbing-toronto`)
- [ ] Legacy auto-generated pages work as fallback
- [ ] Sitemap includes all pages (`/sitemap.xml`)
- [ ] Robots.txt is accessible (`/robots.txt`)

### SEO Testing
- [ ] Meta titles are correct (view page source)
- [ ] Meta descriptions are unique per page
- [ ] Canonical URLs are set properly
- [ ] Open Graph tags present (test with https://www.opengraph.xyz/)
- [ ] Twitter Card tags present
- [ ] JSON-LD schemas validate (test with https://validator.schema.org/)
- [ ] Sitemap includes images
- [ ] Priority levels correct (serviceLocation = 0.9, legacy = 0.85)

### Studio Testing
- [ ] Can create new serviceLocation documents
- [ ] Slug auto-generates on service+location selection
- [ ] Preview shows "{Service} in {Location}"
- [ ] Content source dropdown works (custom/inherit/ai)
- [ ] Sections array accepts all 19 section types
- [ ] SEO overrides work
- [ ] Display options toggle correctly
- [ ] Publish/unpublish works

### Multi-Tenant Testing (if applicable)
- [ ] Schema deployed to all datasets successfully
- [ ] Each site can create serviceLocation documents
- [ ] No cross-site data leaks
- [ ] Site switching works correctly
- [ ] All datasets compile without errors

---

## 📊 Migration Progress Tracking

Use this template to track migration:

```markdown
## ServiceLocation Migration Progress

**Site**: [Site Name]
**Started**: YYYY-MM-DD
**Target Completion**: YYYY-MM-DD

### High-Priority Pages (Target: 20)
- [x] plumbing-toronto
- [x] hvac-toronto
- [x] electrical-toronto
- [ ] plumbing-vancouver
- [ ] ... (16 more)

### Medium-Priority Pages (Target: 50)
- [ ] plumbing-mississauga
- [ ] ... (49 more)

### Low-Priority Pages (Target: 200+)
- [ ] ... (auto-generate or leave as legacy)

### Metrics
- **Total Combinations**: 300
- **Migrated**: 23 (7.6%)
- **In Progress**: 5
- **Remaining**: 272
- **Strategy**: Migrate top 50 high-value, leave rest as legacy fallback
```

---

## 🎓 Best Practices

### Content Strategy
1. **Prioritize high-traffic combinations** - Migrate top 20% that drive 80% of traffic
2. **Use inherit mode for similar markets** - Save time with content inheritance
3. **Create custom content for major cities** - Invest in top markets
4. **Leave long-tail as legacy** - No need to migrate 100%

### SEO Optimization
1. **Unique intro for each market** - First 155 chars are critical
2. **Local keywords** - Include city/region-specific terms
3. **Schema.org validation** - Test with Google Rich Results Test
4. **Monitor Core Web Vitals** - ServiceLocation pages should perform well

### Performance
1. **ISR caching** - ServiceLocation pages use 120s revalidation
2. **Image optimization** - Use optimized images in sections
3. **Lazy load sections** - Consider lazy loading below-the-fold sections
4. **Monitor build times** - 1000+ pages OK, but watch build performance

### Maintenance
1. **Regular audits** - Review top pages quarterly
2. **Update content** - Keep intro text fresh and relevant
3. **Monitor analytics** - Track conversion rates per market
4. **Iterate** - Apply learnings from top performers

---

## 🆘 Troubleshooting

### Issue: Slug already exists

**Error**: "A document with this slug already exists"

**Solution**:
1. Check if serviceLocation already exists for this combination
2. If duplicate, edit existing document
3. If legacy auto-generated URL conflicts, the system handles it automatically

### Issue: Sections not rendering

**Problem**: ServiceLocation page shows no sections

**Solution**:
1. Check `contentSource` field:
   - If "custom": Add sections to `sections` array
   - If "inherit": Verify parent service has sections
2. Verify sections array is populated in Studio
3. Check console for errors

### Issue: SEO metadata not updating

**Problem**: Meta tags show old values

**Solution**:
1. Clear Next.js cache: `rm -rf .next && pnpm dev`
2. Clear browser cache
3. Verify `seo` field is populated in Studio
4. Check if SEO overrides are set correctly

### Issue: JSON-LD validation errors

**Problem**: Schema.org validator shows errors

**Solution**:
1. Check required fields are populated:
   - Service: name, provider
   - LocalBusiness: address (if using)
2. Verify coordinates format (lat/lng numbers)
3. Test with Google Rich Results Test
4. Check console for JSON parsing errors

### Issue: Build fails after migration

**Error**: TypeScript compilation errors

**Solution**:
```bash
# Regenerate types
pnpm sanitize:types

# Check for errors
pnpm typecheck

# Common issue: SEO field access pattern
# Documents: document.seo?.metaTitle
# SiteSettings: site.metaDescription (direct)
```

### Issue: Performance degradation

**Problem**: Slow page loads after migration

**Solution**:
1. Check GROQ query efficiency (should match existing patterns)
2. Verify ISR revalidation is set (120s)
3. Monitor Sanity API usage
4. Consider adding edge caching (Vercel Edge Config)

---

## 📚 Additional Resources

- **Full Roadmap**: `docs/md-files/schema-improvement-roadmap.md`
- **Phase 1 Report**: `docs/md-files/schema-phase1-complete.md`
- **CLAUDE.md**: Updated with serviceLocation documentation
- **Schema File**: `src/sanity/schemaTypes/documents/serviceLocation.ts`
- **GROQ Queries**: `src/sanity/queries.ts` (lines 370-527)
- **SEO Builder**: `src/lib/seo.ts` (`buildSeoForServiceLocation` function)
- **JSON-LD Builder**: `src/lib/jsonld.ts` (`buildServiceLocationJsonLd` function)

---

## 🎉 Success Criteria

Migration is complete when:

- ✅ Schema deployed to all sites/datasets
- ✅ Studio shows Service + Location Pages section
- ✅ Can create and publish serviceLocation documents
- ✅ High-priority pages migrated (top 20%)
- ✅ SEO metadata validates correctly
- ✅ JSON-LD schemas present and valid
- ✅ Sitemap includes serviceLocation URLs
- ✅ All tests pass
- ✅ Zero URL breakage
- ✅ Analytics show stable/improved metrics

---

**Questions or Issues?**

Create an issue in the repository or contact the development team.

**Migration Support**: Available for complex multi-site migrations.
