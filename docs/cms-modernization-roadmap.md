# CMS Modernization & Scaling PRD

This Product Requirements Document describes the work needed to evolve the project into a best-in-class, fully CMS-controlled, SEO-first platform capable of competing with leading enterprise CMS offerings. The plan is organized into phased PRD sections. Each section lists goals, deliverables, implementation details, acceptance criteria, and risks. Follow each phase in order—nothing here is optional if we want parity with the biggest players.

---

## Phase 0 – Foundational Cleanup

### Objectives
- Remove legacy/baked-in UI copy, hard-coded URLs, or defaults still living in the React layer.
- Align the content model with the current frontend features.
- Establish quality gates (lint, type generation, tests) so regressions are caught early.

### Tasks & Steps
1. **Audit Remaining Hardcoded Content**
   - Use `rg "text-zinc"` etc. to find strings and move them into Sanity documents or global settings.
   - Introduce global string resources for “View details →”, “Popular locations”, error copy, etc.
   - Ensure all telephone/email values originate from CMS settings (no interpolation of `site.phone` in code without formatting logic handled via helper).

2. **Enforce Link Usage**
   - Replace any residual `href`/string links with the `link` object across cards, menus, breadcrumbs, and structured data payloads.
   - Add schema validation to prevent publishing without a resolved target.

3. **Type Safety**
   - Install `@sanity-codegen` (or similar) to auto-generate TS types. Remove `src/types/sanity.ts`; import generated types instead.
   - Fail CI if schema changes are not accompanied by regenerated types (`pnpm sanitize:types`).

4. **Code Base Hygiene**
   - Delete unused components (e.g., old `layout/Hero`).
   - Ensure every exported component lives in barrel files for discoverability (`src/components/index.ts`).
   - Enforce strict ESLint + Prettier; add CI job that blocks on warnings.

### Acceptance
- No hard-coded copy/URLs in `src` except design tokens/fallbacks.
- Code compilation uses generated Sanity types; manual type file removed.
- ESLint/Prettier run cleanly; missing link data produces author-facing errors in Studio.

---

## Phase 1 – CMS-Driven Layouts & Frontend Controls

### Objectives
- Create predefined layout templates for every core page (home, services index, service detail, locations index, location detail, offers index, offer detail, blog list, blog article, generic page) so new pages always start with a curated structure instead of a blank canvas.
- Empower editors to control layout, theming, and component variants without developer intervention.
- Provide structure for repeatable design (grid, spacing, typography).

### Tasks & Steps
1. **Design Tokens v2**
   - Extend `tokens` singleton: add spacing scale, typography scale, shadow presets, border radius options, button styles.
   - Generate CSS variables server-side (in `RootLayout`) from tokens; remove Tailwind classes that encode fixed values.
   - Update components to consume new tokens (e.g., CTA variants derive from token definitions).

2. **Section Registry Expansion**
   - Add new sections:  
     - `section.timeline`, `section.pricingTable`, `section.gallery`, `section.quote`, `section.blogList`.
   - Each section has: heading, eyebrow, body, layout options (grid/list/carousel), theming (background, text colors from tokens), CTAs.
   - Register them in `SectionRenderer` + schema.

3. **Composable Layout Blocks**
   - Introduce `section.layout` authoring: ability to stack blocks with optional spacing, container width, background overrides.
   - Add “global scripts” (e.g., chat widgets) toggled per page via CMS.

4. **Predefined Page Templates**
   - Create Sanity “page layout” documents for each page type listed above. Each template includes an ordered list of recommended sections (hero, breadcrumbs, intro, cards, testimonials, FAQ, CTA, etc.) and base copy fields.
   - Implement Studio action/button “Create from template” that clones the selected predefined layout into a new page.
   - Ensure every template includes breadcrumb configuration except the homepage (breadcrumbs should render automatically above the hero for all non-home pages).
   - Ensure service/location detail pages include optional components (e.g., related services, related locations) that can be toggled on/off per instance.

