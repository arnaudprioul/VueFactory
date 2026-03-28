<template>
  <div class="vf-dp">
    <!-- Header -->
    <div class="vf-dp__header">
      <span class="vf-dp__title">Données</span>
      <button class="vf-dp__close" @click="$emit('close')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <!-- Tabs -->
    <div class="vf-dp__tabs">
      <button :class="['vf-dp__tab', { active: tab === 'schema' }]" @click="tab = 'schema'">Variables</button>
      <button :class="['vf-dp__tab', { active: tab === 'preview' }]" @click="tab = 'preview'">Test data</button>
    </div>

    <!-- ── Schema tab ─────────────────────────────────────────────────── -->
    <div v-if="tab === 'schema'" class="vf-dp__body">
      <p class="vf-dp__hint">
        Définissez les variables disponibles dans vos blocs.<br>
        Chemin = accès dot dans la donnée API (ex : <code>user.name</code>).
      </p>

      <div class="vf-dp__schema-list">
        <div v-if="rows.length === 0" class="vf-dp__empty">Aucune variable définie.</div>

        <div v-for="(row, i) in rows" :key="i" class="vf-dp__schema-row">
          <input
            class="vf-dp__input"
            :value="row.varName"
            placeholder="nomVariable"
            @input="updateRow(i, 'varName', ($event.target as HTMLInputElement).value)"
          />
          <span class="vf-dp__arrow">→</span>
          <input
            class="vf-dp__input"
            :value="row.path"
            placeholder="dot.path"
            @input="updateRow(i, 'path', ($event.target as HTMLInputElement).value)"
          />
          <!-- resolved value preview -->
          <span class="vf-dp__resolved" :title="String(resolvedPreview[row.varName] ?? '')">
            {{ resolvedPreview[row.varName] !== undefined ? truncate(String(resolvedPreview[row.varName])) : '—' }}
          </span>
          <button class="vf-dp__del" @click="removeRow(i)" title="Supprimer">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <button class="vf-dp__add" @click="addRow">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Ajouter une variable
      </button>
    </div>

    <!-- ── Preview data tab ───────────────────────────────────────────── -->
    <div v-else class="vf-dp__body">
      <p class="vf-dp__hint">
        Collez ici un exemple de réponse API pour tester vos variables dans l'éditeur.
      </p>
      <textarea
        class="vf-dp__json-area"
        :value="previewDataStr"
        placeholder="{&#10;  &quot;user&quot;: { &quot;name&quot;: &quot;Alice&quot; },&#10;  &quot;products&quot;: []&#10;}"
        spellcheck="false"
        @input="onPreviewInput(($event.target as HTMLTextAreaElement).value)"
      />
      <div v-if="jsonError" class="vf-dp__json-error">{{ jsonError }}</div>
      <div v-else-if="previewDataStr" class="vf-dp__json-ok">JSON valide ✓</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { getNestedValue } from '../../composables/useDataBinding'

interface Props {
  dataSchema?: Record<string, string>
  previewData?: string
}

const props = withDefaults(defineProps<Props>(), {
  dataSchema: () => ({}),
  previewData: '',
})

const emit = defineEmits<{
  'update:dataSchema': [schema: Record<string, string>]
  'update:previewData': [json: string]
  'close': []
}>()

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const tab = ref<'schema' | 'preview'>('schema')

// ─── Schema rows ──────────────────────────────────────────────────────────────
interface Row { varName: string; path: string }

const rows = ref<Row[]>([])

watch(() => props.dataSchema, (schema) => {
  rows.value = Object.entries(schema ?? {}).map(([varName, path]) => ({ varName, path }))
}, { immediate: true })

function updateRow (i: number, field: keyof Row, val: string) {
  rows.value[i][field] = val
  emitSchema()
}

function addRow () {
  rows.value.push({ varName: '', path: '' })
}

function removeRow (i: number) {
  rows.value.splice(i, 1)
  emitSchema()
}

function emitSchema () {
  const schema: Record<string, string> = {}
  for (const row of rows.value) {
    if (row.varName.trim()) schema[row.varName.trim()] = row.path.trim()
  }
  emit('update:dataSchema', schema)
}

// ─── Preview data ─────────────────────────────────────────────────────────────
const previewDataStr = ref(props.previewData ?? '')
const jsonError = ref('')

watch(() => props.previewData, (v) => { previewDataStr.value = v ?? '' })

