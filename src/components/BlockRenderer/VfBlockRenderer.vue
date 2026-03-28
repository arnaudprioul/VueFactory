<template>
  <!-- ── Condition gate — hidden (not removed) when condition is false in edit mode,
          truly absent from DOM in preview mode ── -->
  <template v-if="conditionResult || (editMode && block.meta?.condition)">

    <!-- Condition-hidden overlay in edit mode -->
    <div
      v-if="editMode && !conditionResult && block.meta?.condition"
      class="vf-block vf-block--condition-hidden"
      :data-vf-block-id="block.id"
      :class="{ 'vf-block--selected': isSelected }"
      @click.stop="!block.meta?.locked && onSelect()"
    >
      <span class="vf-block--condition-hidden__label">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        Masqué — <code>{{ block.meta.condition }}</code>
      </span>
    </div>

    <!-- ── Image block ── -->
    <img
      v-else-if="block.type === 'vf-img' && !adapterHasComponent"
      v-bind="boundProps"
      :class="['vf-block', 'vf-block--image', { 'vf-block--selected': isSelected && editMode }]"
      :style="[{ display: 'block' }, ownStyleOverrides]"
      :data-vf-block-id="block.id"
      :src="(boundProps.src as string) || IMAGE_PLACEHOLDER"
      :alt="(boundProps.alt as string) || ''"
      @click.stop="!block.meta?.locked && onSelect()"
    />

    <!-- ── Icon block ── -->
    <svg
      v-else-if="block.type === 'vf-icon' && !adapterHasComponent"
      :class="['vf-block', 'vf-block--icon', { 'vf-block--selected': isSelected && editMode }]"
      :style="ownStyleOverrides"
      :data-vf-block-id="block.id"
      :width="(boundProps.size as number) || 24"
      :height="(boundProps.size as number) || 24"
      viewBox="0 0 24 24"
      fill="none"
      :stroke="(boundProps.color as string) || 'currentColor'"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      @click.stop="!block.meta?.locked && onSelect()"
    >
      <path :d="ICON_PATHS[(boundProps.name as string)] ?? ICON_PATHS['circle']" />
    </svg>

    <!-- ── Generic block ── -->
    <component
      v-else
      :is="resolvedComponent"
      ref="elRef"
      v-bind="boundProps"
      :contenteditable="canEdit ? 'true' : undefined"
      :class="['vf-block', `vf-block--${block.type}`, { 'vf-block--selected': isSelected && editMode, 'vf-block--locked': block.meta?.locked, 'vf-block--editable': canEdit }]"
      :style="ownStyleOverrides"
      :data-vf-block-id="block.id"
      :data-vf-ds="adapterHasComponent ? adapter.id : undefined"
      @click.stop="!block.meta?.locked && onSelect()"
      @input.stop="onTextInput"
      @keydown.enter="onEnterKey"
      @keydown.space="onSpaceKey"
      @paste="onPaste"
    >
      <!-- Text content (leaf nodes) — skipped in edit mode (textContent set via JS) -->
      <template v-if="effectiveText && !hasChildren && !canEdit">{{ effectiveText }}</template>

      <!-- Children — pass the full override maps + dataContext down -->
      <VfBlockRenderer
        v-for="child in block.children"
        :key="child.id"
        :block="child"
        :instance-id="instanceId"
        :adapter="adapter"
        :selected-block-id="selectedBlockId"
        :edit-mode="editMode"
        :text-overrides-map="textOverridesMap"
        :prop-overrides-map="propOverridesMap"
        :attr-overrides-map="attrOverridesMap"
        :style-overrides-map="styleOverridesMap"
        :data-context="dataContext"
        @select="$emit('select', $event)"
        @update-text="$emit('update-text', $event)"
        @update-prop="$emit('update-prop', $event)"
      />
    </component>

  </template>
</template>

<script lang="ts" setup>
import { computed, ref, watch, onMounted, nextTick, resolveComponent as vueResolveComponent } from 'vue'
import type { Component } from 'vue'
import type { BlockDefinition, DesignSystemAdapter } from '../../types'
import { IMAGE_PLACEHOLDER, ICON_PATHS } from './icon-paths'
import { evalCondition, resolveTextBinding, resolvePropBindings } from '../../composables/useDataBinding'

