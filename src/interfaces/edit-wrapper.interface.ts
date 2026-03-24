export interface IEditWrapperProps {
    id?: string
    class?: string | string[] | Record<string, boolean>
    style?: string | string[] | Record<string, string>
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
