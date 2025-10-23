import { CogIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

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

export default defineType({
  name: 'siteSettings',
  title: 'Global Settings',
  type: 'document',
  icon: CogIcon,
  __experimental_liveEdit: true,
  groups: [
    { name: 'brand', title: 'Brand' },
    { name: 'contact', title: 'Contact' },
    { name: 'business', title: 'Local Business' },
    { name: 'seo', title: 'SEO' },
    { name: 'integrations', title: 'Integrations' },
  ],
  fields: [
    // Brand
    defineField({
      name: 'name',
      title: 'Business Name',
      type: 'string',
      group: 'brand',
      validation: (rule) => rule.required(),
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
      validation: (rule) =>
        rule
          .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { name: 'hex colour' })
          .warning('Use a valid hex colour'),
    }),
    defineField({
      name: 'secondaryColor',
      title: 'Secondary Colour',
      type: 'string',
      group: 'brand',
      description: 'Hex value e.g. #F97316',
      validation: (rule) =>
        rule
          .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { name: 'hex colour' })
          .warning('Use a valid hex colour'),
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
    }),
    defineField({
      name: 'email',
      title: 'Primary Email',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.email(),
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

    // SEO defaults
    defineField({
      name: 'metaTitle',
      title: 'Default Meta Title',
      type: 'string',
      group: 'seo',
      validation: (rule) => rule.max(60).warning('Aim for fewer than 60 characters'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Default Meta Description',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (rule) => rule.max(160).warning('Aim for fewer than 160 characters'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Default Open Graph Image',
      type: 'image',
      group: 'seo',
      options: { hotspot: true },
    }),
    defineField({
      name: 'twitterHandle',
      title: 'Twitter Handle',
      type: 'string',
      group: 'seo',
      description: 'Do not include @ symbol',
    }),
    defineField({
      name: 'robots',
      title: 'Robots Directives',
      type: 'string',
      group: 'seo',
      description: 'Defaults to "index,follow" if left blank',
    }),

    // Integrations
    defineField({
      name: 'googleTagManagerId',
      title: 'Google Tag Manager ID',
      type: 'string',
      group: 'integrations',
    }),
    defineField({
      name: 'googleAnalyticsId',
      title: 'Google Analytics ID',
      type: 'string',
      group: 'integrations',
    }),
    defineField({
      name: 'metaPixelId',
      title: 'Meta Pixel ID',
      type: 'string',
      group: 'integrations',
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
    select: { title: 'name', subtitle: 'tagline', media: 'logo' },
  },
})
