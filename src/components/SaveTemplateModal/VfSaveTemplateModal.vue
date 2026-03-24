<template>
  <Teleport to="body">
    <Transition name="vf-modal">
      <div v-if="open" class="vf-stm-backdrop" @click.self="$emit('close')">
        <div class="vf-stm" role="dialog" aria-modal="true" aria-labelledby="vf-stm-title">
          <!-- Header -->
          <div class="vf-stm__header">
            <div class="vf-stm__header-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
            </div>
            <div>
              <h2 id="vf-stm-title" class="vf-stm__title">Sauvegarder comme template</h2>
              <p class="vf-stm__subtitle">Ce template sera disponible dans le panneau des sections.</p>
            </div>
            <button class="vf-stm__close" title="Fermer" @click="$emit('close')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="vf-stm__body">
            <!-- Name -->
            <div class="vf-stm__field">
              <label class="vf-stm__label" for="stm-name">Nom du template *</label>
              <input
                id="stm-name"
                v-model="form.name"
                class="vf-stm__input"
                type="text"
                placeholder="Ex: Mon Hero personnalisé"
                autofocus
              />
            </div>

            <!-- Category -->
            <div class="vf-stm__field">
              <label class="vf-stm__label" for="stm-category">Catégorie *</label>
              <div class="vf-stm__select-wrap">
                <select id="stm-category" v-model="form.category" class="vf-stm__select">
                  <option v-for="cat in CATEGORIES" :key="cat.value" :value="cat.value">
                    {{ cat.label }}
                  </option>
                </select>
                <svg class="vf-stm__select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            <!-- Description -->
            <div class="vf-stm__field">
              <label class="vf-stm__label" for="stm-desc">Description</label>
              <textarea
                id="stm-desc"
                v-model="form.description"
                class="vf-stm__textarea"
                rows="2"
                placeholder="Décrivez brièvement cette section…"
              />
            </div>

            <!-- Override option -->
            <div v-if="sourceTemplate && !sourceTemplate.isCustom" class="vf-stm__override-section">
              <label class="vf-stm__toggle-row">
                <div class="vf-stm__toggle" :class="{ 'vf-stm__toggle--on': form.overrideOriginal }" @click="form.overrideOriginal = !form.overrideOriginal">
                  <span class="vf-stm__toggle-thumb" />
                </div>
                <div class="vf-stm__toggle-label">
                  <span class="vf-stm__toggle-title">Remplacer la section par défaut</span>
                  <span class="vf-stm__toggle-hint">
                    Le template "{{ sourceTemplate.name }}" sera remplacé par le vôtre dans le picker.
                    Exportez le JSON et chargez-le via <code>createVueFactory({ sections: [...] })</code> pour le persister.
                  </span>
                </div>
              </label>
            </div>

            <!-- JSON Preview -->
            <div class="vf-stm__json-preview">
              <div class="vf-stm__json-header">
                <span class="vf-stm__json-label">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                  </svg>
                  Aperçu JSON
                </span>
                <button class="vf-stm__json-copy" title="Copier" @click="copyJson">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                  {{ copied ? 'Copié !' : 'Copier' }}
                </button>
              </div>
              <pre class="vf-stm__json-code">{{ jsonPreview }}</pre>
            </div>
          </div>

          <!-- Footer -->
          <div class="vf-stm__footer">
            <button class="vf-stm__btn" @click="$emit('close')">Annuler</button>
            <button class="vf-stm__btn vf-stm__btn--secondary" @click="onDownload">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Télécharger JSON
            </button>
            <button class="vf-stm__btn vf-stm__btn--primary" :disabled="!isValid" @click="onSave">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { reactive, computed, ref, watch } from 'vue'
import type { SectionInstance, SectionTemplate, SectionCategory, BlockDefinition } from '../../types'
import { SECTION_CATEGORY_LABELS } from '../../consts'

// ─── Props / Emits ────────────────────────────────────────────────────────────

interface Props {
  open: boolean
  sourceInstance: SectionInstance | null
  sourceTemplate: SectionTemplate | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'close': []
  'save': [template: SectionTemplate]
}>()

// ─── Form ────────────────────────────────────────────────────────────────────

const form = reactive({
  name: '',
  category: 'hero' as SectionCategory,
  description: '',
  overrideOriginal: false,
})

const copied = ref(false)

// Reset when opening
watch(() => props.open, (v) => {
  if (v && props.sourceTemplate) {
    form.name = props.sourceTemplate.name
    form.category = props.sourceTemplate.category
    form.description = props.sourceTemplate.description ?? ''
    form.overrideOriginal = false
  }
})

const CATEGORIES = Object.entries(SECTION_CATEGORY_LABELS).map(([value, label]) => ({
  value: value as SectionCategory,
  label,
}))

