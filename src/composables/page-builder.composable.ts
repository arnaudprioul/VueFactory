import { computed, provide, inject, reactive } from 'vue'
import type { InjectionKey } from 'vue'
import type { PageConfig, PageBuilderState, SectionInstance, SectionTemplate, DesignSystemAdapter, BlockDefinition } from '../types'
import { resolveAdapter, getDefaultAdapterId, getAdapterById, registerAdapter } from '../design-systems'
import { getSectionById } from '../sections'

// ─── Injection Key ─────────────────────────────────────────────────────────────

export const VF_PAGE_BUILDER_KEY: InjectionKey<ReturnType<typeof createPageBuilder>> =
  Symbol.for('vue-factory:page-builder')

// ─── ID Generator ────────────────────────────────────────────────────────────

let _sectionCounter = 0
const generateInstanceId = (): string => `section-${Date.now()}-${++_sectionCounter}`

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createPageBuilder (initialPage?: Partial<PageConfig>, directAdapter?: DesignSystemAdapter) {
  // Register directAdapter in the global registry if not already present,
  // so the DS mapper can display and select it like any other adapter.
  if (directAdapter && !getAdapterById(directAdapter.id)) {
    registerAdapter(directAdapter)
  }

  // A saved designSystemId of 'html' is treated as "unset" so the plugin
  // default (configured via createVueFactory) can override it.
  const savedDsId = initialPage?.designSystemId
  const resolvedDsId = directAdapter?.id
    ?? (savedDsId && savedDsId !== 'html' ? savedDsId : null)
    ?? getDefaultAdapterId()

  const defaultPage: PageConfig = {
    id: `page-${Date.now()}`,
    name: 'Ma page',
    sections: [],
    ...initialPage,
    designSystemId: resolvedDsId,
  }

  const state = reactive<PageBuilderState>({
    page: { ...defaultPage, sections: [...(defaultPage.sections ?? [])] },
    selectedSectionId: null,
    selectedBlockId: null,
    sectionPickerOpen: true,
    dsMapperOpen: false,
    previewMode: false,
    sectionPickerSearch: '',
    history: [],
    historyIndex: -1,
  })

  // ─── History ─────────────────────────────────────────────────────────────

  const _saveHistory = () => {
    const snapshot = JSON.parse(JSON.stringify(state.page)) as PageConfig
    // Discard redo stack on new action
    state.history.splice(state.historyIndex + 1)
    state.history.push(snapshot)
    state.historyIndex = state.history.length - 1
    // Cap history at 50 entries
    if (state.history.length > 50) {
      state.history.shift()
      state.historyIndex--
    }
  }

  const undo = () => {
    if (state.historyIndex <= 0) return
    state.historyIndex--
    state.page = JSON.parse(JSON.stringify(state.history[state.historyIndex]))
  }

  const redo = () => {
    if (state.historyIndex >= state.history.length - 1) return
    state.historyIndex++
    state.page = JSON.parse(JSON.stringify(state.history[state.historyIndex]))
  }

  const canUndo = computed(() => state.historyIndex > 0)
  const canRedo = computed(() => state.historyIndex < state.history.length - 1)

  // ─── Design System ────────────────────────────────────────────────────────

  const adapter = computed<DesignSystemAdapter>(() =>
    resolveAdapter(state.page.designSystemId, state.page.customComponentMap),
  )

  const setDesignSystem = (id: string, customMap?: Partial<Record<string, string>>) => {
    _saveHistory()
    state.page.designSystemId = id
    if (customMap) {
      state.page.customComponentMap = customMap
    } else {
      delete state.page.customComponentMap
    }
  }

  // ─── Sections ─────────────────────────────────────────────────────────────

  const sortedSections = computed(() =>
    [...state.page.sections].sort((a, b) => a.order - b.order),
  )

  const addSection = (template: SectionTemplate, atIndex?: number): SectionInstance => {
    _saveHistory()
    const instance: SectionInstance = {
      instanceId: generateInstanceId(),
      templateId: template.id,
      propOverrides: {},
      textOverrides: {},
      order: atIndex ?? state.page.sections.length,
      wrapperStyles: { maxWidth: '1200px' },
    }
    if (atIndex !== undefined) {
      // Shift existing sections down
      state.page.sections
        .filter((s) => s.order >= atIndex)
        .forEach((s) => s.order++)
    }
    state.page.sections.push(instance)
    state.selectedSectionId = instance.instanceId
    state.selectedBlockId = null
    return instance
  }

  const addSectionById = (templateId: string, atIndex?: number): SectionInstance | null => {
    const template = getSectionById(templateId)
    if (!template) return null
    return addSection(template, atIndex)
  }

  const removeSection = (instanceId: string) => {
    _saveHistory()
    const idx = state.page.sections.findIndex((s) => s.instanceId === instanceId)
    if (idx === -1) return
    state.page.sections.splice(idx, 1)
    if (state.selectedSectionId === instanceId) {
      state.selectedSectionId = null
      state.selectedBlockId = null
    }
  }

  const moveSection = (instanceId: string, direction: 'up' | 'down') => {
    const sorted = sortedSections.value
    const currentIdx = sorted.findIndex((s) => s.instanceId === instanceId)
    if (currentIdx === -1) return

    const targetIdx = direction === 'up' ? currentIdx - 1 : currentIdx + 1
    if (targetIdx < 0 || targetIdx >= sorted.length) return

    _saveHistory()
    const current = sorted[currentIdx]
    const target = sorted[targetIdx]
    const tmpOrder = current.order
    current.order = target.order
    target.order = tmpOrder
  }

  const duplicateSection = (instanceId: string) => {
    const original = state.page.sections.find((s) => s.instanceId === instanceId)
    if (!original) return
    _saveHistory()
    const clone: SectionInstance = {
      ...JSON.parse(JSON.stringify(original)),
      instanceId: generateInstanceId(),
      order: original.order + 0.5,
    }
    state.page.sections.push(clone)
    // Normalize order values
    const sorted = [...state.page.sections].sort((a, b) => a.order - b.order)
    sorted.forEach((s, i) => { s.order = i })
  }

  // ─── Block Editing ────────────────────────────────────────────────────────

  const updateBlockText = (instanceId: string, blockId: string, text: string) => {
    const section = state.page.sections.find((s) => s.instanceId === instanceId)
    if (!section) return
    if (!section.textOverrides) section.textOverrides = {}
    section.textOverrides[blockId] = text
  }

  const updateBlockProp = (instanceId: string, blockId: string, propKey: string, value: unknown) => {
    const section = state.page.sections.find((s) => s.instanceId === instanceId)
    if (!section) return
    if (!section.propOverrides) section.propOverrides = {}
    if (!section.propOverrides[blockId]) section.propOverrides[blockId] = {}
    section.propOverrides[blockId][propKey] = value
  }

  const updateSectionData = (instanceId: string, data: {
    customBlocks?: BlockDefinition[]
    attrOverrides?: Record<string, Record<string, string>>
    textOverrides?: Record<string, string>
    propOverrides?: Record<string, Record<string, unknown>>
    styleOverrides?: Record<string, Record<string, string>>
    sectionStyles?: Record<string, string>
    wrapperStyles?: Record<string, string>
  }): boolean => {
    const idx = state.page.sections.findIndex((s) => s.instanceId === instanceId)
    if (idx === -1) return false
    _saveHistory()
    // Replace the element entirely so Vue's reactive array intercepts the change
    // and sortedSections recomputes, triggering a full re-render cascade.
    state.page.sections.splice(idx, 1, {
      ...state.page.sections[idx],
      ...(data.customBlocks !== undefined   ? { customBlocks:   data.customBlocks   } : {}),
      ...(data.attrOverrides !== undefined  ? { attrOverrides:  data.attrOverrides  } : {}),
      ...(data.textOverrides !== undefined  ? { textOverrides:  data.textOverrides  } : {}),
      ...(data.propOverrides !== undefined  ? { propOverrides:  data.propOverrides  } : {}),
      ...(data.styleOverrides !== undefined ? { styleOverrides: data.styleOverrides } : {}),
      ...(data.sectionStyles !== undefined  ? { sectionStyles:  data.sectionStyles  } : {}),
      ...(data.wrapperStyles !== undefined  ? { wrapperStyles:  data.wrapperStyles  } : {}),
    })
    return true
  }

  const getBlockOverrides = (instanceId: string, blockId: string) => {
    const section = state.page.sections.find((s) => s.instanceId === instanceId)
    if (!section) return { props: {}, text: undefined }
    return {
      props: section.propOverrides?.[blockId] ?? {},
      text: section.textOverrides?.[blockId],
    }
  }

  // ─── Selection ────────────────────────────────────────────────────────────

  const selectSection = (instanceId: string | null, blockId: string | null = null) => {
    state.selectedSectionId = instanceId
    state.selectedBlockId = blockId
  }

  const selectBlock = (blockId: string | null) => {
    state.selectedBlockId = blockId
  }

  const selectedSection = computed(() =>
    state.page.sections.find((s) => s.instanceId === state.selectedSectionId) ?? null,
  )

  const selectedSectionTemplate = computed(() =>
    selectedSection.value ? getSectionById(selectedSection.value.templateId) ?? null : null,
  )

  // ─── Page Actions ─────────────────────────────────────────────────────────

  const setPageName = (name: string) => {
    state.page.name = name
  }

  const exportPage = (): PageConfig => JSON.parse(JSON.stringify(state.page))

  const loadPage = (page: PageConfig) => {
    _saveHistory()
    state.page = JSON.parse(JSON.stringify(page))
    state.selectedSectionId = null
    state.selectedBlockId = null
  }

  // ─── UI State ─────────────────────────────────────────────────────────────

  const toggleSectionPicker = () => {
    state.sectionPickerOpen = !state.sectionPickerOpen
  }

  const openDsMapper = () => {
    state.dsMapperOpen = true
  }

  const closeDsMapper = () => {
    state.dsMapperOpen = false
  }

  const togglePreview = () => {
    state.previewMode = !state.previewMode
  }

  // ─── Provide ──────────────────────────────────────────────────────────────

  const api = {
    state,
    adapter,
    sortedSections,
    canUndo,
    canRedo,
    selectedSection,
    selectedSectionTemplate,
    // Actions
    undo,
    redo,
    setDesignSystem,
    addSection,
    addSectionById,
    removeSection,
    moveSection,
    duplicateSection,
    updateBlockText,
    updateBlockProp,
    updateSectionData,
    getBlockOverrides,
    selectSection,
    selectBlock,
    setPageName,
    exportPage,
    loadPage,
    toggleSectionPicker,
    openDsMapper,
    closeDsMapper,
    togglePreview,
  }

  provide(VF_PAGE_BUILDER_KEY, api)

  return api
}

// ─── Consumer Hook ────────────────────────────────────────────────────────────

export function usePageBuilder () {
  const pb = inject(VF_PAGE_BUILDER_KEY)
  if (!pb) {
    throw new Error('[VueFactory] usePageBuilder() must be called inside a <VfPageBuilder> component.')
  }
  return pb
}

export type PageBuilderAPI = ReturnType<typeof createPageBuilder>
