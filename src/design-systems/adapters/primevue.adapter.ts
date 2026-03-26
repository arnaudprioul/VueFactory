import type { DesignSystemAdapter } from '../../types'

/**
 * PrimeVue 4 Adapter
 *
 * Requires PrimeVue 4 to be installed and registered globally in the host app.
 * Components are referenced by their global registered names (e.g. 'Button', 'Card').
 */
export const primevueAdapter: DesignSystemAdapter = {
  id: 'primevue',
  name: 'PrimeVue 4',
  version: '^4.x',
  componentMap: {
    'vf-button': {
      component: 'Button',
      defaultProps: { severity: 'primary' },
      propMap: {
        text: { name: 'label' },
        variant: {
          name: 'severity',
          transform: (v) => {
            const map: Record<string, string> = {
              primary: 'primary',
              secondary: 'secondary',
              danger: 'danger',
              ghost: 'text',
            }
            return map[v as string] ?? 'primary'
          },
        },
        icon: { name: 'icon' },
        disabled: { name: 'disabled' },
        href: { name: 'as', transform: () => 'a' },
      },
    },
    'vf-img': {
      component: 'Image',
      propMap: {
        src: { name: 'src' },
        alt: { name: 'alt' },
        width: { name: 'width' },
        height: { name: 'height' },
        preview: { name: 'preview' },
      },
    },
    'vf-icon': {
      component: 'i',
      propMap: {
        name: { name: 'class', transform: (v) => `pi pi-${v}` },
      },
    },
    'vf-chip': {
      component: 'Badge',
      propMap: {
        value: { name: 'value' },
        severity: { name: 'severity' },
        size: { name: 'size' },
      },
    },
    'vf-tag': {
      component: 'Tag',
      propMap: {
        text: { name: 'value' },
        color: { name: 'severity' },
        rounded: { name: 'rounded' },
      },
    },
    'vf-card': {
      component: 'Card',
    },
    'vf-container': {
      component: 'div',
    },
    'vf-grid': {
      component: 'div',
      defaultProps: { class: 'grid' },
    },
    'vf-row': {
      component: 'div',
      defaultProps: { class: 'flex flex-row' },
    },
    'vf-column': {
      component: 'div',
      defaultProps: { class: 'col' },
    },
    'vf-divider': {
      component: 'Divider',
      propMap: {
        layout: { name: 'layout' },
        align: { name: 'align' },
        type: { name: 'type' },
      },
    },
    'vf-spacer': {
      component: 'div',
    },
    'vf-input': {
      component: 'InputText',
      propMap: {
        label: { name: 'placeholder' },
        disabled: { name: 'disabled' },
      },
    },
    'vf-list': {
      component: 'Listbox',
    },
    'vf-list-item': {
      component: 'li',
    },
    'vf-link': {
      component: 'a',
      defaultProps: { href: '#' },
    },
    'vf-video': {
      component: 'video',
      defaultProps: { controls: true },
    },
    'vf-carousel': {
      component: 'Carousel',
      propMap: {
        items: { name: 'value' },
        numVisible: { name: 'numVisible' },
        numScroll: { name: 'numScroll' },
      },
    },
  },
}