// ─── Props / Emits ────────────────────────────────────────────────────────────

interface Props {
  block: BlockDefinition
  instanceId: string
  adapter: DesignSystemAdapter
  selectedBlockId?: string | null
  // Full override maps — propagated to all descendants
  textOverridesMap?: Record<string, string>
  propOverridesMap?: Record<string, Record<string, unknown>>
  attrOverridesMap?: Record<string, Record<string, string>>
  styleOverridesMap?: Record<string, Record<string, string>>
  editMode?: boolean
  /** Resolved data context passed from the page builder */
  dataContext?: Record<string, unknown>
}

const props = withDefaults(defineProps<Props>(), {
  selectedBlockId: null,
  textOverridesMap: () => ({}),
  propOverridesMap: () => ({}),
  attrOverridesMap: () => ({}),
  styleOverridesMap: () => ({}),
  editMode: false,
  dataContext: () => ({}),
})

const emit = defineEmits<{
  'select': [payload: { instanceId: string; blockId: string }]
  'update-text': [payload: { instanceId: string; blockId: string; text: string }]
  'update-prop': [payload: { instanceId: string; blockId: string; key: string; value: unknown }]
}>()

// ─── Refs ────────────────────────────────────────────────────────────────────

const elRef = ref<HTMLElement | null>(null)

// ─── Adapter override check ───────────────────────────────────────────────────
const adapterHasComponent = computed(() => !!props.adapter.componentMap[props.block.type])

// ─── Data binding — condition ─────────────────────────────────────────────────

const conditionResult = computed(() => {
  const expr = props.block.meta?.condition
  if (!expr) return true
  return evalCondition(expr, props.dataContext)
})

// ─── Default styles per HTML tag ─────────────────────────────────────────────

const TAG_DEFAULT_STYLES: Record<string, Record<string, string>> = {
  h1: { fontSize: '2.25rem', fontWeight: '700', lineHeight: '1.2', margin: '0' },
  h2: { fontSize: '1.875rem', fontWeight: '700', lineHeight: '1.25', margin: '0' },
  h3: { fontSize: '1.5rem',  fontWeight: '600', lineHeight: '1.3',  margin: '0' },
  h4: { fontSize: '1.25rem', fontWeight: '600', lineHeight: '1.4',  margin: '0' },
  h5: { fontSize: '1.125rem',fontWeight: '600', lineHeight: '1.4',  margin: '0' },
  h6: { fontSize: '1rem',    fontWeight: '600', lineHeight: '1.4',  margin: '0' },
  p:  { fontSize: '1rem',    lineHeight: '1.6', margin: '0' },
  strong: { fontWeight: '700' },
  em:     { fontStyle: 'italic' },
}

// ─── Own overrides (looked up from maps by block.id) ─────────────────────────

const ownTextOverride  = computed(() => props.textOverridesMap?.[props.block.id])
const ownPropOverrides = computed(() => props.propOverridesMap?.[props.block.id] ?? {})
const ownAttrOverrides = computed(() => props.attrOverridesMap?.[props.block.id] ?? {})
const ownStyleOverrides = computed(() => {
  const tagDefault = (props.block.type === 'vf-text' || props.block.type === 'vf-heading')
    ? TAG_DEFAULT_STYLES[(ownPropOverrides.value.tag ?? props.block.props?.tag) as string] ?? {}
    : {}
  return {
    ...tagDefault,
    ...(props.block.style ?? {}),
    ...(props.styleOverridesMap?.[props.block.id] ?? {}),
  }
})

// ─── Computed ─────────────────────────────────────────────────────────────────

const isSelected = computed(() => props.selectedBlockId === props.block.id)
const hasChildren = computed(() => (props.block.children?.length ?? 0) > 0)

/** Whether this block supports inline editing */
const canEdit = computed(() => props.editMode && !hasChildren.value && !props.block.meta?.locked)

/** Resolve the Vue component or HTML tag to render */
const resolvedComponent = computed<Component | string>(() => {
  const def = props.adapter.componentMap[props.block.type]
  if (!def) {
    const tag = (ownPropOverrides.value.tag ?? props.block.props?.tag) as string | undefined
    return tag ?? 'div'
  }
  if (typeof def.component === 'string') {
    try {
      const resolved = vueResolveComponent(def.component)
      return typeof resolved === 'string' ? def.component : resolved
    } catch {
      return def.component
    }
  }
  return def.component
})

