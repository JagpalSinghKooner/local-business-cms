import { defineField } from 'sanity'

const spacingOptions = [
  { title: 'None', value: 'none' },
  { title: 'XS', value: 'xs' },
  { title: 'SM', value: 'sm' },
  { title: 'MD', value: 'md' },
  { title: 'LG', value: 'lg' },
  { title: 'XL', value: 'xl' },
  { title: '2XL', value: '2xl' },
  { title: '3XL', value: '3xl' },
  { title: 'Section', value: 'section' },
]

export const layoutField = defineField({
  name: 'layout',
  title: 'Layout & Theme',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'background',
      title: 'Background',
      type: 'string',
      initialValue: 'surface',
      options: {
        list: [
          { title: 'Surface', value: 'surface' },
          { title: 'Muted Surface', value: 'surface-muted' },
          { title: 'Strong Surface', value: 'surface-strong' },
          { title: 'Brand Primary', value: 'brand' },
          { title: 'Brand Secondary', value: 'secondary' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'textTone',
      title: 'Text Tone',
      type: 'string',
      initialValue: 'default',
      options: {
        list: [
          { title: 'Automatic', value: 'default' },
          { title: 'Dark', value: 'dark' },
          { title: 'Light', value: 'light' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'paddingTop',
      title: 'Padding Top',
      type: 'string',
      initialValue: 'section',
      options: { list: spacingOptions },
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Padding Bottom',
      type: 'string',
      initialValue: 'section',
      options: { list: spacingOptions },
    }),
    defineField({
      name: 'container',
      title: 'Container Width',
      type: 'string',
      initialValue: 'default',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Full Width', value: 'full' },
          { title: 'Narrow', value: 'narrow' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'contentAlignment',
      title: 'Content Alignment',
      type: 'string',
      initialValue: 'start',
      options: {
        list: [
          { title: 'Left / Start', value: 'start' },
          { title: 'Center', value: 'center' },
        ],
        layout: 'radio',
      },
    }),
  ],
})

export const animationField = defineField({
  name: 'animation',
  title: 'Entrance Animation',
  type: 'string',
  initialValue: 'none',
  options: {
    list: [
      { title: 'None', value: 'none' },
      { title: 'Fade in', value: 'fade' },
      { title: 'Slide up', value: 'slide-up' },
      { title: 'Slide right', value: 'slide-right' },
      { title: 'Slide left', value: 'slide-left' },
    ],
    layout: 'radio',
  },
})

export const visibilityField = defineField({
  name: 'visibility',
  title: 'Visibility',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'hideOnMobile',
      title: 'Hide on mobile',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'hideOnDesktop',
      title: 'Hide on desktop',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})

export const sectionBaseFields = [layoutField, animationField, visibilityField]

export const withSectionDefaults = <T>(fields: T[]): T[] => [...fields, ...(sectionBaseFields as T[])]
