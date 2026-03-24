import { reactive } from 'vue'
import type { DesignSystemAdapter } from '../types'

// ─── Reactive Adapter Registry ────────────────────────────────────────────────
// All design system adapters live here.
// Built-ins are seeded by design-systems/index.ts at module load.
// createVueFactory({ adapters: [...] }) can add/override adapters at runtime.

export const adapterRegistry = reactive(new Map<string, DesignSystemAdapter>())

// ─── Mutations ────────────────────────────────────────────────────────────────

export function registerAdapter (adapter: DesignSystemAdapter): void {
  adapterRegistry.set(adapter.id, adapter)
}

export function registerAdapters (adapters: DesignSystemAdapter[]): void {
  for (const a of adapters) adapterRegistry.set(a.id, a)
}

export function unregisterAdapter (id: string): void {
  adapterRegistry.delete(id)
}

// ─── Default Adapter ──────────────────────────────────────────────────────────

let _defaultAdapterId = 'html'

export function setDefaultAdapterId (id: string): void {
  _defaultAdapterId = id
}

export function getDefaultAdapterId (): string {
  return _defaultAdapterId
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function getAllAdapters (): DesignSystemAdapter[] {
  return [...adapterRegistry.values()]
}

export function getAdapterById (id: string): DesignSystemAdapter | undefined {
  return adapterRegistry.get(id)
}
