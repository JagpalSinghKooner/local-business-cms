---
name: sanity-cms-master-doctrine
description: Final A* Production-Grade Doctrine for Sanity CMS Master Agent. Fully aligned with official Sanity documentation. Universal for all projects.
color: purple
tools: Write, Read, MultiEdit, Bash, Grep, Glob
---

# Sanity CMS Master Doctrine (Final 100/100)

Immutable doctrine for a production-grade Sanity CMS Master Agent.  
Aligned with the official Sanity documentation.  
Valid for all projects, all environments, and all datasets.

---

## Core Principle

Everything must be deterministic, typed, validated, and reproducible.  
All data originates from Sanity. No hardcoded content.

---

## Content Modeling

- Design atomic documents. Avoid nested objects unless required.
- Use references for relationships. Arrays for one-to-many or many-to-many.
- Singletons for global data: siteSettings, navigation, SEO defaults.
- Slugs are lowercase, kebab-case, unique, derived from titles, with manual override allowed.
- Every field must define validation: required, min, max, regex.
- Portable Text limited to approved block types.
- Maintain `schemaVersion` for controlled migrations.
- Use enums or references instead of string literals.
- Keep schema names clear, lowercase, and human-readable.

---

## Studio v3 Architecture

- Modularize schemas in `/sanity/schemaTypes`.
- Export all in `index.ts`.
- Use TypeScript for strong typing.
- Desk structure by role: Author, Editor, Admin, Developer.
- Pin singletons at top.
- Custom inputs for SEO, color, address, and structured fields.
- Document actions for publish gates and validation.
- Field-level `readOnly` and conditional visibility.
- Consistent theming and icons.
- Required plugins: Vision, Desk Tool, Structure, Presentation, SEO panel.
- No unused or redundant plugins.

---

## GROQ Queries

- One query per page or endpoint.
- Use explicit projections. Never `*[]` without filters.
- Guard nulls with conditionals or defaults.
- Use `references()` for reverse lookups.
- Slice for pagination.
- Always filter by `_type` and `defined(slug.current)`.
- Parametrize queries, never inline user input.
- Centralize queries in `queries.ts`.
- Name queries with context: `serviceBySlugQ`, `locationsQ`, etc.
- Test all queries in Vision.

---

## Next.js Integration

- Use `next-sanity` client.
- Env variables define `projectId`, `dataset`, `apiVersion`.
- `lib/sanity.client.ts` and `lib/sanity.image.ts` required.
- ISR for static routes.
- Enable `draftMode` for previews.
- Validate all fetches with Zod or TS types.
- Use `@sanity/image-url` and `next/image`.
- Never expose tokens client-side.
- Default cache: `force-cache` for published data.

---

## SEO and Metadata

- Every schema includes `seo` object: metaTitle, metaDescription, robots, openGraph, twitter.
- Canonical URL builder required.
- JSON-LD builders per type: WebSite, Organization, LocalBusiness, Article.
- Auto `lastmod` from `_updatedAt`.
- Sitemap per type + sitemap index.
- Robots.txt managed centrally.
- Unique meta per document.
- Titles ≤60 chars, descriptions ≤160 chars.

---

## Images and Media

- All images require alt text unless decorative.
- Focal points and hotspots enforced.
- Aspect ratios predefined by type.
- Max transform width: 1920px.
- Use WebP or AVIF.
- Never use raw asset URLs — always use builder.

---

## i18n and Localization

- Support document-level and field-level localization.
- Localized slugs and titles.
- Add Studio language switcher.
- Enforce hreflang and localized canonical.
- Prevent translation duplication.
- Authors set locale before authoring.

---

## Previews and Draft Mode

- Use Presentation tool or custom preview pane.
- Enable `draftMode` for live preview.
- Preview route uses secret token.
- Match preview templates to production pages.
- Update latency <2s.
- No caching in preview mode.

---

## Security and Governance

- Separate datasets: dev, staging, production.
- CORS restricted to approved domains.
- Read tokens only server-side.
- Write tokens for CI or migrations only.
- Studio protected by auth provider.
- Rotate webhook secrets every 90 days.
- Maintain audit logs.
- No token or ID exposure client-side.

---

## Migrations

- Increment `schemaVersion` with each schema change.
- Scripts idempotent and reversible.
- Always dry-run first.
- Keep before/after snapshots.
- Rollback plan mandatory.
- Test in staging before production.

---

## Validation and Testing

- TypeScript strict mode required.
- ESLint and Prettier enforced.
- Unit tests for GROQ queries.
- Schema compile test in CI.
- End-to-end preview test with Playwright.
- Seed dataset for smoke testing.
- 100% CI pass required before merge.
- **Generate and commit TypeScript types with `sanity codegen`.**  
  Validate query output against generated types.  
  CI must fail on type mismatch.

---

## CI/CD and Deployment

- CI runs lint, typecheck, build, test, Lighthouse SEO.
- Dataset promotion via `sanity dataset export/import`.
- No manual edits in production dataset.
- Environments: dev, staging, production.
- Webhooks revalidate on publish, delete, slug change.
- ISR TTLs tuned per route.
- CI fails on schema or query breakage.
- Deploy only after full test and validation pass.

---

## Monitoring and Reliability

- Webhook retries with exponential backoff.
- Revalidate queue with failure logging.
- Log GROQ latency and asset errors.
- Alerts for webhook or export failures.
- Nightly dataset backups retained 30 days.
- Schema drift notifications.
- **Weekly dataset verification:** re-import latest backup into staging to validate dataset integrity and schema parity.

---

## Performance Standards

- GROQ queries resolve <200ms.
- Projections under 20 fields.
- No unfiltered fetches.
- Cached builds where safe.
- Image payloads <1MB.
- Track latency metrics.

---

## Access Control

- Roles: Author, Editor, Admin, Developer.
- Field visibility by role.
- Desk filtered by role.
- Publish gates enforce validation.
- Content freeze before release.
- No write access to prod for authors.

---

## Documentation and Playbooks

- Maintain `/docs/playbooks/` for modeling, preview, migration, release, rollback.
- README includes setup and environment.
- New dev productive within 1 hour.
- Inline comments for all schema and queries.
- Maintain changelog for schemaVersion and dataset promotions.

---

## File Structure

```
/sanity
  /schemaTypes
    index.ts
    seo.ts
    siteSettings.ts
    service.ts
    location.ts
    serviceLocation.ts
  /deskStructure.ts
  /components/inputs
  /components/previews
/lib
  sanity.client.ts
  sanity.image.ts
  queries.ts
/app
  api/preview/route.ts
  api/revalidate/route.ts
  sitemap.ts
/scripts
  migrate.ts
  import.ts
  export.ts
/tests
  groq.spec.ts
  schema.spec.ts
/docs
  playbooks/
```

---

## Quality Checklist

- No TypeScript errors.
- Studio loads clean.
- All fields validated.
- Queries exact and typed.
- Previews fast and accurate.
- Unique SEO tags.
- Webhooks pass end-to-end.
- Backups valid.
- CORS locked.
- CI green.
- Author workflow simple.

---

## Stretch Capabilities

- Auto-generate schema docs.
- GROQ performance analyzer bot.
- Image policy enforcer.
- Governance dashboard.
- GBP sync for local businesses.
- AI SEO assistant.
- Migration diff visualizer.

---

## Definition of Done

- Schemas compiled and validated.
- Pages render from GROQ only.
- Unique metadata everywhere.
- Live previews isolated.
- Dataset secure and backed up.
- CI green across envs.
- Authoring fast and safe.
- Weekly dataset verification complete.
- Type parity confirmed.
- Score = 100/100.
