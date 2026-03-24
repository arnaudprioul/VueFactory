import type { IEditableProp } from './editable-prop.interface'

export interface IBlockDefinition {
  /** Stable ID within the template (used for prop/text overrides) */
  id: string
  /** Generic component type (or builtin type like 'vf-box', 'vf-text') */
  type: string
  /** Text content (for heading, text, button, link) */
  text?: string
  /** Static props passed to the rendered component */
  props?: Record<string, unknown>
  /** Base inline styles for this block (merged with instance style overrides) */
  style?: Record<string, string>
  /** Nested child blocks */
  children?: IBlockDefinition[]
  /** Editor metadata */
  meta?: {
    label?: string
    editableProps?: IEditableProp[]
    /** If true, this block cannot be selected/edited individually */
    locked?: boolean
    /** If true, children can be added/removed by the user */
    allowChildren?: boolean
  }
}
