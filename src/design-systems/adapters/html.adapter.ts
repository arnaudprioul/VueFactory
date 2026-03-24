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
    button: {
      component: 'button',
      defaultProps: { type: 'button' },
    },
    image: {
      component: 'img',
      defaultProps: { loading: 'lazy', alt: '' },
    },
    icon: {
      component: 'span',
    },
    badge: {
      component: 'span',
    },
    tag: {
      component: 'span',
    },
    card: {
      component: 'div',
      defaultProps: {},
    },
    container: {
      component: 'div',
    },
    grid: {
      component: 'div',
    },
    row: {
      component: 'div',
    },
    column: {
      component: 'div',
    },
    divider: {
      component: 'hr',
    },
    spacer: {
      component: 'div',
    },
    input: {
      component: 'input',
      defaultProps: { type: 'text' },
    },
    list: {
      component: 'ul',
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
      component: 'div',
    },
  },
}
