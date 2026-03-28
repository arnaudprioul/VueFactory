<template>
  <div ref="pbRoot" class="vf-pb" :style="rootStyle" @keydown.ctrl.z.prevent="pb.undo()" @keydown.meta.z.prevent="pb.undo()" @keydown.ctrl.shift.z.prevent="pb.redo()" @keydown.meta.shift.z.prevent="pb.redo()" tabindex="0">

    <!-- TOOLBAR (dark, 48px) -->
    <header v-if="!pb.state.previewMode" class="vf-pb-toolbar">
      <div class="vf-pb-toolbar__left">
        <!-- Toggle left panel -->
        <button :class="['vf-pb-icon-btn', { 'vf-pb-icon-btn--active': pb.state.sectionPickerOpen }]" @click="pb.toggleSectionPicker()" title="Panneau sections">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>
          </svg>
        </button>
        <div class="vf-pb-sep"/>
        <!-- Undo/Redo -->
        <button class="vf-pb-icon-btn" :disabled="!pb.canUndo.value" @click="pb.undo()" title="Annuler">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v6h6"/><path d="M3 13C5.8 8.7 10 6 15 6c5 0 8.5 3 8.5 8s-4 9-9 9a11 11 0 01-8-3.5"/></svg>
        </button>
        <button class="vf-pb-icon-btn" :disabled="!pb.canRedo.value" @click="pb.redo()" title="Rétablir">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 7v6h-6"/><path d="M21 13C18.2 8.7 14 6 9 6c-5 0-8.5 3-8.5 8s4 9 9 9a11 11 0 008-3.5"/></svg>
        </button>
        <div class="vf-pb-sep"/>
        <!-- Device breakpoints -->
        <div class="vf-pb-device-group">
          <button v-for="d in DEVICES" :key="d.id" :class="['vf-pb-device-btn', { 'vf-pb-device-btn--active': deviceMode === d.id }]" :title="d.label" @click="deviceMode = d.id">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path :d="d.icon"/></svg>
          </button>
        </div>
      </div>

      <div class="vf-pb-toolbar__center">
        <input :value="pb.state.page.name" class="vf-pb-title-input" type="text" aria-label="Nom de la page" @input="pb.setPageName(($event.target as HTMLInputElement).value)"/>
      </div>

      <div class="vf-pb-toolbar__right">
        <button class="vf-pb-ds-btn" @click="pb.openDsMapper()">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          {{ pb.adapter.value.name }}
        </button>
        <div class="vf-pb-sep"/>
        <!-- Data binding panel toggle -->
        <button :class="['vf-pb-icon-btn', { 'vf-pb-icon-btn--active': dataPanelOpen }]" @click="dataPanelOpen = !dataPanelOpen" title="Données & liaisons">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
        </button>
        <div class="vf-pb-sep"/>
        <button v-if="pb.selectedSection.value" class="vf-pb-btn vf-pb-btn--ghost" @click="saveTemplateOpen = true" title="Sauvegarder comme template">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          Template
        </button>
        <button class="vf-pb-btn vf-pb-btn--ghost" @click="pb.togglePreview()">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          Aperçu
        </button>
        <button class="vf-pb-btn vf-pb-btn--ghost" @click="onExport">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Exporter
        </button>
        <button class="vf-pb-btn vf-pb-btn--primary" @click="onSave">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          Enregistrer
        </button>
      </div>
    </header>

    <!-- Preview bar -->
    <div v-else class="vf-pb-preview-bar">
      <div class="vf-pb-preview-bar__indicator">
        <span class="vf-pb-preview-dot"/>
        Mode aperçu
      </div>
      <button class="vf-pb-btn vf-pb-btn--ghost-light" @click="pb.togglePreview()">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 19l-7-7 7-7"/><path d="M4 12h16"/></svg>
        Retour à l'édition
      </button>
    </div>

    <!-- MAIN LAYOUT -->
    <div class="vf-pb-layout">

      <!-- LEFT PANEL: sections library -->
      <aside v-if="!pb.state.previewMode" :class="['vf-pb-left', { 'vf-pb-left--hidden': !pb.state.sectionPickerOpen }]">
        <VfSectionPicker
          @add="onPickerAdd($event)"
          @settings="onSectionSettings($event)"
          @add-section="onAddSectionType($event)"
          @add-category="onAddCategory()"
        />
      </aside>

      <!-- DATA PANEL (slides in from left, independent of section picker) -->
      <aside v-if="!pb.state.previewMode && dataPanelOpen" class="vf-pb-data-panel">
        <VfDataPanel
          :data-schema="pb.state.page.dataSchema"
          :preview-data="pb.state.page.previewData"
          @update:data-schema="pb.updateDataSchema($event)"
          @update:preview-data="pb.updatePreviewData($event)"
          @close="dataPanelOpen = false"
        />
      </aside>

      <!-- CANVAS -->
      <main class="vf-pb-canvas">
        <div class="vf-pb-canvas__scroll" @click.self="onCanvasClick" @dragover.prevent @drop.prevent="onCanvasDrop">
        <div :class="['vf-pb-page', `vf-pb-page--${deviceMode}`, { 'vf-pb-page--preview': pb.state.previewMode }]" @click.self="onCanvasClick">

          <!-- Empty state -->
          <div v-if="pb.sortedSections.value.length === 0" class="vf-pb-empty">
            <div class="vf-pb-empty__box" @click="pb.state.sectionPickerOpen = true">
              <div class="vf-pb-empty__plus">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </div>
              <p class="vf-pb-empty__title">Ajouter une section</p>
              <p class="vf-pb-empty__hint">Choisissez dans le panneau gauche<br>ou cliquez ici</p>
            </div>
          </div>

          <!-- Sections + insert slots -->
          <template v-else>
            <div v-if="!pb.state.previewMode" class="vf-pb-insert-slot">
              <button class="vf-pb-insert-btn" @click="openPickerAt(0)" title="Insérer une section ici">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
            <template v-for="(section, idx) in pb.sortedSections.value" :key="section.instanceId">
              <VfSectionRenderer
                :section="section"
                :template="getSectionTemplate(section.templateId)"
                :adapter="pb.adapter.value"
                :is-selected="pb.state.selectedSectionId === section.instanceId"
                :selected-block-id="pb.state.selectedSectionId === section.instanceId ? pb.state.selectedBlockId : null"
                :is-first="idx === 0"
                :is-last="idx === pb.sortedSections.value.length - 1"
                :preview-mode="pb.state.previewMode"
                :data-context="dataContext"
                @select="onEditSection($event)"
                @remove="pb.removeSection($event)"
                @duplicate="pb.duplicateSection($event)"
                @move="pb.moveSection($event.instanceId, $event.direction)"
                @select-block="pb.selectSection($event.instanceId, $event.blockId)"
                @update-text="pb.updateBlockText($event.instanceId, $event.blockId, $event.text)"
                @update-prop="pb.updateBlockProp($event.instanceId, $event.blockId, $event.key, $event.value)"
                @reorder="onSectionReorder"
                @edit="onEditSection($event)"
              />
              <div v-if="!pb.state.previewMode" class="vf-pb-insert-slot">
                <button class="vf-pb-insert-btn" @click="openPickerAt(idx + 1)" title="Insérer une section ici">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>
            </template>
          </template>
        </div>
        </div>
      </main>

    </div>

    <!-- ══ FLOATING PROPERTIES PANEL ═══════════════════════════════════════════ -->
    <Transition name="vf-float">
      <div
        v-if="pb.selectedSection.value && !pb.state.previewMode"
        class="vf-pb-float"
        :style="floatStyle"
      >
        <!-- Drag header -->
        <div class="vf-pb-float__hdr" @mousedown.prevent="onFloatDragStart">
          <svg class="vf-pb-float__grip" width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
            <circle cx="2.5" cy="2.5" r="1.2"/><circle cx="7.5" cy="2.5" r="1.2"/>
            <circle cx="2.5" cy="7" r="1.2"/><circle cx="7.5" cy="7" r="1.2"/>
            <circle cx="2.5" cy="11.5" r="1.2"/><circle cx="7.5" cy="11.5" r="1.2"/>
          </svg>
          <div class="vf-pb-float__hdr-info">
            <span class="vf-pb-float__hdr-cat">Section</span>
            <span class="vf-pb-float__hdr-name">{{ pb.selectedSectionTemplate.value?.name ?? '—' }}</span>
          </div>
          <div class="vf-pb-float__hdr-actions">
            <button
              class="vf-pb-float__hdr-btn"
              title="Ouvrir l'éditeur"
              @click.stop="onEditSection(pb.selectedSection.value!.instanceId)"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button
              class="vf-pb-float__hdr-btn vf-pb-float__hdr-btn--close"
              title="Fermer"
              @click.stop="pb.selectSection(null)"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Block bar (if block selected) -->
        <div v-if="pb.state.selectedBlockId" class="vf-pb-float__block-bar">
          <div class="vf-pb-float__block-dot" />
          <span class="vf-pb-float__block-name">{{ selectedBlockLabel }}</span>
          <button class="vf-pb-float__block-back" title="Désélectionner le bloc" @click="pb.selectBlock(null)">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Prop body -->
        <div class="vf-pb-float__body">
          <VfPropertiesPanel
            :selected-section="pb.selectedSection.value"
            :selected-template="pb.selectedSectionTemplate.value"
            :selected-block-id="pb.state.selectedBlockId"
            @deselect="pb.selectBlock(null)"
            @update-text="pb.updateBlockText($event.instanceId, $event.blockId, $event.text)"
            @update-prop="pb.updateBlockProp($event.instanceId, $event.blockId, $event.key, $event.value)"
          />
        </div>

        <!-- Footer -->
        <div class="vf-pb-float__footer">
          <button class="vf-pb-float__edit-btn" @click="onEditSection(pb.selectedSection.value!.instanceId)">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Ouvrir l'éditeur complet
          </button>
        </div>
      </div>
    </Transition>

    <!-- Modals -->
    <VfDesignSystemMapper
      :open="pb.state.dsMapperOpen"
      :current-ds-id="pb.state.page.designSystemId"
      :current-custom-map="pb.state.page.customComponentMap"
      @close="pb.closeDsMapper()"
      @apply="pb.setDesignSystem($event.dsId, $event.customMap)"
    />
    <VfSaveTemplateModal
      :open="saveTemplateOpen"
      :source-instance="pb.selectedSection.value"
      :source-template="pb.selectedSectionTemplate.value"
      @close="saveTemplateOpen = false"
      @save="onTemplateSaved"
    />
    <VfSectionEditor
      v-if="editorInstance"
      :open="editorOpen"
      :instance="editorInstance"
      :template="editorTemplate"
      :adapter="pb.adapter.value"
      @close="editorOpen = false; editorInstanceId = null"
      @save="onEditorSave"
    />
    <VfNewSectionModal
      :open="newSectionModalOpen"
      :initial-category="newSectionInitialCategory"
      @close="newSectionModalOpen = false"
      @confirm="onNewSectionConfirm"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import type { StyleValue } from 'vue'
