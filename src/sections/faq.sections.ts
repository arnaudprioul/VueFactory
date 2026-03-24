import type { SectionTemplate } from '../types'
import { TAG_PROP } from './shared'

export const faqSections: SectionTemplate[] = [
  {
    id: 'faq-simple',
    name: 'FAQ Simple',
    category: 'faq',
    description: 'Section FAQ avec questions et réponses.',
    blocks: [
      {
        id: 'root',
        type: 'vf-box',
        style: { display: 'flex', flexDirection: 'column', gap: '32px', padding: '80px 24px' },
        meta: { label: 'Section FAQ', locked: true },
        children: [
          { id: 'heading', type: 'vf-heading', text: 'Questions fréquentes', props: { tag: 'h2' }, meta: { label: 'Titre', editableProps: [TAG_PROP] } },
          { id: 'desc', type: 'vf-text', text: 'Tout ce que vous devez savoir sur notre solution.', props: { tag: 'p' }, meta: { label: 'Description', editableProps: [TAG_PROP] } },
          {
            id: 'grid',
            type: 'vf-box',
            style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' },
            meta: { label: 'Grille FAQ', locked: true },
            children: [
              {
                id: 'faq-1',
                type: 'card',
                meta: { label: 'FAQ 1' },
                children: [
                  { id: 'q1', type: 'vf-heading', text: 'Quels design systems sont supportés ?', props: { tag: 'h3' }, meta: { label: 'Question', editableProps: [TAG_PROP] } },
                  { id: 'a1', type: 'vf-text', text: 'Vuetify, PrimeVue, Element Plus, Naive UI, et tout design system personnalisé via le mapper de composants.', props: { tag: 'p' }, meta: { label: 'Réponse', editableProps: [TAG_PROP] } },
                ],
              },
              {
                id: 'faq-2',
                type: 'card',
                meta: { label: 'FAQ 2' },
                children: [
                  { id: 'q2', type: 'vf-heading', text: 'Puis-je exporter ma page ?', props: { tag: 'h3' }, meta: { label: 'Question', editableProps: [TAG_PROP] } },
                  { id: 'a2', type: 'vf-text', text: 'Oui, la configuration complète s\'exporte en JSON et peut être rechargée dans n\'importe quelle instance du page builder.', props: { tag: 'p' }, meta: { label: 'Réponse', editableProps: [TAG_PROP] } },
                ],
              },
              {
                id: 'faq-3',
                type: 'card',
                meta: { label: 'FAQ 3' },
                children: [
                  { id: 'q3', type: 'vf-heading', text: 'Y a-t-il des limites sur les sections ?', props: { tag: 'h3' }, meta: { label: 'Question', editableProps: [TAG_PROP] } },
                  { id: 'a3', type: 'vf-text', text: 'Non, vous pouvez ajouter autant de sections que nécessaire sur votre page.', props: { tag: 'p' }, meta: { label: 'Réponse', editableProps: [TAG_PROP] } },
                ],
              },
              {
                id: 'faq-4',
                type: 'card',
                meta: { label: 'FAQ 4' },
                children: [
                  { id: 'q4', type: 'vf-heading', text: 'Comment utiliser mon propre design system ?', props: { tag: 'h3' }, meta: { label: 'Question', editableProps: [TAG_PROP] } },
                  { id: 'a4', type: 'vf-text', text: 'Utilisez le "Mapper de composants" pour associer chaque type générique (bouton, carte...) au composant de votre design system.', props: { tag: 'p' }, meta: { label: 'Réponse', editableProps: [TAG_PROP] } },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]
