# Phase 0 – Foundational Cleanup Checklist

Track every deliverable from the PRD while executing Phase 0. Check items off only once the implementation and verification steps are complete.

## Tasks & Steps
- [ ] Audit remaining hardcoded content across React components and pages; relocate copy/URLs into CMS documents or global settings.
- [ ] Introduce global string resources for UI labels such as “View details →”, “Popular locations”, and all error/CTA copy.
- [ ] Ensure all telephone/email uses flow through CMS settings with formatting handled via helper utilities.
- [ ] Replace residual string-based `href` usage with the canonical `link` object (cards, menus, breadcrumbs, structured data).
- [ ] Add schema validation preventing publication without valid link targets.
- [ ] Install and configure Sanity type generation (`@sanity-codegen` or similar), removing `src/types/sanity.ts` in favour of generated imports.
- [ ] Update CI or project scripting so schema changes require regenerated types (`pnpm sanitize:types` or equivalent).
- [ ] Delete unused components (e.g., legacy `layout/Hero`) and ensure exports are re-homed into barrel files.
- [ ] Enforce strict ESLint + Prettier settings; ensure CI blocks on warnings.

## Acceptance Criteria
- [ ] No hard-coded copy or URLs remain in `src` other than design tokens or fallbacks explicitly allowed.
- [ ] Code compilation relies on generated Sanity types; manual type file removed.
- [ ] ESLint and Prettier run cleanly; missing link data raises author-facing errors in Sanity Studio.
