import type { DesignSystemAdapter } from '../../types'

/**
 * DaisyUI Adapter
 *
 * DaisyUI is a Tailwind CSS plugin — it uses native HTML elements styled with
 * utility classes. No Vue component registration is required; classes are
 * injected via defaultProps.
 *
 * Requires DaisyUI + Tailwind CSS to be configured in the host app.
 */
export const daisyuiAdapter: DesignSystemAdapter = {
  id: 'daisyui',
  name: 'DaisyUI',
  version: '^5.x',
  componentMap: {
    button: {
      component: 'button',
      defaultProps: { type: 'button', class: 'btn btn-primary' },
      propMap: {
        variant: { name: 'class', transform: (v) => `btn btn-${v}` },
        disabled: { name: 'disabled' },
        href: { name: 'href' },
      },
    },
    image: {
      component: 'img',
      defaultProps: { loading: 'lazy', alt: '', class: 'rounded-box' },
      propMap: {
        src: { name: 'src' },
        alt: { name: 'alt' },
        width: { name: 'width' },
        height: { name: 'height' },
      },
    },
    icon: {
      component: 'span',
      defaultProps: { class: 'inline-block' },
      propMap: {
        name: { name: 'data-icon' },
        size: { name: 'style', transform: (v) => `font-size: ${v}` },
        color: { name: 'style', transform: (v) => `color: ${v}` },
      },
    },
    badge: {
      component: 'span',
      defaultProps: { class: 'badge badge-primary' },
      propMap: {
        color: { name: 'class', transform: (v) => `badge badge-${v}` },
      },
    },
    tag: {
      component: 'span',
      defaultProps: { class: 'badge badge-ghost badge-sm' },
      propMap: {
        color: { name: 'class', transform: (v) => `badge badge-${v} badge-sm` },
      },
    },
    card: {
      component: 'div',
      defaultProps: { class: 'card bg-base-100 shadow-md' },
    },
    container: {
      component: 'div',
      defaultProps: { class: 'container mx-auto px-4' },
    },
    grid: {
      component: 'div',
      defaultProps: { class: 'grid gap-4' },
    },
    row: {
      component: 'div',
      defaultProps: { class: 'flex flex-wrap gap-4' },
    },
    column: {
      component: 'div',
    },
    divider: {
      component: 'div',
      defaultProps: { class: 'divider' },
    },
    spacer: {
      component: 'div',
      defaultProps: { class: 'flex-1' },
    },
    input: {
      component: 'input',
      defaultProps: { type: 'text', class: 'input input-bordered w-full' },
      propMap: {
        label: { name: 'placeholder' },
        placeholder: { name: 'placeholder' },
        type: { name: 'type' },
        disabled: { name: 'disabled' },
        required: { name: 'required' },
      },
    },
    list: {
      component: 'ul',
      defaultProps: { class: 'menu bg-base-200 rounded-box' },
    },
    'list-item': {
      component: 'li',
    },
    link: {
      component: 'a',
      defaultProps: { href: '#', class: 'link link-primary' },
    },
    video: {
      component: 'video',
      defaultProps: { controls: true, class: 'rounded-box w-full' },
    },
    carousel: {
      component: 'div',
      defaultProps: { class: 'carousel rounded-box w-full' },
    },
  },
}
