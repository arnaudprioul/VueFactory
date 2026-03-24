---
name: page_builder_architecture
description: Architecture du page builder VueFactory — design systems, sections, composable, composants, theming
type: project
---

# VueFactory Page Builder — Architecture

**Why:** Library Vue 3 agnostique pour construire un page builder à la Elementor/Breakdance/Divi, compatible avec n'importe quel design system.

## Structure (conventions mars 2026)

```
src/
  components/        # Composants Vue (Vf prefix)
  composables/       # Composables use* / create* — fonctions internes en const
  consts/            # Constantes UPPERCASE (SECTION_CATEGORY_LABELS, TAG_PROP, etc.)
  design-systems/    # Adapters DS + registry
  enums/             # Enums E-prefixed (EDesignSystemId, ESectionCategory, EGenericComponentType)
  interfaces/        # Interfaces I-prefixed (IDesignSystemAdapter, IBlockDefinition, etc.)
  sections/          # Définitions de sections préfabriquées
  types/             # Types T-prefixed + aliases backward-compat
  utils/             # Fonctions utilitaires (edit-wrapper.util, adapter.utils)
  assets/scss/       # SCSS (main.scss, variables/, helpers/)
  plugin.ts          # createVueFactory plugin
  index.ts           # Export point principal
```

## Composants principaux

- `VfPageBuilder.vue` — Composant principal, toolbar, canvas, page frame
- `VfSectionPicker.vue` — Panneau gauche, cartes de sections
- `VfSectionRenderer.vue` — Rendu d'une section + controls overlay
- `VfBlockRenderer.vue` — Rendu récursif d'un bloc (délègue au DS adapter)
- `VfPropertiesPanel.vue` — Panneau droite, propriétés
- `VfDesignSystemMapper.vue` — Modal choix du DS
- `VfSectionEditor.vue` — Édition des blocs d'une section

## Block types builtin

- `vf-heading` : blocs titre (h1-h6), tag default `h2`
- `vf-text` : blocs texte (p/span/strong/em), tag default `p`
- `vf-button`, `vf-image`, `vf-icon`

## Design systems disponibles

- `html` (fallback), `vuetify`, `primevue`, `element-plus`, `naive-ui`, `daisyui`
- Config: `createVueFactory({ designSystemId: 'daisyui' })`
- Le DS configuré dans le plugin est le default ; une valeur `html` dans `initialPage.designSystemId` est traitée comme "non défini" → le default du plugin gagne

## UX (Elementor-like)

- Canvas centré (blanc, ombre), max-width selon breakpoint (desktop/tablet/mobile)
- "+" entre sections : `addSectionById(id, atIndex)`
- Section controls overlay : hover/sélection, drag handle + up/down/duplicate/delete
- Undo/redo (50 entrées max)

## SCSS Architecture

```
src/assets/scss/
  main.scss              # Entrée principale
  variables/
    _colors.scss         # Palette + semantic aliases
    _typography.scss     # Fonts, sizes, weights
    _spacing.scss        # Scale + section padding
    _effects.scss        # Shadows, border-radius, transitions
    _breakpoints.scss    # Breakpoints + mixins screen-*
    _index.scss          # @forward all
  helpers/
    _reset.scss          # box-sizing, font-smoothing
    _layout.scss         # flex/grid/gap utilities
    _text.scss           # text-align/color/size/weight
    _index.scss          # @forward all
  _sections.scss         # Styles blocs/sections
```

**How to apply:** Respecter les conventions (I/T/E/CONST), garder les fonctions internes des composables en `const`, importer les constantes depuis `consts/` et non `types/`.
