/**
 * useDataBinding — utilities for resolving data bindings at render time.
 *
 * dataContext = { varName: resolvedValue, ... }
 * Built from pageConfig.dataSchema + the pageData prop passed by the consumer.
 */

// ─── Dot-path resolution ──────────────────────────────────────────────────────

/** Get a nested value from an object using a dot-path. Returns undefined if not found. */
export function getNestedValue (obj: unknown, path: string): unknown {
  if (!path || obj === null || obj === undefined) return undefined
  const parts = path.split('.')
  let current: unknown = obj
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[part]
  }
  return current
}

// ─── Context builder ──────────────────────────────────────────────────────────

/**
 * Build a flat dataContext object from a schema + raw pageData.
 *
 * Schema: { userName: "user.name", items: "catalog.products" }
 * pageData: { user: { name: "Alice" }, catalog: { products: [...] } }
 * → context: { userName: "Alice", items: [...] }
 *
 * Keys from the schema are aliased variables; the raw pageData is also merged
 * in at the root level so direct dot-paths work in expressions.
 */
export function buildDataContext (
  schema: Record<string, string> | undefined,
  pageData: Record<string, unknown> | undefined,
): Record<string, unknown> {
  if (!pageData && !schema) return {}
  const ctx: Record<string, unknown> = { ...(pageData ?? {}) }
  if (schema) {
    for (const [varName, path] of Object.entries(schema)) {
      ctx[varName] = getNestedValue(pageData ?? {}, path)
    }
  }
  return ctx
}

// ─── Text resolution ──────────────────────────────────────────────────────────

/**
 * Resolve {{varName}} and {{dot.path}} placeholders in a text string.
 * Falls back to '' for undefined values.
 */
export function resolveText (text: string, ctx: Record<string, unknown>): string {
  if (!text || !text.includes('{{')) return text
  return text.replace(/\{\{([\w.]+)\}\}/g, (_, expr: string) => {
    const val = getNestedValue(ctx, expr) ?? ctx[expr]
    return val !== undefined ? String(val) : ''
  })
}

/**
 * Resolve a text binding:
 * - If binding contains '{{', treat as a template string.
 * - Otherwise treat as a direct dot-path.
 */
export function resolveTextBinding (binding: string, ctx: Record<string, unknown>): string {
  if (!binding) return ''
  if (binding.includes('{{')) return resolveText(binding, ctx)
  const val = getNestedValue(ctx, binding)
  return val !== undefined ? String(val) : ''
}

// ─── Condition evaluation ─────────────────────────────────────────────────────

/**
 * Evaluate a JS condition expression against a data context.
 * Returns true (show) by default if the expression errors.
 * SECURITY NOTE: only user-authored expressions are evaluated.
 */
export function evalCondition (expr: string, ctx: Record<string, unknown>): boolean {
  if (!expr || !expr.trim()) return true
  try {
    const keys = Object.keys(ctx)
    const values = Object.values(ctx)
    // eslint-disable-next-line no-new-func
    const fn = new Function(...keys, `return !!(${expr})`)
    return fn(...values)
  } catch {
    return true
  }
}

// ─── Prop binding resolution ──────────────────────────────────────────────────

/** Resolve a map of propName → dot-path against the context. */
export function resolvePropBindings (
  bindings: Record<string, string>,
  ctx: Record<string, unknown>,
): Record<string, unknown> {
  const resolved: Record<string, unknown> = {}
  for (const [propName, path] of Object.entries(bindings)) {
    const val = getNestedValue(ctx, path)
    if (val !== undefined) resolved[propName] = val
  }
  return resolved
}