import type { PageConfig, SectionTemplate, SectionInstance, BlockDefinition, SectionCategory, DesignSystemAdapter } from '../../types'
import { createPageBuilder } from '../../composables/page-builder.composable.ts'
import { buildDataContext } from '../../composables/useDataBinding'
import { getSectionById, registerSection } from '../../sections'
import { VfSectionPicker } from '../SectionPicker'
import { VfSectionRenderer } from '../SectionRenderer'
import { VfPropertiesPanel } from '../PropertiesPanel'
import { VfDesignSystemMapper } from '../DesignSystemMapper'
import { VfSaveTemplateModal } from '../SaveTemplateModal'
import { VfSectionEditor } from '../SectionEditor'
import { VfNewSectionModal } from '../NewSectionModal'
import { VfDataPanel } from '../DataPanel'

interface Props {
  id?: string
  page?: Partial<PageConfig>
  adapter?: DesignSystemAdapter
  fullHeight?: boolean
  /** Runtime API data passed by the consumer application */
  pageData?: Record<string, unknown>
}
const props = withDefaults(defineProps<Props>(), { fullHeight: true })
const emit = defineEmits<{
  'save': [page: PageConfig]
  'export': [page: PageConfig]
  'update:page': [page: PageConfig]
  'save-template': [template: SectionTemplate]
}>()

