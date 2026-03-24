import type { Plugin } from 'vue'
import type { SectionTemplate, DesignSystemAdapter } from './types'
import { registerSections } from './sections/registry'
import { registerAdapters, setDefaultAdapterId } from './design-systems/registry'
import { VfPageBuilder } from './components/PageBuilder'

// ─── Plugin Options ───────────────────────────────────────────────────────────

export interface VueFactoryOptions {
  /** @alias defaultDesignSystem */
  defaultAdapter?: string
  /** @alias defaultDesignSystem */
  designSystemId?: string
  /**
   * Custom or override section templates.
   *
   * Sections whose `id` matches a built-in will replace it.
   * New IDs are added alongside the built-ins.
   *
   * ```ts
   * const sections = Object.values(
   *   import.meta.glob('./assets/sections/*.json', { eager: true })
   * )
   * app.use(createVueFactory({ sections: sections as SectionTemplate[] }))
   * ```
   */
  sections?: SectionTemplate[]

  /**
   * Custom or override design system adapters.
   *
   * Any adapter whose `id` matches a built-in (html, vuetify, primevue,
   * element-plus, naive-ui) will replace it. A brand-new `id` is added
   * alongside the built-ins and appears in the DS mapper UI automatically.
   *
   * Full adapter capabilities are supported: component mapping, propMap,
   * defaultProps, value transforms — everything `DesignSystemAdapter` exposes.
   *
   * ```ts
   * import type { DesignSystemAdapter } from '@vue-factory/page-builder'
   *
   * const myDsAdapter: DesignSystemAdapter = {
   *   id: 'my-ds',
   *   name: 'Mon Design System',
   *   version: '2.x',
   *   componentMap: {
   *     button: { component: 'MyButton', defaultProps: { size: 'md' } },
   *     heading: { component: 'MyHeading' },
   *     text: { component: 'MyText' },
   *     // …
   *   },
   * }
   *
   * app.use(createVueFactory({ adapters: [myDsAdapter] }))
   * ```
   */
  adapters?: DesignSystemAdapter[]

  /**
   * ID of the design system to use by default for new pages.
   * If omitted, defaults to 'html'.
   *
   * ```ts
   * app.use(createVueFactory({ defaultDesignSystem: 'daisyui' }))
   * ```
   */
  defaultDesignSystem?: string

  /**
   * Register VfPageBuilder as a global Vue component.
   * Default: false — recommended to import it explicitly instead.
   */
  registerComponents?: boolean
}

// ─── Plugin factory ───────────────────────────────────────────────────────────

export function createVueFactory (options: VueFactoryOptions = {}): Plugin {
  return {
    install (app) {
      // Register custom / override adapters
      if (options.adapters?.length) {
        registerAdapters(options.adapters)
      }

      // Set default design system (support all option name variants)
      const defaultDs = options.defaultDesignSystem ?? options.defaultAdapter ?? options.designSystemId
      if (defaultDs) {
        setDefaultAdapterId(defaultDs)
      }

      // Register custom / override sections
      if (options.sections?.length) {
        registerSections(options.sections)
      }

      // Optional: register VfPageBuilder globally
      if (options.registerComponents) {
        app.component('VfPageBuilder', VfPageBuilder)
      }
    },
  }
}
