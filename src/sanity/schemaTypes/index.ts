import { type SchemaTypeDefinition } from 'sanity'

import siteSettings from './singletons/siteSettings'
import navigation from './navigation'
import tokens from './tokens'

import service from './documents/service'
import location from './documents/location'
import offer from './documents/offer'
import caseStudy from './documents/caseStudy'
import coupon from './documents/coupon'
import lead from './documents/lead'

import testimonial from './testimonial'
import faq from './faq'
import page from './page'
import post from './post'
import redirects from './redirects'
import category from './category'
import serviceCategory from './serviceCategory'

import navLink from './navLink'
import seo from './objects/seo'
import richText from './objects/richText'
import address from './objects/address'
import galleryImage from './objects/galleryImage'
import geo from './objects/geo'
import openingHours from './objects/openingHours'
import socialLink from './objects/socialLink'
import trackingScript from './objects/trackingScript'
import cta from './objects/cta'
import { sectionTypes } from './objects/sections'

const documentTypes: SchemaTypeDefinition[] = [
  siteSettings,
  navigation,
  tokens,
  serviceCategory,
  service,
  location,
  offer,
  caseStudy,
  coupon,
  lead,
  testimonial,
  faq,
  page,
  post,
  category,
  redirects,
]

const objectTypes: SchemaTypeDefinition[] = [
  navLink,
  seo,
  richText,
  address,
  galleryImage,
  geo,
  openingHours,
  socialLink,
  trackingScript,
  cta,
  ...sectionTypes,
]

export const schemaTypes: SchemaTypeDefinition[] = [...documentTypes, ...objectTypes]

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
}
