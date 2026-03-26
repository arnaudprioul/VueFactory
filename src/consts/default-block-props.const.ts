import type { IEditableProp } from '../interfaces/editable-prop.interface'

// ─── Default editable props per block type ────────────────────────────────────
// Automatically surfaced in the properties panel for every block of that type,
// even when the section template does not declare them explicitly.
// Block-level meta.editableProps override these defaults for the same key.

const VARIANT_PROP: IEditableProp = {
  key: 'variant',
  label: 'Variante',
  type: 'select',
  default: 'primary',
  options: [
    { value: 'primary',     label: 'Principal' },
    { value: 'secondary',   label: 'Secondaire' },
    { value: 'ghost',       label: 'Fantôme' },
    { value: 'outline',     label: 'Contour' },
    { value: 'destructive', label: 'Destructif' },
  ],
}

const HREF_PROP: IEditableProp = {
  key: 'href',
  label: 'Lien (href)',
  type: 'url',
  default: '#',
  placeholder: 'https://',
}

const TARGET_PROP: IEditableProp = {
  key: 'target',
  label: 'Ouverture',
  type: 'select',
  default: '_self',
  options: [
    { value: '_self',  label: 'Même onglet' },
    { value: '_blank', label: 'Nouvel onglet' },
  ],
}

const SIZE_PROP: IEditableProp = {
  key: 'size',
  label: 'Taille',
  type: 'select',
  default: 'md',
  options: [
    { value: 'sm', label: 'Petit' },
    { value: 'md', label: 'Moyen' },
    { value: 'lg', label: 'Grand' },
  ],
}

const DISABLED_PROP: IEditableProp = {
  key: 'disabled',
  label: 'Désactivé',
  type: 'boolean',
  default: false,
}

export const DEFAULT_BLOCK_PROPS: Record<string, IEditableProp[]> = {
  // ─── Button ────────────────────────────────────────────────────────────────
  'vf-button': [VARIANT_PROP, HREF_PROP, TARGET_PROP, SIZE_PROP, DISABLED_PROP],

  // ─── Image ─────────────────────────────────────────────────────────────────
  'vf-img': [
    { key: 'src',    label: 'URL de l\'image',  type: 'image-url', default: '',    placeholder: 'https://' },
    { key: 'alt',    label: 'Texte alternatif', type: 'text',      default: '',    placeholder: 'Description...' },
    { key: 'width',  label: 'Largeur',          type: 'text',      default: '100%' },
    { key: 'height', label: 'Hauteur',          type: 'text',      default: 'auto' },
  ],

  // ─── Icon ──────────────────────────────────────────────────────────────────
  'vf-icon': [
    { key: 'name',  label: 'Nom de l\'icône', type: 'text',   default: 'star' },
    { key: 'size',  label: 'Taille (px)',     type: 'number', default: 24 },
    { key: 'color', label: 'Couleur',         type: 'color',  default: 'currentColor' },
  ],

  // ─── Chip / Badge ──────────────────────────────────────────────────────────
  'vf-chip': [
    { key: 'variant', label: 'Variante', type: 'text', default: '', placeholder: 'primary, success...' },
    { key: 'color',   label: 'Couleur',  type: 'color', default: '' },
  ],

  // ─── Link ──────────────────────────────────────────────────────────────────
  'vf-link': [HREF_PROP, TARGET_PROP],

  // ─── vf-heading ────────────────────────────────────────────────────────────
  'vf-heading': [
    {
      key: 'tag',
      label: 'Niveau',
      type: 'select',
      default: 'h2',
      options: [
        { value: 'h1', label: 'H1 — Titre principal' },
        { value: 'h2', label: 'H2 — Titre de section' },
        { value: 'h3', label: 'H3 — Sous-titre' },
        { value: 'h4', label: 'H4' },
        { value: 'h5', label: 'H5' },
        { value: 'h6', label: 'H6' },
      ],
    },
  ],

  // ─── vf-text ───────────────────────────────────────────────────────────────
  'vf-text': [
    {
      key: 'tag',
      label: 'Balise HTML',
      type: 'select',
      default: 'p',
      options: [
        { value: 'p',      label: 'p — Paragraphe' },
        { value: 'span',   label: 'span — En ligne' },
        { value: 'div',    label: 'div — Bloc' },
        { value: 'strong', label: 'strong — Gras sémantique' },
        { value: 'em',     label: 'em — Italique sémantique' },
      ],
    },
  ],
}
