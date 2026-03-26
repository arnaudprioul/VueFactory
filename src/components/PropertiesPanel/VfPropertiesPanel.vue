<template>
  <aside class="vf-pp">

    <!-- Header - affiché standalone, masqué dans floating panel via :deep -->
    <div class="vf-pp__header">
      <div class="vf-pp__header-left">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span class="vf-pp__title">Propriétés</span>
      </div>
      <button v-if="selectedBlockId" class="vf-pp__hdr-close" title="Désélectionner" @click="$emit('deselect')">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>

    <!-- Empty state -->
    <div v-if="!selectedSection" class="vf-pp__empty">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
        <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" /><circle cx="12" cy="12" r="3" />
      </svg>
      <p>Sélectionnez une section</p>
    </div>

    <template v-else>
      <!-- Section chip -->
      <div class="vf-pp__section-chip">
        <span class="vf-pp__chip-dot vf-pp__chip-dot--section" />
        <span class="vf-pp__chip-cat">Section</span>
        <span class="vf-pp__chip-name">{{ selectedTemplate?.name ?? selectedSection.templateId }}</span>
      </div>

      <!-- Block selected -->
      <template v-if="selectedBlock">
        <div class="vf-pp__block-chip">
          <span class="vf-pp__chip-dot vf-pp__chip-dot--block" />
          <span class="vf-pp__chip-cat">Bloc</span>
          <span class="vf-pp__chip-name">{{ selectedBlock.meta?.label ?? selectedBlock.id }}</span>
          <button class="vf-pp__chip-back" title="Désélectionner" @click="$emit('deselect')">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <!-- Prop rows — 2 colonnes style Figma -->
        <div v-if="editableProps.length" class="vf-pp__rows">
          <div
            v-for="prop in editableProps"
            :key="prop.key"
            class="vf-pp__row"
            :class="{ 'vf-pp__row--tall': prop.type === 'textarea' }"
          >
            <span class="vf-pp__row-label" :title="prop.label">{{ prop.label }}</span>
            <div class="vf-pp__row-control">

              <!-- Text / URL / Image-URL -->
              <input
                v-if="prop.type === 'text' || prop.type === 'url' || prop.type === 'image-url'"
                :value="getPropValue(prop.key, prop.default)"
                class="vf-pp__input"
                :type="prop.type === 'url' || prop.type === 'image-url' ? 'url' : 'text'"
                :placeholder="prop.placeholder ?? String(prop.default ?? '')"
                @input="onPropChange(prop.key, ($event.target as HTMLInputElement).value)"
              />

              <!-- Textarea -->
              <textarea
                v-else-if="prop.type === 'textarea'"
                :value="(getPropValue(prop.key, prop.default) as string | number | undefined)"
                class="vf-pp__textarea"
                :placeholder="prop.placeholder ?? String(prop.default ?? '')"
                rows="3"
                @input="onPropChange(prop.key, ($event.target as HTMLTextAreaElement).value)"
              />

              <!-- Number -->
              <input
                v-else-if="prop.type === 'number'"
                :value="getPropValue(prop.key, prop.default)"
                class="vf-pp__input vf-pp__input--number"
                type="number"
                @input="onPropChange(prop.key, Number(($event.target as HTMLInputElement).value))"
              />

              <!-- Boolean -->
              <label v-else-if="prop.type === 'boolean'" class="vf-pp__toggle">
                <input
                  :checked="Boolean(getPropValue(prop.key, prop.default))"
                  type="checkbox"
                  @change="onPropChange(prop.key, ($event.target as HTMLInputElement).checked)"
                />
                <span class="vf-pp__toggle-track"><span class="vf-pp__toggle-thumb" /></span>
              </label>

              <!-- Color -->
              <div v-else-if="prop.type === 'color'" class="vf-pp__color-row">
                <label class="vf-pp__color-swatch-wrap">
                  <input
                    :value="getPropValue(prop.key, prop.default)"
                    class="vf-pp__color-native"
                    type="color"
                    @input="onPropChange(prop.key, ($event.target as HTMLInputElement).value)"
                  />
                  <span class="vf-pp__color-preview" :style="{ background: String(getPropValue(prop.key, prop.default) ?? '#000') }" />
                </label>
                <input
                  :value="getPropValue(prop.key, prop.default)"
                  class="vf-pp__input"
                  type="text"
                  :placeholder="String(prop.default ?? '#000000')"
                  @input="onPropChange(prop.key, ($event.target as HTMLInputElement).value)"
                />
              </div>

              <!-- Select -->
              <div v-else-if="prop.type === 'select'" class="vf-pp__select-wrap">
                <select
                  :value="getPropValue(prop.key, prop.default)"
                  class="vf-pp__select"
                  @change="onPropChange(prop.key, ($event.target as HTMLSelectElement).value)"
                >
                  <option v-for="opt in prop.options" :key="String(opt.value)" :value="String(opt.value)">
                    {{ opt.label }}
                  </option>
                </select>
                <svg class="vf-pp__select-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

            </div>
          </div>
        </div>

        <div v-else class="vf-pp__no-props">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.35"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          Aucune propriété éditable
        </div>
      </template>

      <div v-else class="vf-pp__hint">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" opacity="0.35"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="17 1 21 5 17 9" /><line x1="12" y1="12" x2="21" y2="5" /></svg>
        Cliquez sur un bloc pour éditer ses propriétés.
      </div>
    </template>
  </aside>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { SectionInstance, SectionTemplate, BlockDefinition, EditableProp } from '../../types'
