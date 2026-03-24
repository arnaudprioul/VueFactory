import type { IPageConfig } from './page-config.interface'

export interface IPageBuilderEmits {
  'update:page': [page: IPageConfig]
  'save': [page: IPageConfig]
  'preview': [page: IPageConfig]
}
