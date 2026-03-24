import type { Component } from 'vue'
import type { IPropMapper } from './prop-mapper.interface'

export interface IComponentDefinition {
  /** Vue Component object OR globally-registered component name (string) */
  component: Component | string
  /** Human-readable label shown in the editor (falls back to humanized type) */
  label?: string
  /** Prop name mapping from generic → DS-specific */
  propMap?: Partial<Record<string, IPropMapper>>
  /** Props always applied to this component (DS defaults) */
  defaultProps?: Record<string, unknown>
  /** Tag to wrap the component in (rare, e.g. for layout wrappers) */
  wrapperTag?: string
}