// ─── Bake template ────────────────────────────────────────────────────────────
// Merges instance overrides into the template blocks to create a "baked" template.

function applyOverrides (
  blocks: BlockDefinition[],
  propOverrides: Record<string, Record<string, unknown>>,
  textOverrides: Record<string, string>,
): BlockDefinition[] {
  return blocks.map((block) => {
    const baked = { ...block }
    if (textOverrides[block.id] !== undefined) {
      baked.text = textOverrides[block.id]
    }
    if (propOverrides[block.id]) {
      baked.props = { ...(block.props ?? {}), ...propOverrides[block.id] }
    }
    if (block.children?.length) {
      baked.children = applyOverrides(block.children, propOverrides, textOverrides)
    }
    return baked
  })
}

const bakedTemplate = computed<SectionTemplate | null>(() => {
  if (!props.sourceTemplate || !props.sourceInstance) return null

  const blocks = applyOverrides(
    JSON.parse(JSON.stringify(props.sourceTemplate.blocks)),
    props.sourceInstance.propOverrides,
    props.sourceInstance.textOverrides,
  )

  const useOriginalId = form.overrideOriginal && !props.sourceTemplate.isCustom
  const id = useOriginalId
    ? props.sourceTemplate.id
    : `custom-${form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${Date.now()}`

  return {
    id,
    name: form.name.trim() || props.sourceTemplate.name,
    category: form.category,
    description: form.description.trim() || undefined,
    blocks,
    isCustom: true,
    overridesId: useOriginalId ? props.sourceTemplate.id : undefined,
  }
})

const isValid = computed(() => form.name.trim().length > 0)

const jsonPreview = computed(() => {
  if (!bakedTemplate.value) return '{}'
  const full = JSON.stringify(bakedTemplate.value, null, 2)
  return full.length > 800 ? full.slice(0, 800) + '\n...' : full
})

// ─── Actions ─────────────────────────────────────────────────────────────────

function onSave () {
  if (!bakedTemplate.value || !isValid.value) return
  emit('save', bakedTemplate.value)
  emit('close')
}

