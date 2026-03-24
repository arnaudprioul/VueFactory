<template>
  <div class="vf-sp">

    <!-- ═══ RAIL (level 1) ═══════════════════════════════════════════════════ -->
    <nav class="vf-sp-rail">
      <div class="vf-sp-rail__items">
        <button
          v-for="cat in railCategories"
          :key="cat.id"
          :class="['vf-sp-rail__btn', { 'vf-sp-rail__btn--active': activeCategory === cat.id }]"
          :title="cat.label"
          :style="activeCategory === cat.id ? { '--cat-color': cat.color } : {}"
          @click="activeCategory = cat.id"
        >
          <div class="vf-sp-rail__icon" :style="activeCategory === cat.id ? { background: cat.color + '22', color: cat.color } : {}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <path :d="cat.icon" />
            </svg>
          </div>
          <span class="vf-sp-rail__label">{{ cat.short }}</span>
        </button>
      </div>

      <!-- Bottom: add category -->
      <div class="vf-sp-rail__bottom">
        <div class="vf-sp-rail__divider" />
        <button class="vf-sp-rail__btn vf-sp-rail__btn--add" title="Nouvelle catégorie" @click="$emit('add-category')">
          <div class="vf-sp-rail__icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
          <span class="vf-sp-rail__label">Créer</span>
        </button>
      </div>
    </nav>

    <!-- ═══ PANEL (level 2) ══════════════════════════════════════════════════ -->
    <div class="vf-sp-panel">

      <!-- Panel header -->
      <div class="vf-sp-panel__header" :style="{ borderBottomColor: activeCategoryDef?.color + '33' }">
        <div class="vf-sp-panel__header-left">
          <div class="vf-sp-panel__cat-dot" :style="{ background: activeCategoryDef?.color ?? '#6366f1' }" />
          <span class="vf-sp-panel__cat-name">{{ activeCategoryDef?.label }}</span>
          <span class="vf-sp-panel__count">{{ displayedSections.length }}</span>
        </div>
        <button class="vf-sp-panel__add-btn" :style="{ color: activeCategoryDef?.color ?? '#6366f1' }" title="Ajouter un type de section" @click="$emit('add-section', activeCategory)">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nouveau
        </button>
      </div>

      <!-- Search -->
      <div class="vf-sp-panel__search-wrap">
        <svg class="vf-sp-panel__search-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          v-model="search"
          class="vf-sp-panel__search"
          type="text"
          placeholder="Rechercher…"
          aria-label="Rechercher des sections"
        />
        <button v-if="search" class="vf-sp-panel__search-clear" @click="search = ''">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <!-- Empty results -->
      <div v-if="displayedSections.length === 0" class="vf-sp-panel__empty">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span>Aucune section trouvée</span>
      </div>

      <!-- Section cards -->
      <div class="vf-sp-panel__list">
        <div
          v-for="section in displayedSections"
          :key="section.id"
          class="vf-sp-card"
          :title="section.description"
          draggable="true"
          @dragstart="onDragStart(section.id, $event)"
          @click="$emit('add', section.id)"
        >
          <!-- Illustration -->
          <div class="vf-sp-card__illus">
            <img
              v-if="section.thumbnail"
              :src="section.thumbnail"
              :alt="section.name"
              class="vf-sp-card__illus-img"
            />
            <div
              v-else
              class="vf-sp-card__illus-placeholder"
              :style="{ background: getCategoryGradient(section.category) }"
            >
              <!-- Wireframe SVG per category -->
              <svg class="vf-sp-card__illus-wire" width="100%" height="100%" viewBox="0 0 220 110" preserveAspectRatio="xMidYMid meet">
                <!-- Hero -->
                <template v-if="section.category === 'hero'">
                  <rect x="55" y="18" width="110" height="14" rx="7" fill="white" opacity="0.3"/>
                  <rect x="70" y="38" width="80" height="8" rx="4" fill="white" opacity="0.18"/>
                  <rect x="80" y="52" width="60" height="8" rx="4" fill="white" opacity="0.15"/>
                  <rect x="75" y="68" width="32" height="16" rx="8" fill="white" opacity="0.35"/>
                  <rect x="113" y="68" width="32" height="16" rx="8" fill="white" opacity="0.18"/>
                </template>
                <!-- Features -->
                <template v-else-if="section.category === 'features'">
                  <rect x="10" y="10" width="58" height="90" rx="6" fill="white" opacity="0.15"/>
                  <rect x="81" y="10" width="58" height="90" rx="6" fill="white" opacity="0.18"/>
                  <rect x="152" y="10" width="58" height="90" rx="6" fill="white" opacity="0.15"/>
                  <rect x="22" y="22" width="34" height="28" rx="4" fill="white" opacity="0.2"/>
                  <rect x="93" y="22" width="34" height="28" rx="4" fill="white" opacity="0.2"/>
                  <rect x="164" y="22" width="34" height="28" rx="4" fill="white" opacity="0.2"/>
                  <rect x="22" y="58" width="34" height="6" rx="3" fill="white" opacity="0.3"/>
                  <rect x="93" y="58" width="34" height="6" rx="3" fill="white" opacity="0.3"/>
                  <rect x="164" y="58" width="34" height="6" rx="3" fill="white" opacity="0.3"/>
                  <rect x="22" y="70" width="24" height="4" rx="2" fill="white" opacity="0.18"/>
                  <rect x="93" y="70" width="24" height="4" rx="2" fill="white" opacity="0.18"/>
                  <rect x="164" y="70" width="24" height="4" rx="2" fill="white" opacity="0.18"/>
                </template>
                <!-- Pricing -->
                <template v-else-if="section.category === 'pricing'">
                  <rect x="10" y="20" width="58" height="70" rx="6" fill="white" opacity="0.13"/>
                  <rect x="81" y="8" width="58" height="94" rx="6" fill="white" opacity="0.3"/>
                  <rect x="152" y="20" width="58" height="70" rx="6" fill="white" opacity="0.13"/>
                  <rect x="93" y="20" width="34" height="10" rx="3" fill="white" opacity="0.4"/>
                  <rect x="93" y="38" width="34" height="6" rx="2" fill="white" opacity="0.25"/>
                  <rect x="93" y="50" width="24" height="4" rx="2" fill="white" opacity="0.2"/>
                  <rect x="93" y="60" width="24" height="4" rx="2" fill="white" opacity="0.2"/>
                  <rect x="93" y="84" width="34" height="10" rx="5" fill="white" opacity="0.4"/>
                </template>
                <!-- CTA -->
                <template v-else-if="section.category === 'cta'">
                  <rect x="30" y="32" width="160" height="14" rx="7" fill="white" opacity="0.3"/>
                  <rect x="50" y="52" width="120" height="8" rx="4" fill="white" opacity="0.18"/>
                  <rect x="70" y="70" width="80" height="18" rx="9" fill="white" opacity="0.35"/>
                </template>
                <!-- Stats -->
                <template v-else-if="section.category === 'stats'">
                  <rect x="10" y="30" width="44" height="50" rx="4" fill="white" opacity="0.2"/>
                  <rect x="64" y="15" width="44" height="65" rx="4" fill="white" opacity="0.25"/>
                  <rect x="118" y="40" width="44" height="40" rx="4" fill="white" opacity="0.2"/>
                  <rect x="172" y="20" width="44" height="60" rx="4" fill="white" opacity="0.22"/>
                </template>
                <!-- Footer -->
                <template v-else-if="section.category === 'footer'">
                  <rect x="10" y="15" width="196" height="1" rx="0.5" fill="white" opacity="0.25"/>
                  <rect x="10" y="25" width="60" height="8" rx="3" fill="white" opacity="0.3"/>
                  <rect x="10" y="40" width="40" height="4" rx="2" fill="white" opacity="0.18"/>
                  <rect x="10" y="50" width="40" height="4" rx="2" fill="white" opacity="0.18"/>
                  <rect x="10" y="60" width="40" height="4" rx="2" fill="white" opacity="0.18"/>
                  <rect x="80" y="40" width="35" height="4" rx="2" fill="white" opacity="0.18"/>
                  <rect x="80" y="50" width="35" height="4" rx="2" fill="white" opacity="0.18"/>
                  <rect x="80" y="60" width="35" height="4" rx="2" fill="white" opacity="0.18"/>
                  <rect x="150" y="40" width="35" height="4" rx="2" fill="white" opacity="0.18"/>
                  <rect x="150" y="50" width="35" height="4" rx="2" fill="white" opacity="0.18"/>
                  <rect x="10" y="88" width="196" height="1" rx="0.5" fill="white" opacity="0.15"/>
                  <rect x="75" y="95" width="70" height="4" rx="2" fill="white" opacity="0.15"/>
                </template>
                <!-- FAQ -->
                <template v-else-if="section.category === 'faq'">
                  <rect x="15" y="12" width="190" height="16" rx="4" fill="white" opacity="0.2"/>
                  <rect x="15" y="34" width="190" height="16" rx="4" fill="white" opacity="0.18"/>
                  <rect x="15" y="56" width="190" height="16" rx="4" fill="white" opacity="0.2"/>
                  <rect x="15" y="78" width="190" height="16" rx="4" fill="white" opacity="0.18"/>
                  <rect x="195" y="16" width="8" height="8" rx="1" fill="white" opacity="0.3"/>
                  <rect x="195" y="38" width="8" height="8" rx="1" fill="white" opacity="0.3"/>
                  <rect x="195" y="60" width="8" height="8" rx="1" fill="white" opacity="0.3"/>
                  <rect x="195" y="82" width="8" height="8" rx="1" fill="white" opacity="0.3"/>
                </template>
                <!-- Default -->
                <template v-else>
                  <rect x="20" y="16" width="180" height="18" rx="5" fill="white" opacity="0.25"/>
                  <rect x="20" y="42" width="180" height="8" rx="3" fill="white" opacity="0.15"/>
                  <rect x="20" y="56" width="140" height="8" rx="3" fill="white" opacity="0.12"/>
                  <rect x="20" y="72" width="60" height="18" rx="5" fill="white" opacity="0.3"/>
                </template>
              </svg>
              <!-- Section name overlay -->
              <div class="vf-sp-card__illus-name">{{ section.name }}</div>
            </div>

            <!-- Hover overlay: add button -->
            <div class="vf-sp-card__overlay">
              <div class="vf-sp-card__overlay-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Ajouter
              </div>
            </div>

            <!-- Custom badge -->
            <div v-if="section.isCustom" class="vf-sp-card__custom-badge">Perso</div>
          </div>

          <!-- Card footer -->
          <div class="vf-sp-card__footer">
            <span class="vf-sp-card__name">{{ section.name }}</span>
            <button
              class="vf-sp-card__settings"
              title="Configurer cette section"
              @click.stop="$emit('settings', section)"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { SectionTemplate, SectionCategory } from '../../types'