import { resolveEditableProps } from '../../utils/block-props.util'

interface Props {
  selectedSection: SectionInstance | null
  selectedTemplate: SectionTemplate | null
  selectedBlockId?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  selectedBlockId: null,
})

const emit = defineEmits<{
  'deselect': []
  'update-text': [payload: { instanceId: string; blockId: string; text: string }]
  'update-prop': [payload: { instanceId: string; blockId: string; key: string; value: unknown }]
}>()

function findBlock (blocks: BlockDefinition[] | undefined, id: string): BlockDefinition | null {
  if (!blocks) return null
  for (const block of blocks) {
    if (block.id === id) return block
    const found = findBlock(block.children, id)
    if (found) return found
  }
  return null
}

const selectedBlock = computed<BlockDefinition | null>(() => {
  if (!props.selectedBlockId || !props.selectedTemplate) return null
  return findBlock(props.selectedTemplate.blocks, props.selectedBlockId)
})

const editableProps = computed<EditableProp[]>(() =>
  selectedBlock.value
    ? resolveEditableProps(selectedBlock.value.type, selectedBlock.value.meta?.editableProps)
    : []
)

function getPropValue (key: string, defaultValue: unknown): unknown {
  if (!props.selectedSection || !props.selectedBlockId) return defaultValue
  if (key === 'text') {
    return props.selectedSection.textOverrides?.[props.selectedBlockId] ??
      selectedBlock.value?.text ??
      defaultValue
  }
  return props.selectedSection.propOverrides?.[props.selectedBlockId]?.[key] ??
    selectedBlock.value?.props?.[key] ??
    defaultValue
}

function onPropChange (key: string, value: unknown) {
  if (!props.selectedSection || !props.selectedBlockId) return
  if (key === 'text') {
    emit('update-text', {
      instanceId: props.selectedSection.instanceId,
      blockId: props.selectedBlockId,
      text: String(value),
    })
  } else {
    emit('update-prop', {
      instanceId: props.selectedSection.instanceId,
      blockId: props.selectedBlockId,
      key,
      value,
    })
  }
}
</script>

