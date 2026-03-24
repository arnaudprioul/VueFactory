import { reactive } from 'vue'
import type { SectionTemplate, SectionCategory } from '../types'

// ─── Reactive Section Registry ────────────────────────────────────────────────
// A reactive Map keyed by section ID.
// Default sections are registered on module load (see sections/index.ts).
// The plugin (createVueFactory) can override or extend them with custom JSONs.

export const sectionRegistry = reactive(new Map<string, SectionTemplate>())

// ─── Mutations ────────────────────────────────────────────────────────────────

export function registerSection (template: SectionTemplate): void {
  sectionRegistry.set(template.id, template)
}

export function registerSections (templates: SectionTemplate[]): void {
  for (const t of templates) sectionRegistry.set(t.id, t)
}

export function unregisterSection (id: string): void {
  sectionRegistry.delete(id)
}

// ─── Queries (reactive — safe to call inside computed/watchEffect) ─────────────

export function getAllSections (): SectionTemplate[] {
  return [...sectionRegistry.values()]
}

export function getSectionById (id: string): SectionTemplate | undefined {
  return sectionRegistry.get(id)
}

export function getSectionsByCategory (category: SectionCategory): SectionTemplate[] {
  return [...sectionRegistry.values()].filter((s) => s.category === category)
}

export function getSectionCategories (): SectionCategory[] {
  return [...new Set([...sectionRegistry.values()].map((s) => s.category))]
}

export function searchSections (query: string): SectionTemplate[] {
  const q = query.toLowerCase().trim()
  if (!q) return getAllSections()
  return [...sectionRegistry.values()].filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      (s.description?.toLowerCase().includes(q) ?? false),
  )
}
