import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'robotsTxt',
  title: 'Robots.txt',
  type: 'document',
  // Note: __experimental_liveEdit removed due to TypeScript compatibility
  // Consider re-adding when officially supported in Sanity types
  fields: [
    defineField({
      name: 'environment',
      title: 'Environment',
      type: 'string',
      options: {
        list: [
          { title: 'Production', value: 'production' },
          { title: 'Staging', value: 'staging' },
          { title: 'Development', value: 'development' },
        ],
      },
      initialValue: 'production',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'userAgents',
      title: 'User Agents',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'User Agent',
              type: 'string',
              description: 'e.g., *, Googlebot, Bingbot',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'allow',
              title: 'Allow',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'Paths to allow (e.g., /, /sitemap.xml)',
            }),
            defineField({
              name: 'disallow',
              title: 'Disallow',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'Paths to disallow (e.g., /admin, /private)',
            }),
            defineField({
              name: 'crawlDelay',
              title: 'Crawl Delay',
              type: 'number',
              description: 'Delay in seconds between requests',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'sitemap',
      title: 'Sitemap URL',
      type: 'url',
      description: 'URL to your sitemap (e.g., https://example.com/sitemap.xml)',
      validation: (Rule) => Rule.uri({ allowRelative: false, scheme: ['https'] }),
    }),
    defineField({
      name: 'additionalDirectives',
      title: 'Additional Directives',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'directive',
              title: 'Directive',
              type: 'string',
              description: 'e.g., Host: example.com',
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
      description: 'Custom directives to add to robots.txt',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Whether this robots.txt configuration is active',
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
      environment: 'environment',
      isActive: 'isActive',
    },
    prepare({ environment, isActive }) {
      return {
        title: `Robots.txt (${environment})`,
        subtitle: isActive ? 'Active' : 'Inactive',
      }
    },
  },
})
