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
    button: {
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
    image: {
      component: 'Image',
      propMap: {
        src: { name: 'src' },
        alt: { name: 'alt' },
        width: { name: 'width' },
        height: { name: 'height' },
        preview: { name: 'preview' },
      },
    },
    icon: {
      component: 'i',
      propMap: {
        name: { name: 'class', transform: (v) => `pi pi-${v}` },
      },
    },
    badge: {
      component: 'Badge',
      propMap: {
        value: { name: 'value' },
        severity: { name: 'severity' },
        size: { name: 'size' },
      },
    },
    tag: {
      component: 'Tag',
      propMap: {
        text: { name: 'value' },
        color: { name: 'severity' },
        rounded: { name: 'rounded' },
      },
    },
    card: {
      component: 'Card',
    },
    container: {
      component: 'div',
    },
    grid: {
      component: 'div',
      defaultProps: { class: 'grid' },
    },
    row: {
      component: 'div',
      defaultProps: { class: 'flex flex-row' },
    },
    column: {
      component: 'div',
      defaultProps: { class: 'col' },
    },
    divider: {
      component: 'Divider',
      propMap: {
        layout: { name: 'layout' },
        align: { name: 'align' },
        type: { name: 'type' },
      },
    },
    spacer: {
      component: 'div',
    },
    input: {
      component: 'InputText',
      propMap: {
        label: { name: 'placeholder' },
        disabled: { name: 'disabled' },
      },
    },
    list: {
      component: 'Listbox',
    },
    'list-item': {
      component: 'li',
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
      component: 'Carousel',
      propMap: {
        items: { name: 'value' },
        numVisible: { name: 'numVisible' },
        numScroll: { name: 'numScroll' },
      },
    },
  },
}
