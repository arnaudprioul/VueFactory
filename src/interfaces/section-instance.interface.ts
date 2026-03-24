import type { IBlockDefinition } from './block-definition.interface'

export interface ISectionInstance {
  instanceId: string
  templateId: string
  /** Per-block prop overrides: blockId → { propKey: value } */
  propOverrides: Record<string, Record<string, unknown>>
  /** Per-block text overrides: blockId → text */
  textOverrides: Record<string, string>
  /** Order index (managed by the page builder state) */
  order: number
  /** Custom block tree for this instance (overrides template blocks when set) */
  customBlocks?: IBlockDefinition[]
  /** Per-block HTML attribute overrides: blockId → { attrName: value } */
  attrOverrides?: Record<string, Record<string, string>>
  /** Per-block CSS style overrides: blockId → { cssProperty: value } */
  styleOverrides?: Record<string, Record<string, string>>
  /** Per-instance style overrides for the outer section wrapper */
  sectionStyles?: Record<string, string>
  /** Per-instance style overrides for the inner content wrapper */
  wrapperStyles?: Record<string, string>
}
