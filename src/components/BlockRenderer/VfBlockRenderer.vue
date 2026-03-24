<template>
  <!-- ── Image block (builtin fallback — overridden if DS defines 'image') ── -->
  <img
    v-if="block.type === 'image' && !adapterHasComponent"
    v-bind="mergedProps"
    :class="['vf-block', 'vf-block--image', { 'vf-block--selected': isSelected && editMode }]"
    :style="[{ display: 'block' }, ownStyleOverrides]"
    :src="(mergedProps.src as string) || IMAGE_PLACEHOLDER"
    :alt="(mergedProps.alt as string) || ''"
    @click.stop="!block.meta?.locked && onSelect()"
  />

  <!-- ── Icon block (builtin fallback — overridden if DS defines 'icon') ─── -->
  <svg
    v-else-if="block.type === 'icon' && !adapterHasComponent"
    :class="['vf-block', 'vf-block--icon', { 'vf-block--selected': isSelected && editMode }]"
    :style="ownStyleOverrides"
    :width="(mergedProps.size as number) || 24"
    :height="(mergedProps.size as number) || 24"
    viewBox="0 0 24 24"
    fill="none"
    :stroke="(mergedProps.color as string) || 'currentColor'"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    @click.stop="!block.meta?.locked && onSelect()"
  >
    <path :d="ICON_PATHS[(mergedProps.name as string)] ?? ICON_PATHS['circle']" />
  </svg>

  <!-- ── Generic block ──────────────────────────────────────────────────── -->
  <component
    v-else
    :is="resolvedComponent"
    ref="elRef"
    v-bind="mergedProps"
    :contenteditable="canEdit ? 'true' : undefined"
    :class="['vf-block', `vf-block--${block.type}`, { 'vf-block--selected': isSelected && editMode, 'vf-block--locked': block.meta?.locked, 'vf-block--editable': canEdit }]"
    :style="ownStyleOverrides"
    :data-vf-ds="adapterHasComponent ? adapter.id : undefined"
    @click.stop="!block.meta?.locked && onSelect()"
    @input.stop="onTextInput"
    @keydown.enter="onEnterKey"
    @keydown.space="onSpaceKey"
    @paste="onPaste"
  >
    <!-- Text content (leaf nodes) — skipped in edit mode (textContent set via JS) -->
    <template v-if="resolvedText && !hasChildren && !canEdit">{{ resolvedText }}</template>

    <!-- Children — pass the full override maps down -->
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
      @select="$emit('select', $event)"
      @update-text="$emit('update-text', $event)"
      @update-prop="$emit('update-prop', $event)"
    />
  </component>
</template>

<script lang="ts" setup>
import { computed, ref, watch, onMounted, nextTick, resolveComponent as vueResolveComponent } from 'vue'
import type { Component } from 'vue'
import type { BlockDefinition, DesignSystemAdapter } from '../../types'
import { IMAGE_PLACEHOLDER, ICON_PATHS } from './icon-paths'

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
}

const props = withDefaults(defineProps<Props>(), {
  selectedBlockId: null,
  textOverridesMap: () => ({}),
  propOverridesMap: () => ({}),
  attrOverridesMap: () => ({}),
  styleOverridesMap: () => ({}),
  editMode: false,
})

const emit = defineEmits<{
  'select': [payload: { instanceId: string; blockId: string }]
  'update-text': [payload: { instanceId: string; blockId: string; text: string }]
  'update-prop': [payload: { instanceId: string; blockId: string; key: string; value: unknown }]
}>()

// ─── Refs ────────────────────────────────────────────────────────────────────

const elRef = ref<HTMLElement | null>(null)

// ─── Adapter override check ───────────────────────────────────────────────────
// If the active DS defines a component for this block type, the generic
// <component> branch is used instead of any builtin renderer.
const adapterHasComponent = computed(() => !!props.adapter.componentMap[props.block.type])

// ─── Default styles per HTML tag (for vf-text blocks) ────────────────────────

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
    // Builtin block: use 'tag' prop to select the HTML element (default: 'div')
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

/** Merge: static block props + DS default props + prop overrides + HTML attr overrides */
const mergedProps = computed(() => {
  const def = props.adapter.componentMap[props.block.type]
  const dsDefaults = def?.defaultProps ?? {}
  // Strip 'tag' — it's a renderer meta-prop consumed by resolvedComponent, not an HTML attribute
  const { tag: _bt, ...blockProps } = props.block.props ?? {}
  const { tag: _ot, ...overrides } = ownPropOverrides.value

  const merged: Record<string, unknown> = { ...dsDefaults, ...blockProps, ...overrides }

  if (def?.propMap) {
    const mapped: Record<string, unknown> = {}
    for (const [genericKey, mapper] of Object.entries(def.propMap)) {
      if (merged[genericKey] !== undefined && mapper) {
        const value = mapper.transform
          ? mapper.transform(merged[genericKey])
          : merged[genericKey]
        mapped[mapper.name] = value
        delete merged[genericKey]
      }
    }
    return { ...merged, ...mapped, ...ownAttrOverrides.value }
  }

  return { ...merged, ...ownAttrOverrides.value }
})

/** Effective text: override > block default */
const resolvedText = computed(() => ownTextOverride.value ?? props.block.text)

// ─── Contenteditable sync ─────────────────────────────────────────────────────

function syncTextToDom () {
  if (canEdit.value && elRef.value) {
    elRef.value.textContent = resolvedText.value ?? ''
  }
}

onMounted(() => {
  syncTextToDom()
})

watch(canEdit, (enabled) => {
  if (enabled) nextTick(syncTextToDom)
})

watch(resolvedText, () => {
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
  // <button> elements trigger a click on Space — prevent it and insert a space manually
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
</style>
