import type { SectionTemplate } from '../types'
import { TAG_PROP } from './shared'

export const teamSections: SectionTemplate[] = [
  {
    id: 'team-grid-3',
    name: 'Équipe 3 Membres',
    category: 'team',
    description: 'Présentation de l\'équipe en grille avec photo, nom, rôle et icônes sociales.',
    blocks: [
      {
        id: 'root',
        type: 'vf-box',
        style: { display: 'flex', flexDirection: 'column', gap: '40px', padding: '80px 24px' },
        meta: { label: 'Section', locked: true },
        children: [
          {
            id: 'header',
            type: 'vf-box',
            style: { display: 'flex', flexDirection: 'column', gap: '12px' },
            meta: { label: 'En-tête', locked: true },
            children: [
              { id: 'heading', type: 'vf-heading', text: 'Notre équipe', props: { tag: 'h2' }, meta: { label: 'Titre', editableProps: [TAG_PROP] } },
              { id: 'desc', type: 'vf-text', text: 'Des passionnés qui construisent le meilleur outil pour les développeurs Vue.', props: { tag: 'p' }, meta: { label: 'Description', editableProps: [TAG_PROP] } },
            ],
          },
          {
            id: 'grid',
            type: 'vf-box',
            style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' },
            meta: { label: 'Grille', locked: true },
            children: [
              {
                id: 'member-1',
                type: 'card',
                meta: { label: 'Membre 1' },
                children: [
                  {
                    id: 'photo-1',
                    type: 'image',
                    props: { src: 'https://i.pravatar.cc/300?img=12', alt: 'Photo membre' },
                    style: { width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' },
                    meta: {
                      label: 'Photo',
                      editableProps: [
                        { key: 'src', label: 'Photo', type: 'image-url', default: 'https://i.pravatar.cc/300?img=12' },
                        { key: 'alt', label: 'Alt', type: 'text', default: 'Photo membre' },
                      ],
                    },
                  },
                  { id: 'name-1', type: 'vf-heading', text: 'Alex Dupont', props: { tag: 'h3' }, meta: { label: 'Nom', editableProps: [TAG_PROP] } },
                  { id: 'role-1', type: 'vf-text', text: 'Co-fondateur & CEO', props: { tag: 'p' }, meta: { label: 'Rôle', editableProps: [TAG_PROP] } },
                  {
                    id: 'socials-1',
                    type: 'vf-box',
                    style: { display: 'flex', flexDirection: 'row', gap: '12px', marginTop: '12px' },
                    meta: { label: 'Socials', locked: true },
                    children: [
                      { id: 'linkedin-1', type: 'icon', props: { name: 'briefcase', size: 18 }, meta: { label: 'LinkedIn' } },
                      { id: 'twitter-1', type: 'icon', props: { name: 'message', size: 18 }, meta: { label: 'Twitter' } },
                      { id: 'mail-1', type: 'icon', props: { name: 'mail', size: 18 }, meta: { label: 'Email' } },
                    ],
                  },
                ],
              },
              {
                id: 'member-2',
                type: 'card',
                meta: { label: 'Membre 2' },
                children: [
                  {
                    id: 'photo-2',
                    type: 'image',
                    props: { src: 'https://i.pravatar.cc/300?img=25', alt: 'Photo membre' },
                    style: { width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' },
                    meta: {
                      label: 'Photo',
                      editableProps: [
                        { key: 'src', label: 'Photo', type: 'image-url', default: 'https://i.pravatar.cc/300?img=25' },
                        { key: 'alt', label: 'Alt', type: 'text', default: 'Photo membre' },
                      ],
                    },
                  },
                  { id: 'name-2', type: 'vf-heading', text: 'Marie Leclerc', props: { tag: 'h3' }, meta: { label: 'Nom', editableProps: [TAG_PROP] } },
                  { id: 'role-2', type: 'vf-text', text: 'Lead Designer', props: { tag: 'p' }, meta: { label: 'Rôle', editableProps: [TAG_PROP] } },
                  {
                    id: 'socials-2',
                    type: 'vf-box',
                    style: { display: 'flex', flexDirection: 'row', gap: '12px', marginTop: '12px' },
                    meta: { label: 'Socials', locked: true },
                    children: [
                      { id: 'linkedin-2', type: 'icon', props: { name: 'briefcase', size: 18 }, meta: { label: 'LinkedIn' } },
                      { id: 'twitter-2', type: 'icon', props: { name: 'message', size: 18 }, meta: { label: 'Twitter' } },
                      { id: 'globe-2', type: 'icon', props: { name: 'globe', size: 18 }, meta: { label: 'Site web' } },
                    ],
                  },
                ],
              },
              {
                id: 'member-3',
                type: 'card',
                meta: { label: 'Membre 3' },
                children: [
                  {
                    id: 'photo-3',
                    type: 'image',
                    props: { src: 'https://i.pravatar.cc/300?img=33', alt: 'Photo membre' },
                    style: { width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' },
                    meta: {
                      label: 'Photo',
                      editableProps: [
                        { key: 'src', label: 'Photo', type: 'image-url', default: 'https://i.pravatar.cc/300?img=33' },
                        { key: 'alt', label: 'Alt', type: 'text', default: 'Photo membre' },
                      ],
                    },
                  },
                  { id: 'name-3', type: 'vf-heading', text: 'Paul Bernard', props: { tag: 'h3' }, meta: { label: 'Nom', editableProps: [TAG_PROP] } },
                  { id: 'role-3', type: 'vf-text', text: 'Senior Engineer', props: { tag: 'p' }, meta: { label: 'Rôle', editableProps: [TAG_PROP] } },
                  {
                    id: 'socials-3',
                    type: 'vf-box',
                    style: { display: 'flex', flexDirection: 'row', gap: '12px', marginTop: '12px' },
                    meta: { label: 'Socials', locked: true },
                    children: [
                      { id: 'github-3', type: 'icon', props: { name: 'code', size: 18 }, meta: { label: 'GitHub' } },
                      { id: 'linkedin-3', type: 'icon', props: { name: 'briefcase', size: 18 }, meta: { label: 'LinkedIn' } },
                      { id: 'mail-3', type: 'icon', props: { name: 'mail', size: 18 }, meta: { label: 'Email' } },
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
