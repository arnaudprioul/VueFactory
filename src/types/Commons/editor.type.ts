import type { Ref } from 'vue'

export type TEditorProvide = {
    id: Ref<unknown>,
    root: {
        children: Ref<Map<unknown, Array<unknown>>>
        parents: Ref<Map<unknown, unknown>>
        edit: Ref<Set<unknown>>
        lock: Ref<Set<unknown>>
    }
}