const pb = createPageBuilder(props.page, props.adapter)
type DeviceMode = 'desktop' | 'tablet' | 'mobile'
const deviceMode = ref<DeviceMode>('desktop')
const DEVICES = [
  { id: 'desktop' as DeviceMode, label: 'Bureau', icon: 'M20 3H4a1 1 0 00-1 1v13a1 1 0 001 1h7v2H8v1h8v-1h-3v-2h7a1 1 0 001-1V4a1 1 0 00-1-1zm-1 13H5V5h14v11z' },
  { id: 'tablet' as DeviceMode, label: 'Tablette', icon: 'M18 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2zM12 20a1 1 0 110-2 1 1 0 010 2zm5-4H7V5h10v11z' },
  { id: 'mobile' as DeviceMode, label: 'Mobile', icon: 'M17 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2zM12 20a1 1 0 110-2 1 1 0 010 2zm4-4H8V5h8v11z' },
]

const insertAtIndex = ref<number | null>(null)
const saveTemplateOpen = ref(false)
const dataPanelOpen = ref(false)
const editorOpen = ref(false)
const editorInstanceId = ref<string | null>(null)
const newSectionModalOpen = ref(false)
const newSectionInitialCategory = ref<SectionCategory | 'all'>('hero')

const editorInstance = computed(() =>
  editorInstanceId.value
    ? pb.state.page.sections.find((s) => s.instanceId === editorInstanceId.value) ?? null
    : null
)

const editorTemplate = computed(() =>
  editorInstance.value ? getSectionById(editorInstance.value.templateId) ?? null : null
)

