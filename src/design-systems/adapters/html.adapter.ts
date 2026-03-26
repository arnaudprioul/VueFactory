import type { DesignSystemAdapter } from '../../types'

/**
 * HTML Adapter — uses native HTML elements only. Works in any Vue 3 project
 * without any additional dependencies. Ideal as a fallback or for unstyled usage.
 */
export const htmlAdapter: DesignSystemAdapter = {
  id: 'html',
  name: 'HTML Natif',
  version: 'HTML5',
  componentMap: {
    'vf-button': {
      component: 'button',
      defaultProps: { type: 'button' },
    },
    'vf-img': {
      component: 'img',
      defaultProps: { loading: 'lazy', alt: '' },
    },
    'vf-icon': {
      component: 'span',
    },
    'vf-chip': {
      component: 'span',
    },
    'vf-tag': {
      component: 'span',
    },
    'vf-card': {
      component: 'div',
    },
    'vf-container': {
      component: 'div',
    },
    'vf-grid': {
      component: 'div',
    },
    'vf-row': {
      component: 'div',
    },
    'vf-column': {
      component: 'div',
    },
    'vf-divider': {
      component: 'hr',
    },
    'vf-spacer': {
      component: 'div',
    },
    'vf-input': {
      component: 'input',
      defaultProps: { type: 'text' },
    },
    'vf-list': {
      component: 'ul',
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
      component: 'div',
    },
  },
}
