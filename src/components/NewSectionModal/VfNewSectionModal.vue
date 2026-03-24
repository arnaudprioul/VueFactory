<template>
  <Teleport to="body">
    <Transition name="vf-nsm">
      <div v-if="open" class="vf-nsm-backdrop" @click.self="$emit('close')">
        <div class="vf-nsm" role="dialog" aria-modal="true" aria-labelledby="vf-nsm-title">

          <!-- Header -->
          <div class="vf-nsm__header">
            <div class="vf-nsm__header-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/>
              </svg>
            </div>
            <div>
              <h2 id="vf-nsm-title" class="vf-nsm__title">Nouvelle section</h2>
              <p class="vf-nsm__subtitle">Créez une section vierge et personnalisez-la dans l'éditeur.</p>
            </div>
            <button class="vf-nsm__close" title="Fermer" @click="$emit('close')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="vf-nsm__body">
            <div class="vf-nsm__field">
              <label class="vf-nsm__label" for="nsm-name">Nom de la section *</label>
              <input
                id="nsm-name"
                ref="nameInputRef"
                v-model="name"
                class="vf-nsm__input"
                type="text"
                placeholder="Ex: Mon Hero personnalisé"
                @keydown.enter="onConfirm"
                @keydown.escape="$emit('close')"
              />
            </div>

            <div class="vf-nsm__field">
              <label class="vf-nsm__label" for="nsm-category">Catégorie *</label>
              <div class="vf-nsm__select-wrap">
                <select id="nsm-category" v-model="category" class="vf-nsm__select">
                  <option v-for="cat in CATEGORIES" :key="cat.value" :value="cat.value">
                    {{ cat.label }}
                  </option>
                </select>
                <svg class="vf-nsm__select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="vf-nsm__footer">
            <button class="vf-nsm__btn" @click="$emit('close')">Annuler</button>
            <button class="vf-nsm__btn vf-nsm__btn--primary" :disabled="!name.trim()" @click="onConfirm">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Créer et éditer
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue'
import type { SectionCategory } from '../../types'
import { SECTION_CATEGORY_LABELS } from '../../consts'

interface Props {
  open: boolean
  initialCategory?: SectionCategory | 'all'
}

const props = withDefaults(defineProps<Props>(), {
  initialCategory: 'hero',
})

const emit = defineEmits<{
  'close': []
  'confirm': [payload: { name: string; category: SectionCategory }]
}>()

const nameInputRef = ref<HTMLInputElement | null>(null)
const name = ref('')
const category = ref<SectionCategory>('hero')

const CATEGORIES = (Object.entries(SECTION_CATEGORY_LABELS) as [SectionCategory, string][])
  .map(([value, label]) => ({ value, label }))

watch(() => props.open, (open) => {
  if (!open) return
  name.value = ''
  category.value = (props.initialCategory === 'all' ? 'hero' : props.initialCategory) as SectionCategory
  nextTick(() => nameInputRef.value?.focus())
})

function onConfirm() {
  if (!name.value.trim()) return
  emit('confirm', { name: name.value.trim(), category: category.value })
}
</script>

<style lang="scss" scoped>
.vf-nsm-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.vf-nsm {
  width: 100%;
  max-width: 440px;
  background: var(--vf-sidebar-bg, #161b22);
  border: 1px solid var(--vf-border, #2d333b);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.55);
}

.vf-nsm__header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid var(--vf-border, #2d333b);

  &-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: rgba(99, 102, 241, 0.12);
    border: 1px solid rgba(99, 102, 241, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6366f1;
    flex-shrink: 0;
    margin-top: 2px;
  }
}

.vf-nsm__title {
  font-size: 15px;
  font-weight: 700;
  color: var(--vf-text-primary, #e6edf3);
  margin: 0 0 3px;
}

.vf-nsm__subtitle {
  font-size: 12px;
  color: var(--vf-text-muted, #484f58);
  margin: 0;
  line-height: 1.5;
}

.vf-nsm__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin-left: auto;
  border: none;
  background: transparent;
  color: var(--vf-text-muted, #484f58);
  border-radius: 6px;
  cursor: pointer;
  transition: background 120ms, color 120ms;
  outline: none;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: var(--vf-text-primary, #e6edf3);
  }
}

.vf-nsm__body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.vf-nsm__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.vf-nsm__label {
  font-size: 12px;
  font-weight: 600;
  color: var(--vf-text-secondary, #7d8590);
}

.vf-nsm__input {
  width: 100%;
  padding: 9px 12px;
  background: var(--vf-panel-bg, #1c2128);
  border: 1px solid var(--vf-border, #2d333b);
  border-radius: 8px;
  color: var(--vf-text-primary, #e6edf3);
  font-size: 13px;
  font-family: inherit;
  outline: none;
  box-sizing: border-box;
  transition: border-color 150ms;

  &::placeholder { color: var(--vf-text-muted, #484f58); }
  &:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15); }
}

.vf-nsm__select-wrap {
  position: relative;
}

.vf-nsm__select {
  width: 100%;
  padding: 9px 32px 9px 12px;
  background: var(--vf-panel-bg, #1c2128);
  border: 1px solid var(--vf-border, #2d333b);
  border-radius: 8px;
  color: var(--vf-text-primary, #e6edf3);
  font-size: 13px;
  font-family: inherit;
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: border-color 150ms;
  box-sizing: border-box;

  &:focus { border-color: #6366f1; }

  option { background: #1c2128; }
}

.vf-nsm__select-arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--vf-text-muted, #484f58);
}

.vf-nsm__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid var(--vf-border, #2d333b);
}

.vf-nsm__btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: background 120ms, border-color 120ms, color 120ms;
  outline: none;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--vf-border, #2d333b);
  color: var(--vf-text-secondary, #7d8590);

  &:hover { background: rgba(255, 255, 255, 0.1); color: var(--vf-text-primary, #e6edf3); }

  &--primary {
    background: #6366f1;
    border-color: #6366f1;
    color: #fff;
    font-weight: 600;

    &:hover:not(:disabled) { background: #4f46e5; border-color: #4f46e5; }
    &:disabled { opacity: 0.4; cursor: not-allowed; }
  }
}

// ─── Transition ───────────────────────────────────────────────────────────────
.vf-nsm-enter-active, .vf-nsm-leave-active {
  transition: opacity 180ms;
  .vf-nsm { transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms; }
}
.vf-nsm-enter-from, .vf-nsm-leave-to {
  opacity: 0;
  .vf-nsm { transform: scale(0.96) translateY(8px); opacity: 0; }
}
</style>