/** Resolved data context: merges pageData (from consumer) with page previewData (in editor). */
const dataContext = computed(() => {
  // In edit mode: use previewData as the data source if no live pageData provided
  const liveData = props.pageData
  const previewStr = pb.state.page.previewData
  const effectiveData: Record<string, unknown> = liveData
    ?? (previewStr ? (() => { try { return JSON.parse(previewStr) } catch { return {} } })() : {})
  return buildDataContext(pb.state.page.dataSchema, effectiveData)
})

const rootStyle = computed((): StyleValue => [props.fullHeight ? { height: '100%' } : undefined])

function findBlock(blocks: BlockDefinition[] | undefined, id: string): BlockDefinition | null {
  if (!blocks) return null
  for (const block of blocks) {
    if (block.id === id) return block
    const found = findBlock(block.children, id)
    if (found) return found
  }
  return null
}

const selectedBlockLabel = computed<string>(() => {
  if (!pb.state.selectedBlockId || !pb.selectedSectionTemplate.value) return ''
  const block = findBlock(pb.selectedSectionTemplate.value.blocks, pb.state.selectedBlockId)
  return block?.meta?.label ?? pb.state.selectedBlockId
})

function openPickerAt(idx: number) {
  insertAtIndex.value = idx
  pb.state.sectionPickerOpen = true
}

function onPickerAdd(templateId: string) {
  if (insertAtIndex.value !== null) {
    pb.addSectionById(templateId, insertAtIndex.value)
    insertAtIndex.value = null
  } else {
    pb.addSectionById(templateId)
  }
}

function onSectionSettings (template: SectionTemplate) {
  const instance = pb.addSectionById(template.id)
  if (instance) {
    editorInstanceId.value = instance.instanceId
    editorOpen.value = true
  }
}
function onAddSectionType (category: SectionCategory | 'all') {
  newSectionInitialCategory.value = category
  newSectionModalOpen.value = true
}
function onAddCategory () { /* TODO: open new category dialog */ }

function onNewSectionConfirm (payload: { name: string; category: SectionCategory }) {
  const templateId = `custom-${Date.now()}`
  const template: SectionTemplate = {
    id: templateId,
    name: payload.name,
    category: payload.category,
    description: '',
    blocks: [
      {
        id: 'root',
        type: 'vf-box',
        style: { padding: '60px 24px' },
        meta: { label: 'Wrapper' },
        children: [],
      },
    ],
  }
  registerSection(template)
  const instance = pb.addSection(template)
  newSectionModalOpen.value = false
  editorInstanceId.value = instance.instanceId
  editorOpen.value = true
}

function onEditSection(instanceId: string) {
  editorInstanceId.value = instanceId
  editorOpen.value = true
}

function onEditorSave(payload: {
  instance: SectionInstance
  customBlocks: BlockDefinition[]
  attrOverrides: Record<string, Record<string, string>>
  textOverrides: Record<string, string>
  propOverrides: Record<string, Record<string, unknown>>
  styleOverrides: Record<string, Record<string, string>>
  sectionStyles: Record<string, string>
  wrapperStyles: Record<string, string>
}) {
  pb.updateSectionData(payload.instance.instanceId, {
    customBlocks: payload.customBlocks,
    attrOverrides: payload.attrOverrides,
    styleOverrides: payload.styleOverrides,
    textOverrides: payload.textOverrides,
    propOverrides: payload.propOverrides,
    sectionStyles: payload.sectionStyles,
    wrapperStyles: payload.wrapperStyles,
  })
  editorOpen.value = false
  editorInstanceId.value = null
}

function getSectionTemplate(templateId: string) {
  return getSectionById(templateId) ?? null
}

function onCanvasClick() {
  pb.selectSection(null)
}

function onCanvasDrop(e: DragEvent) {
  const data = e.dataTransfer?.getData('text/plain') ?? ''
  if (data.startsWith('new:')) pb.addSectionById(data.slice(4))
}

function onSectionReorder(payload: { fromId: string; toId: string; position: 'top' | 'bottom' }) {
  const sorted = pb.sortedSections.value
  const fromSection = sorted.find((s) => s.instanceId === payload.fromId)
  const toSection = sorted.find((s) => s.instanceId === payload.toId)
  if (!fromSection || !toSection) return
  fromSection.order = payload.position === 'top' ? toSection.order - 0.5 : toSection.order + 0.5
  const newSorted = [...pb.state.page.sections].sort((a, b) => a.order - b.order)
  newSorted.forEach((s, i) => { s.order = i })
}

function onSave() {
  const page = pb.exportPage()
  emit('save', page)
  emit('update:page', page)
}

