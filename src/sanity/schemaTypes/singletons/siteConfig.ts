import { CogIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'
import {
  validateDatasetName,
  validateProductionUrl,
  validateUrl,
  validateHexColor,
  validateEmail,
  validatePhone,
  validateGoogleAnalyticsId,
  validateGoogleTagManagerId,
  validateMetaPixelId,
  validateMetaTitle,
  validateMetaDescription,
  validateSocialUsername,
  validateBusinessName,
} from '@/sanity/validation'

const businessTypes = [
  'AutoRepair',
  'Dentist',
  'Electrician',
  'GeneralContractor',
  'HVACBusiness',
  'HousePainter',
  'Locksmith',
  'Plumber',
  'RoofingContractor',
  'MovingCompany',
  'PestControl',
  'DryCleaningOrLaundry',
  'HomeAndConstructionBusiness',
  'ProfessionalService',
  'LocalBusiness',
]

/**
 * Site Configuration Schema
 *
 * Enhanced for multi-tenant architecture using Multiple Datasets approach.
 * Each dataset represents one site, so this schema stores site-specific settings.
 *
 * Multi-Tenant Architecture:
 * - Each site = separate Sanity dataset
 * - This schema exists in each dataset
 * - No cross-dataset queries needed (perfect isolation)
 * - Deploy one Next.js instance per site with different DATASET env var
 */
export default defineType({
  name: 'siteConfig',
  title: 'Site Configuration',
  type: 'document',
  icon: CogIcon,
  __experimental_liveEdit: true,
  groups: [
    { name: 'deployment', title: 'Deployment' },
    { name: 'brand', title: 'Brand' },
    { name: 'contact', title: 'Contact' },
    { name: 'business', title: 'Local Business' },
    { name: 'seo', title: 'SEO' },
    { name: 'integrations', title: 'Integrations' },
  ],
  fields: [
    // Deployment & Multi-Tenant
    defineField({
      name: 'siteId',
      title: 'Site ID',
      type: 'slug',
      group: 'deployment',
      description:
        'Unique identifier for this site (e.g., "budds-plumbing", "acme-hvac"). Should match dataset name.',
      validation: (rule) => rule.required(),
      options: {
        source: 'name',
        maxLength: 50,
      },
    }),
    defineField({
      name: 'datasetName',
      title: 'Sanity Dataset Name',
      type: 'string',
      group: 'deployment',
      description:
        'The Sanity dataset for this site (e.g., "site-budds"). Must match NEXT_PUBLIC_SANITY_DATASET env var.',
      readOnly: true,
      initialValue: () => process.env.SANITY_STUDIO_DATASET || 'production',
      validation: (rule) => rule.custom(validateDatasetName),
    }),
    defineField({
      name: 'status',
      title: 'Site Status',
      type: 'string',
      group: 'deployment',
      description: 'Current status of this site',
      options: {
        list: [
          { title: '🟢 Active (Production)', value: 'active' },
          { title: '🟡 Staging (Testing)', value: 'staging' },
          { title: '🔴 Inactive (Disabled)', value: 'inactive' },
          { title: '🚧 Development (Building)', value: 'development' },
        ],
        layout: 'radio',
      },
      initialValue: 'active',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'deploymentUrl',
      title: 'Primary Deployment URL',
      type: 'url',
      group: 'deployment',
      description:
        'The production URL where this site is deployed (e.g., https://buddsplumbing.com)',
      validation: (rule) => rule.required().custom(validateProductionUrl),
    }),
    defineField({
      name: 'stagingUrl',
      title: 'Staging URL',
      type: 'url',
      group: 'deployment',
      description: 'Optional staging/preview URL for testing',
      validation: (rule) => rule.custom(validateUrl),
    }),
    defineField({
      name: 'deployedAt',
      title: 'Last Deployed',
      type: 'datetime',
      group: 'deployment',
      description: 'When this site was last deployed (auto-updated by deployment scripts)',
      readOnly: true,
    }),

    // Brand
    defineField({
      name: 'name',
      title: 'Business Name',
      type: 'string',
      group: 'brand',
      validation: (rule) => rule.required().custom(validateBusinessName),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'brand',
    }),
    defineField({
      name: 'domain',
      title: 'Primary Domain',
      type: 'url',
      group: 'brand',
      description: 'Used for canonical URLs and sitemap generation',
      validation: (rule) => rule.uri({ allowRelative: false, scheme: ['https'] }),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'brand',
      options: { hotspot: true },
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      group: 'brand',
      options: { hotspot: true },
    }),
    defineField({
      name: 'primaryColor',
      title: 'Primary Colour',
      type: 'string',
      group: 'brand',
      description: 'Hex value e.g. #0EA5E9',
      validation: (rule) => rule.custom(validateHexColor),
    }),
    defineField({
      name: 'secondaryColor',
      title: 'Secondary Colour',
      type: 'string',
      group: 'brand',
      description: 'Hex value e.g. #F97316',
      validation: (rule) => rule.custom(validateHexColor),
    }),
    defineField({
      name: 'fontHeading',
      title: 'Heading Font',
      type: 'string',
      group: 'brand',
      description: 'CSS font family for headings, e.g. "Poppins, sans-serif"',
    }),
    defineField({
      name: 'fontBody',
      title: 'Body Font',
      type: 'string',
      group: 'brand',
      description: 'CSS font family for body copy',
    }),

    // Contact
    defineField({
      name: 'phone',
      title: 'Primary Phone',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.custom(validatePhone),
    }),
    defineField({
      name: 'email',
      title: 'Primary Email',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.custom(validateEmail),
    }),
    defineField({
      name: 'address',
      title: 'Headquarters Address',
      type: 'address',
      group: 'contact',
    }),
    defineField({
      name: 'hours',
      title: 'Business Hours',
      type: 'array',
      group: 'contact',
      of: [defineArrayMember({ type: 'openingHoursSpec' })],
    }),
    defineField({
      name: 'social',
      title: 'Social Profiles',
      type: 'array',
      group: 'contact',
      of: [defineArrayMember({ type: 'socialLink' })],
    }),
    defineField({
      name: 'contactCta',
      title: 'Contact CTA Label',
      type: 'string',
      group: 'contact',
      description: 'Optional CTA text used in the header or hero CTA button',
    }),

    // Local business defaults
    defineField({
      name: 'businessType',
      title: 'Schema.org Business Type',
      type: 'string',
      group: 'business',
      options: {
        list: businessTypes.map((value) => ({ title: value, value })),
      },
      initialValue: 'LocalBusiness',
    }),
    defineField({
      name: 'legalName',
      title: 'Legal business name',
      type: 'string',
      group: 'business',
    }),
    defineField({
      name: 'serviceAreas',
      title: 'Primary Service Areas',
      type: 'array',
      group: 'business',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'geo',
      title: 'Headquarters Geo',
      type: 'geo',
      group: 'business',
      description: 'Used for JSON-LD structured data',
    }),
    defineField({
      name: 'priceRange',
      title: 'Price Range',
      type: 'string',
      group: 'business',
      description: 'Use $, $$, $$$ etc for Google rich results',
    }),
    defineField({
      name: 'sameAs',
      title: 'SameAs (social URLs)',
      type: 'array',
      group: 'business',
      of: [defineArrayMember({ type: 'url' })],
      description: 'Add authoritative profile URLs for structured data.',
    }),

    // SEO defaults (site-specific)
    defineField({
      name: 'metaTitle',
      title: 'Default Meta Title',
      type: 'string',
      group: 'seo',
      description:
        'Fallback title for pages without specific meta titles. Each site has its own SEO defaults.',
      validation: (rule) => rule.custom(validateMetaTitle),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Default Meta Description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description:
        'Fallback description for pages without specific meta descriptions. Each site has its own SEO defaults.',
      validation: (rule) => rule.custom(validateMetaDescription),
    }),
    defineField({
      name: 'ogImage',
      title: 'Default Open Graph Image',
      type: 'image',
      group: 'seo',
      description:
        'Fallback social sharing image for pages without specific OG images. Each site has its own default.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'twitterHandle',
      title: 'Twitter Handle',
      type: 'string',
      group: 'seo',
      description:
        'Twitter handle for this site (without @ symbol). Each site can have its own social accounts.',
      placeholder: 'yourbusiness',
      validation: (rule) => rule.custom(validateSocialUsername('twitter')),
    }),
    defineField({
      name: 'robots',
      title: 'Robots Directives',
      type: 'string',
      group: 'seo',
      description:
        'Site-wide robots meta tag directives. Defaults to "index,follow" if left blank. Can be overridden per page.',
      options: {
        list: [
          { title: 'Index, Follow (Default)', value: 'index,follow' },
          { title: 'No Index, Follow', value: 'noindex,follow' },
          { title: 'Index, No Follow', value: 'index,nofollow' },
          { title: 'No Index, No Follow', value: 'noindex,nofollow' },
        ],
      },
    }),

    // Integrations
    defineField({
      name: 'googleTagManagerId',
      title: 'Google Tag Manager ID',
      type: 'string',
      group: 'integrations',
      description: 'Format: GTM-XXXXXXX',
      placeholder: 'GTM-XXXXXXX',
      validation: (rule) => rule.custom(validateGoogleTagManagerId),
    }),
    defineField({
      name: 'googleAnalyticsId',
      title: 'Google Analytics ID',
      type: 'string',
      group: 'integrations',
      description: 'Format: G-XXXXXXXXXX (GA4) or UA-XXXXXXXX-X (legacy)',
      placeholder: 'G-XXXXXXXXXX',
      validation: (rule) => rule.custom(validateGoogleAnalyticsId),
    }),
    defineField({
      name: 'metaPixelId',
      title: 'Meta Pixel ID',
      type: 'string',
      group: 'integrations',
      description: '15-16 digit number',
      placeholder: '1234567890123456',
      validation: (rule) => rule.custom(validateMetaPixelId),
    }),
    defineField({
      name: 'trackingScripts',
      title: 'Additional Tracking Scripts',
      type: 'array',
      group: 'integrations',
      of: [defineArrayMember({ type: 'trackingScript' })],
    }),
    defineField({
      name: '_schemaVersion',
      type: 'string',
      title: 'Schema Version',
      initialValue: '1',
      readOnly: true,
      hidden: true,
      description: 'Internal: tracks schema version for safe migrations',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'siteId.current',
      media: 'logo',
      status: 'status',
    },
    prepare({ title, subtitle, media, status }) {
      const statusEmoji =
        {
          active: '🟢',
          staging: '🟡',
          inactive: '🔴',
          development: '🚧',
        }[status as string] || ''

      return {
        title: `${statusEmoji} ${title}`,
        subtitle: subtitle ? `Site ID: ${subtitle}` : 'No site ID set',
        media,
      }
    },
  },
})
