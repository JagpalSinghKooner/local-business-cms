import { type SchemaTypeDefinition } from 'sanity'

import siteSettings from './singletons/siteSettings'
import robotsTxt from './singletons/robotsTxt'
import cookieConsent from './singletons/cookieConsent'
import privacyPolicy from './singletons/privacyPolicy'
import navigation from './navigation'

import service from './documents/service'
import serviceLocation from './documents/serviceLocation'
import location from './documents/location'
import offer from './documents/offer'
import caseStudy from './documents/caseStudy'
import coupon from './documents/coupon'
import lead from './documents/lead'
import pageTemplate from './documents/pageTemplate'
import redirect from './documents/redirect'
import auditLog from './documents/auditLog'
import webhook from './documents/webhook'
import webhookLog from './documents/webhookLog'
import approvalRequest from './documents/approvalRequest'
import role from './documents/role'
import userProfile from './documents/userProfile'

import testimonial from './testimonial'
import faq from './faq'
import page from './page'
import post from './post'
import redirects from './redirects'
import category from './category'
import serviceCategory from './serviceCategory'

import navLink from './navLink'
import seoUnified from './objects/seoUnified'
import richText from './objects/richText'
import address from './objects/address'
import galleryImage from './objects/galleryImage'
import geo from './objects/geo'
import openingHours from './objects/openingHours'
import socialLink from './objects/socialLink'
import trackingScript from './objects/trackingScript'
import cta from './objects/cta'
import link from './objects/link'
import imageWithPriority from './fields/imageWithPriority'
import crossSiteReference from './objects/crossSiteReference'
import workflowState from './objects/workflowState'
import { sectionTypes } from './objects/sections'
import { breadcrumbObjects } from './objects/breadcrumbs'

const documentTypes: SchemaTypeDefinition[] = [
  siteSettings, // Unified site configuration (merged siteSettings + siteConfig)
  robotsTxt,
  cookieConsent,
  privacyPolicy,
  navigation,
  serviceCategory,
  service,
  serviceLocation,
  location,
  offer,
  caseStudy,
  coupon,
  lead,
  pageTemplate,
  redirect,
  auditLog,
  webhook,
  webhookLog,
  approvalRequest,
  role,
  userProfile,
  testimonial,
  faq,
  page,
  post,
  category,
  redirects,
]

const objectTypes: SchemaTypeDefinition[] = [
  navLink,
  seoUnified,
  richText,
  address,
  galleryImage,
  imageWithPriority,
  geo,
  openingHours,
  socialLink,
  trackingScript,
  cta,
  link,
  crossSiteReference,
  workflowState,
  ...breadcrumbObjects,
  ...sectionTypes,
]

export const schemaTypes: SchemaTypeDefinition[] = [...documentTypes, ...objectTypes]

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
}

export default schemaTypes
