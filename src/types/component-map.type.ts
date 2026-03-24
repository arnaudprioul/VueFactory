import type { EGenericComponentType } from '../enums/generic-component-type.enum'
import type { IComponentDefinition } from '../interfaces/component-definition.interface'

export type TComponentMap = Partial<Record<EGenericComponentType | string, IComponentDefinition>>
