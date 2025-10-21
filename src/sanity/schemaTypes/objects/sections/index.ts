import hero from './hero'
import text from './text'
import services from './services'
import locations from './locations'
import testimonials from './testimonials'
import faq from './faq'
import offers from './offers'
import cta from './cta'
import contact from './contact'
import features from './features'
import steps from './steps'
import stats from './stats'
import logos from './logos'
import mediaText from './mediaText'
import timeline from './timeline'
import pricingTable from './pricingTable'
import gallery from './gallery'
import quote from './quote'
import blogList from './blogList'
import layoutGroup from './layoutGroup'

export const sectionTypes = [
  hero,
  text,
  services,
  locations,
  testimonials,
  faq,
  offers,
  cta,
  contact,
  features,
  mediaText,
  steps,
  stats,
  logos,
  timeline,
  pricingTable,
  gallery,
  quote,
  blogList,
  layoutGroup,
]

export type SectionTypeNames = (typeof sectionTypes)[number]['name']
