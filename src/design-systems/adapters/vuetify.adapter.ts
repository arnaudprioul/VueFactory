import type { DesignSystemAdapter } from '../../types'

/**
 * Vuetify 3 Adapter
 *
 * Requires Vuetify 3 to be installed and registered globally in the host app.
 * Components are referenced by their global registered names (e.g. 'v-btn').
 * No direct import of Vuetify is needed here — Vue resolveComponent() handles it at runtime.
 */
export const vuetifyAdapter: DesignSystemAdapter = {
  id: 'vuetify',
  name: 'Vuetify 3',
  version: '^3.x',
  componentMap: {
    button: {
      component: 'v-btn',
      defaultProps: { color: 'primary', variant: 'elevated' },
      propMap: {
        variant: { name: 'variant' },
        color: { name: 'color' },
        size: { name: 'size' },
        disabled: { name: 'disabled' },
        href: { name: 'href' },
      },
    },
    image: {
      component: 'v-img',
      defaultProps: { cover: true },
      propMap: {
        src: { name: 'src' },
        alt: { name: 'alt' },
        width: { name: 'width' },
        height: { name: 'height' },
      },
    },
    icon: {
      component: 'v-icon',
      propMap: {
        name: { name: 'icon' },
        size: { name: 'size' },
        color: { name: 'color' },
      },
    },
    badge: {
      component: 'v-badge',
      propMap: {
        color: { name: 'color' },
        content: { name: 'content' },
      },
    },
    tag: {
      component: 'v-chip',
      defaultProps: { size: 'small' },
      propMap: {
        color: { name: 'color' },
        variant: { name: 'variant' },
        size: { name: 'size' },
      },
    },
    card: {
      component: 'v-card',
      defaultProps: { elevation: 2 },
      propMap: {
        elevation: { name: 'elevation' },
        color: { name: 'color' },
        rounded: { name: 'rounded' },
      },
    },
    container: {
      component: 'v-container',
      defaultProps: { fluid: false },
    },
    grid: {
      component: 'v-row',
      propMap: {
        gap: { name: 'no-gutters', transform: (v) => !v },
        align: { name: 'align' },
        justify: { name: 'justify' },
      },
    },
    row: {
      component: 'v-row',
    },
    column: {
      component: 'v-col',
      propMap: {
        span: { name: 'cols' },
        sm: { name: 'sm' },
        md: { name: 'md' },
        lg: { name: 'lg' },
      },
    },
    divider: {
      component: 'v-divider',
      propMap: {
        vertical: { name: 'vertical' },
        thickness: { name: 'thickness' },
      },
    },
    spacer: {
      component: 'v-spacer',
    },
    input: {
      component: 'v-text-field',
      defaultProps: { variant: 'outlined', density: 'comfortable' },
      propMap: {
        label: { name: 'label' },
        placeholder: { name: 'placeholder' },
        type: { name: 'type' },
        disabled: { name: 'disabled' },
        required: { name: 'required' },
      },
    },
    list: {
      component: 'v-list',
    },
    'list-item': {
      component: 'v-list-item',
      propMap: {
        title: { name: 'title' },
        subtitle: { name: 'subtitle' },
        prependIcon: { name: 'prepend-icon' },
      },
    },
    link: {
      component: 'a',
      defaultProps: { href: '#' },
    },
    video: {
      component: 'video',
      defaultProps: { controls: true },
    },
    carousel: {
      component: 'v-carousel',
      defaultProps: { 'show-arrows': 'hover' },
    },
  },
}