5. **Breadcrumb System**
   - Build a breadcrumb component that reads navigation hierarchy and page relationships from CMS.
   - Add breadcrumb configuration to the schema (manual overrides + automatic generation).
   - Render breadcrumbs above the hero on all pages except the homepage (update relevant page templates accordingly).

6. **UI State Controls**
   - Add fields for animation/entrance effects per section (enum: fade, slide, none).
   - Offer toggles for mobile/desktop visibility.

7. **Preview & Versioning**
   - Implement Sanity draft previews using Next.js draft mode for pages/services/locations.
   - Provide a “visual diff” field using Vision/Structure builder so editors can compare draft vs. published.

### Acceptance
- Author can create a page from scratch using only CMS controls; no developer change required.
- Changing tokens immediately updates the live frontend (after redeploy).
- Preview shows draft content with full layout parity.
- All non-home pages render breadcrumbs correctly above the hero; editors can override breadcrumb labels per page.
- Templates exist for each page type and include sensible default sections.

---

## Phase 2 – Advanced SEO & Structured Data

### Objectives
- Hit every modern SEO requirement: canonical management, robots control, structured data coverage, performance hints.
- Automate SEO guardrails (validation, reporting).

### Tasks & Steps
1. **SEO Schema Overhaul**
   - Update `seo` object to include: canonical URL, meta robots, OG/Twitter toggles, JSON-LD selection, custom head scripts, social image overrides, fallback description source ordering.
   - Introduce page-level `hreflang` support (list of language/locale pairs).

2. **Structured Data Library**
   - Expose multiple JSON-LD templates in CMS (e.g., FAQ, Offer, LocalBusiness, Service, Product). Each section can toggle inclusion.
   - Add backend builder that assembles JSON-LDs per page respecting toggles and validation (missing fields produce warnings).

3. **URL / Routing Controls**
   - Add redirect manager with path validation (no duplicates, loops). Provide bulk import/export.
   - Support alternate slug patterns (e.g., `/category/service`) via CMS-managed routing rules.

4. **Technical SEO**
   - Implement `robots.txt` editor with environment defaults (production vs. staging).
   - Add image optimisation metadata (width/height, priority, loading hints) sourced from CMS.
   - Provide field for `rel="prev"/"next"` for paginated content.

5. **SEO QA Automation**
   - Add Playwright/Cypress job that crawls key pages verifying meta tags, canonical correctness, hreflang, JSON-LD validity (using `structured-data-testing-tool` library).
   - Fail CI if SEO checks regress.

### Acceptance
- Every page’s head tags can be edited in CMS; canonical/robots/hreflang are accurate.
- Structured data probes pass (Rich Results Test for applicable sections).
- Automated SEO QA runs on each deploy.

---

## Phase 3 – Dynamic Content & Multi-Site

### Objectives
- Support multiple brands/locales from a single code base.
- Provide personalized content blocks and scheduling.

### Tasks & Steps
1. **Multi-Site Architecture**
   - Extend schema with `siteConfig` documents keyed by domain/subdomain.
   - Update loaders to fetch by `siteId` (derive from request host).
   - Add `SiteContext` provider in frontend to switch theme/navigation/SEO data per site.

2. **Localization & Internationalisation**
   - Implement Sanity i18n plugin for translatable content fields.
   - Provide locale-specific routes (`/[locale]/...`) with language switcher component.
   - Ensure SEO metadata/hreflang sync with locales.

3. **Personalisation Hooks**
   - Add `audience` fields on sections (enum: default, residential, commercial, custom tags).
   - Frontend reads audience info from query/cookie to conditionally render blocks.

4. **Scheduling & Workflows**
   - Enable Sanity Scheduling for pages/offers (with timezone handling).
   - Provide UI cues on frontend (e.g., staging preview showing upcoming sections).

### Acceptance
- System can host multiple brands/domains by data only; design/theme/custom copy drawn from CMS config.
- Localization workflows (translation, locale fallback) tested end-to-end.
- Sections can target audiences and schedule visibility without code changes.

