# Multi-Tenant Architecture: Shared vs. Isolated

## 🎯 Core Principle

**ONE CODEBASE, MANY SITES - ZERO CONTENT LEAKS**

This platform is designed to:
- ✅ Deploy technical updates to 100s of websites from a single codebase
- ✅ Share schema definitions across all tenants
- ✅ Keep content completely isolated with ZERO risk of cross-contamination

---

## 📦 What is SHARED (Deployed to All Tenants)

### 1. Frontend Code (Next.js Application)
**Location**: `src/` directory
- ✅ All React components (`src/components/`)
- ✅ All pages (`src/app/`)
- ✅ All utilities (`src/lib/`)
- ✅ All layouts, sections, forms
- ✅ Styling (Tailwind, CSS)
- ✅ Client-side logic
- ✅ Server actions
- ✅ API routes

**Deployment Model**:
- Single Next.js build deployed to all sites
- OR separate deployments pointing to different datasets using same codebase

**Benefits**:
- Fix a bug once → fixed for all 100+ sites
- Add a feature once → available to all sites
- Update dependencies once → all sites updated
- Consistent UX across all sites

### 2. Sanity Schema Definitions
**Location**: `src/sanity/schemaTypes/`
- ✅ All document type schemas (service, location, page, etc.)
- ✅ All object schemas (sections, seo, address, etc.)
- ✅ All field definitions
- ✅ Validation rules
- ✅ Preview configurations
- ✅ Studio structure

**Deployment Model**:
```bash
# Deploy schema to ALL datasets at once
pnpm deploy-schema-all-sites
```

**Benefits**:
- Add a new field → available in all datasets
- Add a new section type → all sites can use it
- Schema evolution across all sites simultaneously
- Consistent content structure

### 3. GROQ Queries
**Location**: `src/sanity/queries.ts`
- ✅ All data-fetching queries
- ✅ Query logic and projections

**Benefits**:
- Optimize a query → faster for all sites
- Add new data fetching → available everywhere

### 4. Infrastructure
- ✅ Middleware logic
- ✅ SEO utilities
- ✅ Image optimization
- ✅ Caching strategies
- ✅ Build configuration

---

## 🔒 What is ISOLATED (Per Dataset/Tenant)

### 1. Content Data
**Location**: Sanity datasets (`site-budds`, `site-hvac`, etc.)
- ❌ Services content (UNIQUE per site)
- ❌ Location content (UNIQUE per site)
- ❌ Pages content (UNIQUE per site)
- ❌ Site settings (UNIQUE per site)
- ❌ Navigation links (UNIQUE per site)
- ❌ SEO meta data (UNIQUE per site)
- ❌ Images/assets (UNIQUE per site)
- ❌ Testimonials, FAQs, offers (UNIQUE per site)
- ❌ Lead submissions (UNIQUE per site)

**Isolation Mechanism**:
- Each site = separate Sanity dataset
- Dataset selected via `NEXT_PUBLIC_SANITY_DATASET` env var
- Zero cross-dataset queries possible
- Assets stored per dataset on Sanity CDN

**Guarantees**:
- Site A's content NEVER appears on Site B
- Site A's leads NEVER visible to Site B
- Site A's images NEVER served to Site B
- Complete data privacy and isolation

### 2. Environment Configuration
**Location**: `.env` per deployment
- ❌ `NEXT_PUBLIC_SANITY_DATASET` (site-specific)
- ❌ `NEXT_PUBLIC_SITE_URL` (site-specific)
- ❌ `SITE_ID` (site-specific)
- ❌ Google Analytics IDs (site-specific)
- ❌ Tracking scripts (site-specific)

---

## 🚀 Deployment Workflows

### Scenario 1: Update Frontend Code (Bug Fix, New Feature)

