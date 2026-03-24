import type { ESectionCategory } from '../enums/section-category.enum'
import type { IBlockDefinition } from './block-definition.interface'

export interface ISectionTemplate {
  id: string
  name: string
  category: ESectionCategory | string
  description?: string
  /** Base64 PNG thumbnail or external URL (displayed in section picker) */
  thumbnail?: string
  /** The block tree */
  blocks: IBlockDefinition[]
  /** Default CSS class applied to the section wrapper */
  defaultClass?: string
  /** Default inline styles applied to the outer section wrapper */
  defaultStyle?: Record<string, string>
  /** Default inline styles applied to the inner content wrapper */
  defaultWrapperStyle?: Record<string, string>
  /** True when created or saved by the end user */
  isCustom?: boolean
  /** If this template overrides a built-in, the original ID is stored here */
  overridesId?: string
}
