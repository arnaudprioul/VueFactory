import type { ICommonsComponentProps } from 'origam/interfaces'

export interface IEditWrapperProps extends ICommonsComponentProps {
    slotName?: string
    autoDetectProps?: boolean
}

export interface IAutoPropComponentDefinition {
    name: string
    index: number
    props: Array<IPropDefinition>
}

export interface IPropDefinition {
    name: string
    types?: string[]
    required?: boolean
    default?: any
}
