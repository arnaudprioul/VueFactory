import { computed, inject, provide, ref } from 'vue'

import { useVModel } from 'origam/composables'
import { getCurrentInstanceName, getUid } from 'origam/utils'

import type { TEditorProvide } from '../../types'

import { EMPTY_EDITOR, ORIGAM_PB_EDITOR_KEY } from '../../consts'

export function createEditor (props: any, name = getCurrentInstanceName()) {

    const children = ref(new Map<unknown, Array<unknown>>())
    const parents = ref(new Map<unknown, unknown>())

    const edit = useVModel(props, 'edit', props.edit, v => new Set(v), v => [...v.values()])
    const lock = useVModel(props, 'lock', props.lock, v => new Set(v), v => [...v.values()])

    const editor: TEditorProvide = {
        id: ref(name),
        root: {
            edit,
            lock,
            children,
            parents
        }
    }

    provide(ORIGAM_PB_EDITOR_KEY, editor)

    return editor.root
}

export function useEditor (props: any) {
    const parent = inject(ORIGAM_PB_EDITOR_KEY, EMPTY_EDITOR)

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
