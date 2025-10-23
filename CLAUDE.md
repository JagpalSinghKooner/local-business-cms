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
pnpm dev              # Start Next.js dev server (http://localhost:3000)
pnpm build            # Production build
pnpm start            # Run production build locally
pnpm lint             # Run ESLint
```

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
  - Service + Location: `/services/plumbing-toronto`
  - The route auto-detects combinations by checking if slug ends with a location slug
- `/locations/[city]` - Individual location pages
- `/[...slug]` - Catch-all for generic CMS pages
- `/studio` - Sanity Studio interface

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

## Common Gotchas

1. **Type generation**: Always run `pnpm sanitize:types` after schema changes
2. **Image URLs**: Use Sanity CDN URLs, configured in `next.config.ts`
3. **Trailing slashes**: Middleware removes them for SEO consistency
4. **Section keys**: Every section needs unique `_key` for React rendering
5. **GROQ syntax**: Brackets `[]` are for arrays, braces `{}` for object projection
6. **Path aliases**: Use `@/` prefix for imports from `src/` directory
7. **Header is client component**: Uses `'use client'` for mobile menu state management
