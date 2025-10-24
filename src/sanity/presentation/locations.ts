/**
 * Presentation Tool - Document Locations
 * Maps Sanity documents to their corresponding frontend URLs
 * Enables the Presentation Tool to know where to preview each document
 */
import { defineLocations } from 'sanity/presentation'

export const locations = {
  // Pages
  page: defineLocations({
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    resolve: (doc) => {
      const slug = doc?.slug
      if (!slug || slug === 'home') {
        return { locations: [{ title: 'Home', href: '/' }] }
      }
      return { locations: [{ title: doc?.title || slug, href: `/${slug}` }] }
    },
  }),

  // Services
  service: defineLocations({
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    resolve: (doc) => {
      const slug = doc?.slug
      if (!slug) return null
      return { locations: [{ title: doc?.title || 'Service', href: `/services/${slug}` }] }
    },
  }),

  // Locations
  location: defineLocations({
    select: {
      city: 'city',
      slug: 'slug.current',
    },
    resolve: (doc) => {
      const slug = doc?.slug
      if (!slug) return null
      return { locations: [{ title: doc?.city || 'Location', href: `/locations/${slug}` }] }
    },
  }),

  // Service + Location Pages
  serviceLocation: defineLocations({
    select: {
      slug: 'slug.current',
    },
    resolve: (doc) => {
      const slug = doc?.slug
      if (!slug) return null
      return { locations: [{ title: 'Service Location', href: `/services/${slug}` }] }
    },
  }),

  // Blog Posts
  post: defineLocations({
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    resolve: (doc) => {
      const slug = doc?.slug
      if (!slug) return null
      return { locations: [{ title: doc?.title || 'Post', href: `/blog/${slug}` }] }
    },
  }),

  // Offers
  offer: defineLocations({
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    resolve: (doc) => {
      const slug = doc?.slug
      if (!slug) return null
      return { locations: [{ title: doc?.title || 'Offer', href: `/offers/${slug}` }] }
    },
  }),
}
