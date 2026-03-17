import type { PropType, VNode } from 'vue'

function pascalCase (str: string): string {
    return str
        .replace(/[-_](.)/g, (_, char: string) => char.toUpperCase())
        .replace(/^(.)/, (_, char: string) => char.toUpperCase())
}

export function getNameFromFile (file: string) {
    const parts = /([^/]+)\.vue$/.exec(file)
    if (parts) {
        return pascalCase(parts[1])
    }
    return 'Anonymous'
}

export function getTagName (vnode: VNode) {
    // Cast to any to access Vue internal dev-only properties (__asyncResolved, __file, name)
    const type = vnode.type as any
    if (typeof type === 'string') {
        return type
    } else if (type?.__asyncResolved) {
        const asyncComp = type.__asyncResolved
        return asyncComp.name ?? getNameFromFile(asyncComp.__file)
    } else if (type?.name) {
        return type.name
    } else if (type?.__file) {
        return getNameFromFile(type.__file)
    }
    return 'Anonymous'
}

export function scanForAutoProps (vnodes: Array<any>) {
    const result: Array<any> = []
    let index = 0

    for (const vnode of vnodes) {
        if (typeof vnode.type === 'object') {

            const propDefs: Array<any> = []

            for (const key in vnode.type.props) {

                const prop = vnode.type.props[key]
                let types
                let defaultValue

                if (prop) {
                    const rawTypes = Array.isArray(prop.type) ? prop.type : typeof prop === 'function' ? [prop] : [prop.type]

                    types = rawTypes.map((t: PropType<any>) => {
                        switch (t) {
                            case String:
                                return 'string'
                            case Number:
                                return 'number'
                            case Boolean:
                                return 'boolean'
                            case Object:
                                return 'object'
                            case Array:
                                return 'array'
                            default:
                                return 'unknown'
                        }
                    })

                    defaultValue = typeof prop.default === 'function' ? prop.default.toString() : prop.default
                }

                propDefs.push({
                    name: key,
                    types,
                    required: prop?.required,
                    default: defaultValue
                })
            }

            result.push({
                name: getTagName(vnode),
                index,
                props: propDefs
            })
            index++
        }

        if (Array.isArray(vnode.children)) {
            result.push(...scanForAutoProps(vnode.children))
        }
    }

    return result.filter(def => def.props.length)
}