function onPreviewInput (val: string) {
  previewDataStr.value = val
  jsonError.value = ''
  if (!val.trim()) { emit('update:previewData', ''); return }
  try {
    JSON.parse(val)
    jsonError.value = ''
    emit('update:previewData', val)
  } catch (e) {
    jsonError.value = (e as Error).message
  }
}

// ─── Resolved preview ─────────────────────────────────────────────────────────
const parsedPreview = computed<Record<string, unknown>>(() => {
  try { return JSON.parse(previewDataStr.value) } catch { return {} }
})

const resolvedPreview = computed<Record<string, unknown>>(() => {
  const out: Record<string, unknown> = {}
  for (const row of rows.value) {
    if (row.varName) out[row.varName] = getNestedValue(parsedPreview.value, row.path)
  }
  return out
})

function truncate (s: string): string {
  return s.length > 20 ? s.slice(0, 20) + '…' : s
}
</script>

<style scoped>
.vf-dp {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1a1a2e;
  color: #e2e8f0;
  font-size: 12px;
  font-family: inherit;
}

.vf-dp__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px 10px;
  border-bottom: 1px solid #2d3748;
}

.vf-dp__title {
  font-weight: 600;
  font-size: 13px;
  color: #f8fafc;
}

.vf-dp__close {
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  padding: 2px;
  display: flex;
  align-items: center;
  border-radius: 4px;
}
.vf-dp__close:hover { color: #f8fafc; background: #2d3748; }

.vf-dp__tabs {
  display: flex;
  gap: 2px;
  padding: 8px 10px 0;
  border-bottom: 1px solid #2d3748;
}

.vf-dp__tab {
  flex: 1;
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 500;
  padding: 5px 8px;
  border-radius: 4px 4px 0 0;
  transition: all 0.15s;
}
.vf-dp__tab:hover { color: #f8fafc; }
.vf-dp__tab.active {
  color: #818cf8;
  border-bottom: 2px solid #818cf8;
}

.vf-dp__body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 12px;
}

.vf-dp__hint {
  color: #94a3b8;
  line-height: 1.5;
  margin: 0 0 12px;
  font-size: 11px;
}
.vf-dp__hint code {
  background: #2d3748;
  padding: 1px 4px;
  border-radius: 3px;
  font-family: monospace;
  font-size: 10px;
}

.vf-dp__empty {
  color: #4a5568;
  text-align: center;
  padding: 16px 0;
  font-size: 11px;
}

.vf-dp__schema-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
}

.vf-dp__schema-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.vf-dp__input {
  flex: 1;
  background: #2d3748;
  border: 1px solid #3a4a5c;
  border-radius: 4px;
  color: #e2e8f0;
  font-size: 11px;
  padding: 4px 6px;
  min-width: 0;
}
.vf-dp__input:focus { outline: none; border-color: #818cf8; }
.vf-dp__input::placeholder { color: #4a5568; }

.vf-dp__arrow {
  color: #4a5568;
  flex-shrink: 0;
  font-size: 11px;
}

.vf-dp__resolved {
  flex: 0 0 52px;
  color: #10b981;
  font-size: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: monospace;
}

.vf-dp__del {
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: #4a5568;
  padding: 2px;
  display: flex;
  align-items: center;
  border-radius: 3px;
}
.vf-dp__del:hover { color: #f87171; }

.vf-dp__add {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: 1px dashed #3a4a5c;
  border-radius: 5px;
  color: #94a3b8;
  font-size: 11px;
  cursor: pointer;
  width: 100%;
  padding: 6px 10px;
  transition: all 0.15s;
}
.vf-dp__add:hover { color: #818cf8; border-color: #818cf8; }

.vf-dp__json-area {
  width: 100%;
  min-height: 220px;
  background: #161b2e;
  border: 1px solid #2d3748;
  border-radius: 5px;
  color: #a5f3fc;
  font-family: 'Menlo', 'Consolas', monospace;
  font-size: 11px;
  line-height: 1.6;
  padding: 10px;
  resize: vertical;
  box-sizing: border-box;
}
.vf-dp__json-area:focus { outline: none; border-color: #818cf8; }

.vf-dp__json-error {
  color: #f87171;
  font-size: 10px;
  margin-top: 6px;
  font-family: monospace;
}
.vf-dp__json-ok {
  color: #10b981;
  font-size: 10px;
  margin-top: 6px;
}
</style>
