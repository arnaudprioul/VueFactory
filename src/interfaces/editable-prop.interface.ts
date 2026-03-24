export interface IEditableProp {
  key: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'color' | 'select' | 'image-url' | 'url'
  options?: Array<{ value: unknown; label: string }>
  default?: unknown
  placeholder?: string
}
