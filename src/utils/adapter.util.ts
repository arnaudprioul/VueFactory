// Re-export adapter utilities from the design-systems module.
// The implementations live there to avoid circular dependencies
// (they depend on adapterRegistry and htmlAdapter).
export { resolveAdapter, buildCustomAdapter } from '../design-systems'
