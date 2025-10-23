import { defineField, defineType } from 'sanity'
import type { ValidationContext } from 'sanity'

export default defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  description:
    'Manage URL redirects with pattern matching, priority ordering, and loop detection. Test redirects using the validation script: pnpm redirects:validate',
  validation: (Rule) =>
    Rule.custom(async (doc, _context: ValidationContext) => {
      if (!doc) return true

      const { from, to, matchType } = doc as {
        from?: string
        to?: string
        matchType?: string
      }

      // Basic validation errors
      const errors: string[] = []

      // Check for self-redirect
      if (from && to && from === to) {
        errors.push('Redirect cannot point to itself')
      }

      // Validate regex if match type is regex
      if (matchType === 'regex' && from) {
        try {
          new RegExp(from)
        } catch (err) {
          errors.push(
            `Invalid regex pattern: ${err instanceof Error ? err.message : 'Unknown error'}`
          )
        }
      }

      // Validate destination URL format
      if (to && to.trim() === '') {
        errors.push('Destination URL cannot be empty')
      } else if (to && !to.startsWith('/')) {
        try {
          new URL(to)
        } catch {
          errors.push('Destination URL must be a valid absolute URL or start with /')
        }
      }

      if (errors.length > 0) {
        return errors.join('. ')
      }

      return true
    }),
  fields: [
    defineField({
      name: 'from',
      title: 'From Path',
      type: 'string',
      description: 'The path to redirect from. Supports wildcards (*) and regex patterns.',
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) return 'From path is required'
          if (!value.startsWith('/') && !value.startsWith('^'))
            return 'Path must start with / or ^ (for regex)'
          if (value.includes(' ')) return 'Path cannot contain spaces'

          // Validate regex if starts with ^
          if (value.startsWith('^')) {
            try {
              new RegExp(value)
            } catch {
              return 'Invalid regex pattern'
            }
          }

          return true
        }),
    }),
    defineField({
      name: 'to',
      title: 'To URL',
      type: 'string',
      description: 'The URL to redirect to. Use $1, $2 for wildcard/regex capture groups.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'matchType',
      title: 'Match Type',
      type: 'string',
      options: {
        list: [
          { title: 'Exact', value: 'exact' },
          { title: 'Wildcard (*)', value: 'wildcard' },
          { title: 'Regex', value: 'regex' },
        ],
        layout: 'radio',
      },
      initialValue: 'exact',
      description: 'How to match the from path',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'statusCode',
      title: 'Status Code',
      type: 'number',
      options: {
        list: [
          { title: '301 - Permanent Redirect', value: 301 },
          { title: '302 - Temporary Redirect', value: 302 },
          { title: '307 - Temporary Redirect (Preserve Method)', value: 307 },
          { title: '308 - Permanent Redirect (Preserve Method)', value: 308 },
        ],
      },
      initialValue: 301,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Whether this redirect is currently active',
    }),
    defineField({
      name: 'caseSensitive',
      title: 'Case Sensitive',
      type: 'boolean',
      initialValue: false,
      description: 'Whether the from path should be matched case-sensitively',
    }),
    defineField({
      name: 'queryStringHandling',
      title: 'Query String Handling',
      type: 'string',
      options: {
        list: [
          { title: 'Preserve - Keep query strings from original URL', value: 'preserve' },
          { title: 'Remove - Strip all query strings', value: 'remove' },
          { title: "Ignore - Don't match query strings at all", value: 'ignore' },
        ],
        layout: 'radio',
      },
      initialValue: 'preserve',
      description: 'How to handle query strings in the redirect',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 2,
      description: 'Internal notes about this redirect',
    }),
    defineField({
      name: 'priority',
      title: 'Priority',
      type: 'number',
      description:
        'Higher numbers are evaluated first (default: 0). Use 10+ for important redirects.',
      initialValue: 0,
      validation: (Rule) => Rule.min(0).max(999),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Auto-incremented position for redirects with same priority',
      initialValue: 0,
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'validationWarnings',
      title: 'Validation Warnings',
      type: 'array',
      of: [{ type: 'string' }],
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: 'schemaVersion',
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
      from: 'from',
      to: 'to',
      matchType: 'matchType',
      statusCode: 'statusCode',
      isActive: 'isActive',
      priority: 'priority',
      warnings: 'validationWarnings',
    },
    prepare({ from, to, matchType, statusCode, isActive, priority, warnings }) {
      const warningIcon = warnings && warnings.length > 0 ? ' ⚠️' : ''
      const priorityBadge = priority && priority > 0 ? ` [P${priority}]` : ''
      return {
        title: `${from} → ${to}${warningIcon}${priorityBadge}`,
        subtitle: `${matchType} | ${statusCode} | ${isActive ? 'Active' : 'Inactive'}`,
      }
    },
  },
  orderings: [
    {
      title: 'Priority (High to Low)',
      name: 'priorityDesc',
      by: [
        { field: 'priority', direction: 'desc' },
        { field: 'order', direction: 'asc' },
      ],
    },
    {
      title: 'From Path A-Z',
      name: 'fromAsc',
      by: [{ field: 'from', direction: 'asc' }],
    },
    {
      title: 'Status Code',
      name: 'statusCode',
      by: [{ field: 'statusCode', direction: 'asc' }],
    },
  ],
})
