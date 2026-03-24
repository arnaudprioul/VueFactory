<template>
  <Teleport to="body">
    <Transition name="vf-dsm">
      <div v-if="open" class="vf-dsm-backdrop" @click.self="$emit('close')">
        <div class="vf-dsm" role="dialog" aria-modal="true" aria-labelledby="vf-dsm-title">

          <!-- ─── Header ─────────────────────────────────────────────────── -->
          <div class="vf-dsm__header">
            <div class="vf-dsm__header-left">
              <div class="vf-dsm__header-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h2 id="vf-dsm-title" class="vf-dsm__title">Design System</h2>
                <p class="vf-dsm__subtitle">Choisissez l'adapter correspondant à votre projet.</p>
              </div>
            </div>
            <button class="vf-dsm__close" title="Fermer" @click="$emit('close')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- ─── Body ───────────────────────────────────────────────────── -->
          <div class="vf-dsm__body">

            <!-- Adapter grid (reactive: shows all registered adapters) -->
            <div class="vf-dsm__grid">
              <button
                v-for="adapter in allAdapters"
                :key="adapter.id"
                :class="['vf-dsm__card', { 'vf-dsm__card--active': selectedId === adapter.id }]"
                @click="selectedId = adapter.id"
              >
                <!-- Logo / initials -->
                <div
                  class="vf-dsm__card-logo"
                  :style="adapter.logo ? { backgroundImage: `url(${adapter.logo})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' } : {}"
                >
                  <span v-if="!adapter.logo">{{ initials(adapter.name) }}</span>
                </div>
                <span class="vf-dsm__card-name">{{ adapter.name }}</span>
                <span v-if="adapter.version" class="vf-dsm__card-version">{{ adapter.version }}</span>
                <div v-if="selectedId === adapter.id" class="vf-dsm__card-check">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </button>

              <!-- "Custom map" option (always last) -->
              <button
                :class="['vf-dsm__card', 'vf-dsm__card--custom', { 'vf-dsm__card--active': selectedId === 'custom' }]"
                @click="selectedId = 'custom'"
              >
                <div class="vf-dsm__card-logo vf-dsm__card-logo--custom">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
                  </svg>
                </div>
                <span class="vf-dsm__card-name">Mapping manuel</span>
                <span class="vf-dsm__card-version">Noms de composants</span>
                <div v-if="selectedId === 'custom'" class="vf-dsm__card-check">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </button>
            </div>

            <!-- Selected adapter info -->
            <div v-if="selectedAdapter && selectedId !== 'custom'" class="vf-dsm__adapter-info">
              <div class="vf-dsm__adapter-stats">
                <div class="vf-dsm__stat">
                  <span class="vf-dsm__stat-value">{{ mappedCount(selectedAdapter) }}</span>
                  <span class="vf-dsm__stat-label">types mappés</span>
                </div>
                <div class="vf-dsm__stat">
                  <span class="vf-dsm__stat-value">{{ Object.keys(GENERIC_COMPONENT_LABELS).length }}</span>
                  <span class="vf-dsm__stat-label">types disponibles</span>
                </div>
              </div>
              <!-- Mapped components preview -->
              <div class="vf-dsm__map-preview">
                <div
                  v-for="[type, label] in componentEntries"
                  :key="type"
                  :class="['vf-dsm__map-row', { 'vf-dsm__map-row--unmapped': !selectedAdapter.componentMap[type as GenericComponentType] }]"
                >
                  <span class="vf-dsm__map-type">
                    <code>{{ type }}</code>
                    <span class="vf-dsm__map-label-text">{{ label }}</span>
                  </span>
                  <span v-if="selectedAdapter.componentMap[type as GenericComponentType]" class="vf-dsm__map-component">
                    {{ getComponentName(selectedAdapter, type as GenericComponentType) }}
                  </span>
                  <span v-else class="vf-dsm__map-fallback">→ HTML natif</span>
                </div>
              </div>
            </div>

            <!-- Custom mapping (simple string map) -->
            <template v-if="selectedId === 'custom'">
              <div class="vf-dsm__custom-notice">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>
                  Pour un design system propriétaire avec <strong>propMap</strong>, <strong>defaultProps</strong> ou des transformations de valeurs,
                  enregistrez un <code>DesignSystemAdapter</code> complet via
                  <code>createVueFactory({ adapters: [monAdapter] })</code> — il apparaîtra automatiquement dans cette liste.
                  Le mapping manuel ci-dessous est limité aux noms de composants simples.
                </span>
              </div>

              <div class="vf-dsm__map-table">
                <div class="vf-dsm__map-table-header">
                  <span>Type générique</span>
                  <span>Composant dans votre DS</span>
                </div>
                <div
                  v-for="[type, label] in componentEntries"
                  :key="type"
                  class="vf-dsm__map-table-row"
                >
                  <label :for="`dsm-${type}`" class="vf-dsm__map-type">
                    <code>{{ type }}</code>
                    <span class="vf-dsm__map-label-text">{{ label }}</span>
                  </label>
                  <input
                    :id="`dsm-${type}`"
                    :value="customMap[type] ?? ''"
                    class="vf-dsm__map-input"
                    type="text"
                    :placeholder="htmlFallback(type as GenericComponentType)"
                    @input="customMap[type] = ($event.target as HTMLInputElement).value || ''"
                  />
                </div>
              </div>
            </template>
          </div>

          <!-- ─── Footer ─────────────────────────────────────────────────── -->
          <div class="vf-dsm__footer">
            <button class="vf-dsm__btn" @click="$emit('close')">Annuler</button>
            <button class="vf-dsm__btn vf-dsm__btn--primary" @click="apply">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Appliquer
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { getAllAdapters } from '../../design-systems'
import { htmlAdapter } from '../../design-systems/adapters/html.adapter'
import { GENERIC_COMPONENT_LABELS } from '../../consts'
import type { DesignSystemAdapter, GenericComponentType } from '../../types'