import { SECTION_CATEGORY_LABELS, SECTION_CATEGORY_ICONS } from '../../consts'
import { getAllSections, getSectionsByCategory, searchSections, getSectionCategories } from '../../sections'

// ─── Emits ────────────────────────────────────────────────────────────────────

defineEmits<{
  'add': [templateId: string]
  'settings': [template: SectionTemplate]
  'add-section': [category: SectionCategory | 'all']
  'add-category': []
}>()

// ─── State ────────────────────────────────────────────────────────────────────

const activeCategory = ref<SectionCategory | 'all'>('all')
const search = ref('')

// ─── Category colors ──────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  all:          '#6366f1',
  hero:         '#6366f1',
  features:     '#0ea5e9',
  pricing:      '#8b5cf6',
  testimonials: '#ec4899',
  cta:          '#f59e0b',
  content:      '#10b981',
  gallery:      '#06b6d4',
  stats:        '#3b82f6',
  team:         '#14b8a6',
  faq:          '#f43f5e',
  contact:      '#a855f7',
  header:       '#64748b',
  footer:       '#475569',
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  all:          'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  hero:         'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
  features:     'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
  pricing:      'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
  testimonials: 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)',
  cta:          'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
  content:      'linear-gradient(135deg, #059669 0%, #10b981 100%)',
  gallery:      'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
  stats:        'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
  team:         'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
  faq:          'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)',
  contact:      'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
  header:       'linear-gradient(135deg, #475569 0%, #64748b 100%)',
  footer:       'linear-gradient(135deg, #334155 0%, #475569 100%)',
}

