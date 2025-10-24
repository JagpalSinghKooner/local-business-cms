# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Local Business CMS Framework** - a headless CMS-driven website for service-based businesses built with Next.js 15 and Sanity CMS. The architecture is designed to be **fully dynamic**, where all content, design, SEO settings, and page structure are controlled through Sanity CMS with minimal code changes required to deploy new business sites.

**Key Principle**: Content editors control everything through the CMS - pages, sections, styling, metadata, navigation, etc. The Next.js frontend is a rendering engine that adapts to CMS data.

## 🎯 Multi-Tenant Architecture (CRITICAL)

**ONE CODEBASE, MANY SITES - ZERO CONTENT LEAKS**

### What is SHARED (Deployed to ALL Sites)
- ✅ **Frontend Code**: All React components, pages, utilities, styles (ONE codebase)
- ✅ **Sanity Schema**: All document types, fields, validation rules (ONE schema)
- ✅ **Infrastructure**: Middleware, SEO utils, caching, build config
- **Deploy once → Updates 100s of sites**

### What is ISOLATED (Per Dataset/Tenant)
- ❌ **Content Data**: Services, locations, pages, leads, images (UNIQUE per site)
- ❌ **Configuration**: Site URL, dataset name, tracking IDs (UNIQUE per site)
- **Guarantee**: Zero cross-tenant data leaks

### Key Commands
```bash
pnpm clone-site <source> <target>  # Create new site from template
pnpm deploy-schema-all             # Deploy schema updates to all datasets
```

**REMEMBER**: When adding features or fixing bugs, they automatically benefit ALL sites. When adding schema fields, run `pnpm deploy-schema-all` to update all datasets. See `docs/multi-tenant-shared-vs-isolated.md` for full details.

## Essential Commands

### Development
```bash
pnpm dev              # Start Next.js dev server (port 3001) + Documentation Dashboard (port 8080)
                      # Automatically opens both in browser
pnpm dev:next         # Start ONLY Next.js dev server (no dashboard)
pnpm build            # Production build
pnpm start            # Run production build locally
pnpm lint             # Run ESLint
```

**Pro Tip**: `pnpm dev` now launches both:
- **App**: http://localhost:3001 (Next.js frontend)
- **Docs Dashboard**: http://localhost:8080/docs/audit-report.html (Technical documentation portal)

### Sanity CMS
```bash
pnpm sanitize:types   # Generate TypeScript types from Sanity schema (run after schema changes)
pnpm sanity:export    # Export Sanity content
pnpm sanity:import    # Import Sanity content
```

### Multi-Tenant Operations
```bash
pnpm clone-site <source> <target>     # Clone dataset to create new site
pnpm clone-site production site-new   # Example: Create new site
pnpm deploy-schema-all                # Deploy schema to ALL datasets
pnpm deploy-schema-all --dry-run      # Preview schema deployment
```

### ServiceLocation Auto-Generation
```bash
pnpm generate:service-locations           # Generate ALL service×location combinations
pnpm generate:service-locations:dry-run   # Preview what will be created (no changes)
```
**Note**: You can also trigger generation from Sanity Studio by clicking the "Generate Service+Location Pages" button (🔄 icon) in any Service or Location document.

### Testing
```bash
pnpm test:seo              # Run all SEO tests
pnpm test:seo:basic        # Run basic SEO tests (simple config)
pnpm test:seo:ui           # Run tests in interactive UI mode
pnpm test:seo:headed       # Run tests with visible browser
pnpm test:seo:debug        # Debug mode with breakpoints
```

**Important**: Always run `pnpm sanitize:types` after modifying Sanity schema files to regenerate TypeScript types.

## Architecture Overview

### Data Flow Pattern

1. **Sanity Schema** (`src/sanity/schemaTypes/`) defines content structure
2. **GROQ Queries** (`src/sanity/queries.ts`) fetch data from Sanity
3. **Loaders** (`src/sanity/loaders.ts`) provide typed data-fetching functions with caching (120s revalidation)
4. **Page Routes** fetch data via loaders and pass to components
5. **Section Renderer** (`src/components/sections/SectionRenderer.tsx`) dynamically renders sections based on CMS data

