# Local Business Website Framework — Product Requirements Document (PRD)

## 1. Overview

A **fully dynamic local business framework** combining **Next.js (frontend)** and **Sanity CMS (backend)** to create high-performance, SEO-optimized websites for any service-based business.

The goal is to build a **reusable boilerplate** that allows launching a new business website with minimal configuration, where:
- **All content, design, and SEO settings** are controlled in Sanity CMS.
- **Next.js** automatically renders pages and metadata based on CMS data.
- **No code changes** are needed to deploy a new business or vertical.

This framework must serve multiple brands, categories, and geographies from a single core system.

---

## 2. Core Objectives

1. **CMS-Driven Frontend**
   - All frontend content, styling, and metadata come from Sanity.
   - No hardcoded values in Next.js except default fallbacks.

2. **SEO-First Architecture**
   - Technical SEO fully automated: canonical, Open Graph, JSON-LD, sitemap, robots.
   - Page-level SEO overrides editable in CMS.
   - Clean, crawlable URLs for every service and location.

3. **Reusable Framework**
   - One codebase for multiple businesses.
   - Each business configured via environment variables or CMS dataset.
   - Rebrand in minutes using CMS brand settings.

4. **Performance**
   - Core Web Vitals ≥ 90.
   - Static site generation (SSG) with ISR.
   - Optimized images, lazy loading, and structured data injection.

---

## 3. Technology Stack

| Layer | Technology | Purpose |
|-------|-------------|----------|
| Frontend | Next.js 15 (App Router) | Server Components, routing, rendering |
| CMS | Sanity v3 | Structured content, brand configuration |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS | Responsive, themeable design |
| Hosting | Vercel | Deployment, edge cache, ISR |
| SEO | Custom SEO utilities + JSON-LD | Full technical SEO setup |
| Media | Sanity CDN + next-sanity-image | Optimized image delivery |

---

## 4. CMS Schema Architecture

The CMS must drive **everything visible and meta** on the site.

### 4.1 Global Settings
- Business Name  
- Domain  
- Logo  
- Primary & Secondary Colours  
- Contact Info (phone, email, address)  
- Business Hours  
- Social Links  
- Schema.org Business Type (e.g., plumber, electrician)  
- Global SEO (title, description, OG image)  
- Favicon & Brand Font  
- Analytics & Tracking Codes  

### 4.2 Services
- Title  
- Slug  
- Description (Portable Text)  
- Icon / Image  
- Category  
- SEO (title, description, keywords)  
- Related Services  

### 4.3 Locations
- City / Region Name  
- Slug  
- Map Coordinates (lat/lon)  
- Contact Info Override  
- Services (reference array)  
- SEO (title, description)  

### 4.4 Combined Pages (Auto)
- Auto-generated for each `service + location`.
- Dynamic SEO and structured data per combination.

### 4.5 Reusable Content Blocks
Each section of the website uses modular, CMS-driven blocks:
- Hero (heading, background image, CTA)
- Text Block
- Services Grid
- Testimonials
- Offers
- FAQ
- Blog Highlights
- CTA Strip
- Contact Form
- Footer Links

### 4.6 Blog / Resources (Optional)
- Title  
- Slug  
- Body (Portable Text)  
- Author  
- Category  
- Featured Image  
- SEO (title, description)  

### 4.7 FAQ
- Question  
- Answer  
- Category Reference (optional)  

### 4.8 Testimonials
- Name  
- City  
- Review  
- Rating (1–5)  
- Related Service / Location (optional)  

### 4.9 Offers
- Title  
- Description  
- Discount Code  
- Expiry Date  
- Active Toggle  

---

## 5. Next.js Frontend Structure

### 5.1 Routing
| Route | Description | Data Source |
|--------|--------------|--------------|
| `/` | Homepage | Global Settings + Sections |
| `/services/[service]` | Service Page | Service Schema |
| `/locations/[city]` | Location Page | Location Schema |
| `/[service]-[city]` | Service + Location Page | Combined Query |
| `/offers` | Active Offers | Offers Schema |
| `/contact` | Lead Form | CMS-defined fields |
| `/blog` | Blog Index | Blog Schema |
| `/blog/[slug]` | Blog Detail | Blog Schema |

### 5.2 Dynamic Page Rendering
- Each page template pulls all sections from Sanity.
- Page components are generic (e.g., `<Hero />`, `<ServicesGrid />`, `<FAQ />`) and fed data via props.
- All metadata (title, description, OG) injected dynamically using Sanity SEO fields.

### 5.3 SEO Automation
Each page automatically includes:
- `<title>` and `<meta>` from CMS
- `<link rel="canonical">` using dynamic path
- Open Graph (image, type, locale)
- Twitter Card
- JSON-LD:
  - `LocalBusiness`
  - `Service`
  - `FAQPage` where applicable
- Sitemap XML built from GROQ query
- Robots.txt referencing sitemap

### 5.4 Image Optimization
- Sanity Image Builder for dynamic crops and sizes.
- WebP and AVIF formats auto-served.
- CMS can define focal points and alt text.

