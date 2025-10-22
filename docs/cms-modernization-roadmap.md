### Claude Efficiency Prompt

You are assisting with a large modular **Next.js + Sanity CMS** project reused across multiple local business websites.

#### Behaviour Guidelines

- Be concise and token-efficient.
- Only reason about the files or sections mentioned.
- Do **not** restate the full roadmap or repeat unchanged code.
- When context is large, summarise instead of re-pasting.
- Always prefer referencing filenames and functions over reproducing them.
- If multiple steps are requested, return them in numbered order with minimal commentary.
- Assume prior technical context unless I explicitly say **"start fresh."**

#### When Near Session or Token Limits

- Summarise progress in bullet points (maximum 10).
- Indicate which sections are safe to drop or compress.
- Stop output instead of truncating mid-code.
- Never restart or regenerate large code blocks unless asked.

#### Output Rules

- Only output code when asked.
- Use short explanations, one sentence per section.
- Avoid repeating previous outputs or restating assumptions.
- Keep answers modular so each response fits within session limits.

---

# Production-Grade Multi-Location CMS Roadmap

## Technical Infrastructure First, UI/Content Last

## 🎯 Mission Statement

Build a **production-grade, SEO-optimized, multi-tenant CMS platform** that:

- ✅ Generates 1000+ service+location pages automatically
- ✅ Achieves perfect technical SEO (Schema.org, sitemaps, canonical URLs)
- ✅ Scales to multiple brands/businesses from single codebase
- ✅ Maintains 100% type safety (zero `any` types)
- ✅ Passes all quality gates (build, TypeScript, ESLint, tests)
- ✅ Supports any service-based business vertical (plumbing, HVAC, legal, medical, etc.)

**Core Principle**: Technical excellence → Scalability → Performance → UI Polish

---

## 📊 Implementation Progress

### Phase 0 – Error Elimination & Production Hardening

**Status**: ✅ **COMPLETE** | **Completion**: 100% (8/8 steps)

**Achievements**:

- ✅ Zero TypeScript errors (down from 90+)
- ✅ Zero ESLint errors (19 warnings in scripts/tests only)
- ✅ Production build SUCCESS (355 routes)
- ✅ Environment validation with Zod
- ✅ Error boundaries & graceful degradation
- ✅ React cache deduplication
- ✅ Quality gates (Husky, lint-staged, CI/CD)

**Files Created**: `src/lib/env.ts`, `src/types/sanity-helpers.ts`, `src/components/ErrorBoundary.tsx`, `.husky/pre-commit`, `.github/workflows/validate.yml`

---

### Phase 1 – Multi-Location SEO Infrastructure

**Status**: ✅ **COMPLETE** | **Completion**: 97% (11/12 steps)

**Achievements**:

- ✅ **336 service+location pages** auto-generated at build time
- ✅ `generateStaticParams` for all combinations
- ✅ Location schema extended with `localSEO` (county, state, zipCodes, coordinates, radius, populationSize)
- ✅ Schema.org builders: LocalBusiness, Service, BreadcrumbList
- ✅ Meta templates for auto-generated SEO metadata
- ✅ Sitemap optimized (service+location priority 0.85)
- ✅ Robots.txt blocks non-production sites

**Files Created**: `src/lib/schema-org.ts`, `src/lib/meta-templates.ts`

**Files Modified**: `src/app/services/[service]/page.tsx` (added generateStaticParams), `src/sanity/schemaTypes/documents/location.ts` (localSEO), `src/app/sitemap.ts`, `src/app/robots.txt/route.ts`

**Build Result**: 355 total routes, 336 service+location combinations

---

### Phase 2 – Type Safety & Code Quality

**Status**: ✅ **COMPLETE** | **Completion**: 100%

**Achievements**:

- ✅ Zero `any` types in section components
- ✅ 100% TypeScript coverage (strict mode)
- ✅ Type-safe props using `Extract<PageSection, { _type: 'X' }>`
- ✅ All quality gates passing (tsc, ESLint, build)

**Assessment**: Codebase already production-ready, no changes needed

---

## 🛠️ Technical Roadmap (Phases 3-7)

### Phase 3 – Performance & Core Web Vitals

**Duration**: 2-3 weeks | **Priority**: 🔴 CRITICAL