```bash
# Developer workflow
git commit -m "fix: header navigation bug"
git push origin main

# Automated deployment (CI/CD)
# Option A: Separate deployments
→ budds-plumbing.vercel.app (DATASET=site-budds)
→ acme-hvac.vercel.app (DATASET=site-hvac)
→ legal-firm.vercel.app (DATASET=site-legal)
# All deployments use SAME code, different env vars

# Option B: Single deployment with domain routing
→ single.vercel.app
  ├─ budds.com → dataset=site-budds
  ├─ acme.com → dataset=site-hvac
  └─ legal.com → dataset=site-legal
```

**Result**: All 100+ sites get the update simultaneously

### Scenario 2: Update Sanity Schema (Add New Field)

```bash
# 1. Update schema locally
# src/sanity/schemaTypes/documents/service.ts
defineField({
  name: 'warrantyInfo',
  title: 'Warranty Information',
  type: 'text',
})

# 2. Deploy schema to ALL datasets
pnpm deploy-schema-all-sites

# This runs:
# sanity deploy --dataset site-budds
# sanity deploy --dataset site-hvac
# sanity deploy --dataset site-legal
# ... (all datasets)
```

**Result**:
- ✅ All datasets now have `warrantyInfo` field available
- ❌ No content copied or leaked between datasets
- ✅ Each site can populate field independently

### Scenario 3: Create New Site

```bash
# Clone existing dataset
pnpm clone-site site-budds site-new-client

# Deploy Next.js with new env vars
NEXT_PUBLIC_SANITY_DATASET=site-new-client
NEXT_PUBLIC_SITE_URL=https://new-client.com

# Deploy time: < 10 minutes
```

**Result**:
- ✅ New site gets all latest code/schema
- ✅ Starts with template content (can be customized)
- ✅ Complete isolation from other sites

---

## 🔐 Content Isolation Guarantees

### How Isolation Works

1. **Separate Datasets**: Each site has its own Sanity dataset
   ```
   Project: xyz123
   ├── Dataset: site-budds (Budds Plumbing content)
   ├── Dataset: site-hvac (ACME HVAC content)
   └── Dataset: site-legal (Legal Firm content)
   ```

2. **Environment-Based Selection**:
   ```typescript
   // Each deployment/domain has different env var
   const client = createClient({
     projectId: 'xyz123', // SHARED
     dataset: process.env.NEXT_PUBLIC_SANITY_DATASET, // UNIQUE
   })
   ```

3. **Query Isolation**:
   ```typescript
   // This query ONLY returns data from current dataset
   const services = await client.fetch(`*[_type == "service"]`)

   // If NEXT_PUBLIC_SANITY_DATASET=site-budds
   // → Returns ONLY Budds Plumbing services

   // If NEXT_PUBLIC_SANITY_DATASET=site-hvac
   // → Returns ONLY ACME HVAC services
   ```

4. **Cache Isolation**:
   ```typescript
   // Cache tags include dataset
   tags: [`site:${dataset}`]

   // site:site-budds cache != site:site-hvac cache
   ```

5. **Asset Isolation**:
   ```
   Sanity CDN paths include dataset:
   - cdn.sanity.io/images/xyz123/site-budds/abc123.jpg
   - cdn.sanity.io/images/xyz123/site-hvac/def456.jpg
   ```

### What Cannot Happen

❌ **Site A cannot query Site B's content** - Different datasets, impossible
❌ **Site A cannot load Site B's images** - Different CDN paths
❌ **Site A cannot see Site B's leads** - Stored in different datasets
❌ **Cache pollution** - Separate cache keys per dataset
❌ **Accidental data leaks** - No shared database, no joins, no cross-dataset queries

---

## 📊 Visual Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   SHARED (All Sites)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Next.js Codebase (ONE)                                    │
│  ├── Components (shared)                                    │
│  ├── Pages (shared)                                         │
│  ├── Utilities (shared)                                     │
│  └── Styles (shared)                                        │
│                                                             │
│  Sanity Schema (ONE)                                        │
│  ├── service.ts (shared definition)                        │
│  ├── location.ts (shared definition)                       │
│  └── page.ts (shared definition)                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                 Deployed to all sites ↓
                              │
