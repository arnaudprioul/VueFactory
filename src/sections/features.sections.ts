import type { SectionTemplate } from '../types'
import { TAG_PROP } from './shared'

export const featuresSections: SectionTemplate[] = [
  {
    id: 'features-grid-3',
    name: 'Grille 3 Fonctionnalités',
    category: 'features',
    description: 'Trois fonctionnalités en grille avec icône, titre et description.',
    blocks: [
      {
        id: 'root',
        type: 'vf-box',
        style: { display: 'flex', flexDirection: 'column', gap: '32px', padding: '80px 24px' },
        meta: { label: 'Section', locked: true },
        children: [
          {
            id: 'section-heading',
            type: 'vf-heading',
            text: 'Tout ce dont vous avez besoin',
            props: { tag: 'h2' },
            meta: { label: 'Titre de section', editableProps: [TAG_PROP] },
          },
          {
            id: 'section-desc',
            type: 'vf-text',
            text: 'Des outils pensés pour les équipes modernes.',
            props: { tag: 'p' },
            meta: { label: 'Description', editableProps: [TAG_PROP] },
          },
          {
            id: 'grid',
            type: 'vf-box',
            style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' },
            meta: { label: 'Grille', locked: true },
            children: [
              {
                id: 'feature-1',
                type: 'card',
                meta: { label: 'Fonctionnalité 1' },
                children: [
                  { id: 'icon-1', type: 'icon', props: { name: 'zap' }, meta: { label: 'Icône', editableProps: [{ key: 'name', label: 'Nom de l\'icône', type: 'text', default: 'zap' }] } },
                  { id: 'title-1', type: 'vf-heading', text: 'Rapidité', props: { tag: 'h3' }, meta: { label: 'Titre', editableProps: [TAG_PROP] } },
                  { id: 'desc-1', type: 'vf-text', text: 'Des performances optimisées pour une expérience fluide.', props: { tag: 'p' }, meta: { label: 'Description', editableProps: [TAG_PROP] } },
                ],
              },
              {
                id: 'feature-2',
                type: 'card',
                meta: { label: 'Fonctionnalité 2' },
                children: [
                  { id: 'icon-2', type: 'icon', props: { name: 'shield' }, meta: { label: 'Icône', editableProps: [{ key: 'name', label: 'Nom de l\'icône', type: 'text', default: 'shield' }] } },
                  { id: 'title-2', type: 'vf-heading', text: 'Sécurité', props: { tag: 'h3' }, meta: { label: 'Titre', editableProps: [TAG_PROP] } },
                  { id: 'desc-2', type: 'vf-text', text: 'Données chiffrées et sauvegardes automatiques.', props: { tag: 'p' }, meta: { label: 'Description', editableProps: [TAG_PROP] } },
                ],
              },
              {
                id: 'feature-3',
                type: 'card',
                meta: { label: 'Fonctionnalité 3' },
                children: [
                  { id: 'icon-3', type: 'icon', props: { name: 'layers' }, meta: { label: 'Icône', editableProps: [{ key: 'name', label: 'Nom de l\'icône', type: 'text', default: 'layers' }] } },
                  { id: 'title-3', type: 'vf-heading', text: 'Flexibilité', props: { tag: 'h3' }, meta: { label: 'Titre', editableProps: [TAG_PROP] } },
                  { id: 'desc-3', type: 'vf-text', text: 'Compatible avec tous les design systems Vue.js.', props: { tag: 'p' }, meta: { label: 'Description', editableProps: [TAG_PROP] } },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'features-list',
    name: 'Liste de Fonctionnalités',
    category: 'features',
    description: 'Fonctionnalités en liste avec icône et texte descriptif.',
    blocks: [
      {
        id: 'root',
        type: 'vf-box',
        style: { display: 'flex', flexDirection: 'column', gap: '32px', padding: '80px 24px' },
        meta: { label: 'Section', locked: true },
        children: [
          {
            id: 'grid',
            type: 'vf-box',
            style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '48px', alignItems: 'start' },
            meta: { label: 'Grille', locked: true },
            children: [
              {
                id: 'col-text',
                type: 'vf-box',
                style: { display: 'flex', flexDirection: 'column', gap: '16px' },
                meta: { label: 'Colonne texte' },
                children: [
                  { id: 'label', type: 'badge', text: 'Fonctionnalités', meta: { label: 'Badge', editableProps: [{ key: 'text', label: 'Badge', type: 'text', default: 'Fonctionnalités' }] } },
                  { id: 'heading', type: 'vf-heading', text: 'Conçu pour les équipes', props: { tag: 'h2' }, meta: { label: 'Titre', editableProps: [TAG_PROP] } },
                  { id: 'desc', type: 'vf-text', text: 'Toutes les fonctionnalités dont vous avez besoin pour créer des expériences exceptionnelles.', props: { tag: 'p' }, meta: { label: 'Description', editableProps: [TAG_PROP] } },
                ],
              },
              {
                id: 'col-list',
                type: 'vf-box',
                style: { display: 'flex', flexDirection: 'column', gap: '12px' },
                meta: { label: 'Colonne liste' },
                children: [
                  {
                    id: 'feat-row-1',
                    type: 'vf-box',
                    style: { display: 'flex', alignItems: 'flex-start', gap: '10px' },
                    meta: { label: 'Fonctionnalité 1' },
                    children: [
                      { id: 'feat-icon-1', type: 'icon', props: { name: 'check-circle', size: 20 }, meta: { label: 'Icône' } },
                      { id: 'feat-text-1', type: 'vf-text', text: 'Design system agnostique', props: { tag: 'p' }, meta: { label: 'Texte', editableProps: [TAG_PROP] } },
                    ],
                  },
                  {
                    id: 'feat-row-2',
                    type: 'vf-box',
                    style: { display: 'flex', alignItems: 'flex-start', gap: '10px' },
                    meta: { label: 'Fonctionnalité 2' },
                    children: [
                      { id: 'feat-icon-2', type: 'icon', props: { name: 'check-circle', size: 20 }, meta: { label: 'Icône' } },
                      { id: 'feat-text-2', type: 'vf-text', text: 'Sections pré-construites', props: { tag: 'p' }, meta: { label: 'Texte', editableProps: [TAG_PROP] } },
                    ],
                  },
                  {
                    id: 'feat-row-3',
                    type: 'vf-box',
                    style: { display: 'flex', alignItems: 'flex-start', gap: '10px' },
                    meta: { label: 'Fonctionnalité 3' },
                    children: [
                      { id: 'feat-icon-3', type: 'icon', props: { name: 'check-circle', size: 20 }, meta: { label: 'Icône' } },
                      { id: 'feat-text-3', type: 'vf-text', text: 'Drag & Drop intuitif', props: { tag: 'p' }, meta: { label: 'Texte', editableProps: [TAG_PROP] } },
                    ],
                  },
                  {
                    id: 'feat-row-4',
                    type: 'vf-box',
                    style: { display: 'flex', alignItems: 'flex-start', gap: '10px' },
                    meta: { label: 'Fonctionnalité 4' },
                    children: [
                      { id: 'feat-icon-4', type: 'icon', props: { name: 'check-circle', size: 20 }, meta: { label: 'Icône' } },
                      { id: 'feat-text-4', type: 'vf-text', text: 'Export JSON portable', props: { tag: 'p' }, meta: { label: 'Texte', editableProps: [TAG_PROP] } },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]
