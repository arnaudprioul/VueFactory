import { heroSections } from './hero.sections'
import { featuresSections } from './features.sections'
import { pricingSections } from './pricing.sections'
import { ctaSections } from './cta.sections'
import { statsSections } from './stats.sections'
import { footerSections } from './footer.sections'
import { faqSections } from './faq.sections'
import { testimonialsSections } from './testimonials.sections'
import { teamSections } from './team.sections'
import { registerSections } from './registry'

// ─── Named section group exports ─────────────────────────────────────────────
export { heroSections } from './hero.sections'
export { featuresSections } from './features.sections'
export { pricingSections } from './pricing.sections'
export { ctaSections } from './cta.sections'
export { statsSections } from './stats.sections'
export { footerSections } from './footer.sections'
export { faqSections } from './faq.sections'
export { testimonialsSections } from './testimonials.sections'
export { teamSections } from './team.sections'

// ─── Registry ────────────────────────────────────────────────────────────────
export {
  sectionRegistry,
  registerSection,
  registerSections,
  unregisterSection,
  getAllSections,
  getSectionById,
  getSectionsByCategory,
  getSectionCategories,
  searchSections,
} from './registry'

// ─── Bootstrap default sections ──────────────────────────────────────────────
// Called once when the library is imported. All built-in sections are
// registered here. createVueFactory() can then override/add on top.

const DEFAULT_SECTIONS = [
  ...heroSections,
  ...featuresSections,
  ...pricingSections,
  ...ctaSections,
  ...statsSections,
  ...footerSections,
  ...faqSections,
  ...testimonialsSections,
  ...teamSections,
]

registerSections(DEFAULT_SECTIONS)

// ─── Legacy compat export (use getAllSections() for reactive reads) ───────────
export const ALL_SECTIONS = DEFAULT_SECTIONS
