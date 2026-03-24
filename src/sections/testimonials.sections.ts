import type { SectionTemplate } from '../types'
import { TAG_PROP } from './shared'

export const testimonialsSections: SectionTemplate[] = [
  {
    id: 'testimonials-grid-3',
    name: 'Témoignages 3 Cartes',
    category: 'testimonials',
    description: 'Trois témoignages clients en grille avec avatar, étoiles et citation.',
    blocks: [
      {
        id: 'root',
        type: 'vf-box',
        style: { display: 'flex', flexDirection: 'column', gap: '40px', padding: '80px 24px', textAlign: 'center' },
        meta: { label: 'Section', locked: true },
        children: [
          {
            id: 'header',
            type: 'vf-box',
            style: { display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' },
            meta: { label: 'En-tête', locked: true },
            children: [
              { id: 'heading', type: 'vf-heading', text: 'Ce que disent nos clients', props: { tag: 'h2' }, meta: { label: 'Titre', editableProps: [TAG_PROP] } },
              { id: 'desc', type: 'vf-text', text: 'Des équipes du monde entier nous font confiance.', props: { tag: 'p' }, meta: { label: 'Description', editableProps: [TAG_PROP] } },
            ],
          },
          {
            id: 'grid',
            type: 'vf-box',
            style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', textAlign: 'left' },
            meta: { label: 'Grille', locked: true },
            children: [
              {
                id: 'testi-1',
                type: 'card',
                meta: { label: 'Témoignage 1' },
                children: [
                  {
                    id: 'stars-1',
                    type: 'vf-box',
                    style: { display: 'flex', flexDirection: 'row', gap: '2px', marginBottom: '12px' },
                    meta: { label: 'Étoiles', locked: true },
                    children: [
                      { id: 'star-1-1', type: 'icon', props: { name: 'star', size: 16 }, meta: { label: 'Étoile' } },
                      { id: 'star-1-2', type: 'icon', props: { name: 'star', size: 16 }, meta: { label: 'Étoile' } },
                      { id: 'star-1-3', type: 'icon', props: { name: 'star', size: 16 }, meta: { label: 'Étoile' } },
                      { id: 'star-1-4', type: 'icon', props: { name: 'star', size: 16 }, meta: { label: 'Étoile' } },
                      { id: 'star-1-5', type: 'icon', props: { name: 'star', size: 16 }, meta: { label: 'Étoile' } },
                    ],
                  },
                  { id: 'quote-1', type: 'vf-text', text: '« VueFactory a transformé notre workflow. Nous livrons des pages deux fois plus vite. »', props: { tag: 'p' }, meta: { label: 'Citation', editableProps: [TAG_PROP] } },
                  {
                    id: 'author-row-1',
                    type: 'vf-box',
                    style: { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px', marginTop: '16px' },
                    meta: { label: 'Auteur', locked: true },
                    children: [
                      {
                        id: 'avatar-1',
                        type: 'image',
                        props: { src: 'https://i.pravatar.cc/48?img=1', alt: 'Avatar' },
                        style: { width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' },
                        meta: {
                          label: 'Avatar',
                          editableProps: [
                            { key: 'src', label: 'Photo', type: 'image-url', default: 'https://i.pravatar.cc/48?img=1' },
                            { key: 'alt', label: 'Alt', type: 'text', default: 'Avatar' },
                          ],
                        },
                      },
                      {
                        id: 'author-info-1',
                        type: 'vf-box',
                        style: { display: 'flex', flexDirection: 'column', gap: '2px' },
                        meta: { label: 'Infos auteur', locked: true },
                        children: [
                          { id: 'author-name-1', type: 'vf-text', text: 'Sophie Martin', props: { tag: 'strong' }, meta: { label: 'Nom', editableProps: [TAG_PROP] } },
                          { id: 'author-role-1', type: 'vf-text', text: 'Lead Developer — Acme Corp', props: { tag: 'p' }, meta: { label: 'Poste', editableProps: [TAG_PROP] } },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                id: 'testi-2',
                type: 'card',
                meta: { label: 'Témoignage 2' },
                children: [
                  {
                    id: 'stars-2',
                    type: 'vf-box',
                    style: { display: 'flex', flexDirection: 'row', gap: '2px', marginBottom: '12px' },
                    meta: { label: 'Étoiles', locked: true },
                    children: [
                      { id: 'star-2-1', type: 'icon', props: { name: 'star', size: 16 }, meta: { label: 'Étoile' } },
                      { id: 'star-2-2', type: 'icon', props: { name: 'star', size: 16 }, meta: { label: 'Étoile' } },
                      { id: 'star-2-3', type: 'icon', props: { name: 'star', size: 16 }, meta: { label: 'Étoile' } },
                      { id: 'star-2-4', type: 'icon', props: { name: 'star', size: 16 }, meta: { label: 'Étoile' } },
                      { id: 'star-2-5', type: 'icon', props: { name: 'star', size: 16 }, meta: { label: 'Étoile' } },
                    ],
                  },
                  { id: 'quote-2', type: 'vf-text', text: '« L\'intégration avec notre design system DaisyUI a été parfaite. Zéro friction. »', props: { tag: 'p' }, meta: { label: 'Citation', editableProps: [TAG_PROP] } },
                  {
                    id: 'author-row-2',
                    type: 'vf-box',
                    style: { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px', marginTop: '16px' },
                    meta: { label: 'Auteur', locked: true },
                    children: [
                      {
                        id: 'avatar-2',
                        type: 'image',
                        props: { src: 'https://i.pravatar.cc/48?img=5', alt: 'Avatar' },
                        style: { width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' },
                        meta: {
                          label: 'Avatar',
                          editableProps: [
                            { key: 'src', label: 'Photo', type: 'image-url', default: 'https://i.pravatar.cc/48?img=5' },
                            { key: 'alt', label: 'Alt', type: 'text', default: 'Avatar' },
                          ],
                        },
                      },
                      {
                        id: 'author-info-2',
                        type: 'vf-box',
                        style: { display: 'flex', flexDirection: 'column', gap: '2px' },
                        meta: { label: 'Infos auteur', locked: true },
                        children: [
                          { id: 'author-name-2', type: 'vf-text', text: 'Thomas Dubois', props: { tag: 'strong' }, meta: { label: 'Nom', editableProps: [TAG_PROP] } },
                          { id: 'author-role-2', type: 'vf-text', text: 'CTO — StartupXYZ', props: { tag: 'p' }, meta: { label: 'Poste', editableProps: [TAG_PROP] } },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                id: 'testi-3',
                type: 'card',
                meta: { label: 'Témoignage 3' },
                children: [
                  {
                    id: 'stars-3',
                    type: 'vf-box',
                    style: { display: 'flex', flexDirection: 'row', gap: '2px', marginBottom: '12px' },
                    meta: { label: 'Étoiles', locked: true },
                    children: [
                      { id: 'star-3-1', type: 'icon', props: { name: 'star', size: 16 }, meta: { label: 'Étoile' } },
                      { id: 'star-3-2', type: 'icon', props: { name: 'star', size: 16 }, meta: { label: 'Étoile' } },
                      { id: 'star-3-3', type: 'icon', props: { name: 'star', size: 16 }, meta: { label: 'Étoile' } },
                      { id: 'star-3-4', type: 'icon', props: { name: 'star', size: 16 }, meta: { label: 'Étoile' } },
                      { id: 'star-3-5', type: 'icon', props: { name: 'star', size: 16 }, meta: { label: 'Étoile' } },
                    ],
                  },
                  { id: 'quote-3', type: 'vf-text', text: '« Nos clients adorent la rapidité de mise en ligne. Le page builder est intuitif et puissant. »', props: { tag: 'p' }, meta: { label: 'Citation', editableProps: [TAG_PROP] } },
                  {
                    id: 'author-row-3',
                    type: 'vf-box',
                    style: { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px', marginTop: '16px' },
                    meta: { label: 'Auteur', locked: true },
                    children: [
                      {
                        id: 'avatar-3',
                        type: 'image',
                        props: { src: 'https://i.pravatar.cc/48?img=9', alt: 'Avatar' },
                        style: { width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' },
                        meta: {
                          label: 'Avatar',
                          editableProps: [
                            { key: 'src', label: 'Photo', type: 'image-url', default: 'https://i.pravatar.cc/48?img=9' },
                            { key: 'alt', label: 'Alt', type: 'text', default: 'Avatar' },
                          ],
                        },
                      },
                      {
                        id: 'author-info-3',
                        type: 'vf-box',
                        style: { display: 'flex', flexDirection: 'column', gap: '2px' },
                        meta: { label: 'Infos auteur', locked: true },
                        children: [
                          { id: 'author-name-3', type: 'vf-text', text: 'Clara Lefèvre', props: { tag: 'strong' }, meta: { label: 'Nom', editableProps: [TAG_PROP] } },
                          { id: 'author-role-3', type: 'vf-text', text: 'Product Manager — BigCo', props: { tag: 'p' }, meta: { label: 'Poste', editableProps: [TAG_PROP] } },
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
    ],
  },
]