### Key Architectural Concepts

#### 1. Section-Based Content Model
Pages are composed of **sections** (hero, features, contact, testimonials, etc.). Each section is:
- Defined as a Sanity schema in `src/sanity/schemaTypes/objects/sections/`
- Has a corresponding React component in `src/components/sections/`
- Rendered via `SectionRenderer` which maps `_type` to components

Adding a new section type requires:
1. Create schema in `src/sanity/schemaTypes/objects/sections/`
2. Add to schema index
3. Create component in `src/components/sections/`
4. Add case to `SectionRenderer.tsx`

#### 2. Dynamic Routing Structure

**Main Routes**:
- `/` - Homepage (fetches page with slug "home")
- `/services/[service]` - Individual service pages AND service+location combinations
  - Single service: `/services/plumbing`
  - **ServiceLocation (dedicated CMS document)**: `/services/plumbing-toronto`
  - **Legacy auto-generated**: `/services/plumbing-toronto` (fallback if no serviceLocation exists)
  - Priority: ServiceLocation document → Legacy auto-generation → Single service
  - The route intelligently queries for dedicated serviceLocation documents first
- `/locations/[city]` - Individual location pages
- `/[...slug]` - Catch-all for generic CMS pages
- `/studio` - Sanity Studio interface

**ServiceLocation Pages** (NEW):
ServiceLocation pages can be created in two ways:
1. **Dedicated documents** (recommended): Create a `serviceLocation` document in the CMS with custom content, sections, and SEO
2. **Auto-generated** (legacy): System auto-generates by combining service + location data

The `/services/[service]` route checks for a dedicated serviceLocation document first. If none exists, it falls back to auto-generating the page.

#### 3. Global Data Pattern
Most pages need global data (site settings, navigation, services list, locations list, design tokens). This is fetched via `getGlobalDataset()` from `src/sanity/loaders.ts` and includes:
- Site settings (business info, SEO defaults, contact info)
- Navigation (header, footer, utility links)
- Design tokens (colors, typography, spacing)
- All services and locations (for menus, cross-linking)

#### 4. SEO & Metadata Architecture

SEO is handled at multiple levels:
- **Global defaults** in Site Settings (fallback meta tags)
- **Page-level SEO** via `seo` field on documents
- **Dynamic generation** via `buildSeo()` in `src/lib/seo.ts`
- **Structured data** via `src/lib/jsonld.ts` (LocalBusiness, Service, FAQ, Offer schemas)

Each page should:
1. Fetch SEO data from CMS
2. Call `buildSeo()` to generate Next.js Metadata
3. Optionally render JSON-LD via `<JsonLd>` component

**ServiceLocation SEO** (NEW):
ServiceLocation pages use a dedicated SEO builder:
- Function: `buildSeoForServiceLocation()` in `src/lib/seo.ts`
- Auto-generates professional titles: `{service} in {city} | {site}`
- Extracts descriptions from Portable Text intro content
- Cascading image selection with 3-level fallback priority
- Full OpenGraph and Twitter Card support
- Generates 1-4 JSON-LD schemas dynamically based on page content

#### 5. Middleware & URL Management

`middleware.ts` handles:
- **Canonical host redirect** (ensures single domain)
- **Trailing slash removal** (SEO consistency)
- **CMS-managed redirects** (fetched from Sanity `redirect` documents with 5-min cache)

#### 6. Design Token System

The framework uses a **design token system** stored in Sanity:
- Colors, typography, spacing, shadows, button styles defined in CMS
- Tokens injected as CSS custom properties in layout
- Referenced in components via `var(--token-name)`
- Schema: `src/sanity/schemaTypes/tokens.ts`
- Utility: `src/lib/tokens.ts`

#### 7. ServiceLocation Pages (NEW - Production Ready)

**Purpose**: Dedicated landing pages for service+location combinations (e.g., "Plumbing in Toronto") with custom content, SEO, and structured data.

