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
    // ─── Data binding ───────────────────────────────────────────────────
    /** JS expression evaluated against dataContext — block hidden when false.
     *  Example: "products.length > 0" or "user.isLoggedIn" */
    condition?: string
    /** Dot-path or {{var}} template to bind block text from data.
     *  Example: "user.name" or "Hello {{userName}}" */
    textBinding?: string
    /** Map of prop name → dot-path in dataContext.
     *  Example: { src: "product.imageUrl", alt: "product.name" } */
    propBindings?: Record<string, string>
  }
}
