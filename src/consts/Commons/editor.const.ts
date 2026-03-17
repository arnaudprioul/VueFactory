import type { InjectionKey } from 'vue'
import { ref, shallowRef } from 'vue'

import type { TEditorProvide } from '../../types'

export const VF_PB_EDITOR_KEY: InjectionKey<TEditorProvide> = Symbol.for('vue-factory:editor')

export const EMPTY_EDITOR: TEditorProvide = {
    id: shallowRef(),
    root: {
        parents: ref(new Map()),
        children: ref(new Map()),
        edit: ref(new Set()),
        lock: ref(new Set())
    }
}