<style lang="scss" scoped>
.vf-pp {
  width: 100%;
  height: 100%;
  background: var(--vf-panel-bg, #fff);
  border-left: 1px solid var(--vf-panel-border, #e5e7eb);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-size: 12px;
  font-family: inherit;
  color: var(--vf-text, #111827);
}

// ── Header ─────────────────────────────────────────────────────────────────────
.vf-pp__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 12px;
  background: var(--vf-panel-header, #f9fafb);
  border-bottom: 1px solid var(--vf-panel-border, #e5e7eb);
  flex-shrink: 0;

  &-left {
    display: flex;
    align-items: center;
    gap: 7px;
    color: var(--vf-text-2, #6b7280);
  }
}
.vf-pp__title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--vf-text-2, #6b7280);
}
.vf-pp__hdr-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  border-radius: 5px;
  cursor: pointer;
  color: var(--vf-text-3, #9ca3af);
  transition: background 120ms, color 120ms;
  outline: none;
  &:hover { background: #f3f4f6; color: var(--vf-text, #111827); }
}

// ── Empty ───────────────────────────────────────────────────────────────────────
.vf-pp__empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 24px;
  color: var(--vf-text-3, #9ca3af);
  font-size: 11.5px;
  text-align: center;
  p { margin: 0; }
}

// ── Chips ───────────────────────────────────────────────────────────────────────
.vf-pp__section-chip,
.vf-pp__block-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-bottom: 1px solid var(--vf-panel-border, #e5e7eb);
  flex-shrink: 0;
}
.vf-pp__chip-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  &--section { background: var(--vf-accent, #6366f1); }
  &--block   { background: #9ca3af; }
}
.vf-pp__chip-cat {
  font-size: 9.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--vf-text-3, #9ca3af);
  flex-shrink: 0;
}
.vf-pp__chip-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--vf-text, #111827);
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.vf-pp__chip-back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  color: var(--vf-text-3, #9ca3af);
  transition: background 120ms, color 120ms;
  outline: none;
  flex-shrink: 0;
  &:hover { background: #f3f4f6; color: var(--vf-text, #111827); }
}

// ── Prop rows (2-col Figma style) ───────────────────────────────────────────────
.vf-pp__rows {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 4px 0 8px;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }
}

.vf-pp__row {
  display: flex;
  align-items: center;
  min-height: 28px;
  padding: 3px 12px;
  gap: 8px;

  &--tall { align-items: flex-start; padding-top: 6px; }
  &-label {
    flex: 0 0 72px;
    font-size: 11px;
    color: var(--vf-text-2, #6b7280);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
    padding-top: 2px;
  }
  &-control {
    flex: 1;
    min-width: 0;
  }
}

// ── Inputs ──────────────────────────────────────────────────────────────────────
.vf-pp__input {
  width: 100%;
  padding: 4px 7px;
  background: #f3f4f6;
  border: 1px solid transparent;
  border-radius: 5px;
  color: var(--vf-text, #111827);
  font-size: 11.5px;
  font-family: inherit;
  outline: none;
  box-sizing: border-box;
  transition: border-color 120ms, background 120ms;

  &::placeholder { color: var(--vf-text-3, #9ca3af); }
  &:hover { background: #eff0f1; }
  &:focus { border-color: var(--vf-accent, #6366f1); background: #fff; box-shadow: 0 0 0 2px rgba(99,102,241,0.1); }

  &--number { text-align: right; }
}

.vf-pp__textarea {
  width: 100%;
  padding: 5px 7px;
  background: #f3f4f6;
  border: 1px solid transparent;
  border-radius: 5px;
  color: var(--vf-text, #111827);
  font-size: 11.5px;
  font-family: inherit;
  outline: none;
  box-sizing: border-box;
  resize: vertical;
  min-height: 52px;
  line-height: 1.5;
  transition: border-color 120ms, background 120ms;

  &::placeholder { color: var(--vf-text-3, #9ca3af); }
  &:hover { background: #eff0f1; }
  &:focus { border-color: var(--vf-accent, #6366f1); background: #fff; box-shadow: 0 0 0 2px rgba(99,102,241,0.1); }
}

// ── Select ──────────────────────────────────────────────────────────────────────
.vf-pp__select-wrap { position: relative; }
.vf-pp__select {
  width: 100%;
  padding: 4px 22px 4px 7px;
  background: #f3f4f6;
  border: 1px solid transparent;
  border-radius: 5px;
  color: var(--vf-text, #111827);
  font-size: 11.5px;
  font-family: inherit;
  outline: none;
  appearance: none;
  cursor: pointer;
  box-sizing: border-box;
  transition: border-color 120ms, background 120ms;

  &:hover { background: #eff0f1; }
  &:focus { border-color: var(--vf-accent, #6366f1); background: #fff; box-shadow: 0 0 0 2px rgba(99,102,241,0.1); }
}
.vf-pp__select-chevron {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--vf-text-3, #9ca3af);
  pointer-events: none;
}

// ── Toggle ──────────────────────────────────────────────────────────────────────
.vf-pp__toggle {
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  input[type='checkbox'] {
    display: none;
    &:checked + .vf-pp__toggle-track {
      background: var(--vf-accent, #6366f1);
      .vf-pp__toggle-thumb { transform: translateX(14px); }
    }
  }
}
.vf-pp__toggle-track {
  display: flex;
  align-items: center;
  width: 32px;
  height: 18px;
  background: #d1d5db;
  border-radius: 9px;
  padding: 2px;
  transition: background 200ms;
}
.vf-pp__toggle-thumb {
  width: 14px;
  height: 14px;
  background: #fff;
  border-radius: 50%;
  transition: transform 200ms;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}

// ── Color ───────────────────────────────────────────────────────────────────────
.vf-pp__color-row {
  display: flex;
  align-items: center;
  gap: 5px;
}
.vf-pp__color-swatch-wrap {
  position: relative;
  width: 26px;
  height: 26px;
  border-radius: 5px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: border-color 120ms;
  &:hover { border-color: #9ca3af; }
}
.vf-pp__color-native {
  position: absolute;
  inset: 0;
  width: 200%;
  height: 200%;
  transform: translate(-25%, -25%);
  opacity: 0;
  cursor: pointer;
}
.vf-pp__color-preview {
  display: block;
  width: 100%;
  height: 100%;
}

// ── Hint / No props ─────────────────────────────────────────────────────────────
.vf-pp__hint,
.vf-pp__no-props {
  padding: 12px 12px;
  font-size: 11px;
  color: var(--vf-text-3, #9ca3af);
  line-height: 1.6;
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
