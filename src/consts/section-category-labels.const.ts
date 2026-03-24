import { ESectionCategory } from '../enums/section-category.enum'

export const SECTION_CATEGORY_LABELS: Record<ESectionCategory, string> = {
  [ESectionCategory.Hero]:         'Hero',
  [ESectionCategory.Features]:     'Fonctionnalités',
  [ESectionCategory.Pricing]:      'Tarification',
  [ESectionCategory.Testimonials]: 'Témoignages',
  [ESectionCategory.Cta]:          'Appel à l\'action',
  [ESectionCategory.Content]:      'Contenu',
  [ESectionCategory.Gallery]:      'Galerie',
  [ESectionCategory.Stats]:        'Statistiques',
  [ESectionCategory.Team]:         'Équipe',
  [ESectionCategory.Faq]:          'FAQ',
  [ESectionCategory.Contact]:      'Contact',
  [ESectionCategory.Header]:       'En-tête',
  [ESectionCategory.Footer]:       'Pied de page',
}
