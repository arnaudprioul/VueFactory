export type { TComponentMap } from './component-map.type'
export type { TSectionCategory } from './section-category.type'
export type { TEditorProvide } from './editor-provide.type'

// ─── Backward-compatibility re-exports ───────────────────────────────────────
// Keep old names as aliases so existing code doesn't break immediately.
export type { IDesignSystemAdapter as DesignSystemAdapter } from '../interfaces/design-system-adapter.interface'
export type { IBlockDefinition as BlockDefinition } from '../interfaces/block-definition.interface'
export type { ISectionTemplate as SectionTemplate } from '../interfaces/section-template.interface'
export type { ISectionInstance as SectionInstance } from '../interfaces/section-instance.interface'
export type { IPageConfig as PageConfig } from '../interfaces/page-config.interface'
export type { IPageBuilderState as PageBuilderState } from '../interfaces/page-builder-state.interface'
export type { IEditableProp as EditableProp } from '../interfaces/editable-prop.interface'
export type { IPropMapper as PropMapper } from '../interfaces/prop-mapper.interface'
export type { IComponentDefinition as ComponentDefinition } from '../interfaces/component-definition.interface'
export type { IDsMapperState as DsMapperState } from '../interfaces/ds-mapper-state.interface'
export type { TSectionCategory as SectionCategory } from './section-category.type'
export type { TComponentMap as ComponentMap } from './component-map.type'
export type { EGenericComponentType as GenericComponentType } from '../enums/generic-component-type.enum'