---

## 6. Theming & Branding

Each brand or business has its own visual identity controlled from Sanity.

**Editable in CMS:**
- Logo upload  
- Brand colours  
- Font selection (Google Fonts integration)  
- Button radius and shadow intensity  
- Card background styles  
- Gradient presets  
- Hero overlay opacity  

**Next.js frontend:**
- Global theme file consumes CMS theme data at build time.
- No manual CSS overrides required.
- Tailwind configured to accept dynamic colour tokens.

---

## 7. Forms & Integrations

### 7.1 Contact Form
- Fields configurable via Sanity (label, placeholder, validation).
- Submissions handled via:
  - Formspree / Resend / Custom endpoint.
- Displays configurable success message or redirect.

### 7.2 Analytics & Tracking
- GA4, GTM, or Meta Pixel added via CMS field.
- Injected via Next.js `next/script`.

### 7.3 External Integrations (future)
- Booking calendar (ServiceTitan, Housecall Pro, custom API)
- CRM sync (HubSpot, Salesforce)
- Email marketing (Klaviyo, Mailchimp)

---

## 8. Sanity Studio Structure

### 8.1 Desk Structure
```
Global Settings (singleton)
├── Services
├── Locations
├── Offers
├── Testimonials
├── FAQs
├── Blog
└── Reusable Sections
```

### 8.2 Features
- Live Preview via Next.js API route.
- SEO inspector for meta validation.
- Reference filtering (link services by city).
- Role-based permissions:
  - Admin = full control
  - Editor = content only
  - Viewer = read-only

---

## 9. Performance & Quality Targets

| Metric | Target |
|---------|---------|
| Lighthouse Overall | ≥ 90 |
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| SEO Audit | 100 |
| Image Compression | Sanity CDN |
| Accessibility | WCAG 2.1 AA |

---

## 10. Scalability

- Multi-tenant setup:
  - Each business = 1 Sanity dataset.
  - One shared Next.js repo.
- Environment variables define:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - `NEXT_PUBLIC_SANITY_DATASET`
  - `NEXT_PUBLIC_SITE_URL`
- Deployment via Vercel:
  - Build triggered by Sanity webhooks.
  - Automatic incremental regeneration.

---

## 11. Deliverables

1. **Sanity CMS Backend**
   - All schema definitions
   - Custom desk structure
   - Live preview and SEO panel

2. **Next.js Frontend**
   - App directory routing
   - Generic CMS-driven templates
   - Dynamic SEO and JSON-LD
   - Sitemap, robots, canonical setup

3. **Utilities**
   - `/lib/queries.ts` – GROQ queries
   - `/lib/jsonld.ts` – structured data generators
   - `/lib/seo.ts` – meta builder
   - `/lib/sitemap.ts` – XML builder
   - `/lib/theme.ts` – CMS-driven theming

4. **Deployment Setup**
   - Vercel build config
   - `.env.example`
   - CMS webhook integration
   - README with setup instructions

---

## 12. Future Enhancements

- Booking & scheduling API integration  
- Membership subscriptions  
- Customer portal  
- Review sync from Google / Yelp  
- AI content suggestions in CMS  
- Multi-language (i18n)  
- Multi-brand dashboard  

---

## 13. Acceptance Criteria

- Website is fully CMS-driven (no hardcoded content).  
- Each route renders dynamically from Sanity data.  
- SEO validation passes (titles, OG, JSON-LD, sitemap).  
- New business setup requires no code edits.  
- Performance meets defined thresholds.  
- CMS editors can modify all text, images, and SEO fields.

---

## 14. Versioning

| Version | Focus | Description |
|----------|--------|-------------|
| v1.0 | Framework Core | CMS + Frontend integration |
| v1.1 | Theming & SEO Automation | Dynamic branding and full SEO coverage |
| v2.0 | Booking + CRM Integrations | Advanced functionality layer |

---

**Author:** Jagpal Kooner  
**Date:** October 2025  
**Project:** Local Business Website Framework  
**Stack:** Next.js 15 • Sanity CMS v3 • TypeScript • Tailwind • Vercel

**Services:** 
**PLUMBING**
Tankless Water Heater
Drain Cleaning
Toilet Repair
Faucet Repair
Sink Installation & Repair
Garbage Disposal
Sump Pump Installation
Sewer Line Repair/Replacement
Boiler Repair Installation
Water Heater Repair
**HVAC**
Heater Checkup
Heating Installation
Heater Service Plans
Furnace Repair
Furnace Installation
Furnace Tune-Up
Smart Thermostats Installation
Humidifier Installation
Ductless HVAC Systems
HVAC
Air Quality Solutions

**LOCATIONS**
Dennis Township, NJ
Seaville, NJ
Cape May Court House, NJ
Erma, NJ
North Cape May, NJ
Villas, NJ
Cape May Point, NJ
Cape May, NJ
North Wildwood, NJ
Avalon, NJ
Stone Harbor, NJ
Wildwood, NJ
Ocean City, NJ
Sea Isle City, NJ
Wildwood Crest, NJ