function onDownload () {
  if (!bakedTemplate.value) return
  const json = JSON.stringify(bakedTemplate.value, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${bakedTemplate.value.id}.json`
  a.click()
  URL.revokeObjectURL(url)
}

async function copyJson () {
  if (!bakedTemplate.value) return
  await navigator.clipboard.writeText(JSON.stringify(bakedTemplate.value, null, 2))
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<style lang="scss" scoped>
.vf-stm-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.vf-stm {
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  background: var(--vf-sidebar-bg, #161b22);
  border: 1px solid var(--vf-border, #2d333b);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);

  &__header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 20px;
    border-bottom: 1px solid var(--vf-border, #2d333b);
    flex-shrink: 0;
  }

  &__header-icon {
    width: 36px;
    height: 36px;
    background: var(--vf-accent-light, rgba(99, 102, 241, 0.12));
    border: 1px solid rgba(99, 102, 241, 0.25);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--vf-accent, #6366f1);
    flex-shrink: 0;
    margin-top: 2px;
  }

  &__title {
    font-size: 15px;
    font-weight: 700;
    color: var(--vf-text-primary, #e6edf3);
    margin: 0 0 3px;
  }

  &__subtitle {
    font-size: 12px;
    color: var(--vf-text-muted, #484f58);
    margin: 0;
    line-height: 1.5;
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    color: var(--vf-text-muted, #484f58);
    border-radius: 6px;
    cursor: pointer;
    margin-left: auto;
    flex-shrink: 0;
    transition: background 120ms, color 120ms;
    outline: none;

    &:hover {
      background: var(--vf-hover-strong, rgba(255, 255, 255, 0.08));
      color: var(--vf-text-primary, #e6edf3);
    }
  }

  &__body {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__label {
    font-size: 11.5px;
    font-weight: 600;
    color: var(--vf-text-secondary, #7d8590);
    letter-spacing: 0.02em;
  }

  &__input,
  &__textarea,
  &__select {
    background: var(--vf-panel-bg, #1c2128);
    border: 1px solid var(--vf-border, #2d333b);
    border-radius: 7px;
    color: var(--vf-text-primary, #e6edf3);
    font-size: 13px;
    font-family: inherit;
    outline: none;
    transition: border-color 150ms, background 150ms;
    box-sizing: border-box;
    width: 100%;

    &::placeholder { color: var(--vf-text-muted, #484f58); }

    &:focus {
      border-color: var(--vf-accent, #6366f1);
      background: rgba(99, 102, 241, 0.06);
    }
  }

  &__input { padding: 9px 12px; }

  &__textarea {
    padding: 9px 12px;
    resize: vertical;
    min-height: 60px;
    line-height: 1.55;
  }

  &__select {
    padding: 9px 32px 9px 12px;
    appearance: none;
    cursor: pointer;
  }

  &__select-wrap {
    position: relative;
  }

  &__select-arrow {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--vf-text-muted, #484f58);
    pointer-events: none;
  }

  // ─── Override toggle ───────────────────────────────────────────────────────

  &__override-section {
    background: rgba(99, 102, 241, 0.06);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 8px;
    padding: 12px 14px;
  }

  &__toggle-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    cursor: pointer;
  }

  &__toggle {
    width: 36px;
    height: 20px;
    background: var(--vf-border, #2d333b);
    border-radius: 10px;
    position: relative;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 200ms;
    margin-top: 2px;

    &--on {
      background: var(--vf-accent, #6366f1);

      .vf-stm__toggle-thumb {
        transform: translateX(16px);
      }
    }
  }

  &__toggle-thumb {
    position: absolute;
    width: 14px;
    height: 14px;
    background: #fff;
    border-radius: 50%;
    top: 3px;
    left: 3px;
    transition: transform 200ms;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }

  &__toggle-label { flex: 1; min-width: 0; }

  &__toggle-title {
    display: block;
    font-size: 12.5px;
    font-weight: 600;
    color: var(--vf-text-primary, #e6edf3);
    margin-bottom: 3px;
  }

  &__toggle-hint {
    display: block;
    font-size: 11.5px;
    color: var(--vf-text-muted, #484f58);
    line-height: 1.55;

    code {
      background: rgba(255, 255, 255, 0.07);
      border: 1px solid var(--vf-border, #2d333b);
      border-radius: 4px;
      padding: 1px 5px;
      font-size: 10.5px;
      color: var(--vf-accent, #6366f1);
    }
  }

  // ─── JSON Preview ──────────────────────────────────────────────────────────

  &__json-preview {
    background: var(--vf-panel-bg, #1c2128);
    border: 1px solid var(--vf-border, #2d333b);
    border-radius: 8px;
    overflow: hidden;
  }

  &__json-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border-bottom: 1px solid var(--vf-border, #2d333b);
  }

  &__json-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--vf-text-muted, #484f58);
  }

  &__json-copy {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 3px 8px;
    background: transparent;
    border: 1px solid var(--vf-border, #2d333b);
    border-radius: 5px;
    color: var(--vf-text-secondary, #7d8590);
    font-size: 11px;
    font-family: inherit;
    cursor: pointer;
    transition: background 120ms, color 120ms;
    outline: none;

    &:hover {
      background: var(--vf-hover-strong, rgba(255, 255, 255, 0.08));
      color: var(--vf-text-primary, #e6edf3);
    }
  }

  &__json-code {
    padding: 12px;
    font-size: 11px;
    line-height: 1.6;
    color: var(--vf-text-secondary, #7d8590);
    font-family: 'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace;
    margin: 0;
    max-height: 200px;
    overflow-y: auto;
    white-space: pre-wrap;
    word-break: break-all;
  }

  // ─── Footer ───────────────────────────────────────────────────────────────

  &__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    padding: 16px 20px;
    border-top: 1px solid var(--vf-border, #2d333b);
    flex-shrink: 0;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 7px;
    font-size: 13px;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    transition: background 120ms, border-color 120ms, color 120ms;
    outline: none;
    background: var(--vf-hover-strong, rgba(255, 255, 255, 0.06));
    border: 1px solid var(--vf-border, #2d333b);
    color: var(--vf-text-secondary, #7d8590);

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--vf-text-primary, #e6edf3);
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    &--secondary {
      background: rgba(255,255,255,0.04);
      border-color: var(--vf-border-light, #373e47);
      color: var(--vf-text-primary, #e6edf3);

      &:hover { background: rgba(255,255,255,0.08); }
    }

    &--primary {
      background: var(--vf-accent, #6366f1);
      border-color: var(--vf-accent, #6366f1);
      color: #fff;
      font-weight: 600;

      &:hover {
        background: var(--vf-accent-hover, #4f46e5);
        border-color: var(--vf-accent-hover, #4f46e5);
        color: #fff;
      }
    }
  }
}

// ─── Transition ───────────────────────────────────────────────────────────────

.vf-modal-enter-active,
.vf-modal-leave-active {
  transition: opacity 200ms;

  .vf-stm {
    transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms;
  }
}

.vf-modal-enter-from,
.vf-modal-leave-to {
  opacity: 0;

  .vf-stm {
    transform: scale(0.96) translateY(8px);
    opacity: 0;
  }
}
</style>
