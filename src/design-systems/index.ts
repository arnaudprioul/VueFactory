import type { DesignSystemAdapter, ComponentMap } from '../types'
import { htmlAdapter } from './adapters/html.adapter'
import { vuetifyAdapter } from './adapters/vuetify.adapter'
import { primevueAdapter } from './adapters/primevue.adapter'
import { elementPlusAdapter } from './adapters/element-plus.adapter'
import { naiveUiAdapter } from './adapters/naive-ui.adapter'
import { daisyuiAdapter } from './adapters/daisyui.adapter'
import { registerAdapters, adapterRegistry } from './registry'

// ─── Named adapter exports ────────────────────────────────────────────────────
export { htmlAdapter } from './adapters/html.adapter'
export { vuetifyAdapter } from './adapters/vuetify.adapter'
export { primevueAdapter } from './adapters/primevue.adapter'
export { elementPlusAdapter } from './adapters/element-plus.adapter'
export { naiveUiAdapter } from './adapters/naive-ui.adapter'
export { daisyuiAdapter } from './adapters/daisyui.adapter'

// ─── Registry exports ─────────────────────────────────────────────────────────
export {
  adapterRegistry,
  registerAdapter,
  registerAdapters,
  unregisterAdapter,
  getAllAdapters,
  getAdapterById,
  setDefaultAdapterId,
  getDefaultAdapterId,
} from './registry'

// ─── Bootstrap built-in adapters ─────────────────────────────────────────────
registerAdapters([
  htmlAdapter,
  vuetifyAdapter,
  primevueAdapter,
  elementPlusAdapter,
  naiveUiAdapter,
  daisyuiAdapter,
])

// ─── Legacy compat ────────────────────────────────────────────────────────────
export const BUILT_IN_ADAPTERS: Record<string, DesignSystemAdapter> = {
  [htmlAdapter.id]: htmlAdapter,
  [vuetifyAdapter.id]: vuetifyAdapter,
  [primevueAdapter.id]: primevueAdapter,
  [elementPlusAdapter.id]: elementPlusAdapter,
  [naiveUiAdapter.id]: naiveUiAdapter,
  [daisyuiAdapter.id]: daisyuiAdapter,
}
export const BUILT_IN_ADAPTER_LIST: DesignSystemAdapter[] = Object.values(BUILT_IN_ADAPTERS)

// ─── Resolve Adapter ──────────────────────────────────────────────────────────
// Looks up the registry (which includes user-registered adapters).
// Falls back to the HTML adapter if no match is found.

export function resolveAdapter (
  id: string,
  customComponentMap?: Partial<Record<string, string>>,
): DesignSystemAdapter {
  // 'custom' id with a simple component map → build an inline adapter
  if (id === 'custom' && customComponentMap) {
    return buildCustomAdapter(customComponentMap)
  }

  // Look in the live registry first (includes user-registered adapters)
  const found = adapterRegistry.get(id)
  if (found) return found

  // Unknown id → fall back gracefully
  console.warn(`[VueFactory] Design system adapter "${id}" not found in registry. Falling back to HTML. Available: ${[...adapterRegistry.keys()].join(', ')}`)
  return htmlAdapter
}

// ─── buildCustomAdapter ───────────────────────────────────────────────────────
// Quick helper for simple component-name overrides without full propMap support.
// For full propMap/defaultProps support, register a complete DesignSystemAdapter.

export function buildCustomAdapter (
  customMap: Partial<Record<string, string>>,
  name = 'Personnalisé',
  id = 'custom',
): DesignSystemAdapter {
  const componentMap: ComponentMap = { ...htmlAdapter.componentMap }

  for (const [type, componentName] of Object.entries(customMap)) {
    if (componentName) {
      componentMap[type as keyof ComponentMap] = { component: componentName }
    }
  }

  return { id, name, componentMap }
}