function onExport() {
  const page = pb.exportPage()
  emit('export', page)
  const blob = new Blob([JSON.stringify(page, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${page.name.replace(/\s+/g, '-').toLowerCase()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function onTemplateSaved(template: SectionTemplate) {
  registerSection(template)
  emit('save-template', template)
}

// ── Floating panel drag ────────────────────────────────────────────────────────
const pbRoot = ref<HTMLElement | null>(null)
const floatPos = ref<{ x: number; y: number } | null>(null)
let _dox = 0, _doy = 0, _dmx = 0, _dmy = 0

const floatStyle = computed(() => {
  if (!floatPos.value) return { right: '16px', top: '64px', position: 'absolute' as const }
  return { left: floatPos.value.x + 'px', top: floatPos.value.y + 'px', position: 'absolute' as const }
})

function onFloatDragStart(e: MouseEvent) {
  const panel = (e.currentTarget as HTMLElement).closest('.vf-pb-float') as HTMLElement | null
  if (!panel || !pbRoot.value) return
  const pr = pbRoot.value.getBoundingClientRect()
  const pa = panel.getBoundingClientRect()
  floatPos.value = { x: pa.left - pr.left, y: pa.top - pr.top }
  _dox = floatPos.value.x; _doy = floatPos.value.y
  _dmx = e.clientX; _dmy = e.clientY
  document.addEventListener('mousemove', onFloatDrag)
  document.addEventListener('mouseup', onFloatDragEnd, { once: true })
}

function onFloatDrag(e: MouseEvent) {
  if (!floatPos.value || !pbRoot.value) return
  const pr = pbRoot.value.getBoundingClientRect()
  floatPos.value = {
    x: Math.max(0, Math.min(_dox + (e.clientX - _dmx), pr.width - 280)),
    y: Math.max(48, Math.min(_doy + (e.clientY - _dmy), pr.height - 80)),
  }
}

function onFloatDragEnd() {
  document.removeEventListener('mousemove', onFloatDrag)
}

watch(() => pb.selectedSection.value?.instanceId, () => {
  floatPos.value = null
})
</script>

<style lang="scss">
@use '../../assets/scss/main.scss';

// CSS tokens — light theme with dark toolbar
:root {
  --vf-toolbar-bg:     #1a1b23;
  --vf-toolbar-border: #2d2e3a;
  --vf-panel-bg:       #ffffff;
  --vf-panel-border:   #e5e7eb;
  --vf-panel-header:   #f8f9fa;
  --vf-canvas-bg:      #f0f2f5;
  --vf-page-bg:        #ffffff;
  --vf-text:           #111827;
  --vf-text-2:         #6b7280;
  --vf-text-3:         #9ca3af;
  --vf-accent:         #6366f1;
  --vf-accent-hover:   #4f46e5;
  --vf-accent-light:   rgba(99,102,241,0.1);
  --vf-accent-glow:    rgba(99,102,241,0.25);
  --vf-font:           'Inter', system-ui, -apple-system, sans-serif;
  --vf-radius:         6px;
}

// Toolbar buttons (dark context)
.vf-pb-icon-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px;
  border-radius: var(--vf-radius); background: transparent;
  border: 1px solid transparent;
  color: rgba(255,255,255,0.5);
  cursor: pointer; transition: all 120ms; outline: none; font-family: var(--vf-font);
  &:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.9); border-color: rgba(255,255,255,0.12); }
  &:disabled { opacity: 0.2; cursor: not-allowed; }
  &--active { background: var(--vf-accent-light); color: var(--vf-accent); border-color: rgba(99,102,241,0.35); }
}
.vf-pb-sep { width: 1px; height: 16px; background: rgba(255,255,255,0.1); margin: 0 4px; flex-shrink: 0; }
.vf-pb-device-group { display: flex; align-items: center; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--vf-radius); padding: 2px; gap: 1px; }
.vf-pb-device-btn { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 4px; background: transparent; border: none; color: rgba(255,255,255,0.35); cursor: pointer; transition: all 120ms; outline: none; &:hover { color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.06); } &--active { background: var(--vf-accent); color: #fff; } }
.vf-pb-title-input { background: transparent; border: 1px solid transparent; border-radius: var(--vf-radius); color: rgba(255,255,255,0.9); font-size: 13px; font-weight: 600; font-family: inherit; text-align: center; padding: 5px 14px; outline: none; width: 200px; transition: all 150ms; &:hover { border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.06); } &:focus { border-color: var(--vf-accent); background: rgba(99,102,241,0.1); } }
.vf-pb-ds-btn { display: inline-flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: var(--vf-radius); font-size: 11.5px; font-weight: 600; font-family: inherit; cursor: pointer; background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3); color: #818cf8; transition: all 120ms; outline: none; &:hover { background: rgba(99,102,241,0.25); border-color: rgba(99,102,241,0.5); } }
.vf-pb-btn { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: var(--vf-radius); font-size: 12px; font-weight: 500; font-family: inherit; cursor: pointer; white-space: nowrap; outline: none; transition: all 120ms;
  &--ghost { background: transparent; border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.6); &:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.9); border-color: rgba(255,255,255,0.2); } }
  &--ghost-light { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.8); &:hover { background: rgba(255,255,255,0.14); color: #fff; } }
  &--primary { background: var(--vf-accent); border: 1px solid var(--vf-accent); color: #fff; box-shadow: 0 1px 4px var(--vf-accent-glow); &:hover { background: var(--vf-accent-hover); border-color: var(--vf-accent-hover); box-shadow: 0 2px 10px var(--vf-accent-glow); } }
}
</style>

<style lang="scss" scoped>
// ─── Root ─────────────────────────────────────────────────────────────────────
.vf-pb {
  display: flex; flex-direction: column;
  position: relative;
  background: var(--vf-canvas-bg, #f0f2f5);
  font-family: var(--vf-font, system-ui);
  color: var(--vf-text, #111827);
  overflow: hidden;
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────
.vf-pb-toolbar {
  display: flex; align-items: center; height: 48px; padding: 0 10px;
  background: var(--vf-toolbar-bg, #1a1b23);
  border-bottom: 1px solid var(--vf-toolbar-border, #2d2e3a);
  flex-shrink: 0; gap: 6px; position: relative; z-index: 100;
  &__left, &__right { display: flex; align-items: center; gap: 3px; min-width: 0; }
  &__right { margin-left: auto; gap: 4px; }
  &__center { flex: 1; display: flex; justify-content: center; }
}

// ─── Preview bar ──────────────────────────────────────────────────────────────
.vf-pb-preview-bar {
  display: flex; align-items: center; justify-content: space-between; height: 44px; padding: 0 16px;
  background: var(--vf-toolbar-bg, #1a1b23); border-bottom: 1px solid var(--vf-toolbar-border, #2d2e3a); flex-shrink: 0;
  &__indicator { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.08em; }
}
.vf-pb-preview-dot { width: 7px; height: 7px; border-radius: 50%; background: #34d399; box-shadow: 0 0 6px rgba(52,211,153,0.6); animation: vf-pulse 2s ease-in-out infinite; }
@keyframes vf-pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }

// ─── Layout ───────────────────────────────────────────────────────────────────
.vf-pb-layout { display: flex; flex: 1; overflow: hidden; min-height: 0; }

// ─── Data Panel ───────────────────────────────────────────────────────────────
.vf-pb-data-panel {
  width: 260px; min-width: 260px; height: 100%;
  background: #1a1a2e;
  border-right: 1px solid #2d3748;
  display: flex; flex-direction: column; overflow: hidden; flex-shrink: 0;
  z-index: 10;
}

// ─── Left Panel ───────────────────────────────────────────────────────────────
.vf-pb-left {
  width: 320px; min-width: 320px; height: 100%;
  background: var(--vf-panel-bg, #ffffff);
  border-right: 1px solid var(--vf-panel-border, #e5e7eb);
  display: flex; flex-direction: column; overflow: hidden; flex-shrink: 0;
  transition: width 200ms ease-out, min-width 200ms ease-out, opacity 200ms ease-out;
  &--hidden { width: 0; min-width: 0; opacity: 0; pointer-events: none; border-right-width: 0; }

  &__header {
    display: flex; align-items: center; justify-content: space-between;
    height: 44px; padding: 0 14px; background: var(--vf-panel-header, #f8f9fa);
    border-bottom: 1px solid var(--vf-panel-border, #e5e7eb); flex-shrink: 0;
  }
  &__title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: var(--vf-text-2, #6b7280); }
  &__count { font-size: 11px; font-weight: 600; background: #f3f4f6; color: var(--vf-text-3, #9ca3af); border-radius: 99px; padding: 1px 8px; }

  &__search-wrap { position: relative; padding: 10px 10px 6px; flex-shrink: 0; }
  &__search-icon { position: absolute; left: 19px; top: 50%; transform: translateY(-50%); color: var(--vf-text-3, #9ca3af); pointer-events: none; }
  &__search {
    width: 100%; padding: 7px 28px; background: #f9fafb; border: 1px solid var(--vf-panel-border, #e5e7eb);
    border-radius: 7px; color: var(--vf-text, #111827); font-size: 12.5px; outline: none;
    transition: border-color 150ms, background 150ms; box-sizing: border-box; font-family: inherit;
    &::placeholder { color: var(--vf-text-3, #9ca3af); }
    &:focus { border-color: var(--vf-accent, #6366f1); background: #fff; }
  }
  &__search-clear { position: absolute; right: 18px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; justify-content: center; width: 16px; height: 16px; border: none; background: #e5e7eb; color: var(--vf-text-2, #6b7280); cursor: pointer; border-radius: 50%; transition: all 120ms; outline: none; &:hover { background: #d1d5db; color: var(--vf-text, #111827); } }

  &__cats { display: flex; flex-direction: column; padding: 0 6px 6px; flex-shrink: 0; border-bottom: 1px solid var(--vf-panel-border, #e5e7eb); }
  &__cat { display: flex; align-items: center; gap: 8px; width: 100%; padding: 6px 8px; border: none; background: transparent; color: var(--vf-text-2, #6b7280); font-size: 12.5px; font-family: inherit; border-radius: 5px; cursor: pointer; text-align: left; transition: all 120ms; outline: none; &:hover { background: #f3f4f6; color: var(--vf-text, #111827); } &--active { background: var(--vf-accent-light, rgba(99,102,241,0.1)); color: var(--vf-accent, #6366f1); &:hover { background: rgba(99,102,241,0.15); } } }
  &__cat-badge { margin-left: auto; font-size: 10px; font-weight: 600; color: var(--vf-text-3, #9ca3af); background: #f3f4f6; border-radius: 99px; padding: 1px 6px; }

  &__list { flex: 1; overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 4px; &::-webkit-scrollbar { width: 4px; } &::-webkit-scrollbar-track { background: transparent; } &::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; } &::-webkit-scrollbar-thumb:hover { background: #d1d5db; } }
  &__empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 32px 16px; font-size: 12px; color: var(--vf-text-3, #9ca3af); text-align: center; }
}

// Active category badge style via parent selector
.vf-pb-left__cat--active .vf-pb-left__cat-badge {
  background: rgba(99,102,241,0.15);
  color: var(--vf-accent, #6366f1);
}

// ─── Section Card ─────────────────────────────────────────────────────────────
.vf-pb-section-card {
  border-radius: 8px; border: 1px solid var(--vf-panel-border, #e5e7eb);
  background: #fff; cursor: pointer; overflow: hidden;
  transition: border-color 150ms, transform 150ms, box-shadow 150ms;
  position: relative;
  &:hover { border-color: var(--vf-accent, #6366f1); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(99,102,241,0.12); }
  &:active { transform: translateY(0); }

  &__thumb { width: 100%; height: 54px; background: linear-gradient(135deg, #f8f9ff, #f0f2ff); display: flex; align-items: center; justify-content: center; overflow: hidden; }
  &__thumb-placeholder { display: flex; align-items: center; justify-content: center; color: rgba(99,102,241,0.5); }

  &__info { padding: 7px 10px 8px; display: flex; align-items: center; gap: 6px; }
  &__name { flex: 1; font-size: 12px; font-weight: 600; color: var(--vf-text, #111827); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  &__badge { flex-shrink: 0; font-size: 9px; font-weight: 700; text-transform: uppercase; padding: 1px 5px; background: rgba(52,211,153,0.1); color: #059669; border-radius: 99px; border: 1px solid rgba(52,211,153,0.25); }
}

.vf-pb-section-card__thumb img { width: 100%; height: 100%; object-fit: cover; }

// ─── Canvas ───────────────────────────────────────────────────────────────────
.vf-pb-canvas {
  flex: 1; min-width: 0; min-height: 0;
  position: relative;
  background: var(--vf-canvas-bg, #f0f2f5);
  background-image: radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px);
  background-size: 20px 20px;
}

// Scroll wrapper — absolute fill so flex sizing never interferes with scroll height
.vf-pb-canvas__scroll {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 28px 16px 56px;
}

// ─── Page Frame ───────────────────────────────────────────────────────────────
.vf-pb-page {
  width: 100%; max-width: 1280px;
  margin: 0 auto;
  background: var(--vf-page-bg, #ffffff);
  box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.08);
  border-radius: 6px; overflow: visible; transition: max-width 300ms cubic-bezier(0.4,0,0.2,1); position: relative;
  border: 1px solid #e5e7eb;
  &--tablet { max-width: 768px; }
  &--mobile { max-width: 390px; }
  &--preview { border-radius: 0; box-shadow: none; max-width: 100%; width: 100%; border: none; }
}

// ─── Empty state ──────────────────────────────────────────────────────────────
.vf-pb-empty {
  display: flex; align-items: center; justify-content: center; padding: 80px 40px; min-height: 300px;
  &__box {
    display: flex; flex-direction: column; align-items: center; gap: 14px;
    padding: 48px 56px; cursor: pointer; border-radius: 16px;
    border: 2px dashed #d1d5db; transition: all 200ms;
    &:hover { border-color: var(--vf-accent, #6366f1); background: var(--vf-accent-light, rgba(99,102,241,0.04)); }
  }
  &__plus {
    width: 56px; height: 56px; border-radius: 50%; background: #f3f4f6; color: #6b7280;
    display: flex; align-items: center; justify-content: center; transition: all 200ms;
  }
  &__title { font-size: 15px; font-weight: 600; color: var(--vf-text, #111827); margin: 0; }
  &__hint { font-size: 12.5px; color: var(--vf-text-2, #6b7280); margin: 0; text-align: center; line-height: 1.6; }
}

.vf-pb-empty__box:hover .vf-pb-empty__plus {
  background: var(--vf-accent, #6366f1);
  color: #fff;
  transform: scale(1.08);
}

// ─── Insert slot ──────────────────────────────────────────────────────────────
.vf-pb-insert-slot {
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 180ms; position: relative; z-index: 2;
  &::before { content: ''; position: absolute; left: 20px; right: 20px; top: 50%; height: 1px; background: var(--vf-accent, #6366f1); opacity: 0; transform: scaleX(0); transition: opacity 180ms, transform 180ms; transform-origin: center; }
  &:hover { opacity: 1; &::before { opacity: 0.4; transform: scaleX(1); } }
}
.vf-pb-page:hover .vf-pb-insert-slot { opacity: 0.4; }
.vf-pb-page:hover .vf-pb-insert-slot:hover { opacity: 1; }
.vf-pb-insert-btn {
  display: flex; align-items: center; justify-content: center;
  width: 24px; height: 24px; border-radius: 50%; background: var(--vf-accent, #6366f1);
  border: none; color: #fff; cursor: pointer; transition: all 150ms;
  box-shadow: 0 2px 8px var(--vf-accent-glow, rgba(99,102,241,0.4));
  position: absolute; z-index: 5; outline: none;
  &:hover { transform: scale(1.2); box-shadow: 0 4px 16px var(--vf-accent-glow, rgba(99,102,241,0.5)); }
}

// ── Floating properties panel ──────────────────────────────────────────────────
.vf-pb-float {
  position: absolute;
  z-index: 200;
  width: 272px;
  max-height: calc(100% - 80px);
  border-radius: 12px;
  background: #fff;
  box-shadow:
    0 0 0 1px rgba(0,0,0,0.07),
    0 4px 6px rgba(0,0,0,0.04),
    0 12px 28px rgba(0,0,0,0.10);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  pointer-events: all;

  // Override PropertiesPanel inside float
  :deep(.vf-pp) { width: 100%; min-width: 0; border-left: none; background: transparent; flex: 1; min-height: 0; overflow: hidden; }
  :deep(.vf-pp__header)       { display: none; }
  :deep(.vf-pp__empty)        { display: none; }
  :deep(.vf-pp__section-chip) { display: none; }
  :deep(.vf-pp__block-chip)   { display: none; }
}

// Drag header
.vf-pb-float__hdr {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px 0 10px;
  height: 40px;
  border-bottom: 1px solid #f0f0f0;
  cursor: grab;
  flex-shrink: 0;
  user-select: none;

  &:active { cursor: grabbing; }
}
.vf-pb-float__grip {
  color: #d1d5db;
  flex-shrink: 0;
}
.vf-pb-float__hdr-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.vf-pb-float__hdr-cat {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(99,102,241,0.55);
}
.vf-pb-float__hdr-name {
  font-size: 12.5px;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.vf-pb-float__hdr-actions { display: flex; align-items: center; gap: 1px; flex-shrink: 0; }
.vf-pb-float__hdr-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  color: #9ca3af;
  transition: background 120ms, color 120ms;
  outline: none;

  &:hover { background: #f3f4f6; color: #374151; }
  &--close:hover { background: #fef2f2; color: #ef4444; }
}

// Block bar
.vf-pb-float__block-bar {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 12px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}
.vf-pb-float__block-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #6b7280;
  flex-shrink: 0;
}
.vf-pb-float__block-name {
  flex: 1;
  font-size: 11.5px;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}
.vf-pb-float__block-back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  color: #9ca3af;
  transition: background 120ms, color 120ms;
  outline: none;
  flex-shrink: 0;
  &:hover { background: #f3f4f6; color: #374151; }
}

// Body (prop list)
.vf-pb-float__body {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

// Footer
.vf-pb-float__footer {
  border-top: 1px solid #f0f0f0;
  padding: 8px 10px;
  flex-shrink: 0;
}
.vf-pb-float__edit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 7px 12px;
  border: 1px solid var(--vf-panel-border, #e5e7eb);
  border-radius: 7px;
  background: #fafafa;
  color: var(--vf-text-2, #6b7280);
  font-size: 11.5px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 120ms;
  outline: none;

  &:hover {
    background: var(--vf-accent, #6366f1);
    border-color: var(--vf-accent, #6366f1);
    color: #fff;
  }
}

// Transition
.vf-float-enter-active { transition: opacity 150ms ease, transform 150ms ease; }
.vf-float-leave-active { transition: opacity 100ms ease; }
.vf-float-enter-from { opacity: 0; transform: translateY(8px) scale(0.97); }
.vf-float-leave-to   { opacity: 0; }
</style>
