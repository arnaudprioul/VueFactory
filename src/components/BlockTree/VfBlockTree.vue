<template>
  <div class="vf-bt">
    <div
      v-for="block in blocks"
      :key="block.id"
      class="vf-bt__node"
    >
      <!-- Drop indicator BEFORE -->
      <div
        v-if="dragState.overId === block.id && dragState.position === 'before'"
        class="vf-bt__drop-line vf-bt__drop-line--before"
        :style="{ marginLeft: `${depth * 14 + 8}px` }"
      />

      <!-- Row -->
      <div
        :class="[
          'vf-bt__row',
          {
            'vf-bt__row--selected': selectedBlockId === block.id,
            'vf-bt__row--editing': editingId === block.id,
            'vf-bt__row--dragging': dragState.draggingId === block.id,
            'vf-bt__row--drop-inside': dragState.overId === block.id && dragState.position === 'inside',
          }
        ]"
        :style="{ paddingLeft: `${depth * 14 + 8}px` }"
        draggable="true"
        @dragstart.stop="onDragStart(block, $event)"
        @dragover.stop.prevent="onDragOver(block, $event)"
        @dragleave.stop="onDragLeave(block)"
        @drop.stop.prevent="onDrop(block)"
        @dragend.stop="onDragEnd"
      >
        <!-- Drag handle -->
        <div class="vf-bt__drag-handle" title="Déplacer">
          <svg width="8" height="12" viewBox="0 0 8 12" fill="currentColor">
            <circle cx="2" cy="2" r="1.2"/><circle cx="6" cy="2" r="1.2"/>
            <circle cx="2" cy="6" r="1.2"/><circle cx="6" cy="6" r="1.2"/>
            <circle cx="2" cy="10" r="1.2"/><circle cx="6" cy="10" r="1.2"/>
          </svg>
        </div>

        <!-- Expand toggle -->
        <button
          v-if="block.children?.length"
          class="vf-bt__toggle"
          @click.stop="$emit('toggle-expand', block.id)"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline v-if="isExpanded(block.id)" points="18 15 12 9 6 15"/>
            <polyline v-else points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <div v-else class="vf-bt__toggle-spacer"/>

        <!-- Block type icon -->
        <div
          class="vf-bt__icon"
          :title="`Sélectionner — ${block.meta?.label ?? block.type}`"
          @click.stop="$emit('select', block.id)"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path :d="getBlockIcon(block.type)"/>
          </svg>
        </div>

        <!-- Label — click to rename -->
        <input
          v-if="editingId === block.id"
          :ref="(el) => { if (el) (el as HTMLInputElement).focus() }"
          class="vf-bt__label-input"
          :value="editingValue"
          @input="editingValue = ($event.target as HTMLInputElement).value"
          @blur="commitRename(block.id)"
          @keydown.enter.stop="commitRename(block.id)"
          @keydown.escape.stop="cancelRename()"
          @click.stop
        />
        <span
          v-else
          class="vf-bt__label"
          :class="{ 'vf-bt__label--renameable': !block.meta?.locked }"
          :title="block.meta?.locked ? block.meta?.label ?? block.type : 'Cliquer pour renommer'"
          @click.stop="onLabelClick(block)"
        >{{ block.meta?.label ?? block.type }}</span>

        <!-- Inside badge -->
        <span v-if="dragState.overId === block.id && dragState.position === 'inside'" class="vf-bt__inside-badge">
          dedans
        </span>

        <!-- Delete button -->
        <button
          v-if="!block.meta?.locked && editingId !== block.id"
          class="vf-bt__delete"
          title="Supprimer ce bloc"
          @click.stop="$emit('delete', block.id)"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Drop indicator AFTER (only if no children expanded below) -->
      <div
        v-if="dragState.overId === block.id && dragState.position === 'after' && !(block.children?.length && isExpanded(block.id))"
        class="vf-bt__drop-line vf-bt__drop-line--after"
        :style="{ marginLeft: `${depth * 14 + 8}px` }"
      />

      <!-- Children (recursive) -->
      <VfBlockTree
        v-if="block.children?.length && isExpanded(block.id)"
        :blocks="block.children"
        :selected-block-id="selectedBlockId"
        :depth="depth + 1"
        :expanded-ids="expandedIds"
        @select="$emit('select', $event)"
        @delete="$emit('delete', $event)"
        @toggle-expand="$emit('toggle-expand', $event)"
        @rename="$emit('rename', $event)"
        @move="$emit('move', $event)"
      />

      <!-- Drop indicator AFTER (when children are expanded, show it below the subtree) -->
      <div
        v-if="dragState.overId === block.id && dragState.position === 'after' && block.children?.length && isExpanded(block.id)"
        class="vf-bt__drop-line vf-bt__drop-line--after"
        :style="{ marginLeft: `${depth * 14 + 8}px` }"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { BlockDefinition } from '../../types'

