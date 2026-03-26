import type { SectionTemplate } from '../types'
import { TAG_PROP } from './shared'

export const ctaSections: SectionTemplate[] = [
  {
    id: 'cta-centered',
    name: 'CTA Centré',
    category: 'cta',
    description: 'Appel à l\'action centré avec titre accrocheur et bouton.',
    blocks: [
      {
        id: 'root',
        type: 'vf-box',
        style: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '24px', padding: '80px 24px' },
        meta: { label: 'Section CTA', locked: true },
        children: [
          { id: 'heading', type: 'vf-heading', text: 'Prêt à vous lancer ?', props: { tag: 'h2' }, meta: { label: 'Titre', editableProps: [TAG_PROP] } },
          { id: 'desc', type: 'vf-text', text: 'Rejoignez des milliers d\'équipes qui font confiance à notre solution.', props: { tag: 'p' }, meta: { label: 'Description', editableProps: [TAG_PROP] } },
          {
            id: 'cta-row',
            type: 'vf-box',
            style: { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' },
            meta: { label: 'Boutons', locked: true },
            children: [
              { id: 'cta-primary', type: 'vf-button', text: 'Créer un compte', props: { variant: 'primary' }, meta: { label: 'Bouton principal', editableProps: [{ key: 'text', label: 'Texte', type: 'text', default: 'Créer un compte' }, { key: 'href', label: 'Lien', type: 'url', default: '#' }] } },
              { id: 'cta-secondary', type: 'vf-link', text: 'En savoir plus →', props: { href: '#' }, meta: { label: 'Lien secondaire', editableProps: [{ key: 'text', label: 'Texte', type: 'text', default: 'En savoir plus →' }, { key: 'href', label: 'Lien', type: 'url', default: '#' }] } },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'cta-banner',
    name: 'Bannière CTA',
    category: 'cta',
    description: 'Bannière horizontale avec texte à gauche et bouton à droite.',
    blocks: [
      {
        id: 'root',
        type: 'vf-box',
        style: { padding: '40px 24px' },
        meta: { label: 'Bannière', locked: true },
        children: [
          {
            id: 'row',
            type: 'vf-box',
            style: { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px', flexWrap: 'wrap' },
            meta: { label: 'Ligne', locked: true },
            children: [
              {
                id: 'col-text',
                type: 'vf-box',
                style: { display: 'flex', flexDirection: 'column', gap: '8px', flex: '1' },
                meta: { label: 'Texte' },
                children: [
                  { id: 'heading', type: 'vf-heading', text: 'Commencez dès aujourd\'hui', props: { tag: 'h2' }, meta: { label: 'Titre', editableProps: [TAG_PROP] } },
                  { id: 'text', type: 'vf-text', text: 'Aucune carte bancaire requise. 14 jours d\'essai gratuit.', props: { tag: 'p' }, meta: { label: 'Texte', editableProps: [TAG_PROP] } },
                ],
              },
              {
                id: 'col-cta',
                type: 'vf-box',
                style: { display: 'flex', alignItems: 'center', flexShrink: '0' },
                meta: { label: 'CTA' },
                children: [
                  { id: 'cta', type: 'vf-button', text: 'Essai gratuit', props: { variant: 'primary' }, meta: { label: 'Bouton', editableProps: [{ key: 'text', label: 'Texte', type: 'text', default: 'Essai gratuit' }, { key: 'href', label: 'Lien', type: 'url', default: '#' }] } },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]
