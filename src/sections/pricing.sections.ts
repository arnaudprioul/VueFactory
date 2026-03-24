import type { SectionTemplate } from '../types'
import { TAG_PROP } from './shared'

export const pricingSections: SectionTemplate[] = [
  {
    id: 'pricing-cards-3',
    name: 'Tarification 3 Plans',
    category: 'pricing',
    description: 'Trois cartes de tarification avec liste de fonctionnalités et CTA.',
    blocks: [
      {
        id: 'root',
        type: 'vf-box',
        style: { display: 'flex', flexDirection: 'column', gap: '32px', padding: '80px 24px' },
        meta: { label: 'Section', locked: true },
        children: [
          { id: 'heading', type: 'vf-heading', text: 'Des tarifs transparents', props: { tag: 'h2' }, meta: { label: 'Titre', editableProps: [TAG_PROP] } },
          { id: 'desc', type: 'vf-text', text: 'Choisissez le plan qui correspond à vos besoins. Sans engagement.', props: { tag: 'p' }, meta: { label: 'Description', editableProps: [TAG_PROP] } },
          {
            id: 'grid',
            type: 'vf-box',
            style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', alignItems: 'start' },
            meta: { label: 'Grille', locked: true },
            children: [
              {
                id: 'plan-starter',
                type: 'card',
                meta: { label: 'Plan Starter' },
                children: [
                  { id: 'plan-name-1', type: 'vf-heading', text: 'Starter', props: { tag: 'h3' }, meta: { label: 'Nom du plan', editableProps: [TAG_PROP] } },
                  { id: 'plan-price-1', type: 'vf-heading', text: '0 €', props: { tag: 'h2' }, meta: { label: 'Prix', editableProps: [TAG_PROP] } },
                  { id: 'plan-desc-1', type: 'vf-text', text: 'Par mois, pour toujours', props: { tag: 'p' }, meta: { label: 'Fréquence', editableProps: [TAG_PROP] } },
                  { id: 'divider-1', type: 'divider', meta: { label: 'Séparateur', locked: true } },
                  {
                    id: 'features-1',
                    type: 'list',
                    meta: { label: 'Fonctionnalités' },
                    children: [
                      { id: 'f1-1', type: 'list-item', text: '3 projets', meta: { label: 'Fonctionnalité', editableProps: [{ key: 'text', label: 'Texte', type: 'text', default: '3 projets' }] } },
                      { id: 'f1-2', type: 'list-item', text: '1 Go de stockage', meta: { label: 'Fonctionnalité', editableProps: [{ key: 'text', label: 'Texte', type: 'text', default: '1 Go de stockage' }] } },
                      { id: 'f1-3', type: 'list-item', text: 'Support communauté', meta: { label: 'Fonctionnalité', editableProps: [{ key: 'text', label: 'Texte', type: 'text', default: 'Support communauté' }] } },
                    ],
                  },
                  { id: 'cta-1', type: 'button', text: 'Commencer', props: { variant: 'secondary' }, meta: { label: 'CTA', editableProps: [{ key: 'text', label: 'Bouton', type: 'text', default: 'Commencer' }, { key: 'href', label: 'Lien', type: 'url', default: '#' }] } },
                ],
              },
              {
                id: 'plan-pro',
                type: 'card',
                props: { highlighted: true },
                meta: { label: 'Plan Pro' },
                children: [
                  { id: 'badge-popular', type: 'badge', text: 'Populaire', meta: { label: 'Badge', editableProps: [{ key: 'text', label: 'Badge', type: 'text', default: 'Populaire' }] } },
                  { id: 'plan-name-2', type: 'vf-heading', text: 'Pro', props: { tag: 'h3' }, meta: { label: 'Nom du plan', editableProps: [TAG_PROP] } },
                  { id: 'plan-price-2', type: 'vf-heading', text: '29 €', props: { tag: 'h2' }, meta: { label: 'Prix', editableProps: [TAG_PROP] } },
                  { id: 'plan-desc-2', type: 'vf-text', text: 'Par mois, par utilisateur', props: { tag: 'p' }, meta: { label: 'Fréquence', editableProps: [TAG_PROP] } },
                  { id: 'divider-2', type: 'divider', meta: { label: 'Séparateur', locked: true } },
                  {
                    id: 'features-2',
                    type: 'list',
                    meta: { label: 'Fonctionnalités' },
                    children: [
                      { id: 'f2-1', type: 'list-item', text: 'Projets illimités', meta: { label: 'Fonctionnalité', editableProps: [{ key: 'text', label: 'Texte', type: 'text', default: 'Projets illimités' }] } },
                      { id: 'f2-2', type: 'list-item', text: '50 Go de stockage', meta: { label: 'Fonctionnalité', editableProps: [{ key: 'text', label: 'Texte', type: 'text', default: '50 Go de stockage' }] } },
                      { id: 'f2-3', type: 'list-item', text: 'Support prioritaire', meta: { label: 'Fonctionnalité', editableProps: [{ key: 'text', label: 'Texte', type: 'text', default: 'Support prioritaire' }] } },
                      { id: 'f2-4', type: 'list-item', text: 'Analyses avancées', meta: { label: 'Fonctionnalité', editableProps: [{ key: 'text', label: 'Texte', type: 'text', default: 'Analyses avancées' }] } },
                    ],
                  },
                  { id: 'cta-2', type: 'button', text: 'Essayer Pro', props: { variant: 'primary' }, meta: { label: 'CTA', editableProps: [{ key: 'text', label: 'Bouton', type: 'text', default: 'Essayer Pro' }, { key: 'href', label: 'Lien', type: 'url', default: '#' }] } },
                ],
              },
              {
                id: 'plan-enterprise',
                type: 'card',
                meta: { label: 'Plan Enterprise' },
                children: [
                  { id: 'plan-name-3', type: 'vf-heading', text: 'Enterprise', props: { tag: 'h3' }, meta: { label: 'Nom du plan', editableProps: [TAG_PROP] } },
                  { id: 'plan-price-3', type: 'vf-heading', text: 'Sur devis', props: { tag: 'h2' }, meta: { label: 'Prix', editableProps: [TAG_PROP] } },
                  { id: 'plan-desc-3', type: 'vf-text', text: 'Solution personnalisée', props: { tag: 'p' }, meta: { label: 'Fréquence', editableProps: [TAG_PROP] } },
                  { id: 'divider-3', type: 'divider', meta: { label: 'Séparateur', locked: true } },
                  {
                    id: 'features-3',
                    type: 'list',
                    meta: { label: 'Fonctionnalités' },
                    children: [
                      { id: 'f3-1', type: 'list-item', text: 'Tout en Pro', meta: { label: 'Fonctionnalité', editableProps: [{ key: 'text', label: 'Texte', type: 'text', default: 'Tout en Pro' }] } },
                      { id: 'f3-2', type: 'list-item', text: 'SLA garanti', meta: { label: 'Fonctionnalité', editableProps: [{ key: 'text', label: 'Texte', type: 'text', default: 'SLA garanti' }] } },
                      { id: 'f3-3', type: 'list-item', text: 'Déploiement on-premise', meta: { label: 'Fonctionnalité', editableProps: [{ key: 'text', label: 'Texte', type: 'text', default: 'Déploiement on-premise' }] } },
                      { id: 'f3-4', type: 'list-item', text: 'Manager dédié', meta: { label: 'Fonctionnalité', editableProps: [{ key: 'text', label: 'Texte', type: 'text', default: 'Manager dédié' }] } },
                    ],
                  },
                  { id: 'cta-3', type: 'button', text: 'Nous contacter', props: { variant: 'secondary' }, meta: { label: 'CTA', editableProps: [{ key: 'text', label: 'Bouton', type: 'text', default: 'Nous contacter' }, { key: 'href', label: 'Lien', type: 'url', default: '#' }] } },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]