// ─── Module-level drag state (shared across all recursive instances) ──────────
// Using a reactive singleton so all tree levels see the same state.
const dragState = reactive<{
  draggingId: string | null
  overId: string | null
  position: 'before' | 'after' | 'inside' | null
}>({
  draggingId: null,
  overId: null,
  position: null,
})

interface Props {
  blocks: BlockDefinition[]
  selectedBlockId?: string | null
  depth?: number
  expandedIds?: Set<string>
}

const props = withDefaults(defineProps<Props>(), {
  selectedBlockId: null,
  depth: 0,
  expandedIds: () => new Set(),
})

const emit = defineEmits<{
  'select': [blockId: string]
  'delete': [blockId: string]
  'toggle-expand': [blockId: string]
  'rename': [payload: { blockId: string; label: string }]
  'move': [payload: { dragId: string; targetId: string; position: 'before' | 'after' | 'inside' }]
}>()

// ─── Inline renaming ──────────────────────────────────────────────────────────

const editingId = ref<string | null>(null)
const editingValue = ref('')

function onLabelClick(block: BlockDefinition) {
  if (block.meta?.locked) return
  if (editingId.value && editingId.value !== block.id) commitRename(editingId.value)
  editingId.value = block.id
  editingValue.value = block.meta?.label ?? block.type
  emit('select', block.id)
}

function commitRename(blockId: string) {
  const trimmed = editingValue.value.trim()
  if (trimmed) emit('rename', { blockId, label: trimmed })
  editingId.value = null
  editingValue.value = ''
}

function cancelRename() {
  editingId.value = null
  editingValue.value = ''
}

// ─── Drag & drop ─────────────────────────────────────────────────────────────

function onDragStart(block: BlockDefinition, e: DragEvent) {
  dragState.draggingId = block.id
  e.dataTransfer!.effectAllowed = 'move'
  e.dataTransfer!.setData('text/plain', block.id)
  // slight visual delay so the element doesn't disappear before ghost appears
  const el = (e.currentTarget as HTMLElement)
  requestAnimationFrame(() => { el.style.opacity = '0.4' })
}

function onDragEnd(e: DragEvent) {
  const el = e.currentTarget as HTMLElement
  el.style.opacity = ''
  dragState.draggingId = null
  dragState.overId = null
  dragState.position = null
}

function canDropInside(block: BlockDefinition): boolean {
  return block.type === 'vf-box'
}

function onDragOver(block: BlockDefinition, e: DragEvent) {
  if (dragState.draggingId === block.id) return
  if (!dragState.draggingId) return

  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  const y = e.clientY - rect.top
  const h = rect.height
  const ratio = y / h

  let position: 'before' | 'after' | 'inside'
  if (canDropInside(block)) {
    if (ratio < 0.3) position = 'before'
    else if (ratio > 0.7) position = 'after'
    else position = 'inside'
  } else {
    position = ratio < 0.5 ? 'before' : 'after'
  }

  dragState.overId = block.id
  dragState.position = position
  e.dataTransfer!.dropEffect = 'move'
}

function onDragLeave(block: BlockDefinition) {
  if (dragState.overId === block.id) {
    dragState.overId = null
    dragState.position = null
  }
}

