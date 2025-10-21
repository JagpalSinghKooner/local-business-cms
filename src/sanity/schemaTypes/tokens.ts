import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'tokens',
  title: 'Brand Tokens',
  type: 'document',
  groups: [
    { name: 'palette', title: 'Colour Palette' },
    { name: 'typography', title: 'Typography' },
    { name: 'spacing', title: 'Spacing & Layout' },
    { name: 'effects', title: 'Radius & Shadows' },
    { name: 'buttons', title: 'Buttons' },
  ],
  fields: [
    // Palette
    defineField({
      name: 'primary',
      title: 'Primary Colour',
      type: 'string',
      group: 'palette',
      description: 'Primary brand colour (e.g. #0EA5E9)',
      validation: (rule) =>
        rule
          .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { name: 'hex colour' })
          .warning('Expected a valid hex colour'),
    }),
    defineField({
      name: 'onPrimary',
      title: 'Text on Primary',
      type: 'string',
      group: 'palette',
      description: 'Text colour when displayed on top of the primary colour',
    }),
    defineField({
      name: 'secondary',
      title: 'Secondary Colour',
      type: 'string',
      group: 'palette',
      description: 'Accent colour for secondary CTAs',
      validation: (rule) =>
        rule
          .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { name: 'hex colour' })
          .warning('Expected a valid hex colour'),
    }),
    defineField({
      name: 'onSecondary',
      title: 'Text on Secondary',
      type: 'string',
      group: 'palette',
      description: 'Text colour for secondary CTAs',
    }),
    defineField({
      name: 'surface',
      title: 'Surface',
      type: 'string',
      group: 'palette',
      description: 'Default background colour',
    }),
    defineField({
      name: 'surfaceMuted',
      title: 'Muted Surface',
      type: 'string',
      group: 'palette',
      description: 'Muted background for alternating sections',
    }),
    defineField({
      name: 'surfaceStrong',
      title: 'Strong Surface',
      type: 'string',
      group: 'palette',
      description: 'Dark background colour',
    }),
    defineField({
      name: 'textStrong',
      title: 'Strong Text',
      type: 'string',
      group: 'palette',
      description: 'Primary text colour',
    }),
    defineField({
      name: 'textMuted',
      title: 'Muted Text',
      type: 'string',
      group: 'palette',
      description: 'Muted text colour for secondary copy',
    }),
    defineField({
      name: 'textInverted',
      title: 'Inverted Text',
      type: 'string',
      group: 'palette',
      description: 'Text colour when displayed on dark surfaces',
    }),
    defineField({
      name: 'borderColor',
      title: 'Border Colour',
      type: 'string',
      group: 'palette',
      description: 'Default border colour',
    }),

    // Typography
    defineField({
      name: 'fontBody',
      title: 'Body Font',
      type: 'string',
      group: 'typography',
      description: 'CSS font stack for body copy',
    }),
    defineField({
      name: 'fontHeading',
      title: 'Heading Font',
      type: 'string',
      group: 'typography',
      description: 'CSS font stack for headings',
    }),
    defineField({
      name: 'typographyScale',
      title: 'Typography Scale',
      type: 'array',
      group: 'typography',
      description: 'Define reusable typography tokens for headings and body copy',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'token',
              title: 'Token',
              type: 'string',
              description: 'e.g. heading-xl, heading-md, body-sm',
              validation: (rule) =>
                rule
                  .required()
                  .regex(/^[a-z0-9-]+$/, { name: 'token' })
                  .warning('Use lowercase letters, numbers, and dashes.'),
            }),
            defineField({
              name: 'fontSize',
              title: 'Font Size',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'lineHeight',
              title: 'Line Height',
              type: 'string',
            }),
            defineField({
              name: 'fontWeight',
              title: 'Font Weight',
              type: 'string',
            }),
          ],
          preview: { select: { title: 'token', subtitle: 'fontSize' } },
        }),
      ],
    }),

    // Spacing
    defineField({
      name: 'spacingScale',
      title: 'Spacing Scale',
      type: 'array',
      group: 'spacing',
      description: 'Spacing tokens applied across layout and section padding',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'token',
              title: 'Token',
              type: 'string',
              validation: (rule) =>
                rule
                  .required()
                  .regex(/^[a-z0-9-]+$/, { name: 'token' }),
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'token', subtitle: 'value' } },
        }),
      ],
    }),
    defineField({
      name: 'containerWidth',
      title: 'Container Width',
      type: 'string',
      group: 'spacing',
      description: 'Max width for containers (e.g. 1200px)',
    }),

    // Radius & Shadows
    defineField({
      name: 'radiusScale',
      title: 'Border Radius',
      type: 'array',
      group: 'effects',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'token',
              title: 'Token',
              type: 'string',
              validation: (rule) =>
                rule
                  .required()
                  .regex(/^[a-z0-9-]+$/, { name: 'token' }),
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'token', subtitle: 'value' } },
        }),
      ],
    }),
    defineField({
      name: 'shadowScale',
      title: 'Shadow Presets',
      type: 'array',
      group: 'effects',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'token',
              title: 'Token',
              type: 'string',
              validation: (rule) =>
                rule
                  .required()
                  .regex(/^[a-z0-9-]+$/, { name: 'token' }),
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'token', subtitle: 'value' } },
        }),
      ],
    }),

    // Buttons
    defineField({
      name: 'buttonStyles',
      title: 'Button Styles',
      type: 'array',
      group: 'buttons',
      description: 'Custom button variants',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'token',
              title: 'Token',
              type: 'string',
              validation: (rule) =>
                rule
                  .required()
                  .regex(/^[a-z0-9-]+$/, { name: 'token' }),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
            }),
            defineField({ name: 'background', title: 'Background', type: 'string' }),
            defineField({ name: 'text', title: 'Text Colour', type: 'string' }),
            defineField({ name: 'border', title: 'Border Colour', type: 'string' }),
            defineField({ name: 'hoverBackground', title: 'Hover Background', type: 'string' }),
            defineField({ name: 'hoverText', title: 'Hover Text', type: 'string' }),
            defineField({ name: 'shadow', title: 'Shadow', type: 'string' }),
          ],
          preview: { select: { title: 'token', subtitle: 'label' } },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Brand Tokens' }),
  },
})