**Key Features**:
- **Scalability**: Support for 5,000+ unique landing pages
- **Custom Content**: Each page can have unique intro text and modular sections
- **Elite SEO**: Auto-generated metadata + multi-schema JSON-LD (Service, LocalBusiness, FAQ, Offer)
- **Content Inheritance**: Choose between custom sections or inherit from parent service
- **Auto-Slug Generation**: Slugs automatically combine service + location slugs

**Schema**: `src/sanity/schemaTypes/documents/serviceLocation.ts`

**Core Fields**:
- `service` (reference, required) - Parent service document
- `location` (reference, required) - Target location
- `slug` (auto-generated) - Combines `{service-slug}-{location-slug}`
- `intro` (richText) - Custom intro text (SEO-critical, first 155 chars used for meta description)
- `sections` (array) - Modular content blocks (19 section types available)
- `seo` (seoUnified) - Custom SEO overrides (title, description, OG image, canonical, robots)
- `contentSource` (enum: custom | inherit | ai) - Controls which sections render
- `displayOptions` (object) - Show/hide related locations and services
- `schemaVersion` (internal) - Schema versioning

**Content Source Logic**:
- `custom`: Renders `serviceLocation.sections` (unique content per market)
- `inherit`: Renders `service.sections` (shared content from parent service)
- `ai`: Reserved for future AI-generated content

**SEO Automation**:
- **Title**: Auto-generates as `{service.title} in {location.city} | {site.name}`
- **Description**: Extracts first 155 chars from `intro` (Portable Text → plain text)
- **Image Priority**: `serviceLocation.seo.ogImage` → `service.heroImage` → `site.defaultOgImage`
- **Canonical URL**: Custom or auto-generated as `/services/{slug}`

**JSON-LD Structured Data** (1-4 schemas per page):
1. **Service Schema** (always): Service with areaServed, provider details
2. **LocalBusiness Schema** (if coordinates): GeoCoordinates, postal address
3. **FAQPage Schema** (if FAQ section detected): Questions and answers
4. **Offer Schemas** (if offers section detected): Individual schema per offer

**Queries & Loaders**:
- `serviceLocationBySlugQ` - Main query with full sections resolution
- `serviceLocationsListQ` - Lightweight query for sitemap (1000 limit)
- `serviceLocationsByServiceQ` - Filter by service reference
- `serviceLocationsByLocationQ` - Filter by location reference
- `getServiceLocationBySlug()` - Loader for single page
- `listServiceLocations()` - Loader for sitemap generation
- `getServiceLocationsByService()` - Loader for related content
- `getServiceLocationsByLocation()` - Loader for related content

**Studio UX**:
Located under **Services** → **Service + Location Pages** in Sanity Studio.

**Preview Format**: Shows `{Service} in {Location} [Content Source]`
**Example**: "Plumbing in Toronto [Custom]"

**Orderings Available**:
- Service A→Z (default)
- Location A→Z
- Recently Created

**Sitemap Integration**:
- Priority: **0.9** (highest - custom landing pages)
- Legacy auto-generated: **0.85** (fallback)
- Change frequency: weekly
- Images: Optimized 1200x630 dimensions

**Migration Path**:
The system supports gradual migration:
1. Create serviceLocation documents for high-value markets
2. System prioritizes dedicated documents over auto-generated pages
3. Legacy combinations remain as fallbacks
4. No breaking changes to existing URLs

**Auto-Generation Workflow** (RECOMMENDED):
ServiceLocation documents are automatically generated, eliminating manual mapping:

**Option 1: From Studio (Per Service/Location)**
1. Open any Service or Location document in Studio
2. Click "Generate Service+Location Pages" button (🔄 icon in actions menu)
3. System auto-generates all combinations for that service/location
4. Shows summary: "✅ Created X new serviceLocation pages!"

**Option 2: Bulk Generation Script (All Combinations)**
```bash
# Preview what will be created (dry run)
pnpm generate:service-locations:dry-run

# Generate all service×location combinations
pnpm generate:service-locations
```

