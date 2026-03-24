<template>
  <div
    :class="[
      'vf-sr',
      {
        'vf-sr--selected': isSelected,
        'vf-sr--preview': previewMode,
      },
    ]"
    @click.stop="onSelectSection"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
  >
    <!-- ─── Editor Overlay ──────────────────────────────────────────────── -->
    <template v-if="!previewMode">
      <!-- Controls bar -->
      <div class="vf-sr__controls" @click.stop>
        <!-- Drag handle -->
        <div
          class="vf-sr__handle"
          title="Glisser pour réorganiser"
          draggable="true"
          @dragstart="onDragStart"
          @dragend="onDragEnd"
        >
          <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
            <circle cx="2.5" cy="2" r="1.5"/><circle cx="7.5" cy="2" r="1.5"/>
            <circle cx="2.5" cy="7" r="1.5"/><circle cx="7.5" cy="7" r="1.5"/>
            <circle cx="2.5" cy="12" r="1.5"/><circle cx="7.5" cy="12" r="1.5"/>
          </svg>
        </div>

        <!-- Section name -->
        <span class="vf-sr__label">{{ template?.name ?? section.templateId }}</span>

        <!-- Action buttons -->
        <div class="vf-sr__actions">
          <button
            class="vf-sr__btn"
            title="Déplacer vers le haut"
            :disabled="isFirst"
            @click.stop="$emit('move', { instanceId: section.instanceId, direction: 'up' })"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
          <button
            class="vf-sr__btn"
            title="Déplacer vers le bas"
            :disabled="isLast"
            @click.stop="$emit('move', { instanceId: section.instanceId, direction: 'down' })"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <div class="vf-sr__btn-sep" />

          <button
            class="vf-sr__btn"
            title="Dupliquer la section"
            @click.stop="$emit('duplicate', section.instanceId)"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          </button>
          <button
            class="vf-sr__btn"
            title="Éditer la section"
            @click.stop="$emit('edit', section.instanceId)"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button
            class="vf-sr__btn vf-sr__btn--danger"
            title="Supprimer la section"
            @click.stop="$emit('remove', section.instanceId)"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
          </button>
        </div>
      </div>
    </template>

    <!-- ─── Drop Indicators ────────────────────────────────────────────── -->
    <div v-if="!previewMode && isDragOver && dragPosition === 'top'" class="vf-sr__drop-line vf-sr__drop-line--top" />

    <!-- ─── Section Content ────────────────────────────────────────────── -->
    <div class="vf-section" :class="{ 'vf-section--centered': isCentered }" :style="resolvedSectionStyle">
      <div class="vf-section__wrapper" :style="resolvedWrapperStyle">
        <VfBlockRenderer
          v-for="block in (section.customBlocks ?? template?.blocks ?? [])"
          :key="block.id"
          :block="block"
          :instance-id="section.instanceId"
          :adapter="adapter"
          :selected-block-id="selectedBlockId"
          :text-overrides-map="section.textOverrides"
          :prop-overrides-map="section.propOverrides"
          :attr-overrides-map="section.attrOverrides"
          :style-overrides-map="section.styleOverrides"
          @select="$emit('select-block', $event)"
          @update-text="$emit('update-text', $event)"
          @update-prop="$emit('update-prop', $event)"
        />
      </div>
    </div>


    <div v-if="!previewMode && isDragOver && dragPosition === 'bottom'" class="vf-sr__drop-line vf-sr__drop-line--bottom" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { SectionInstance, SectionTemplate, DesignSystemAdapter } from '../../types'
import { VfBlockRenderer } from '../BlockRenderer'

interface Props {
  section: SectionInstance
  template: SectionTemplate | null
  adapter: DesignSystemAdapter
  isSelected: boolean
  selectedBlockId?: string | null
  isFirst: boolean
  isLast: boolean
  previewMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selectedBlockId: null,
  previewMode: false,
})

const emit = defineEmits<{
  'select': [instanceId: string]
  'remove': [instanceId: string]
  'duplicate': [instanceId: string]
  'move': [payload: { instanceId: string; direction: 'up' | 'down' }]
  'select-block': [payload: { instanceId: string; blockId: string }]
  'update-text': [payload: { instanceId: string; blockId: string; text: string }]
  'update-prop': [payload: { instanceId: string; blockId: string; key: string; value: unknown }]
  'reorder': [payload: { fromId: string; toId: string; position: 'top' | 'bottom' }]
  'edit': [instanceId: string]
}>()