// ─── Props / Emits ────────────────────────────────────────────────────────────

interface Props {
  open: boolean
  currentDsId?: string
  currentCustomMap?: Partial<Record<string, string>>
}

const props = withDefaults(defineProps<Props>(), {
  currentDsId: 'html',
  currentCustomMap: () => ({}),
})

const emit = defineEmits<{
  'close': []
  'apply': [payload: { dsId: string; customMap?: Partial<Record<string, string>> }]
}>()

// ─── State ────────────────────────────────────────────────────────────────────

const selectedId = ref(props.currentDsId)
const customMap = ref<Partial<Record<string, string>>>({ ...props.currentCustomMap })

watch(() => props.open, (open) => {
  if (open) {
    selectedId.value = props.currentDsId
    customMap.value = { ...props.currentCustomMap }
  }
})

// ─── Data (reactive — reads from registry) ────────────────────────────────────

const allAdapters = computed(() => getAllAdapters())

const selectedAdapter = computed<DesignSystemAdapter | null>(() =>
  allAdapters.value.find((a) => a.id === selectedId.value) ?? null,
)

const componentEntries = computed(() =>
  Object.entries(GENERIC_COMPONENT_LABELS) as [GenericComponentType, string][],
)

// ─── Helpers ─────────────────────────────────────────────────────────────────

