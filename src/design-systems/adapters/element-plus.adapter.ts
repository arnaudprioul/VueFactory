import type { DesignSystemAdapter } from '../../types'

/**
 * Element Plus Adapter
 *
 * Requires Element Plus to be installed and registered globally in the host app.
 * Components are referenced by their global registered names (e.g. 'el-button', 'el-card').
 */
export const elementPlusAdapter: DesignSystemAdapter = {
  id: 'element-plus',
  name: 'Element Plus',
  version: '^2.x',
  componentMap: {
    button: {
      component: 'el-button',
      defaultProps: { type: 'primary' },
      propMap: {
        variant: {
          name: 'type',
          transform: (v) => {
            const map: Record<string, string> = {
              primary: 'primary',
              secondary: 'default',
              danger: 'danger',
              ghost: 'text',
            }
            return map[v as string] ?? 'primary'
          },
        },
        disabled: { name: 'disabled' },
        round: { name: 'round' },
        circle: { name: 'circle' },
        size: { name: 'size' },
      },
    },
    image: {
      component: 'el-image',
      defaultProps: { fit: 'cover', lazy: true },
      propMap: {
        src: { name: 'src' },
        alt: { name: 'alt' },
        width: { name: 'style', transform: (v) => ({ width: `${v}px` }) },
        height: { name: 'style', transform: (v) => ({ height: `${v}px` }) },
      },
    },
    icon: {
      component: 'el-icon',
      propMap: {
        size: { name: 'size' },
        color: { name: 'color' },
      },
    },
    badge: {
      component: 'el-badge',
      propMap: {
        value: { name: 'value' },
        type: { name: 'type' },
        max: { name: 'max' },
      },
    },
    tag: {
      component: 'el-tag',
      defaultProps: { effect: 'plain' },
      propMap: {
        color: {
          name: 'type',
          transform: (v) => {
            const map: Record<string, string> = {
              primary: 'primary',
              secondary: 'info',
              danger: 'danger',
              warning: 'warning',
              success: 'success',
            }
            return map[v as string] ?? ''
          },
        },
        size: { name: 'size' },
      },
    },
    card: {
      component: 'el-card',
      defaultProps: { shadow: 'hover' },
      propMap: {
        shadow: { name: 'shadow' },
        header: { name: 'header' },
      },
    },
    container: {
      component: 'el-container',
    },
    grid: {
      component: 'el-row',
      defaultProps: { gutter: 20 },
      propMap: {
        gutter: { name: 'gutter' },
        justify: { name: 'justify' },
        align: { name: 'align' },
      },
    },
    row: {
      component: 'el-row',
    },
    column: {
      component: 'el-col',
      propMap: {
        span: { name: 'span' },
        offset: { name: 'offset' },
        xs: { name: 'xs' },
        sm: { name: 'sm' },
        md: { name: 'md' },
        lg: { name: 'lg' },
      },
    },
    divider: {
      component: 'el-divider',
      propMap: {
        direction: { name: 'direction' },
        borderStyle: { name: 'border-style' },
        contentPosition: { name: 'content-position' },
      },
    },
    spacer: {
      component: 'div',
    },
    input: {
      component: 'el-input',
      propMap: {
        label: { name: 'placeholder' },
        type: { name: 'type' },
        disabled: { name: 'disabled' },
        size: { name: 'size' },
        clearable: { name: 'clearable' },
      },
    },
    list: {
      component: 'ul',
    },
    'list-item': {
      component: 'li',
    },
    link: {
      component: 'el-link',
      defaultProps: { type: 'primary' },
      propMap: {
        href: { name: 'href' },
        type: { name: 'type' },
        underline: { name: 'underline' },
      },
    },
    video: {
      component: 'video',
      defaultProps: { controls: true },
    },
    carousel: {
      component: 'el-carousel',
      defaultProps: { type: 'card' },
      propMap: {
        height: { name: 'height' },
        autoplay: { name: 'autoplay' },
        interval: { name: 'interval' },
        indicator: { name: 'indicator-position' },
      },
    },
  },
}
