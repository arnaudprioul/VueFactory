import type { SectionTemplate } from '../types'
import { TAG_PROP } from './shared'

export const statsSections: SectionTemplate[] = [
  {
    id: 'stats-row-4',
    name: 'Statistiques 4 Chiffres',
    category: 'stats',
    description: 'Quatre métriques clés sur une ligne avec chiffre et description.',
    blocks: [
      {
        id: 'root',
        type: 'vf-box',
        style: { padding: '80px 24px' },
        meta: { label: 'Section Stats', locked: true },
        children: [
          {
            id: 'grid',
            type: 'vf-box',
            style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' },
            meta: { label: 'Grille', locked: true },
            children: [
              {
                id: 'stat-1',
                type: 'vf-box',
                style: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' },
                meta: { label: 'Statistique 1' },
                children: [
                  { id: 'icon-1', type: 'vf-icon', props: { name: 'users', size: 32 }, meta: { label: 'Icône' } },
                  { id: 'number-1', type: 'vf-heading', text: '10 000+', props: { tag: 'h2' }, meta: { label: 'Chiffre', editableProps: [TAG_PROP] } },
                  { id: 'label-1', type: 'vf-text', text: 'Utilisateurs actifs', props: { tag: 'p' }, meta: { label: 'Label', editableProps: [TAG_PROP] } },
                ],
              },
              {
                id: 'stat-2',
                type: 'vf-box',
                style: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' },
                meta: { label: 'Statistique 2' },
                children: [
                  { id: 'icon-2', type: 'vf-icon', props: { name: 'trending-up', size: 32 }, meta: { label: 'Icône' } },
                  { id: 'number-2', type: 'vf-heading', text: '99,9%', props: { tag: 'h2' }, meta: { label: 'Chiffre', editableProps: [TAG_PROP] } },
                  { id: 'label-2', type: 'vf-text', text: 'Disponibilité', props: { tag: 'p' }, meta: { label: 'Label', editableProps: [TAG_PROP] } },
                ],
              },
              {
                id: 'stat-3',
                type: 'vf-box',
                style: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' },
                meta: { label: 'Statistique 3' },
                children: [
                  { id: 'icon-3', type: 'vf-icon', props: { name: 'layers', size: 32 }, meta: { label: 'Icône' } },
                  { id: 'number-3', type: 'vf-heading', text: '500+', props: { tag: 'h2' }, meta: { label: 'Chiffre', editableProps: [TAG_PROP] } },
                  { id: 'label-3', type: 'vf-text', text: 'Intégrations', props: { tag: 'p' }, meta: { label: 'Label', editableProps: [TAG_PROP] } },
                ],
              },
              {
                id: 'stat-4',
                type: 'vf-box',
                style: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' },
                meta: { label: 'Statistique 4' },
                children: [
                  { id: 'icon-4', type: 'vf-icon', props: { name: 'star', size: 32 }, meta: { label: 'Icône' } },
                  { id: 'number-4', type: 'vf-heading', text: '4,9/5', props: { tag: 'h2' }, meta: { label: 'Chiffre', editableProps: [TAG_PROP] } },
                  { id: 'label-4', type: 'vf-text', text: 'Note moyenne', props: { tag: 'p' }, meta: { label: 'Label', editableProps: [TAG_PROP] } },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]