const SHORT_LABELS: Partial<Record<SectionCategory | 'all', string>> = {
  all:          'Tout',
  hero:         'Hero',
  features:     'Feat.',
  pricing:      'Prix',
  testimonials: 'Avis',
  cta:          'CTA',
  content:      'Cont.',
  gallery:      'Gal.',
  stats:        'Stats',
  team:         'Équipe',
  faq:          'FAQ',
  contact:      'Contact',
  header:       'Header',
  footer:       'Footer',
}

// ─── Rail categories ──────────────────────────────────────────────────────────

const railCategories = computed(() => {
  const usedCats = getSectionCategories()
  const all = {
    id: 'all' as const,
    label: 'Toutes',
    short: 'Tout',
    icon: 'M4 6h16M4 10h16M4 14h16M4 18h16',
    color: CATEGORY_COLORS['all'],
  }
  const cats = usedCats.map((c) => {
    const cat = c as keyof typeof SECTION_CATEGORY_LABELS
    return {
      id: c,
      label: SECTION_CATEGORY_LABELS[cat],
      short: SHORT_LABELS[c] ?? SECTION_CATEGORY_LABELS[cat].slice(0, 5),
      icon: SECTION_CATEGORY_ICONS[cat],
      color: CATEGORY_COLORS[c] ?? '#6366f1',
    }
  })
  return [all, ...cats]
})

