import type { IPageConfig } from './page-config.interface'

export interface IPageBuilderState {
  page: IPageConfig
  selectedSectionId: string | null
  selectedBlockId: string | null
  sectionPickerOpen: boolean
  dsMapperOpen: boolean
  previewMode: boolean
  sectionPickerSearch: string
  history: IPageConfig[]
  historyIndex: number
}
