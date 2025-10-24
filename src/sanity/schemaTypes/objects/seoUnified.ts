import { defineField, defineType } from 'sanity'

/**
 * Unified SEO Object
 *
 * Consolidates objects/seo.ts + fields/seo.ts into one clean, simple system.
 * Removed: hreflang (no i18n), customHeadScripts (use global trackingScripts),
 *          imageOptimization (not used), pagination (blog only), over-engineered toggles
 */
export default defineType({
  name: 'seoUnified',
  title: 'SEO & Metadata',
  type: 'object',
  options: { collapsible: true, collapsed: false },
  fields: [
    // ===================================
    // Core Meta
    // ===================================
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Leave empty to auto-generate from page content (~60 chars)',
      validation: (Rule) => Rule.max(60).warning('Aim for <60 characters for best SEO'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Leave empty to auto-generate (~155 chars)',
      validation: (Rule) => Rule.max(160).warning('Aim for <160 characters for best SEO'),
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      description: 'Override canonical URL (rarely needed - leave empty for auto-generation)',
      validation: (Rule) => Rule.uri({ allowRelative: false, scheme: ['https'] }),
    }),

    // ===================================
    // Social Media
    // ===================================
    defineField({
      name: 'ogImage',
      title: 'Social Share Image',
      type: 'image',
      description: '1200×630px recommended. Falls back to page hero image if empty.',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          validation: (Rule) => Rule.required().error('Alt text required for accessibility'),
        },
      ],
    }),
    defineField({
      name: 'ogTitle',
      title: 'Social Title Override',
      type: 'string',
      description: 'Optional. Defaults to meta title if empty.',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'ogDescription',
      title: 'Social Description Override',
      type: 'text',
      rows: 2,
      description: 'Optional. Defaults to meta description if empty.',
      validation: (Rule) => Rule.max(160),
    }),

    // ===================================
    // Robots
    // ===================================
    defineField({
      name: 'noIndex',
      title: 'Hide from Search Engines',
      type: 'boolean',
      initialValue: false,
      description: 'Check to add "noindex" meta tag (prevents Google indexing)',
    }),
    defineField({
      name: 'noFollow',
      title: 'No Follow Links',
      type: 'boolean',
      initialValue: false,
      description: 'Check to add "nofollow" meta tag (prevents Google following links)',
    }),

    // ===================================
    // Structured Data Toggles
    // ===================================
    defineField({
      name: 'structuredData',
      title: 'Structured Data (JSON-LD)',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      description: 'Control which Schema.org structured data to include',
      fields: [
        defineField({
          name: 'enableService',
          title: 'Enable Service Schema',
          type: 'boolean',
          initialValue: true,
          description: 'Automatically enabled for service pages',
        }),
        defineField({
          name: 'enableFAQ',
          title: 'Enable FAQ Schema',
          type: 'boolean',
          initialValue: false,
          description: 'Auto-enabled if page has FAQ section',
        }),
        defineField({
          name: 'enableOffer',
          title: 'Enable Offer Schema',
          type: 'boolean',
          initialValue: false,
          description: 'Enable special offer structured data',
        }),
      ],
    }),
  ],
})