function initials (name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

function mappedCount (adapter: DesignSystemAdapter): number {
  return Object.keys(adapter.componentMap).length
}

function getComponentName (adapter: DesignSystemAdapter, type: GenericComponentType): string {
  const def = adapter.componentMap[type]
  if (!def) return ''
  return typeof def.component === 'string' ? def.component : `<Component>`
}

function htmlFallback (type: GenericComponentType): string {
  const def = htmlAdapter.componentMap[type]
  if (!def) return ''
  return typeof def.component === 'string' ? def.component : ''
}

// ─── Apply ────────────────────────────────────────────────────────────────────

function apply () {
  emit('apply', {
    dsId: selectedId.value,
    customMap: selectedId.value === 'custom' ? { ...customMap.value } : undefined,
  })
  emit('close')
}
</script>

<style lang="scss" scoped>
.vf-dsm-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.vf-dsm {
  width: 100%;
  max-width: 660px;
  max-height: 90vh;
  background: var(--vf-sidebar-bg, #161b22);
  border: 1px solid var(--vf-border, #2d333b);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
}

// ─── Header ───────────────────────────────────────────────────────────────────

.vf-dsm__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid var(--vf-border, #2d333b);
  flex-shrink: 0;

  &-left {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  &-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: var(--vf-accent-light, rgba(99, 102, 241, 0.12));
    border: 1px solid rgba(99, 102, 241, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--vf-accent, #6366f1);
    flex-shrink: 0;
    margin-top: 2px;
  }
}

.vf-dsm__title {
  font-size: 15px;
  font-weight: 700;
  color: var(--vf-text-primary, #e6edf3);
  margin: 0 0 3px;
}

.vf-dsm__subtitle {
  font-size: 12px;
  color: var(--vf-text-muted, #484f58);
  margin: 0;
  line-height: 1.5;
}

.vf-dsm__close {
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
  transition: background 120ms, color 120ms;
  outline: none;
  flex-shrink: 0;

  &:hover {
    background: var(--vf-hover-strong, rgba(255, 255, 255, 0.08));
    color: var(--vf-text-primary, #e6edf3);
  }
}

// ─── Body ─────────────────────────────────────────────────────────────────────

.vf-dsm__body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: var(--vf-border, #2d333b);
    border-radius: 2px;
  }
}

// ─── Adapter grid ─────────────────────────────────────────────────────────────

.vf-dsm__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px;
}

.vf-dsm__card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  padding: 16px 10px 14px;
  background: var(--vf-panel-bg, #1c2128);
  border: 1px solid var(--vf-border, #2d333b);
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 150ms, background 150ms, box-shadow 150ms;
  text-align: center;
  outline: none;
  font-family: inherit;

  &:hover {
    border-color: rgba(99, 102, 241, 0.5);
    background: rgba(99, 102, 241, 0.05);
  }

  &--active {
    border-color: var(--vf-accent, #6366f1);
    background: var(--vf-accent-light, rgba(99, 102, 241, 0.1));
    box-shadow: 0 0 0 1px var(--vf-accent, #6366f1);
  }

  &--custom {
    border-style: dashed;
  }
}

.vf-dsm__card-logo {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: var(--vf-accent, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
  flex-shrink: 0;

  &--custom {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid var(--vf-border, #2d333b);
    color: var(--vf-text-secondary, #7d8590);
  }
}

.vf-dsm__card-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--vf-text-primary, #e6edf3);
  line-height: 1.3;
}

.vf-dsm__card-version {
  font-size: 10.5px;
  color: var(--vf-text-muted, #484f58);
}

.vf-dsm__card-check {
  position: absolute;
  top: 7px;
  right: 7px;
  width: 18px;
  height: 18px;
  background: var(--vf-accent, #6366f1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

// ─── Adapter info (selected non-custom) ───────────────────────────────────────

.vf-dsm__adapter-info {
  border: 1px solid var(--vf-border, #2d333b);
  border-radius: 10px;
  overflow: hidden;
}

.vf-dsm__adapter-stats {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--vf-border, #2d333b);
}

.vf-dsm__stat {
  flex: 1;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-right: 1px solid var(--vf-border, #2d333b);

  &:last-child { border-right: none; }

  &-value {
    font-size: 20px;
    font-weight: 700;
    color: var(--vf-accent, #6366f1);
    line-height: 1;
  }

  &-label {
    font-size: 11px;
    color: var(--vf-text-muted, #484f58);
  }
}

.vf-dsm__map-preview {
  max-height: 240px;
  overflow-y: auto;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: var(--vf-border, #2d333b); border-radius: 2px; }
}

.vf-dsm__map-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 14px;
  border-bottom: 1px solid var(--vf-border, #2d333b);
  gap: 8px;

  &:last-child { border-bottom: none; }

  &--unmapped {
    opacity: 0.45;
  }
}

.vf-dsm__map-type {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;

  code {
    font-size: 10.5px;
    background: rgba(99, 102, 241, 0.1);
    color: var(--vf-accent, #6366f1);
    padding: 1px 6px;
    border-radius: 4px;
    font-family: 'Fira Code', monospace;
    flex-shrink: 0;
  }
}

.vf-dsm__map-label-text {
  font-size: 12px;
  color: var(--vf-text-secondary, #7d8590);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vf-dsm__map-component {
  font-size: 12px;
  font-family: 'Fira Code', 'Cascadia Code', monospace;
  color: #34d399;
  background: rgba(52, 211, 153, 0.08);
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
  flex-shrink: 0;
}

.vf-dsm__map-fallback {
  font-size: 11px;
  color: var(--vf-text-muted, #484f58);
  font-style: italic;
  flex-shrink: 0;
}

// ─── Custom notice ────────────────────────────────────────────────────────────

.vf-dsm__custom-notice {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  background: rgba(99, 102, 241, 0.06);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 8px;
  font-size: 12px;
  color: var(--vf-text-secondary, #7d8590);
  line-height: 1.6;

  svg {
    color: var(--vf-accent, #6366f1);
    flex-shrink: 0;
    margin-top: 2px;
  }

  strong { color: var(--vf-text-primary, #e6edf3); }

  code {
    background: rgba(99, 102, 241, 0.12);
    color: var(--vf-accent, #6366f1);
    border-radius: 4px;
    padding: 1px 6px;
    font-size: 11px;
  }
}

// ─── Custom mapping table ─────────────────────────────────────────────────────

.vf-dsm__map-table {
  border: 1px solid var(--vf-border, #2d333b);
  border-radius: 10px;
  overflow: hidden;

  &-header {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding: 8px 14px;
    background: rgba(255, 255, 255, 0.03);
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--vf-text-muted, #484f58);
    border-bottom: 1px solid var(--vf-border, #2d333b);
  }

  &-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 12px;
    padding: 7px 14px;
    border-bottom: 1px solid var(--vf-border, #2d333b);
    transition: background 120ms;

    &:last-child { border-bottom: none; }

    &:hover {
      background: rgba(255, 255, 255, 0.02);
    }
  }
}

.vf-dsm__map-input {
  width: 100%;
  padding: 5px 10px;
  background: var(--vf-panel-bg, #1c2128);
  border: 1px solid var(--vf-border, #2d333b);
  border-radius: 6px;
  color: var(--vf-text-primary, #e6edf3);
  font-size: 12px;
  font-family: 'Fira Code', monospace;
  outline: none;
  box-sizing: border-box;
  transition: border-color 150ms;

  &::placeholder { color: var(--vf-text-muted, #484f58); }
  &:focus { border-color: var(--vf-accent, #6366f1); }
}

// ─── Footer ───────────────────────────────────────────────────────────────────

.vf-dsm__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid var(--vf-border, #2d333b);
  flex-shrink: 0;
}

.vf-dsm__btn {
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
  background: var(--vf-hover-strong, rgba(255, 255, 255, 0.06));
  border: 1px solid var(--vf-border, #2d333b);
  color: var(--vf-text-secondary, #7d8590);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--vf-text-primary, #e6edf3);
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

// ─── Transition ───────────────────────────────────────────────────────────────

.vf-dsm-enter-active,
.vf-dsm-leave-active {
  transition: opacity 200ms;

  .vf-dsm {
    transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms;
  }
}

.vf-dsm-enter-from,
.vf-dsm-leave-to {
  opacity: 0;

  .vf-dsm {
    transform: scale(0.96) translateY(8px);
    opacity: 0;
  }
}
</style>