**What Gets Auto-Generated**:
- Title: `{Service} in {City}`
- Slug: `{service-slug}-{location-slug}` (auto-combined)
- References: Links to parent service and location documents
- Content Source: `inherit` (uses parent service sections by default)
- Published Date: Current timestamp

**After Auto-Generation**:
1. Navigate to Services → Service + Location Pages in Studio
2. Find the auto-generated document
3. Customize intro text (first 155 chars become meta description)
4. Switch contentSource to "custom" and add unique sections
5. Override SEO fields if needed

Result: `/services/{service}-{city}` is live immediately with inherited content, ready for customization.

**Manual Creation Workflow** (Edge Cases):
Use manual creation only for non-standard combinations:
1. Navigate to Services → Service + Location Pages in Studio
2. Click "Create" button
3. Select service and location references
4. Slug auto-generates (or customize if needed)
5. Add custom content and SEO overrides

## Important File Locations

### Core Configuration
- `next.config.ts` - Next.js config (image domains)
- `sanity.config.ts` - Sanity Studio config
- `middleware.ts` - URL canonicalization and redirects
- `tsconfig.json` - TypeScript config with `@/*` path alias

### Data Layer
- `src/sanity/queries.ts` - All GROQ queries (single source of truth)
- `src/sanity/loaders.ts` - Typed data fetching functions with caching
- `src/sanity/client.ts` - Read-only Sanity client
- `src/sanity/writeClient.ts` - Write-enabled client (for forms, API routes)

### Schema Definitions
- `src/sanity/schemaTypes/index.ts` - Schema registry
- `src/sanity/schemaTypes/documents/` - Main document types (service, location, offer, etc.)
- `src/sanity/schemaTypes/singletons/` - Singleton documents (site settings, robots.txt)
- `src/sanity/schemaTypes/objects/sections/` - Section schemas
- `src/sanity/schemaTypes/fields/` - Reusable field schemas (SEO, breadcrumbs, etc.)