---

## Phase 4 – Developer Experience & Reliability

### Objectives
- Ensure the platform is maintainable, testable, and resilient under load.

### Tasks & Steps
1. **Type-Driven Rendering**
   - Adopt Zod (or TS types) to validate loader outputs at runtime; fail gracefully with CMS author feedback.
   - Create `SectionMap` typed registry so new sections require less wiring.

2. **Testing Strategy**
   - Unit tests for all helper libs (SEO, links, formatting).
   - Component tests for each section with snapshot coverage.
   - E2E flows: navigation, lead capture submission (with mocked Sanity write client), sitemap generation.

3. **Performance Hardening**
   - Enable Next.js image optimization with remote loader (using Sanity CDN).
   - Implement caching strategies (ISR + on-demand revalidation via Sanity webhooks).
   - Add Web Vitals monitoring (e.g., Vercel Analytics or custom).

4. **Migration Tooling**
   - Provide scripts for schema migrations (e.g., `pnpm migrate:schema`).
   - Document change management: how to introduce new sections without breaking content (draft migrations, fallback renderers).

5. **Author Experience**
   - Build Studio dashboards: SEO health status, broken links, upcoming scheduled content.
   - Add live preview inside Studio with `@sanity/preview-kit`.

### Acceptance
- All tests (unit, component, e2e) pass; coverage thresholds met.
- Deployment pipeline runs lint/types/test/SEO suite.
- Page builds remain stable under data changes; no runtime “null” errors due to missing CMS content.

---

## Phase 5 – Feature Parity With Enterprise CMS

### Objectives
- Deliver advanced capabilities expected from top-tier platforms.

### Tasks & Steps
1. **Composable Content APIs**
   - Expose GraphQL/REST endpoints for headless consumers; document versioned API.
   - Provide query fragments so third parties can reuse the content model.

2. **Workflow & Permissions**
   - Set up Sanity roles: authors, editors, approvers. Restrict critical settings (tokens, SEO) to admins.
   - Implement content workflows (draft → review → approve) using `@sanity/workspace`.

3. **Marketplace Integrations**
   - Integrate with marketing tools: HubSpot/Marketo forms, chat widgets, review feeds.
   - Allow embedding of third-party scripts via CMS with sanitization/consent toggles.

4. **Analytics & A/B Testing**
   - Provide CMS fields to inject analytics scripts (Google Tag, GA4, Meta Pixel).
   - Add experiment toggles per section to support A/B variants; store variant metrics.

5. **Migration & Import/Export**
   - Build CLI to import/export site configurations, pages, and sections (JSON/YAML).
   - Document blueprints for rapid new-site setup (seed data, template pages, sample sections).

### Acceptance
- Platform supports advanced author workflows, integrations, and multi-channel consumption.
- New client onboarding can be done via documented import templates without writing code.
- Feature set matches or exceeds leading CMS capabilities (Contentful, Prismic, Webflow Enterprise).

---

## Implementation Notes
- **Version Control:** treat each milestone as a feature branch; ensure migrations are committed alongside schema changes.
- **Communication:** keep changelog updates for Studio editors; provide training after each major UX shift.
- **Rollout Strategy:** for high-risk changes (schema updates) ship preview environment + gating toggles before production rollouts.

---

## Final Deliverable Checklist
- [ ] Schema fully controls layout, styling, copy, links, SEO, and structured data.
- [ ] Frontend has zero hard-coded business copy; automation catches missing CMS data.
- [ ] CI/CD pipeline enforces linting, type generation, tests, SEO audits.
- [ ] Studio provides robust authoring UX with preview, scheduling, and workflow support.
- [ ] Multi-site/localisation/personalisation ready for enterprise customers.
- [ ] Documentation kept current (author handbook, developer onboarding, migration guides).

Achieving the above will position this CMS as a credible competitor to major platforms, with flexibility, SEO rigor, and developer experience that scales.
