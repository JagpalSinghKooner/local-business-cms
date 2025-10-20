# Content Authoring Guide

This project is fully driven by Sanity. Every route is powered by data, so editors can launch a new business site without touching code. Use the guidance below when populating the CMS.

## Global configuration

- **Site Settings**: Set brand colours, fonts, contact info, schema type, default SEO, and tracking IDs. This document is a singleton and must stay published.
- **Navigation**: Manage header/utility/footer links. Services and locations appear automatically in the mega menu; you can still add manual links.
- **Brand Tokens**: Optional design tokens (e.g., border radius) that can be referenced by the frontend.
- **Lead Inbox**: Lead submissions (via the inline contact form) land in the `Lead` collection. Add internal notes and update the status column to track follow-up.

## Pages and sections

Pages now use the `sections` array to build layouts. Available blocks:

- **Hero Section** – headline, media, CTA buttons; choose split/center/background layouts.
- **Text Block** – rich text with optional eyebrow and alignment.
- **Services Grid** – auto-populate all services, filter by category, or hand-pick specific services.
- **Service Pages** – include a "Teaser" rich text summary, hero image, and optional modular sections (Feature Grid, Steps, Stats, Logo Wall, etc.) to build the body without relying on the legacy body field.
- **Feature Grid** – highlight differentiators with icon/emoji, rich text, and optional inline links.
- **Process Steps** – outline your workflow step-by-step with rich text support.
- **Stats Banner** – surface KPIs/metrics with large numeric callouts.
- **Logo Wall** – showcase partner, accreditation, or client logos.
- **Locations Grid** – showcase all or selected locations.
- **Testimonials** – choose testimonials and grid or carousel layout.
- **FAQ Section** – reference FAQ documents and display in accordion or columns.
- **Offers & Coupons** – auto show all offers or curate a subset.
- **CTA Banner** – branded call-to-action with up to two buttons.
- **Contact / Lead Capture** – use the built-in form, embed HTML, or link to an external booking flow.

Create a page with slug `home` to control the homepage. Any other slug (e.g., `about`, `pricing`) will be served automatically via `/[...slug]`.

## Core content types

- **Services**: Title, slug, excerpt, hero image, rich body, optional category, related locations, and dedicated SEO fields.
  - Use the **Teaser** rich-text field to control card copy (supports inline links for interlinking).
  - **Tip:** Categories are required. Create categories first so services can be grouped for navigation and mega menus.
- **Locations**: City slug, intro copy (portable text), gallery, geo coordinates, popular services, SEO.
- **Offers**: Title, summary, validity range, body, SEO.
- **Testimonials**, **FAQs**, **Case Studies**, **Posts**, **Redirects**: managed via their respective collections.

## Promotions & offers

- Create offers in Sanity and they will appear on `/offers`. Reference them inside page sections to highlight specific promotions.

## Combined service + location pages

The route `/[service]-[city]` is generated automatically. Ensure each location has a slug (e.g., `cape-may-nj`) and each service has a slug. The page builder splits the slug on the location suffix.

## Tracking & analytics

- Add Google Tag Manager, Google Analytics, or Meta Pixel IDs in Site Settings.
- Extra snippets can be pasted into the **Additional Tracking Scripts** array (choose `head` or `body`).
- To enable lead capture, set `SANITY_API_WRITE_TOKEN` in the runtime environment (a Sanity token with write access). Without this token the inline form displays a friendly “disabled” notice.

## Deployment checklist

1. Populate Site Settings, Navigation, Tokens.
2. Create homepage (`home`), services, and locations.
3. Add offers/testimonials/FAQs as needed.
4. Create at least one test lead in Studio to confirm desk filters.
5. Verify `/studio` and `/` render correctly.
5. Update `.env` with the new project ID, dataset, and tokens before deployment.

Refer to `docs/sanity-migration.md` for exporting/importing datasets between Sanity projects.