/** Merge: static block props + DS default props + prop overrides + attr overrides + data prop bindings */
const mergedProps = computed(() => {
  const def = props.adapter.componentMap[props.block.type]
  const dsDefaults = def?.defaultProps ?? {}
  const { tag: _bt, ...blockProps } = props.block.props ?? {}
  const { tag: _ot, ...overrides } = ownPropOverrides.value

  const merged: Record<string, unknown> = { ...dsDefaults, ...blockProps, ...overrides }

  if (def?.propMap) {
    const mapped: Record<string, unknown> = {}
    for (const [genericKey, mapper] of Object.entries(def.propMap)) {
      if (merged[genericKey] !== undefined && mapper) {
        const value = mapper.transform ? mapper.transform(merged[genericKey]) : merged[genericKey]
        mapped[mapper.name] = value
        delete merged[genericKey]
      }
    }
    return { ...merged, ...mapped, ...ownAttrOverrides.value }
  }

  return { ...merged, ...ownAttrOverrides.value }
})

/** Props with data bindings applied on top */
const boundProps = computed(() => {
  const bindings = props.block.meta?.propBindings
  if (!bindings || Object.keys(bindings).length === 0 || !props.dataContext) return mergedProps.value
  const resolved = resolvePropBindings(bindings, props.dataContext)
  return { ...mergedProps.value, ...resolved }
})

/** Effective text: data binding > user text override > block default */
const resolvedText = computed(() => ownTextOverride.value ?? props.block.text)

const effectiveText = computed(() => {
  const binding = props.block.meta?.textBinding
  if (binding && props.dataContext && Object.keys(props.dataContext).length > 0) {
    const bound = resolveTextBinding(binding, props.dataContext)
    if (bound) return bound
  }
  return resolvedText.value
})

// ─── Contenteditable sync ─────────────────────────────────────────────────────

function syncTextToDom () {
  if (canEdit.value && elRef.value) {
    elRef.value.textContent = effectiveText.value ?? ''
  }
}

onMounted(() => { syncTextToDom() })

watch(canEdit, (enabled) => { if (enabled) nextTick(syncTextToDom) })

watch(effectiveText, () => {
  if (canEdit.value && elRef.value && document.activeElement !== elRef.value) {
    syncTextToDom()
  }
})

// ─── Handlers ────────────────────────────────────────────────────────────────

function onSelect () {
  emit('select', { instanceId: props.instanceId, blockId: props.block.id })
}

function onTextInput (e: Event) {
  if (!canEdit.value) return
  const text = (e.target as HTMLElement).textContent ?? ''
  emit('update-text', { instanceId: props.instanceId, blockId: props.block.id, text })
}

function onEnterKey (e: KeyboardEvent) {
  if (!canEdit.value) return
  e.preventDefault()
  ;(e.target as HTMLElement).blur()
}

function onSpaceKey (e: KeyboardEvent) {
  if (!canEdit.value) return
  e.preventDefault()
  document.execCommand('insertText', false, ' ')
}

function onPaste (e: ClipboardEvent) {
  if (!canEdit.value) return
  e.preventDefault()
  const text = e.clipboardData?.getData('text/plain') ?? ''
  document.execCommand('insertText', false, text)
}
</script>

<style scoped>
.vf-block--editable {
  outline: none;
  cursor: text;
}

.vf-block--selected {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}

.vf-block--condition-hidden {
  opacity: 0.35;
  border: 1px dashed #6366f1;
  border-radius: 4px;
  padding: 6px 10px;
  min-height: 28px;
  display: flex;
  align-items: center;
  cursor: pointer;
  background: rgba(99, 102, 241, 0.05);
}

.vf-block--condition-hidden__label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #818cf8;
  font-family: sans-serif;
  pointer-events: none;
}

.vf-block--condition-hidden__label code {
  background: rgba(99, 102, 241, 0.15);
  padding: 1px 5px;
  border-radius: 3px;
  font-family: monospace;
}
</style>