#### 3.1 Image Optimization Pipeline

- Responsive image generation (srcset, sizes)
- Priority/loading hints from CMS (`loading="eager"` for above-fold)
- WebP/AVIF support with fallbacks
- Image dimension validation (prevent CLS)
- Lazy loading by default

#### 3.2 Performance Monitoring

- Web Vitals instrumentation (LCP, FID, CLS, INP, TTFB)
- Performance budget enforcement
- Lighthouse CI in GitHub Actions
- Bundle size monitoring
- Database query optimization

#### 3.3 Advanced Redirect System

- Redirect schema: wildcard support, regex patterns
- Loop detection algorithm
- Redirect chain validation
- Bulk import/export
- Performance monitoring

**Acceptance Criteria**:

- [ ] Core Web Vitals > 90 (LCP, FID, CLS)
- [ ] Lighthouse Performance > 95
- [ ] Bundle size < 250KB first load
- [ ] Zero redirect loops
- [ ] Images have width/height attributes

---

### Phase 4 – Testing Infrastructure

**Duration**: 2-3 weeks | **Priority**: 🔴 CRITICAL

#### 4.1 SEO Testing Suite Enhancement

- Meta tag validation (all page types)
- Canonical URL correctness
- JSON-LD schema validation
- Breadcrumb structure verification
- Sitemap completeness
- Internal link audit
- Mobile-friendliness validation

#### 4.2 Integration Testing

- Service+location page generation
- Form submission workflows
- Preview mode functionality
- Redirect rules processing
- Error boundary behavior

#### 4.3 Visual Regression Testing

- Component screenshot testing
- Cross-browser compatibility
- Responsive design verification

**Acceptance Criteria**:

- [ ] 100% SEO test coverage
- [ ] All schemas pass Google Rich Results Test
- [ ] E2E tests for critical user flows
- [ ] Visual regression baseline established

---

### Phase 5 – Multi-Tenant Architecture

**Duration**: 3-4 weeks | **Priority**: 🟡 IMPORTANT

#### 5.1 Multi-Site Infrastructure

- Site configuration schema (domain, theme, settings)
- Domain-based site detection middleware
- Per-site data isolation (Sanity datasets or filters)
- Shared component library
- Environment-based site selection

#### 5.2 Data Isolation Strategy

- Multiple Sanity datasets (full isolation)
- OR single dataset with site filters (shared content)
- Cross-site content references
- Site-specific asset CDN paths
- Data migration utilities

#### 5.3 Deployment Automation

- CLI tool for bulk content import
- Site configuration export/import
- Sanity schema diff tool
- Automated smoke tests post-deployment

**Acceptance Criteria**:

- [ ] Multi-site configuration operational
- [ ] Domain-based routing working
- [ ] Data isolation prevents cross-contamination
- [ ] New site deployment < 30 minutes
- [ ] Zero cross-tenant data leaks

---

### Phase 6 – Internationalization (i18n)

**Duration**: 2-3 weeks | **Priority**: 🟢 FUTURE

#### 6.1 i18n Infrastructure

- Sanity i18n plugin integration
- Locale detection (URL, cookie, Accept-Language header)
- Type-safe translation keys with i18next
- Locale-specific routes (`/en/services`, `/fr/services`)
- RTL layout support
- Hreflang meta tag automation

#### 6.2 Translation Management

- Translation workflow in Sanity Studio
- Fallback language handling
- Locale-specific content validation
- Translation coverage reporting

**Acceptance Criteria**:

- [ ] i18n plugin integrated
- [ ] Type-safe translation system
- [ ] Hreflang tags auto-generated
- [ ] RTL layouts render correctly
- [ ] Locale switching works seamlessly

---

### Phase 7 – Enterprise Features

**Duration**: 3-4 weeks | **Priority**: 🟢 FUTURE

#### 7.1 Workflow & Permissions

- Custom workflow states (draft → review → approved → published)
- Role-based access control (RBAC) schemas
- Content scheduling with validation
- Audit log for all changes
- Approval notification system

#### 7.2 Integration Architecture

- Webhook system for external services
- API route structure for third-party callbacks
- Type-safe integration configs
- Error handling and retry logic
- Integration monitoring dashboard

**Examples**:

- CRM webhooks (HubSpot, Salesforce)
- Form submission pipelines
- Review aggregation APIs
- Analytics event streaming

#### 7.3 Analytics Infrastructure

- GA4 integration with type-safe events
- Conversion tracking framework
- Custom event schema
- Server-side event tracking
- Privacy-compliant cookie management

**Acceptance Criteria**:

- [ ] Workflow system with RBAC operational
- [ ] Webhook system working
- [ ] GA4 integration with server-side tracking
- [ ] Integration monitoring dashboard live

---

## 🎨 Phase 8 – UI/Design/Content (FINAL PHASE)

**Duration**: 2-3 weeks | **Priority**: 🟢 LOW (after all technical work)

### 8.1 Design Token System

- Extend token schema: spacing scale (4px-128px), shadows, border radii, transitions
- Generate CSS variables in RootLayout from Sanity tokens
- Token validation at runtime
- Token preview in Sanity Studio

### 8.2 Section Variants & Layouts

- Add section variants (background, padding, alignment options)
- Layout system: grid, flexbox, carousel configurations
- Section-level animation controls (fade, slide, scale)
- Nested section support

### 8.3 Component Library Polish

- Consistent design patterns across sections
- Accessibility improvements (ARIA labels, keyboard navigation)
- Animation refinements
- Responsive design enhancements

### 8.4 Content Templates

- Page templates for common use cases
- Section combinations for different verticals
- Placeholder content for rapid deployment
- Template documentation

**Acceptance Criteria**:

- [ ] Token system controls all visual styling
- [ ] Section variants enable flexible layouts
- [ ] Component library fully accessible
- [ ] Content templates reduce setup time to < 1 hour

---

## 📈 Success Metrics

### Phase 0-2 (Foundation)

- ✅ Zero production errors for 30 days
- ✅ 100% TypeScript coverage
- ✅ All quality gates passing

### Phase 3-4 (Performance & Testing)

- [ ] Lighthouse scores > 95 (all categories)
- [ ] Core Web Vitals > 90
- [ ] 100% SEO test coverage
- [ ] Zero visual regression failures

### Phase 5-7 (Scale & Enterprise)

- [ ] 5+ brands on single platform
- [ ] New site deployment < 30 minutes
- [ ] Multi-language support operational
- [ ] Enterprise integrations working

### Phase 8 (Polish)

- [ ] Page creation time < 5 minutes
- [ ] Token system controls 100% of styling
- [ ] Content templates deployed

---

## 🚨 Risk Mitigation

### Technical Risks

- **Data structure changes**: Use validators, fail gracefully
- **API failures**: Cache, fallbacks, retry logic
- **Performance issues**: Monitoring, optimization, CDN

### Operational Risks

- **Schema changes**: Versioning, migration scripts, backward compatibility
- **Deployment failures**: Automated rollback, smoke tests, staging validation
- **Breaking changes**: Semantic versioning, deprecation warnings, migration guides

---

## 🎯 Implementation Guidelines

1. **Technical excellence first** - No shortcuts on infrastructure
2. **Type safety everywhere** - Catch errors at compile time
3. **Automate all validation** - Tests, linting, type checking in CI/CD
4. **Performance by default** - Every feature optimized from day one
5. **Semantic versioning** - Breaking changes require major version bump
6. **Documentation as code** - JSDoc, README, architecture diagrams
7. **UI/design last** - Only after technical foundation is bulletproof

---

## 🏆 Final Deliverable

A production-grade, enterprise-ready multi-location CMS platform:

**Technical Foundation**:

- ✅ Zero runtime errors
- ✅ 100% type safety
- ✅ Scalable architecture (1000s of pages)
- ✅ Performance optimized (Lighthouse > 95)
- ✅ Complete SEO infrastructure
- ✅ Multi-tenant ready
- ✅ Automated testing & deployment
- ✅ Enterprise integrations

**Business Value**:

- ✅ Supports any service-based business vertical
- ✅ Deploys new sites in < 30 minutes
- ✅ Generates 300-1000+ SEO-optimized pages automatically
- ✅ Scales from 1 to 100+ brands
- ✅ Zero technical debt
- ✅ Developer-friendly, editor-friendly

**This is the technical blueprint for a world-class multi-location CMS platform.**
