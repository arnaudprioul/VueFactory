import type { IEditableProp } from '../interfaces/editable-prop.interface'

export const TAG_PROP: IEditableProp = {
  key: 'tag',
  label: 'Balise HTML',
  type: 'select',
  default: 'p',
  options: [
    { value: 'h1', label: 'H1 — Titre principal' },
    { value: 'h2', label: 'H2 — Titre de section' },
    { value: 'h3', label: 'H3 — Sous-titre' },
    { value: 'h4', label: 'H4' },
    { value: 'h5', label: 'H5' },
    { value: 'h6', label: 'H6' },
    { value: 'p', label: 'p — Paragraphe' },
    { value: 'span', label: 'span — En ligne' },
    { value: 'strong', label: 'strong — Gras sémantique' },
    { value: 'em', label: 'em — Italique sémantique' },
  ],
}
