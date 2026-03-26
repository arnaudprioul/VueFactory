import type { DesignSystemAdapter } from '../../types'

/**
 * Naive UI Adapter
 *
 * Requires Naive UI to be installed and registered globally in the host app.
 * Components are referenced by their global registered names (e.g. 'n-button', 'n-card').
 */
export const naiveUiAdapter: DesignSystemAdapter = {
  id: 'naive-ui',
  name: 'Naive UI',
  version: '^2.x',
  componentMap: {
    'vf-button': {
      component: 'n-button',
      defaultProps: { type: 'primary' },
      propMap: {
        variant: {
          name: 'type',
          transform: (v) => {
            const map: Record<string, string> = {
              primary: 'primary',
              secondary: 'default',
              danger: 'error',
              ghost: 'tertiary',
            }
            return map[v as string] ?? 'primary'
          },
        },
        disabled: { name: 'disabled' },
        size: { name: 'size' },
        round: { name: 'round' },
        circle: { name: 'circle' },
        ghost: { name: 'ghost' },
        dashed: { name: 'dashed' },
        strong: { name: 'strong' },
      },
    },
    'vf-text': {
      component: 'n-text',
      propMap: {
        type: { name: 'type' },
        depth: { name: 'depth' },
        strong: { name: 'strong' },
      },
    },
    'vf-heading': {
      component: 'n-h1',
    },
    'vf-img': {
      component: 'n-image',
      defaultProps: { lazy: true },
      propMap: {
        src: { name: 'src' },
        alt: { name: 'alt' },
        width: { name: 'width' },
        height: { name: 'height' },
        previewSrc: { name: 'preview-src' },
      },
    },
    'vf-icon': {
      component: 'n-icon',
      propMap: {
        size: { name: 'size' },
        color: { name: 'color' },
        depth: { name: 'depth' },
      },
    },
    'vf-chip': {
      component: 'n-badge',
      propMap: {
        value: { name: 'value' },
        type: { name: 'type' },
        max: { name: 'max' },
        dot: { name: 'dot' },
      },
    },
    'vf-tag': {
      component: 'n-tag',
      defaultProps: { round: false },
      propMap: {
        color: {
          name: 'type',
          transform: (v) => {
            const map: Record<string, string> = {
              primary: 'primary',
              secondary: 'default',
              danger: 'error',
              warning: 'warning',
              success: 'success',
            }
            return map[v as string] ?? 'default'
          },
        },
        size: { name: 'size' },
        round: { name: 'round' },
        closable: { name: 'closable' },
      },
    },
    'vf-card': {
      component: 'n-card',
      propMap: {
        title: { name: 'title' },
        hoverable: { name: 'hoverable' },
        segmented: { name: 'segmented' },
      },
    },
    'vf-container': {
      component: 'div',
    },
    'vf-grid': {
      component: 'n-grid',
      defaultProps: { cols: 3, xGap: 12, yGap: 12 },
      propMap: {
        cols: { name: 'cols' },
        xGap: { name: 'x-gap' },
        yGap: { name: 'y-gap' },
        responsive: { name: 'responsive' },
      },
    },
    'vf-row': {
      component: 'n-flex',
      defaultProps: { vertical: false },
    },
    'vf-column': {
      component: 'n-gi',
      propMap: {
        span: { name: 'span' },
        offset: { name: 'offset' },
      },
    },
    'vf-divider': {
      component: 'n-divider',
      propMap: {
        vertical: { name: 'vertical' },
        titlePlacement: { name: 'title-placement' },
        dashed: { name: 'dashed' },
      },
    },
    'vf-spacer': {
      component: 'div',
    },
    'vf-input': {
      component: 'n-input',
      defaultProps: { type: 'text' },
      propMap: {
        label: { name: 'placeholder' },
        type: { name: 'type' },
        disabled: { name: 'disabled' },
        size: { name: 'size' },
        clearable: { name: 'clearable' },
        round: { name: 'round' },
      },
    },
    'vf-list': {
      component: 'n-list',
    },
    'vf-list-item': {
      component: 'n-list-item',
    },
    'vf-link': {
      component: 'n-a',
      defaultProps: { href: '#' },
      propMap: {
        href: { name: 'href' },
      },
    },
    'vf-video': {
      component: 'video',
      defaultProps: { controls: true },
    },
    'vf-carousel': {
      component: 'n-carousel',
      defaultProps: { autoplay: false },
      propMap: {
        autoplay: { name: 'autoplay' },
        interval: { name: 'interval' },
        effect: { name: 'effect' },
        dotType: { name: 'dot-type' },
      },
    },
  },
}
