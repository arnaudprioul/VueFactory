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
}
