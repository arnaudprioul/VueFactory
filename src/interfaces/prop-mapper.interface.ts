export interface IPropMapper {
  /** Target prop name in the design system component */
  name: string
  /** Optional value transform (e.g., 'primary' → 'v-primary') */
  transform?: (value: unknown) => unknown
}
