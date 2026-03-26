import type { SectionTemplate } from '../types'
import { TAG_PROP } from './shared'

export const heroSections: SectionTemplate[] = [
  {
    id: 'hero-centered',
    name: 'Hero Centré',
    category: 'hero',
    description: 'Grand titre centré avec sous-titre et bouton d\'appel à l\'action.',
    blocks: [
      {
        id: 'root',
        type: 'vf-box',
        style: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '24px', padding: '80px 24px' },
        meta: { label: 'Conteneur Hero', locked: true },
        children: [
          {
            id: 'heading',
            type: 'vf-heading',
            text: 'Créez des pages qui convertissent',
            props: { tag: 'h1' },
            meta: { label: 'Titre principal', editableProps: [TAG_PROP] },
          },
          {
            id: 'subheading',
            type: 'vf-text',
            text: 'Un page builder puissant, compatible avec n\'importe quel design system Vue.js.',
            props: { tag: 'p' },
            meta: { label: 'Sous-titre', editableProps: [TAG_PROP] },
          },
          {
            id: 'cta-row',
            type: 'vf-box',
            style: { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' },
            meta: { label: 'Ligne de boutons', locked: true },
            children: [
              {
                id: 'cta-primary',
                type: 'vf-button',
                text: 'Commencer gratuitement',
                props: { variant: 'primary' },
                meta: {
                  label: 'Bouton principal',
                  editableProps: [
                    { key: 'text', label: 'Texte du bouton', type: 'text', default: 'Commencer gratuitement' },
                    { key: 'href', label: 'Lien', type: 'url', default: '#' },
                    { key: 'variant', label: 'Variante', type: 'select', options: [{ value: 'primary', label: 'Principal' }, { value: 'secondary', label: 'Secondaire' }, { value: 'ghost', label: 'Fantôme' }] },
                  ],
                },
              },
              {
                id: 'cta-secondary',
                type: 'vf-button',
                text: 'Voir la démo',
                props: { variant: 'ghost' },
                meta: {
                  label: 'Bouton secondaire',
                  editableProps: [
                    { key: 'text', label: 'Texte du bouton', type: 'text', default: 'Voir la démo' },
                    { key: 'href', label: 'Lien', type: 'url', default: '#' },
                  ],
                },
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'hero-split',
    name: 'Hero avec Image',
    category: 'hero',
    description: 'Texte à gauche et image illustrative à droite.',
    blocks: [
      {
        id: 'root',
        type: 'vf-box',
        style: { padding: '80px 24px' },
        meta: { label: 'Conteneur Hero', locked: true },
        children: [
          {
            id: 'grid',
            type: 'vf-box',
            style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '48px', alignItems: 'center' },
            meta: { label: 'Grille 2 colonnes', locked: true },
            children: [
              {
                id: 'col-text',
                type: 'vf-box',
                style: { display: 'flex', flexDirection: 'column', gap: '16px' },
                meta: { label: 'Colonne texte', locked: true },
                children: [
                  {
                    id: 'badge',
                    type: 'vf-chip',
                    text: 'Nouveauté',
                    meta: { label: 'Badge', editableProps: [{ key: 'text', label: 'Texte du badge', type: 'text', default: 'Nouveauté' }] },
                  },
                  {
                    id: 'heading',
                    type: 'vf-heading',
                    text: 'Votre prochain projet, plus vite',
                    props: { tag: 'h1' },
                    meta: { label: 'Titre', editableProps: [TAG_PROP] },
                  },
                  {
                    id: 'text',
                    type: 'vf-text',
                    text: 'Construisez des interfaces riches sans compromis sur la qualité. Compatible avec tous les design systems Vue.',
                    props: { tag: 'p' },
                    meta: { label: 'Description', editableProps: [TAG_PROP] },
                  },
                  {
                    id: 'cta',
                    type: 'vf-button',
                    text: 'Démarrer maintenant',
                    props: { variant: 'primary' },
                    meta: { label: 'CTA', editableProps: [{ key: 'text', label: 'Bouton', type: 'text', default: 'Démarrer maintenant' }, { key: 'href', label: 'Lien', type: 'url', default: '#' }] },
                  },
                ],
              },
              {
                id: 'col-image',
                type: 'vf-box',
                style: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
                meta: { label: 'Colonne image', locked: true },
                children: [
                  {
                    id: 'hero-image',
                    type: 'vf-img',
                    props: { src: 'https://placehold.co/600x400', alt: 'Illustration hero', width: '100%' },
                    meta: {
                      label: 'Image hero',
                      editableProps: [
                        { key: 'src', label: 'URL de l\'image', type: 'image-url', default: 'https://placehold.co/600x400' },
                        { key: 'alt', label: 'Texte alternatif', type: 'text', default: 'Illustration' },
                      ],
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'hero-minimal',
    name: 'Hero Minimaliste',
    category: 'hero',
    description: 'Titre épuré avec un seul bouton d\'action, style minimaliste.',
    blocks: [
      {
        id: 'root',
        type: 'vf-box',
        style: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '24px', padding: '80px 24px' },
        meta: { label: 'Conteneur', locked: true },
        children: [
          {
            id: 'heading',
            type: 'vf-heading',
            text: 'Simple. Efficace. Puissant.',
            props: { tag: 'h1' },
            meta: { label: 'Titre', editableProps: [TAG_PROP] },
          },
          {
            id: 'cta',
            type: 'vf-button',
            text: 'Explorer',
            props: { variant: 'primary' },
            meta: { label: 'Bouton', editableProps: [{ key: 'text', label: 'Bouton', type: 'text', default: 'Explorer' }, { key: 'href', label: 'Lien', type: 'url', default: '#' }] },
          },
        ],
      },
    ],
  },
]