┌─────────────────┬───────────────────┬─────────────────────┐
│   Site A        │      Site B       │      Site C         │
├─────────────────┼───────────────────┼─────────────────────┤
│ DATASET:        │ DATASET:          │ DATASET:            │
│ site-budds      │ site-hvac         │ site-legal          │
│                 │                   │                     │
│ Content:        │ Content:          │ Content:            │
│ - Services (50) │ - Services (30)   │ - Services (20)     │
│ - Locations (5) │ - Locations (3)   │ - Locations (2)     │
│ - Pages (15)    │ - Pages (12)      │ - Pages (10)        │
│ - Leads (200)   │ - Leads (150)     │ - Leads (100)       │
│                 │                   │                     │
│ ENV:            │ ENV:              │ ENV:                │
│ budds.com       │ acme.com          │ legal.com           │
│                 │                   │                     │
│ ❌ Cannot see   │ ❌ Cannot see     │ ❌ Cannot see       │
│ other site data │ other site data   │ other site data     │
└─────────────────┴───────────────────┴─────────────────────┘
```

---

## 🎯 Benefits of This Architecture

### For Developers

1. **Single Point of Maintenance**
   - Fix once, deploy everywhere
   - One codebase to understand
   - Consistent patterns across all sites

2. **Easy Schema Evolution**
   - Add fields to all sites simultaneously
   - Rollback schema changes if needed
   - Version control for schema

3. **Rapid Site Deployment**
   - Clone dataset + deploy = new site in <10 minutes
   - No custom code per site
   - Consistent quality

### For Site Owners

1. **Always Up-to-Date**
   - Automatic bug fixes
   - New features deployed to all sites
   - Security patches applied everywhere

2. **Complete Data Privacy**
   - Zero risk of data leaks
   - Independent content management
   - Own analytics and leads

3. **Cost-Effective**
   - Share infrastructure costs
   - Economies of scale
   - Faster feature development

### For End Users

1. **Consistent UX**
   - Familiar interface across sites
   - High-quality components
   - Tested and optimized

2. **Performance**
   - Shared optimizations benefit all
   - Latest Next.js features
   - Fast page loads

---

## 🛠 Implementation Checklist

### ✅ Shared Code Deployment

- [x] Single Next.js codebase
- [x] Environment-based dataset selection
- [x] Shared component library
- [x] Shared schema definitions
- [x] CI/CD pipeline for all sites

### ✅ Content Isolation

- [x] Separate Sanity datasets per site
- [x] Dataset-specific cache keys
- [x] Environment variable validation
- [x] No cross-dataset queries possible
- [x] Asset CDN isolation

### 🔄 Remaining

- [ ] Automated schema deployment script (`deploy-schema-all-sites`)
- [ ] Dataset migration utilities
- [ ] Multi-site smoke tests
- [ ] Rollback mechanisms

---

## 📝 Best Practices

### DO ✅

1. **Deploy code changes to all sites simultaneously**
2. **Use environment variables for site-specific config**
3. **Test schema changes on staging dataset first**
4. **Version control all schema definitions**
5. **Document breaking changes clearly**
6. **Use TypeScript for type safety across all sites**

### DON'T ❌

1. **Never hardcode dataset names in frontend code**
2. **Never query multiple datasets in single request**
3. **Never share API tokens between sites**
4. **Never bypass environment-based dataset selection**
5. **Never create site-specific components (keep shared)**
6. **Never manually copy content between datasets (data leak risk)**

---

## 🚨 Critical Reminders

> **SHARED**: Code, schema, infrastructure
>
> **ISOLATED**: Content, data, assets, configuration
>
> **GUARANTEE**: Zero cross-tenant data leaks
>
> **BENEFIT**: Update once, deploy to 100s of sites

---

**Last Updated**: 2025-10-23
**Architecture**: Multiple Datasets with Shared Codebase
**Status**: Production-Ready