const activeCategoryDef = computed(() =>
  railCategories.value.find((c) => c.id === activeCategory.value),
)

// ─── Sections list ────────────────────────────────────────────────────────────

const displayedSections = computed(() => {
  if (search.value.trim()) return searchSections(search.value)
  if (activeCategory.value === 'all') return getAllSections()
  return getSectionsByCategory(activeCategory.value as SectionCategory)
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCategoryGradient (category: string): string {
  return CATEGORY_GRADIENTS[category] ?? CATEGORY_GRADIENTS['all']
}

function onDragStart (templateId: string, e: DragEvent) {
  e.dataTransfer?.setData('text/plain', `new:${templateId}`)
}
</script>

<style lang="scss" scoped>
// ─── Root ─────────────────────────────────────────────────────────────────────

.vf-sp {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: #fff;
}

// ─── Rail (level 1) ───────────────────────────────────────────────────────────

.vf-sp-rail {
  height: 100%;
  background: #f8f9fa;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;

  &__items {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 6px 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
    align-items: center;

    &::-webkit-scrollbar { width: 3px; }
    &::-webkit-scrollbar-track { background: transparent; }
    &::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 2px; }
  }

  &__bottom {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 6px 0;
    gap: 1px;
  }

  &__divider {
    width: 32px;
    height: 1px;
    background: #e5e7eb;
    margin-bottom: 4px;
  }

  &__btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    width: 44px;
    height: 48px;
    padding: 0;
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    outline: none;
    transition: background 150ms;
    color: #6b7280;
    flex-shrink: 0;

    &:hover {
      background: #f0f0f0;
      color: #374151;
    }

    &--active {
      background: var(--cat-color, #6366f1) + '15' !important;

      .vf-sp-rail__label {
        color: var(--cat-color, #6366f1);
        font-weight: 700;
      }
    }

    &--add {
      color: #9ca3af;
      &:hover {
        color: #374151;
        .vf-sp-rail__icon { background: #f0f0f0; }
      }
    }
  }

  &__icon {
    width: 28px;
    height: 28px;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 150ms, color 150ms;
  }

  &__label {
    font-size: 9.5px;
    font-weight: 500;
    color: #9ca3af;
    text-align: center;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    max-width: 52px;
    text-overflow: ellipsis;
    font-family: 'Inter', system-ui, sans-serif;
    transition: color 150ms;
  }
}

// Active state using a different approach (no CSS variables interpolation in SCSS)
.vf-sp-rail__btn--active {
  .vf-sp-rail__label { font-weight: 700; }
}

// ─── Panel (level 2) ──────────────────────────────────────────────────────────

.vf-sp-panel {
  flex: 1;
  min-width: 0;
  min-height: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 46px;
    padding: 0 12px;
    border-bottom: 2px solid #e5e7eb;
    flex-shrink: 0;
    background: #fafafa;
  }

  &__header-left {
    display: flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
  }

  &__cat-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 0 0 2px #fff, 0 0 0 3px currentColor;
  }

  &__cat-name {
    font-size: 12px;
    font-weight: 700;
    color: #111827;
    letter-spacing: 0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__count {
    font-size: 10.5px;
    font-weight: 600;
    background: #f3f4f6;
    color: #9ca3af;
    border-radius: 99px;
    padding: 1px 7px;
  }

  &__add-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border: 1px solid currentColor;
    border-radius: 6px;
    background: transparent;
    font-size: 11px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: opacity 150ms, background 150ms;
    opacity: 0.7;
    outline: none;
    flex-shrink: 0;

    &:hover { opacity: 1; background: currentColor; color: #fff !important; }
  }

  &__search-wrap {
    position: relative;
    padding: 8px 10px;
    flex-shrink: 0;
    border-bottom: 1px solid #f0f0f0;
  }

  &__search-icon {
    position: absolute;
    left: 19px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    pointer-events: none;
  }

  &__search {
    width: 100%;
    padding: 6px 26px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    color: #111827;
    font-size: 12px;
    outline: none;
    box-sizing: border-box;
    font-family: inherit;
    transition: border-color 150ms, background 150ms;

    &::placeholder { color: #9ca3af; }
    &:focus { border-color: #6366f1; background: #fff; }
  }

  &__search-clear {
    position: absolute;
    right: 17px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border: none;
    background: #e5e7eb;
    color: #6b7280;
    cursor: pointer;
    border-radius: 50%;
    outline: none;
    transition: all 120ms;
    &:hover { background: #d1d5db; color: #111827; }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 40px 16px;
    color: #9ca3af;
    font-size: 12px;
    text-align: center;
    flex: 1;
  }

  &__list {
    flex: 1;
    min-height: 0;
    overflow-y: scroll;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;

    &::-webkit-scrollbar { width: 6px; }
    &::-webkit-scrollbar-track { background: #f3f4f6; }
    &::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
    &::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
  }
}

// ─── Section Card ─────────────────────────────────────────────────────────────

.vf-sp-card {
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 160ms, box-shadow 160ms, transform 160ms;
  position: relative;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  &:hover {
    border-color: #6366f1;
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.14);
    transform: translateY(-2px);

    .vf-sp-card__overlay { opacity: 1; }
    .vf-sp-card__settings { opacity: 1; }
  }

  &:active { transform: translateY(0); }

  // ── Illustration ──
  &__illus {
    width: 100%;
    height: 100px;
    min-height: 100px;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
  }

  &__illus-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &__illus-placeholder {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    overflow: hidden;
  }

  &__illus-wire {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  &__illus-name {
    position: absolute;
    bottom: 7px;
    left: 8px;
    right: 8px;
    font-size: 10.5px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: 'Inter', system-ui, sans-serif;
    letter-spacing: 0.01em;
  }

  // ── Hover overlay ──
  &__overlay {
    position: absolute;
    inset: 0;
    background: rgba(99, 102, 241, 0.8);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 160ms;
    border-radius: 8px 8px 0 0;
  }

  &__overlay-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    background: #fff;
    color: #6366f1;
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 700;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    pointer-events: none;
  }

  // ── Custom badge ──
  &__custom-badge {
    position: absolute;
    top: 6px;
    right: 6px;
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    padding: 2px 6px;
    background: rgba(52, 211, 153, 0.15);
    color: #059669;
    border: 1px solid rgba(52, 211, 153, 0.35);
    border-radius: 99px;
    backdrop-filter: blur(4px);
    letter-spacing: 0.04em;
  }

  // ── Footer ──
  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 10px 9px;
    gap: 6px;
  }

  &__name {
    font-size: 13px;
    font-weight: 600;
    color: #111827;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
    font-family: 'Inter', system-ui, sans-serif;
    letter-spacing: -0.01em;
  }

  &__settings {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    border: 1px solid transparent;
    background: transparent;
    color: #9ca3af;
    cursor: pointer;
    transition: all 120ms;
    outline: none;
    opacity: 0;
    flex-shrink: 0;

    &:hover {
      background: #f3f4f6;
      border-color: #e5e7eb;
      color: #374151;
    }
  }
}
</style>