### Type Definitions
- `src/types/sanity.generated.d.ts` - Auto-generated from schema (don't edit manually)
- `src/types/index.ts` - Custom type exports and utilities

### SEO & Metadata
- `src/lib/seo.ts` - `buildSeo()` function for Next.js Metadata
- `src/lib/jsonld.ts` - JSON-LD structured data builders
- `src/components/seo/JsonLd.tsx` - Component for injecting structured data
- `src/app/sitemap.ts` - Dynamic sitemap generation
- `src/app/robots.txt/route.ts` - Dynamic robots.txt from CMS

## Common Patterns & Workflows

### Adding a New Page Type

1. Create schema in `src/sanity/schemaTypes/documents/`
2. Add GROQ query to `src/sanity/queries.ts`
3. Add loader function to `src/sanity/loaders.ts`
4. Create route in `src/app/[route-name]/page.tsx`
5. Fetch data via loader in route
6. Generate metadata with `buildSeo()`
7. Render sections with `SectionRenderer`
8. Add to sitemap in `src/app/sitemap.ts`

### Modifying GROQ Queries

All queries are centralized in `src/sanity/queries.ts`. Key patterns:
- Use `groq` template literal for syntax highlighting
- Always fetch image metadata: `asset->{ url, metadata{ lqip, dimensions{ width, height } } }`
- Use `coalesce()` for fallbacks
- Reference resolution: `field->{ properties }` or `field[]->{ properties }`
- Conditional fields: `select(_type == 'foo' => field)`

### Working with Forms & Lead Capture

Lead forms use Server Actions:
1. Form component: `src/components/forms/LeadCaptureForm.tsx`
2. Server action: `src/app/actions/createLead.ts`
3. Data saved to Sanity `lead` document type
4. Form validation with Zod schemas

### Preview Mode

Live preview is implemented via `next-sanity`:
- Preview routes: `src/app/api/preview/route.ts`, `src/app/api/preview/exit/route.ts`
- Preview components: `src/components/preview/*`
- Draft mode enabled by visiting `/api/preview?slug=...`

### Script Injection & Analytics

Two systems for scripts:
1. **Global scripts** in Site Settings (GTM, GA, Meta Pixel)
2. **Per-page script overrides** via `scriptOverrides` field
3. Provider: `src/components/scripts/ScriptOverridesProvider.tsx`

## Testing Strategy

Playwright tests focus on SEO verification:
- `tests/seo/basic-seo.spec.ts` - Fundamental SEO checks
- `tests/seo/meta-tags.spec.ts` - Meta tag validation
- `tests/seo/structured-data.spec.ts` - JSON-LD validation
- `tests/seo/technical-seo.spec.ts` - Technical SEO (canonical, robots, sitemap)

## Environment Variables

Required variables (`.env.local`):
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SITE_URL=https://your-domain.com
SANITY_API_TOKEN=your_api_token  # For write operations
CANONICAL_HOST=www.buddsplumbing.com  # Optional, overrides NEXT_PUBLIC_SITE_URL
```

## Multi-Site Considerations

The framework is designed for multi-site deployment:
- Same codebase serves multiple businesses
- Different Sanity datasets per business
- Environment variables control which dataset is active
- Domain-based routing via middleware

## Caching Strategy

- **Sanity queries**: 120s ISR revalidation (`next: { revalidate: 120 }`)
- **Redirects**: 5-minute in-memory cache in middleware
- **Static pages**: Generated at build time with ISR
- **Images**: Served via Sanity CDN with automatic optimization

## Navigation System

### Desktop Mega Menu
- **Two-level navigation**: Hover "Services" → See categories → Hover category → See services in submenu
- **Categories**: Display in first dropdown with right arrow indicator (›)
- **Services submenu**: Opens to the right of hovered category
- **Locations**: Shows all locations in a 2-column grid dropdown
- Categories are auto-sorted alphabetically
- Hover to open, auto-closes on mouse leave with smart timeout management

### Mobile Navigation
- **Hamburger menu** with slide-in panel
- **Accordion-style dropdowns** for Services (grouped by category) and Locations
- Click backdrop or link to close
- Fully accessible with ARIA attributes

### Implementation
- Header: `src/components/layout/Header.tsx` (client component with state)
- Mega Menu: `src/components/layout/MegaMenu.tsx` (handles both desktop and mobile)
- Services grouped by `category` field from Sanity
- Mobile breakpoint: `md` (768px)

## Markdown File Organization

**IMPORTANT**: This repository has strict rules for where Markdown files belong to prevent file scatter and maintain organization.

**See:** `docs/MARKDOWN-FILE-GOVERNANCE.md` for complete rules.

**Quick Reference:**
- 📋 Planning/audits/PRDs → `./docs/md-files/` (with prefixes: `audit-*`, `prd-*`, `roadmap-*`, `schema-*`, etc.)
- 📖 Operational guides → `./docs/` (testing, monitoring, architecture references)
- 🤖 Agent config → `./.claude/agents/`
- ⚠️ Root level → Only `README.md` and `CLAUDE.md`

**Check compliance:**
```bash
pnpm check:md-governance  # Validates all .md file locations
```

**When creating new Markdown files:**
1. Is it planning/audit/PRD? → `./docs/md-files/[prefix]-[name].md`
2. Is it an operational guide? → `./docs/[name].md`
3. Is it agent config? → `./.claude/agents/[name].md`
4. When in doubt → `./docs/md-files/` (safest default)

## Common Gotchas

1. **Type generation**: Always run `pnpm sanitize:types` after schema changes
2. **Image URLs**: Use Sanity CDN URLs, configured in `next.config.ts`
3. **Trailing slashes**: Middleware removes them for SEO consistency
4. **Section keys**: Every section needs unique `_key` for React rendering
5. **GROQ syntax**: Brackets `[]` are for arrays, braces `{}` for object projection
6. **Path aliases**: Use `@/` prefix for imports from `src/` directory
7. **Header is client component**: Uses `'use client'` for mobile menu state management
8. **Markdown file locations**: Follow `docs/MARKDOWN-FILE-GOVERNANCE.md` rules strictly
