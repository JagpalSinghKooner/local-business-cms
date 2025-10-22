import { defineField, defineType } from 'sanity'

/**
 * Reusable image field with loading priority for performance optimization.
 *
 * Loading priorities:
 * - eager: Load immediately (LCP candidate, above fold) - adds priority={true} to Next.js Image
 * - lazy: Lazy load (below fold) - adds loading="lazy"
 * - auto: Default Next.js behavior (lazy loads unless priority is set)
 */
export const imageWithPriorityFields = [
  defineField({
    name: 'image',
    title: 'Image',
    type: 'image',
    options: { hotspot: true },
  }),
  defineField({
    name: 'alt',
    title: 'Alt Text',
    type: 'string',
    description: 'Descriptive text for accessibility and SEO',
    hidden: ({ parent }) => !parent?.image,
  }),
  defineField({
    name: 'loadingPriority',
    title: 'Loading Priority',
    type: 'string',
    description:
      'Control when this image loads. "Eager" for above-fold/hero images (improves LCP). "Lazy" for below-fold images. "Auto" uses default behavior.',
    options: {
      list: [
        { title: 'Auto (Default)', value: 'auto' },
        { title: 'Eager (Above Fold)', value: 'eager' },
        { title: 'Lazy (Below Fold)', value: 'lazy' },
      ],
      layout: 'radio',
    },
    initialValue: 'auto',
    hidden: ({ parent }) => !parent?.image,
  }),
]

export default defineType({
  name: 'imageWithPriority',
  title: 'Optimized Image',
  type: 'object',
  fields: imageWithPriorityFields,
  preview: {
    select: {
      media: 'image',
      alt: 'alt',
      priority: 'loadingPriority',
    },
    prepare({ media, alt, priority }) {
      return {
        title: alt || 'Image',
        subtitle: priority ? `Loading: ${priority}` : undefined,
        media,
      }
    },
  },
})
