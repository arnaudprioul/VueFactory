import type { SectionTemplate } from '../types'
import { TAG_PROP } from './shared'

export const footerSections: SectionTemplate[] = [
  {
    id: 'footer-simple',
    name: 'Pied de page Simple',
    category: 'footer',
    description: 'Pied de page minimaliste avec logo, liens et copyright.',
    blocks: [
      {
        id: 'root',
        type: 'vf-box',
        style: { display: 'flex', flexDirection: 'column', gap: '24px', padding: '40px 24px' },
        meta: { label: 'Footer', locked: true },
        children: [
          {
            id: 'row',
            type: 'vf-box',
            style: { display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '48px', flexWrap: 'wrap' },
            meta: { label: 'Ligne', locked: true },
            children: [
              {
                id: 'col-brand',
                type: 'vf-box',
                style: { display: 'flex', flexDirection: 'column', gap: '8px' },
                meta: { label: 'Marque' },
                children: [
                  { id: 'brand-name', type: 'vf-heading', text: 'VueFactory', props: { tag: 'h3' }, meta: { label: 'Nom de marque', editableProps: [TAG_PROP] } },
                  { id: 'brand-desc', type: 'vf-text', text: 'Page builder Vue.js.', props: { tag: 'p' }, meta: { label: 'Description', editableProps: [TAG_PROP] } },
                ],
              },
              {
                id: 'col-links',
                type: 'vf-box',
                style: { display: 'flex', flexDirection: 'column', gap: '8px' },
                meta: { label: 'Liens' },
                children: [
                  { id: 'link-1', type: 'vf-link', text: 'Accueil', props: { href: '#' }, meta: { label: 'Lien 1', editableProps: [{ key: 'text', label: 'Texte', type: 'text', default: 'Accueil' }, { key: 'href', label: 'URL', type: 'url', default: '#' }] } },
                  { id: 'link-2', type: 'vf-link', text: 'Fonctionnalités', props: { href: '#' }, meta: { label: 'Lien 2', editableProps: [{ key: 'text', label: 'Texte', type: 'text', default: 'Fonctionnalités' }, { key: 'href', label: 'URL', type: 'url', default: '#' }] } },
                  { id: 'link-3', type: 'vf-link', text: 'Tarifs', props: { href: '#' }, meta: { label: 'Lien 3', editableProps: [{ key: 'text', label: 'Texte', type: 'text', default: 'Tarifs' }, { key: 'href', label: 'URL', type: 'url', default: '#' }] } },
                  { id: 'link-4', type: 'vf-link', text: 'Contact', props: { href: '#' }, meta: { label: 'Lien 4', editableProps: [{ key: 'text', label: 'Texte', type: 'text', default: 'Contact' }, { key: 'href', label: 'URL', type: 'url', default: '#' }] } },
                ],
              },
            ],
          },
          { id: 'divider', type: 'vf-divider', meta: { label: 'Séparateur', locked: true } },
          {
            id: 'bottom-row',
            type: 'vf-box',
            style: { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' },
            meta: { label: 'Bas de page', locked: true },
            children: [
              { id: 'copyright', type: 'vf-text', text: '© 2026 VueFactory. Tous droits réservés.', props: { tag: 'p' }, meta: { label: 'Copyright', editableProps: [TAG_PROP] } },
              {
                id: 'social-links',
                type: 'vf-box',
                style: { display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center' },
                meta: { label: 'Icônes sociales' },
                children: [
                  { id: 'social-github', type: 'vf-icon', props: { name: 'code', size: 18 }, meta: { label: 'GitHub' } },
                  { id: 'social-twitter', type: 'vf-icon', props: { name: 'message', size: 18 }, meta: { label: 'Twitter / X' } },
                  { id: 'social-linkedin', type: 'vf-icon', props: { name: 'briefcase', size: 18 }, meta: { label: 'LinkedIn' } },
                  { id: 'social-mail', type: 'vf-icon', props: { name: 'mail', size: 18 }, meta: { label: 'Email' } },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]
