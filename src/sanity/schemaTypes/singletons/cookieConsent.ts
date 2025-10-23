/**
 * Cookie Consent Configuration
 *
 * Manage cookie consent settings for GDPR/CCPA compliance
 */

import { defineType, defineField } from 'sanity'
import { CogIcon } from '@sanity/icons'

export default defineType({
  name: 'cookieConsent',
  title: 'Cookie Consent',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enable Cookie Consent',
      type: 'boolean',
      description: 'Show cookie consent banner to users',
      initialValue: true,
    }),
    defineField({
      name: 'mode',
      title: 'Consent Mode',
      type: 'string',
      options: {
        list: [
          { title: 'Opt-In (GDPR)', value: 'opt-in' },
          { title: 'Opt-Out (CCPA)', value: 'opt-out' },
          { title: 'Notice Only', value: 'notice' },
        ],
      },
      initialValue: 'opt-in',
    }),
    defineField({
      name: 'bannerText',
      title: 'Banner Text',
      type: 'text',
      rows: 3,
      initialValue:
        'We use cookies to enhance your browsing experience and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.',
    }),
    defineField({
      name: 'categories',
      title: 'Cookie Categories',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'id',
              title: 'Category ID',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'name',
              title: 'Category Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
            },
            {
              name: 'required',
              title: 'Required',
              type: 'boolean',
              description: 'Cannot be opted out',
              initialValue: false,
            },
            {
              name: 'defaultEnabled',
              title: 'Enabled by Default',
              type: 'boolean',
              initialValue: false,
            },
          ],
          preview: {
            select: {
              name: 'name',
              required: 'required',
            },
            prepare({ name, required }) {
              return {
                title: name,
                subtitle: required ? 'Required' : 'Optional',
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'privacyPolicyUrl',
      title: 'Privacy Policy URL',
      type: 'string',
      description: 'Link to privacy policy page',
    }),
    defineField({
      name: 'cookiePolicyUrl',
      title: 'Cookie Policy URL',
      type: 'string',
      description: 'Link to cookie policy page',
    }),
  ],
  preview: {
    select: {
      enabled: 'enabled',
      mode: 'mode',
    },
    prepare({ enabled, mode }) {
      const status = enabled ? '✅' : '❌'
      return {
        title: `${status} Cookie Consent`,
        subtitle: mode || 'Not configured',
      }
    },
  },
})