// ─── Resolved styles ─────────────────────────────────────────────────────────

const resolvedSectionStyle = computed(() => ({
  ...(props.template?.defaultStyle ?? {}),
  ...(props.section.sectionStyles ?? {}),
}))

const resolvedWrapperStyle = computed(() => ({
  ...(props.template?.defaultWrapperStyle ?? {}),
  ...(props.section.wrapperStyles ?? {}),
}))

const isCentered = computed(() => !!props.section.wrapperStyles?.maxWidth)

// ─── Drag & Drop ─────────────────────────────────────────────────────────────

const isDragOver = ref(false)
const dragPosition = ref<'top' | 'bottom'>('top')

function onDragStart (e: DragEvent) {
  e.dataTransfer?.setData('text/plain', props.section.instanceId)
  e.stopPropagation()
}

function onDragEnd () {
  isDragOver.value = false
}

function onDragLeave () {
  isDragOver.value = false
}

function onDragOver (e: DragEvent) {
  isDragOver.value = true
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  dragPosition.value = e.clientY < rect.top + rect.height / 2 ? 'top' : 'bottom'
}

function onDrop (e: DragEvent) {
  isDragOver.value = false
  const fromId = e.dataTransfer?.getData('text/plain')
  if (fromId && fromId !== props.section.instanceId) {
    emit('reorder', { fromId, toId: props.section.instanceId, position: dragPosition.value })
  }
}

// ─── Selection ───────────────────────────────────────────────────────────────

function onSelectSection () {
  emit('select', props.section.instanceId)
}
</script>

<style lang="scss" scoped>
.vf-sr {
  position: relative;
  cursor: default;

  // Hover outline
  &:not(&--preview):not(&--selected):hover {
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      outline: 2px solid rgba(99, 102, 241, 0.35);
      outline-offset: -2px;
      pointer-events: none;
      border-radius: 1px;
    }
  }

  // Selected outline
  &--selected {
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      outline: 2px solid #6366f1;
      outline-offset: -2px;
      pointer-events: none;
      border-radius: 1px;
    }

    .vf-sr__controls {
      opacity: 1;
      pointer-events: all;
      transform: translateY(0);
    }
  }

  // Show controls on hover too
  &:not(&--preview):hover .vf-sr__controls {
    opacity: 1;
    pointer-events: all;
    transform: translateY(0);
  }
}

// ─── Controls Bar ────────────────────────────────────────────────────────────

.vf-sr__controls {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 36px;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 6px 0 4px;
  background: #6366f1;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-4px);
  transition: opacity 150ms, transform 150ms;
  cursor: default;
}

.vf-sr__handle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: rgba(255, 255, 255, 0.7);
  cursor: grab;
  border-radius: 4px;
  flex-shrink: 0;
  transition: color 120ms, background 120ms;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
  }

  &:active {
    cursor: grabbing;
  }
}

.vf-sr__label {
  flex: 1;
  font-size: 11.5px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.vf-sr__actions {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

.vf-sr__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.75);
  border-radius: 4px;
  cursor: pointer;
  transition: background 120ms, color 120ms;
  outline: none;

  &:hover {
    background: rgba(255, 255, 255, 0.18);
    color: #fff;
  }

  &:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }

  &--danger:hover {
    background: rgba(239, 68, 68, 0.5);
    color: #fff;
  }
}

.vf-sr__btn-sep {
  width: 1px;
  height: 14px;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 2px;
}

// ─── Content ─────────────────────────────────────────────────────────────────

.vf-section {
  width: 100%;
  color: var(--vf-section-color, #111827);
  background-color: var(--vf-section-bg, #ffffff);
  font-family: var(--vf-section-font, system-ui, -apple-system, sans-serif);
  font-size: 16px;
  line-height: 1.5;
}

.vf-section__wrapper {
  min-height: 80px;
  box-sizing: border-box;
}

.vf-section--centered .vf-section__wrapper {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

// ─── Drop Line ────────────────────────────────────────────────────────────────

.vf-sr__drop-line {
  height: 3px;
  background: #6366f1;
  border-radius: 2px;
  margin: 0;
  box-shadow: 0 0 8px rgba(99, 102, 241, 0.6);
  animation: vf-drop-pulse 700ms ease-in-out infinite alternate;

  &--top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }

  &--bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
}

@keyframes vf-drop-pulse {
  from { opacity: 0.7; }
  to { opacity: 1; }
}
</style>
