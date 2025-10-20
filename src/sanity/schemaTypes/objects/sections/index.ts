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

export const sectionTypes = [hero, text, services, locations, testimonials, faq, offers, cta, contact, features, steps, stats, logos]

export type SectionTypeNames = (typeof sectionTypes)[number]['name']