function onDrop(block: BlockDefinition) {
  const dragId = dragState.draggingId
  const position = dragState.position
  dragState.overId = null
  dragState.position = null
  dragState.draggingId = null

  if (!dragId || !position || dragId === block.id) return
  emit('move', { dragId, targetId: block.id, position })
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isExpanded(blockId: string): boolean {
  return props.expandedIds.has(blockId)
}

const BLOCK_ICONS: Record<string, string> = {
  'vf-box':     'M3 3h18v18H3z',
  'vf-text':    'M4 6h16M4 10h16M4 14h16M4 18h12',
  'vf-heading': 'M4 6h16M4 12h10M4 18h6',
  heading:    'M4 6h16M4 12h10M4 18h6',
  subheading: 'M4 6h16M4 12h14M4 18h10',
  text:       'M4 6h16M4 10h16M4 14h16M4 18h12',
  button:     'M5 12h14M12 5l7 7-7 7',
  link:       'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
  image:      'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  container:  'M3 3h18v18H3z',
  row:        'M3 6h18M3 12h18M3 18h18',
  column:     'M6 3v18M12 3v18M18 3v18',
  grid:       'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  badge:      'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
  divider:    'M3 12h18',
  spacer:     'M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3',
  card:       'M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z',
  icon:       'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  list:       'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  'list-item':'M9 6h11M9 12h11M4 6h.01M4 12h.01',
}

function getBlockIcon(type: string): string {
  return BLOCK_ICONS[type] ?? 'M4 6h16M4 12h16M4 18h16'
}
</script>

<style lang="scss" scoped>
.vf-bt {
  width: 100%;
}

.vf-bt__node {
  position: relative;
}

.vf-bt__drop-line {
  height: 2px;
  background: #6366f1;
  border-radius: 2px;
  margin-right: 4px;
  pointer-events: none;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: -4px;
    top: -3px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #6366f1;
  }
}

.vf-bt__row {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 32px;
  padding-right: 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 120ms;
  margin: 1px 4px;
  color: #374151;
  position: relative;

  &:hover {
    background: #f3f4f6;
    .vf-bt__delete { opacity: 1; }
    .vf-bt__drag-handle { opacity: 1; }
  }

  &--selected {
    background: rgba(99, 102, 241, 0.1);
    color: #4f46e5;

    .vf-bt__icon { color: #6366f1; }
    .vf-bt__label { color: #4f46e5; font-weight: 600; }
  }

  &--editing {
    background: rgba(99, 102, 241, 0.08);
  }

  &--dragging {
    opacity: 0.4;
  }

  &--drop-inside {
    background: rgba(99, 102, 241, 0.12) !important;
    outline: 2px dashed #6366f1;
    outline-offset: -2px;
  }
}

.vf-bt__drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 20px;
  color: #d1d5db;
  cursor: grab;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 120ms, color 120ms;

  &:hover { color: #9ca3af; }
  &:active { cursor: grabbing; }
}

.vf-bt__toggle {
  display: flex; align-items: center; justify-content: center;
  width: 16px; height: 16px; border: none; background: transparent;
  cursor: pointer; border-radius: 3px; color: #9ca3af; outline: none;
  flex-shrink: 0;
  &:hover { background: #e5e7eb; color: #374151; }
}

.vf-bt__toggle-spacer { width: 16px; flex-shrink: 0; }

.vf-bt__icon {
  display: flex; align-items: center; justify-content: center;
  width: 22px; height: 22px; color: #9ca3af; flex-shrink: 0;
  border-radius: 4px; cursor: pointer; transition: background 100ms, color 100ms;
  &:hover { background: #e5e7eb; color: #4f46e5; }
  .vf-bt__row--selected & { color: #6366f1; }
  .vf-bt__row--selected &:hover { background: rgba(99,102,241,0.15); }
}

.vf-bt__label {
  flex: 1; font-size: 12px; font-weight: 500;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  min-width: 0; border-radius: 3px; padding: 1px 3px; margin: 0 -3px;
  transition: background 100ms;

  &--renameable {
    cursor: text;
    &:hover { background: rgba(0, 0, 0, 0.05); }
    .vf-bt__row--selected &:hover { background: rgba(99, 102, 241, 0.15); }
  }
}

.vf-bt__label-input {
  flex: 1;
  min-width: 0;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  color: #4f46e5;
  background: #fff;
  border: 1px solid #6366f1;
  border-radius: 4px;
  padding: 2px 5px;
  outline: none;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.vf-bt__inside-badge {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6366f1;
  background: rgba(99, 102, 241, 0.12);
  border-radius: 3px;
  padding: 1px 4px;
  flex-shrink: 0;
  pointer-events: none;
}

.vf-bt__delete {
  display: flex; align-items: center; justify-content: center;
  width: 20px; height: 20px; border: none; background: transparent;
  color: #9ca3af; cursor: pointer; border-radius: 4px; outline: none;
  opacity: 0; transition: all 120ms; flex-shrink: 0;
  &:hover { background: #fee2e2; color: #ef4444; }
}
</style>
