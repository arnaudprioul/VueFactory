import type { TComponentMap } from '../types/component-map.type'

export interface IDesignSystemAdapter {
  /** Unique key (e.g. 'vuetify', 'primevue', 'html') */
  id: string
  /** Display name shown in the UI */
  name: string
  /** Version string, shown for reference */
  version?: string
  /** SVG string or URL for the logo (shown in the mapper UI) */
  logo?: string
  /** The component mapping */
  componentMap: TComponentMap
}
