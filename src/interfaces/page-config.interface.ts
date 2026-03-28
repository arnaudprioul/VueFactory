import type { ISectionInstance } from './section-instance.interface'

export interface IPageConfig {
  id: string
  name: string
  /** Ordered section instances */
  sections: ISectionInstance[]
  /** The design system adapter ID */
  designSystemId: string
  /** Custom component map — used when designSystemId === 'custom' */
  customComponentMap?: Partial<Record<string, string>>
  // ─── Data binding ─────────────────────────────────────────────────────
  /** Maps template variable names to dot-paths in pageData.
   *  Example: { "userName": "user.name", "items": "catalog.products" } */
  dataSchema?: Record<string, string>
  /** JSON string used as test data in the editor preview. Not used at runtime. */
  previewData?: string
}
