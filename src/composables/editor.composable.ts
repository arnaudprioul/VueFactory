import { computed, getCurrentInstance, inject, provide, ref } from 'vue'

import type { TEditorProvide } from '../types'
import { EMPTY_EDITOR, VF_PB_EDITOR_KEY } from '../consts'

let _uid = 0

const getUid = (): number => ++_uid

export function createEditor (props: any, name?: string) {
    const instanceName = name ?? getCurrentInstance()?.type?.__name ?? getCurrentInstance()?.type?.name ?? 'editor'

    const children = ref(new Map<unknown, Array<unknown>>())
    const parents = ref(new Map<unknown, unknown>())

    const edit = ref<Set<unknown>>(new Set(props.edit ?? []))
    const lock = ref<Set<unknown>>(new Set(props.lock ?? []))

    const editor: TEditorProvide = {
        id: ref(instanceName),
        root: {
            edit,
            lock,
            children,
            parents
        }
    }

    provide(VF_PB_EDITOR_KEY, editor)

    return editor.root
}

export function useEditor (props: any) {
    const parent = inject(VF_PB_EDITOR_KEY, EMPTY_EDITOR)

    const uidSymbol = Symbol(getUid())
    const computedId = computed(() => uidSymbol)

    return {
        ...parent,
        id: computedId,
        props,
        isEdited: computed(() => parent.root.edit.value.has(computedId.value)),
        isLocked: computed(() => parent.root.lock.value.has(computedId.value))
    }
}
