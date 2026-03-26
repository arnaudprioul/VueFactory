<template>
  <Teleport to="body">
    <div v-if="open" class="vf-se-overlay">

      <!-- ═══ HEADER ════════════════════════════════════════════════════════ -->
      <header class="vf-se-header">
        <div class="vf-se-header__left">
          <button class="vf-se-header__back" @click="$emit('close')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 19l-7-7 7-7"/><path d="M4 12h16"/></svg>
          </button>
          <div class="vf-se-header__breadcrumb">
            <span class="vf-se-header__page">Page</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span class="vf-se-header__section">{{ template?.name ?? instance.templateId }}</span>
            <template v-if="selectedBlockId">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              <span class="vf-se-header__block">{{ selectedBlockLabel }}</span>
            </template>
          </div>
        </div>
        <div class="vf-se-header__right">
          <button class="vf-se-header__cancel" @click="$emit('close')">Annuler</button>
          <button class="vf-se-header__save" @click="onSave">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Enregistrer
          </button>
        </div>
      </header>

      <!-- ═══ BODY ══════════════════════════════════════════════════════════ -->
      <div class="vf-se-body">

        <!-- LEFT: Block tree + Add component -->
        <aside class="vf-se-left">
          <div class="vf-se-left__header">
            <span class="vf-se-left__title">Arborescence</span>
          </div>
          <div class="vf-se-left__tree">
            <VfBlockTree
              :blocks="workingBlocks"
              :selected-block-id="selectedBlockId"
              :expanded-ids="expandedIds"
              @select="selectedBlockId = $event"
              @delete="onDeleteBlock($event)"
              @toggle-expand="toggleExpand($event)"
              @rename="onRenameBlock($event)"
              @move="onMoveBlock($event)"
            />
          </div>

          <!-- Add component section -->
          <div class="vf-se-left__add-section">
            <div class="vf-se-left__add-header">
              <span class="vf-se-left__add-title">Ajouter un composant</span>
            </div>
            <div class="vf-se-left__add-search-wrap">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="vf-se-left__add-search-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input v-model="componentSearch" class="vf-se-left__add-search" placeholder="Chercher…" type="text"/>
            </div>
            <div class="vf-se-left__add-list">
              <template v-for="(comp, idx) in filteredComponents" :key="comp.type">
                <!-- Séparateur entre builtins et composants adapter -->
                <div
                  v-if="idx > 0 && !comp.builtin && filteredComponents[idx - 1].builtin"
                  class="vf-se-left__add-sep"
                />
                <button
                  :class="['vf-se-left__add-item', { 'vf-se-left__add-item--builtin': comp.builtin }]"
                  :title="comp.type"
                  @click="onAddBlock(comp.type)"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  {{ comp.label }}
                </button>
              </template>
            </div>
          </div>
        </aside>

        <!-- CENTER: Canvas preview -->
        <main class="vf-se-canvas" @click.self="selectedBlockId = null">
          <div class="vf-se-canvas__scroll" @click.self="selectedBlockId = null">
            <div class="vf-se-page" @click.self="selectedBlockId = null">
              <div class="vf-section" :class="{ 'vf-section--centered': isCentered }" :style="workingSectionStyles" @click.self="selectedBlockId = null">
                <div class="vf-section__wrapper" :style="workingWrapperStyles" @click.self="selectedBlockId = null">
                  <VfBlockRenderer
                    v-for="block in workingBlocks"
                    :key="block.id"
                    :block="block"
                    :instance-id="instance.instanceId"
                    :adapter="adapter"
                    :selected-block-id="selectedBlockId"
                    :text-overrides-map="workingTextOverrides"
                    :prop-overrides-map="workingPropOverrides"
                    :attr-overrides-map="workingAttrs"
                    :style-overrides-map="workingStyleOverrides"
                    :edit-mode="true"
                    @select="selectedBlockId = $event.blockId"
                    @update-text="onUpdateText($event)"
                    @update-prop="onUpdateProp($event)"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>

        <!-- RIGHT: Properties panel -->
        <aside class="vf-se-right" @click="onRightPanelClick">

          <!-- ── Section settings (collapsible) ───────────────────────── -->
          <div class="vf-se-right__section-settings">
            <button class="vf-se-collapse-header" @click="sectionSettingsOpen = !sectionSettingsOpen">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <span>Section</span>
              <svg class="vf-se-collapse-chevron" :class="{ 'vf-se-collapse-chevron--open': sectionSettingsOpen }" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            <div v-if="sectionSettingsOpen" class="vf-se-collapse-body">
              <div class="vf-se-section-title" style="margin-top:0;border-top:none;padding-top:0">Section</div>
              <div class="vf-se-panel__bd">
                <div class="vf-se-field">
                  <label class="vf-se-label">Fond</label>
                  <div class="vf-se-color-row">
                    <input type="color" :value="workingSectionStyles.backgroundColor ?? '#ffffff'" class="vf-se-color-swatch"
                      @input="workingSectionStyles = { ...workingSectionStyles, backgroundColor: ($event.target as HTMLInputElement).value }" />
                    <input type="text" :value="workingSectionStyles.backgroundColor ?? ''" class="vf-se-input" style="flex:1"
                      placeholder="transparent"
                      @input="workingSectionStyles = { ...workingSectionStyles, backgroundColor: ($event.target as HTMLInputElement).value }" />
                  </div>
                </div>
                <div class="vf-se-field">
                  <label class="vf-se-label">Texte</label>
                  <div class="vf-se-color-row">
                    <input type="color" :value="workingSectionStyles.color ?? '#111827'" class="vf-se-color-swatch"
                      @input="workingSectionStyles = { ...workingSectionStyles, color: ($event.target as HTMLInputElement).value }" />
                    <input type="text" :value="workingSectionStyles.color ?? ''" class="vf-se-input" style="flex:1"
                      placeholder="#111827"
                      @input="workingSectionStyles = { ...workingSectionStyles, color: ($event.target as HTMLInputElement).value }" />
                  </div>
                </div>
                <div class="vf-se-field">
                  <label class="vf-se-label">Padding</label>
                  <div class="vf-se-number-field">
                    <input type="text" class="vf-se-number-input" :value="workingSectionStyles.padding ?? ''"
                      placeholder="ex: 80px 0"
                      @input="workingSectionStyles = { ...workingSectionStyles, padding: ($event.target as HTMLInputElement).value }" />
                  </div>
                </div>
              </div>

              <div class="vf-se-section-title">Contenu</div>
              <div class="vf-se-panel__bd">
                <div class="vf-se-field">
                  <label class="vf-se-label">Conteneur</label>
                  <div class="vf-se-container-toggle">
                    <button :class="['vf-se-container-btn', { 'vf-se-container-btn--active': !isCentered }]" title="Pleine largeur" @click="setContainerMode('full')">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="1"/></svg>
                      Pleine largeur
                    </button>
                    <button :class="['vf-se-container-btn', { 'vf-se-container-btn--active': isCentered }]" title="Centré" @click="setContainerMode('centered')">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="6" width="14" height="12" rx="1"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/></svg>
                      Centré
                    </button>
                  </div>
                </div>
                <div v-if="isCentered" class="vf-se-field">
                  <label class="vf-se-label">Largeur max</label>
                  <div class="vf-se-number-field">
                    <input type="text" class="vf-se-number-input" :value="workingWrapperStyles.maxWidth ?? '1200px'"
                      placeholder="1200px"
                      @input="workingWrapperStyles = { ...workingWrapperStyles, maxWidth: ($event.target as HTMLInputElement).value }" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="vf-se-right__divider" />

          <template v-if="selectedBlock">
            <!-- Tabs -->
            <div class="vf-se-right__tabs">
              <button :class="['vf-se-right__tab', { 'vf-se-right__tab--active': rightTab === 'props' }]" @click="rightTab = 'props'">Propriétés</button>
              <button :class="['vf-se-right__tab', { 'vf-se-right__tab--active': rightTab === 'attrs' }]" @click="rightTab = 'attrs'">Attributs HTML</button>
            </div>

            <!-- Props tab -->
            <div v-if="rightTab === 'props'" class="vf-se-right__content">

              <!-- Block header -->
              <div class="vf-se-block-hd">
                <span class="vf-se-block-hd__type">{{ humanizeType(selectedBlock.type) }}</span>
                <input
                  class="vf-se-block-hd__name"
                  :value="selectedBlock.meta?.label ?? selectedBlock.id"
                  placeholder="Nom du bloc"
                  @change="onRenameBlock({ blockId: selectedBlock.id, label: ($event.target as HTMLInputElement).value.trim() || (selectedBlock.meta?.label ?? selectedBlock.id) })"
                />
                <div class="vf-se-block-hd__opacity">
                  <input
                    type="number" min="0" max="100"
                    class="vf-se-block-hd__opacity-input"
                    :value="Math.round(parseFloat(getStyleValue('opacity','1'))*100)"
                    @input="setStyleValue('opacity', String(Number(($event.target as HTMLInputElement).value)/100))"
                  />
                  <span class="vf-se-block-hd__opacity-unit">%</span>
                </div>
              </div>

              <!-- ─── IMAGE ─────────────────────────────────────────────────────────── -->
              <template v-if="isImageBlock">
                <button class="vf-se-sec-hd" @click="panelOpen.image = !panelOpen.image">
                  <svg class="vf-se-sec-hd__chevron" :class="{'vf-se-sec-hd__chevron--open': panelOpen.image}" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                  <span class="vf-se-sec-hd__label">Image</span>
                </button>
                <div v-if="panelOpen.image" class="vf-se-sec-body">
                  <!-- Hidden file input -->
                  <input ref="imageFileInputRef" type="file" accept="image/*" style="display:none" @change="onImageFileChange" />
                  <!-- Preview -->
                  <div v-if="getPropValue('src','')" class="vf-se-img-preview">
                    <img :src="String(getPropValue('src',''))" alt="preview" />
                  </div>
                  <!-- File picker button -->
                  <button class="vf-se-img-pick-btn" @click="pickImageFile">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                    Choisir un fichier
                  </button>
                  <!-- URL input -->
                  <div class="vf-se-field" style="margin-top:8px">
                    <label class="vf-se-label">URL de l'image</label>
                    <input type="text" class="vf-se-input" :value="String(getPropValue('src',''))" placeholder="https://…" @input="onUpdateProp({instanceId:instance.instanceId,blockId:selectedBlockId!,key:'src',value:($event.target as HTMLInputElement).value})" />
                  </div>
                  <!-- Alt text -->
                  <div class="vf-se-field">
                    <label class="vf-se-label">Texte alternatif (alt)</label>
                    <input type="text" class="vf-se-input" :value="String(getPropValue('alt',''))" placeholder="Description de l'image" @input="onUpdateProp({instanceId:instance.instanceId,blockId:selectedBlockId!,key:'alt',value:($event.target as HTMLInputElement).value})" />
                  </div>
                  <!-- Object fit -->
                  <div class="vf-se-field">
                    <label class="vf-se-label">Ajustement</label>
                    <div class="vf-se-select-wrap">
                      <select class="vf-se-select" :value="getStyleValue('objectFit','cover')" @change="setStyleValue('objectFit',($event.target as HTMLSelectElement).value)">
                        <option value="cover">cover</option>
                        <option value="contain">contain</option>
                        <option value="fill">fill</option>
                        <option value="none">none</option>
                        <option value="scale-down">scale-down</option>
                      </select>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="vf-se-select-arrow"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>
                </div>
              </template>

              <!-- ─── ICÔNE ──────────────────────────────────────────────────────────── -->
              <template v-if="isIconBlock">
                <button class="vf-se-sec-hd" @click="panelOpen.icon = !panelOpen.icon">
                  <svg class="vf-se-sec-hd__chevron" :class="{'vf-se-sec-hd__chevron--open': panelOpen.icon}" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                  <span class="vf-se-sec-hd__label">Icône</span>
                </button>
                <div v-if="panelOpen.icon" class="vf-se-sec-body">
                  <!-- Size + Color row -->
                  <div class="vf-se-type-row">
                    <div class="vf-se-number-field" style="flex:1">
                      <span class="vf-se-number-icon-label">px</span>
                      <input type="number" min="8" max="200" class="vf-se-number-input" :value="Number(getPropValue('size',32))" placeholder="32" @input="onUpdateProp({instanceId:instance.instanceId,blockId:selectedBlockId!,key:'size',value:Number(($event.target as HTMLInputElement).value)})" />
                    </div>
                    <div class="vf-se-color-row" style="flex:1.5">
                      <input type="color" :value="String(getPropValue('color','#000000'))" class="vf-se-color-swatch" @input="onUpdateProp({instanceId:instance.instanceId,blockId:selectedBlockId!,key:'color',value:($event.target as HTMLInputElement).value})" />
                      <input type="text" :value="String(getPropValue('color','currentColor'))" class="vf-se-input" style="flex:1" placeholder="currentColor" @input="onUpdateProp({instanceId:instance.instanceId,blockId:selectedBlockId!,key:'color',value:($event.target as HTMLInputElement).value})" />
                    </div>
                  </div>
                  <!-- Search -->
                  <div class="vf-se-icon-search-wrap">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="vf-se-icon-search-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input v-model="iconSearch" type="text" class="vf-se-icon-search" placeholder="Chercher une icône…" />
                  </div>
                  <!-- Icon grid -->
                  <div class="vf-se-icon-grid">
                    <button
                      v-for="name in filteredIconNames"
                      :key="name"
                      :class="['vf-se-icon-item', { 'vf-se-icon-item--active': getPropValue('name','star') === name }]"
                      :title="name"
                      @click="onUpdateProp({instanceId:instance.instanceId,blockId:selectedBlockId!,key:'name',value:name})"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path :d="ICON_PATHS[name]"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </template>

              <!-- ─── PROPRIÉTÉS ─────────────────────────────────────────────────────── -->
              <template v-if="editableProps.length > 0">
                <button class="vf-se-sec-hd" @click="panelOpen.props = !panelOpen.props">
                  <svg class="vf-se-sec-hd__chevron" :class="{'vf-se-sec-hd__chevron--open': panelOpen.props}" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                  <span class="vf-se-sec-hd__label">Propriétés</span>
                </button>
                <div v-if="panelOpen.props" class="vf-se-sec-body">
                  <div v-for="prop in editableProps" :key="prop.key" class="vf-se-field">
                    <label class="vf-se-label">{{ prop.label }}</label>
                    <!-- Text content prop — routes to textOverrides, not propOverrides -->
                    <textarea v-if="prop.key==='text'" :value="getTextValue()" class="vf-se-textarea" rows="3" @input="onUpdateText({instanceId:instance.instanceId,blockId:selectedBlockId!,text:($event.target as HTMLTextAreaElement).value})" />
                    <input v-else-if="prop.type==='text'||prop.type==='url'||prop.type==='image-url'" :value="getPropValue(prop.key,prop.default)" class="vf-se-input" :type="prop.type==='url'||prop.type==='image-url'?'url':'text'" :placeholder="prop.placeholder??String(prop.default??'')" @input="onUpdateProp({instanceId:instance.instanceId,blockId:selectedBlockId!,key:prop.key,value:($event.target as HTMLInputElement).value})" />
                    <textarea v-else-if="prop.type==='textarea'" :value="String(getPropValue(prop.key,prop.default)??'')" class="vf-se-textarea" rows="3" @input="onUpdateProp({instanceId:instance.instanceId,blockId:selectedBlockId!,key:prop.key,value:($event.target as HTMLTextAreaElement).value})" />
                    <input v-else-if="prop.type==='number'" :value="getPropValue(prop.key,prop.default)" class="vf-se-input" type="number" @input="onUpdateProp({instanceId:instance.instanceId,blockId:selectedBlockId!,key:prop.key,value:Number(($event.target as HTMLInputElement).value)})" />
                    <label v-else-if="prop.type==='boolean'" class="vf-se-toggle">
                      <input type="checkbox" :checked="Boolean(getPropValue(prop.key,prop.default))" @change="onUpdateProp({instanceId:instance.instanceId,blockId:selectedBlockId!,key:prop.key,value:($event.target as HTMLInputElement).checked})" />
                      <span class="vf-se-toggle-track"><span class="vf-se-toggle-thumb"/></span>
                    </label>
                    <div v-else-if="prop.type==='color'" class="vf-se-color-row">
                      <input type="color" :value="String(getPropValue(prop.key,prop.default)??'#000000')" class="vf-se-color-swatch" @input="onUpdateProp({instanceId:instance.instanceId,blockId:selectedBlockId!,key:prop.key,value:($event.target as HTMLInputElement).value})" />
                      <input type="text" :value="String(getPropValue(prop.key,prop.default)??'')" class="vf-se-input" style="flex:1" @input="onUpdateProp({instanceId:instance.instanceId,blockId:selectedBlockId!,key:prop.key,value:($event.target as HTMLInputElement).value})" />
                    </div>
                    <div v-else-if="prop.type==='select'" class="vf-se-select-wrap">
                      <select :value="String(getPropValue(prop.key,prop.default)??'')" class="vf-se-select" @change="onUpdateProp({instanceId:instance.instanceId,blockId:selectedBlockId!,key:prop.key,value:($event.target as HTMLSelectElement).value})">
                        <option v-for="opt in prop.options" :key="String(opt.value)" :value="String(opt.value)">{{ opt.label }}</option>
                      </select>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="vf-se-select-arrow"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>
                </div>
              </template>

              <!-- ─── TYPOGRAPHIE ────────────────────────────────────────────────────── -->
              <template v-if="isTextBlock">
                <button class="vf-se-sec-hd" @click="panelOpen.typo = !panelOpen.typo">
                  <svg class="vf-se-sec-hd__chevron" :class="{'vf-se-sec-hd__chevron--open': panelOpen.typo}" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                  <span class="vf-se-sec-hd__label">Typographie</span>
                </button>
                <div v-if="panelOpen.typo" class="vf-se-sec-body">
                  <!-- Font family -->
                  <div class="vf-se-select-wrap">
                    <select class="vf-se-select" :value="getStyleValue('fontFamily', 'Inter')" @change="setStyleValue('fontFamily', ($event.target as HTMLSelectElement).value)">
                      <option v-for="f in FONT_FAMILIES" :key="f" :value="f">{{ f }}</option>
                    </select>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="vf-se-select-arrow"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                  <!-- Size + Weight -->
                  <div class="vf-se-type-row">
                    <div class="vf-se-number-field" style="flex:1">
                      <span class="vf-se-number-icon-label">A</span>
                      <input type="number" min="1" max="999" class="vf-se-number-input" :value="parsePx(getStyleValue('fontSize', '16px'))" placeholder="16" @input="setStyleValue('fontSize', ($event.target as HTMLInputElement).value + 'px')" />
                      <span class="vf-se-number-unit">px</span>
                    </div>
                    <div class="vf-se-select-wrap" style="flex:1.4">
                      <select class="vf-se-select" :value="getStyleValue('fontWeight', '400')" @change="setStyleValue('fontWeight', ($event.target as HTMLSelectElement).value)">
                        <option v-for="w in FONT_WEIGHTS" :key="w.value" :value="w.value">{{ w.label }}</option>
                      </select>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="vf-se-select-arrow"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>
                  <!-- Line height + Letter spacing -->
                  <div class="vf-se-type-row">
                    <div class="vf-se-number-field" style="flex:1">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="vf-se-number-icon"><line x1="12" y1="3" x2="12" y2="21"/><polyline points="8 7 12 3 16 7"/><polyline points="8 17 12 21 16 17"/></svg>
                      <input type="number" min="0" step="0.1" class="vf-se-number-input" :value="parsePx(getStyleValue('lineHeight', ''))" placeholder="auto" @input="setStyleValue('lineHeight', ($event.target as HTMLInputElement).value)" />
                    </div>
                    <div class="vf-se-number-field" style="flex:1">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="vf-se-number-icon"><line x1="3" y1="12" x2="21" y2="12"/><polyline points="7 8 3 12 7 16"/><polyline points="17 8 21 12 17 16"/></svg>
                      <input type="number" step="0.5" class="vf-se-number-input" :value="parsePx(getStyleValue('letterSpacing', '0px'))" placeholder="0" @input="setStyleValue('letterSpacing', ($event.target as HTMLInputElement).value + 'px')" />
                      <span class="vf-se-number-unit">px</span>
                    </div>
                  </div>
                  <!-- Alignment + Decoration -->
                  <div class="vf-se-fmt-toolbar">
                    <div class="vf-se-fmt-group">
                      <button v-for="(icon, align) in ALIGN_ICONS" :key="align"
                        :class="['vf-se-fmt-btn', { 'vf-se-fmt-btn--active': getStyleValue('textAlign') === align }]"
                        :title="`Aligner ${align}`"
                        @click="setStyleValue('textAlign', getStyleValue('textAlign') === align ? '' : align)">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path :d="icon"/></svg>
                      </button>
                    </div>
                    <div class="vf-se-fmt-sep"/>
                    <div class="vf-se-fmt-group">
                      <button :class="['vf-se-fmt-btn','vf-se-fmt-btn--text',{ 'vf-se-fmt-btn--active': isBold }]" title="Gras" @click="toggleBold">B</button>
                      <button :class="['vf-se-fmt-btn','vf-se-fmt-btn--text','vf-se-fmt-btn--italic',{ 'vf-se-fmt-btn--active': getStyleValue('fontStyle')==='italic' }]" title="Italique" @click="toggleItalic">I</button>
                      <button :class="['vf-se-fmt-btn','vf-se-fmt-btn--text','vf-se-fmt-btn--underline',{ 'vf-se-fmt-btn--active': getStyleValue('textDecoration').includes('underline') }]" title="Souligné" @click="toggleDecoration('underline')">U</button>
                      <button :class="['vf-se-fmt-btn','vf-se-fmt-btn--text','vf-se-fmt-btn--strike',{ 'vf-se-fmt-btn--active': getStyleValue('textDecoration').includes('line-through') }]" title="Barré" @click="toggleDecoration('line-through')">S</button>
                    </div>
                  </div>
                  <!-- Text color -->
                  <div class="vf-se-color-row">
                    <div class="vf-se-fill-swatch-wrap">
                      <button class="vf-se-fill-swatch vf-se-fill-swatch--sm"
                        :style="{background: getStyleValue('color','#000000')}"
                        @click.stop="colorPopupKey = colorPopupKey==='text-color' ? null : 'text-color'" />
                      <div v-if="colorPopupKey === 'text-color'" class="vf-se-color-popup" @click.stop>
                        <input type="color" class="vf-se-color-popup__picker" :value="getStyleValue('color','#000000')" @input="setStyleValue('color',($event.target as HTMLInputElement).value)" />
                        <div class="vf-se-color-popup__row">
                          <input type="text" class="vf-se-color-popup__hex" :value="getStyleValue('color','')" placeholder="#000000 ou rgba(…)" @input="setStyleValue('color',($event.target as HTMLInputElement).value)" />
                        </div>
                      </div>
                    </div>
                    <span style="font-size:11px;color:#374151;flex:1">{{ getStyleValue('color','') || '#000000' }}</span>
                  </div>
                </div>
              </template>

              <!-- ─── LAYOUT ─────────────────────────────────────────────────────────── -->
              <button class="vf-se-sec-hd" @click="panelOpen.layout = !panelOpen.layout">
                <svg class="vf-se-sec-hd__chevron" :class="{'vf-se-sec-hd__chevron--open': panelOpen.layout}" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                <span class="vf-se-sec-hd__label">Layout</span>
              </button>
              <div v-if="panelOpen.layout" class="vf-se-sec-body">
                <!-- W / H compact row -->
                <div class="vf-se-dim-row">
                  <div class="vf-se-dim-field">
                    <span class="vf-se-dim-lbl">W</span>
                    <input type="text" class="vf-se-dim-input" :value="getStyleValue('width','')" placeholder="auto" @input="setStyleValue('width',($event.target as HTMLInputElement).value)" />
                  </div>
                  <div class="vf-se-dim-field">
                    <span class="vf-se-dim-lbl">H</span>
                    <input type="text" class="vf-se-dim-input" :value="getStyleValue('height','')" placeholder="auto" @input="setStyleValue('height',($event.target as HTMLInputElement).value)" />
                  </div>
                </div>

                <!-- Display mode icon toggle buttons -->
                <div class="vf-se-display-row">
                  <button
                    v-for="mode in DISPLAY_MODES"
                    :key="mode.value"
                    :class="['vf-se-display-btn', { 'vf-se-display-btn--active': currentDisplay === mode.value }]"
                    :title="mode.label"
                    @click="setStyleValue('display', mode.value)"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path :d="mode.icon"/>
                    </svg>
                  </button>
                </div>

                <!-- Auto-layout panel (flex) -->
                <template v-if="isFlex">
                  <div class="vf-se-autolayout-row">
                    <!-- Direction + wrap buttons -->
                    <div class="vf-se-dir-btns">
                      <button
                        :class="['vf-se-dir-btn', { 'vf-se-dir-btn--active': isFlexRow }]"
                        title="Horizontal (row)"
                        @click="setStyleValue('flexDirection', 'row')"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="15 8 19 12 15 16"/></svg>
                      </button>
                      <button
                        :class="['vf-se-dir-btn', { 'vf-se-dir-btn--active': !isFlexRow }]"
                        title="Vertical (column)"
                        @click="setStyleValue('flexDirection', 'column')"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="8 15 12 19 16 15"/></svg>
                      </button>
                      <button
                        :class="['vf-se-dir-btn', { 'vf-se-dir-btn--active': getStyleValue('flexWrap','nowrap') === 'wrap' }]"
                        title="Wrap"
                        @click="setStyleValue('flexWrap', getStyleValue('flexWrap','nowrap') === 'wrap' ? 'nowrap' : 'wrap')"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>
                      </button>
                    </div>
                    <!-- 3×3 alignment grid -->
                    <div class="vf-se-align-grid">
                      <button
                        v-for="cell in ALIGN_CELLS"
                        :key="cell.key"
                        :class="['vf-se-align-cell', { 'vf-se-align-cell--active': isAlignCellActive(cell) }]"
                        :title="cell.label"
                        @click="setAlignCell(cell)"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <rect x="1" y="1" width="12" height="12" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
                          <circle :cx="cell.cx" :cy="cell.cy" r="1.5" fill="currentColor"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <!-- Distribution (space-between / space-around / space-evenly) -->
                  <div class="vf-se-distrib-row">
                    <button
                      v-for="d in DISTRIB_VALUES"
                      :key="d.value"
                      :class="['vf-se-distrib-btn', { 'vf-se-distrib-btn--active': getStyleValue('justifyContent','') === d.value }]"
                      :title="d.label"
                      @click="setStyleValue('justifyContent', getStyleValue('justifyContent','') === d.value ? 'flex-start' : d.value)"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path :d="d.lines" stroke="currentColor" stroke-width="0.8" opacity="0.35"/>
                        <rect v-for="r in d.rects" :key="r" :x="r" y="4" width="2" height="6" rx="0.5" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>

                  <!-- Gap field -->
                  <div class="vf-se-gap-row">
                    <div class="vf-se-dim-field" style="flex:1">
                      <span class="vf-se-dim-lbl" style="width:auto;font-size:9px">Gap</span>
                      <input type="text" class="vf-se-dim-input" :value="getStyleValue('gap','')" placeholder="0" @input="setStyleValue('gap',($event.target as HTMLInputElement).value)" />
                    </div>
                  </div>
                </template>

                <!-- Padding -->
                <div class="vf-se-spacing-box">
                  <div class="vf-se-spacing-box__hd">
                    <span class="vf-se-spacing-box__title">Padding</span>
                    <div class="vf-se-spacing-modes">
                      <button :class="['vf-se-spacing-mode', { active: paddingMode==='all' }]" title="Tout lier" @click="paddingMode='all'">
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="3.5" y="3.5" width="7" height="7" rx="0.5" stroke="currentColor" stroke-width="1" opacity="0.5"/></svg>
                      </button>
                      <button :class="['vf-se-spacing-mode', { active: paddingMode==='axial' }]" title="Inline / Block" @click="paddingMode='axial'">
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" stroke-width="1.2"/><line x1="7" y1="1" x2="7" y2="13" stroke="currentColor" stroke-width="1.2"/><circle cx="7" cy="7" r="1.5" fill="currentColor"/></svg>
                      </button>
                      <button :class="['vf-se-spacing-mode', { active: paddingMode==='individual' }]" title="Individuel" @click="paddingMode='individual'">
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><line x1="3" y1="1" x2="11" y2="1" stroke="currentColor" stroke-width="1.2"/><line x1="13" y1="3" x2="13" y2="11" stroke="currentColor" stroke-width="1.2"/><line x1="11" y1="13" x2="3" y2="13" stroke="currentColor" stroke-width="1.2"/><line x1="1" y1="11" x2="1" y2="3" stroke="currentColor" stroke-width="1.2"/></svg>
                      </button>
                    </div>
                  </div>
                  <!-- All: single input -->
                  <div v-if="paddingMode==='all'" class="vf-se-dim-row">
                    <div class="vf-se-dim-field" style="flex:1">
                      <svg width="10" height="10" viewBox="0 0 14 14" fill="none" style="flex-shrink:0;color:#9ca3af"><rect x="1" y="1" width="12" height="12" rx="1" stroke="currentColor" stroke-width="1.2"/></svg>
                      <input type="text" class="vf-se-dim-input" :value="getSpacingVal('padding','Top')" placeholder="0" @change="setSpacingAll('padding',($event.target as HTMLInputElement).value)" />
                    </div>
                  </div>
                  <!-- Axial: H + V -->
                  <div v-else-if="paddingMode==='axial'" class="vf-se-dim-row">
                    <div class="vf-se-dim-field" style="flex:1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;color:#9ca3af"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="15 8 19 12 15 16"/><polyline points="9 8 5 12 9 16"/></svg>
                      <input type="text" class="vf-se-dim-input" :value="getSpacingVal('padding','Left')" placeholder="0" @change="setSpacingInline('padding',($event.target as HTMLInputElement).value)" />
                    </div>
                    <div class="vf-se-dim-field" style="flex:1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;color:#9ca3af"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="8 15 12 19 16 15"/><polyline points="8 9 12 5 16 9"/></svg>
                      <input type="text" class="vf-se-dim-input" :value="getSpacingVal('padding','Top')" placeholder="0" @change="setSpacingBlock('padding',($event.target as HTMLInputElement).value)" />
                    </div>
                  </div>
                  <!-- Individual: cross -->
                  <div v-else class="vf-se-spacing-cross">
                    <div class="vf-se-spacing-cross__top">
                      <input type="text" class="vf-se-spacing-input" :value="getSpacingVal('padding','Top')" placeholder="0" @change="setSpacing('padding','Top',($event.target as HTMLInputElement).value)" />
                    </div>
                    <div class="vf-se-spacing-cross__middle">
                      <input type="text" class="vf-se-spacing-input" :value="getSpacingVal('padding','Left')" placeholder="0" @change="setSpacing('padding','Left',($event.target as HTMLInputElement).value)" />
                      <div class="vf-se-spacing-cross__center"><span class="vf-se-spacing-cross__label">P</span></div>
                      <input type="text" class="vf-se-spacing-input" :value="getSpacingVal('padding','Right')" placeholder="0" @change="setSpacing('padding','Right',($event.target as HTMLInputElement).value)" />
                    </div>
                    <div class="vf-se-spacing-cross__bottom">
                      <input type="text" class="vf-se-spacing-input" :value="getSpacingVal('padding','Bottom')" placeholder="0" @change="setSpacing('padding','Bottom',($event.target as HTMLInputElement).value)" />
                    </div>
                  </div>
                </div>

                <!-- Margin -->
                <div class="vf-se-spacing-box">
                  <div class="vf-se-spacing-box__hd">
                    <span class="vf-se-spacing-box__title">Margin</span>
                    <div class="vf-se-spacing-modes">
                      <button :class="['vf-se-spacing-mode', { active: marginMode==='all' }]" title="Tout lier" @click="marginMode='all'">
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="3.5" y="3.5" width="7" height="7" rx="0.5" stroke="currentColor" stroke-width="1" opacity="0.5"/></svg>
                      </button>
                      <button :class="['vf-se-spacing-mode', { active: marginMode==='axial' }]" title="Inline / Block" @click="marginMode='axial'">
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" stroke-width="1.2"/><line x1="7" y1="1" x2="7" y2="13" stroke="currentColor" stroke-width="1.2"/><circle cx="7" cy="7" r="1.5" fill="currentColor"/></svg>
                      </button>
                      <button :class="['vf-se-spacing-mode', { active: marginMode==='individual' }]" title="Individuel" @click="marginMode='individual'">
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><line x1="3" y1="1" x2="11" y2="1" stroke="currentColor" stroke-width="1.2"/><line x1="13" y1="3" x2="13" y2="11" stroke="currentColor" stroke-width="1.2"/><line x1="11" y1="13" x2="3" y2="13" stroke="currentColor" stroke-width="1.2"/><line x1="1" y1="11" x2="1" y2="3" stroke="currentColor" stroke-width="1.2"/></svg>
                      </button>
                    </div>
                  </div>
                  <div v-if="marginMode==='all'" class="vf-se-dim-row">
                    <div class="vf-se-dim-field" style="flex:1">
                      <svg width="10" height="10" viewBox="0 0 14 14" fill="none" style="flex-shrink:0;color:#9ca3af"><rect x="1" y="1" width="12" height="12" rx="1" stroke="currentColor" stroke-width="1.2"/></svg>
                      <input type="text" class="vf-se-dim-input" :value="getSpacingVal('margin','Top')" placeholder="0" @change="setSpacingAll('margin',($event.target as HTMLInputElement).value)" />
                    </div>
                  </div>
                  <div v-else-if="marginMode==='axial'" class="vf-se-dim-row">
                    <div class="vf-se-dim-field" style="flex:1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;color:#9ca3af"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="15 8 19 12 15 16"/><polyline points="9 8 5 12 9 16"/></svg>
                      <input type="text" class="vf-se-dim-input" :value="getSpacingVal('margin','Left')" placeholder="0" @change="setSpacingInline('margin',($event.target as HTMLInputElement).value)" />
                    </div>
                    <div class="vf-se-dim-field" style="flex:1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;color:#9ca3af"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="8 15 12 19 16 15"/><polyline points="8 9 12 5 16 9"/></svg>
                      <input type="text" class="vf-se-dim-input" :value="getSpacingVal('margin','Top')" placeholder="0" @change="setSpacingBlock('margin',($event.target as HTMLInputElement).value)" />
                    </div>
                  </div>
                  <div v-else class="vf-se-spacing-cross">
                    <div class="vf-se-spacing-cross__top">
                      <input type="text" class="vf-se-spacing-input" :value="getSpacingVal('margin','Top')" placeholder="0" @change="setSpacing('margin','Top',($event.target as HTMLInputElement).value)" />
                    </div>
                    <div class="vf-se-spacing-cross__middle">
                      <input type="text" class="vf-se-spacing-input" :value="getSpacingVal('margin','Left')" placeholder="0" @change="setSpacing('margin','Left',($event.target as HTMLInputElement).value)" />
                      <div class="vf-se-spacing-cross__center"><span class="vf-se-spacing-cross__label">M</span></div>
                      <input type="text" class="vf-se-spacing-input" :value="getSpacingVal('margin','Right')" placeholder="0" @change="setSpacing('margin','Right',($event.target as HTMLInputElement).value)" />
                    </div>
                    <div class="vf-se-spacing-cross__bottom">
                      <input type="text" class="vf-se-spacing-input" :value="getSpacingVal('margin','Bottom')" placeholder="0" @change="setSpacing('margin','Bottom',($event.target as HTMLInputElement).value)" />
                    </div>
                  </div>
                </div>
              </div>


              <!-- ─── FOND ───────────────────────────────────────────────────────────── -->
              <div class="vf-se-sec-hd-wrap">
                <button class="vf-se-sec-hd" @click="panelOpen.fill = !panelOpen.fill">
                  <svg class="vf-se-sec-hd__chevron" :class="{'vf-se-sec-hd__chevron--open': panelOpen.fill}" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                  <span class="vf-se-sec-hd__label">Fill</span>
                </button>
                <button class="vf-se-sec-hd-add" title="Ajouter un fond" @click="bgMode='color';applyBackground();panelOpen.fill=true">+</button>
              </div>
              <div v-if="panelOpen.fill" class="vf-se-sec-body">

                <!-- Fill row (when fill is set) -->
                <div v-if="bgMode !== 'none'" class="vf-se-fill-row">
                  <div class="vf-se-fill-swatch-wrap">
                    <button
                      class="vf-se-fill-swatch"
                      :style="{background: bgMode==='color' ? getStyleValue('backgroundColor','#fff') : (bgMode==='gradient' ? builtGradient : 'transparent')}"
                      @click.stop="colorPopupKey = colorPopupKey==='fill' ? null : 'fill'"
                    />
                    <div v-if="colorPopupKey === 'fill'" class="vf-se-color-popup" @click.stop>
                      <!-- Mode tabs inside popup -->
                      <div class="vf-se-popup-tabs">
                        <button :class="['vf-se-popup-tab',{active:bgMode==='color'}]" @click="bgMode='color';applyBackground()">Couleur</button>
                        <button :class="['vf-se-popup-tab',{active:bgMode==='gradient'}]" @click="bgMode='gradient';applyBackground()">Dégradé</button>
                        <button :class="['vf-se-popup-tab',{active:bgMode==='image'}]" @click="bgMode='image';applyBackground()">Image</button>
                      </div>
                      <!-- Color mode -->
                      <template v-if="bgMode==='color'">
                        <input type="color" class="vf-se-color-popup__picker" :value="getStyleValue('backgroundColor','#ffffff')" @input="setStyleValue('backgroundColor',($event.target as HTMLInputElement).value)" />
                        <div class="vf-se-color-popup__row">
                          <input type="text" class="vf-se-color-popup__hex" :value="getStyleValue('backgroundColor','')" placeholder="#ffffff" @input="setStyleValue('backgroundColor',($event.target as HTMLInputElement).value)" />
                        </div>
                      </template>
                      <!-- Gradient mode -->
                      <template v-else-if="bgMode==='gradient'">
                        <div class="vf-se-field" style="margin-top:4px">
                          <div class="vf-se-type-row">
                            <div class="vf-se-select-wrap" style="flex:1">
                              <select class="vf-se-select" :value="gradType" @change="gradType = ($event.target as HTMLSelectElement).value as any; applyBackground()">
                                <option value="linear">Linéaire</option>
                                <option value="radial">Radial</option>
                                <option value="conic">Conique</option>
                              </select>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="vf-se-select-arrow"><polyline points="6 9 12 15 18 9"/></svg>
                            </div>
                            <div v-if="gradType !== 'radial'" class="vf-se-number-field" style="width:60px;flex-shrink:0">
                              <input type="number" class="vf-se-number-input" :value="gradAngle" @input="gradAngle = Number(($event.target as HTMLInputElement).value); applyBackground()" />
                              <span class="vf-se-number-unit">°</span>
                            </div>
                          </div>
                        </div>
                        <div class="vf-se-grad-preview" :style="{ background: builtGradient }" />
                        <div class="vf-se-grad-stops">
                          <div v-for="(stop, i) in gradStops" :key="i" class="vf-se-grad-stop">
                            <input type="color" :value="stop.color" class="vf-se-color-swatch vf-se-color-swatch--sm" @input="updateGradStop(i, 'color', ($event.target as HTMLInputElement).value)" />
                            <input type="number" min="0" max="100" class="vf-se-number-input" style="width:44px" :value="stop.position" @input="updateGradStop(i, 'position', ($event.target as HTMLInputElement).value)" />
                            <span class="vf-se-number-unit">%</span>
                            <button v-if="gradStops.length > 2" class="vf-se-stop-remove" @click="removeGradStop(i)">
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                          </div>
                          <button class="vf-se-stop-add" @click="addGradStop">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            Ajouter une étape
                          </button>
                        </div>
                      </template>
                      <!-- Image mode -->
                      <template v-else-if="bgMode==='image'">
                        <div class="vf-se-field" style="margin-top:4px">
                          <label class="vf-se-label">URL</label>
                          <input type="text" class="vf-se-input" :value="bgImgUrl" placeholder="https://…" @input="bgImgUrl = ($event.target as HTMLInputElement).value; applyBackground()" />
                        </div>
                        <div class="vf-se-field">
                          <label class="vf-se-label">Taille</label>
                          <div class="vf-se-select-wrap">
                            <select class="vf-se-select" :value="bgSize" @change="bgSize = ($event.target as HTMLSelectElement).value; applyBackground()">
                              <option value="cover">Couvrir (cover)</option>
                              <option value="contain">Contenir (contain)</option>
                              <option value="auto">Auto</option>
                              <option value="100% 100%">Étirer</option>
                            </select>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="vf-se-select-arrow"><polyline points="6 9 12 15 18 9"/></svg>
                          </div>
                        </div>
                        <div class="vf-se-field">
                          <label class="vf-se-label">Position</label>
                          <div class="vf-se-select-wrap">
                            <select class="vf-se-select" :value="bgPos" @change="bgPos = ($event.target as HTMLSelectElement).value; applyBackground()">
                              <option value="center">Centre</option>
                              <option value="top">Haut</option>
                              <option value="bottom">Bas</option>
                              <option value="left">Gauche</option>
                              <option value="right">Droite</option>
                              <option value="top left">Haut gauche</option>
                              <option value="top right">Haut droite</option>
                              <option value="bottom left">Bas gauche</option>
                              <option value="bottom right">Bas droite</option>
                            </select>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="vf-se-select-arrow"><polyline points="6 9 12 15 18 9"/></svg>
                          </div>
                        </div>
                        <div class="vf-se-field">
                          <label class="vf-se-label">Répétition</label>
                          <div class="vf-se-select-wrap">
                            <select class="vf-se-select" :value="bgRepeat" @change="bgRepeat = ($event.target as HTMLSelectElement).value; applyBackground()">
                              <option value="no-repeat">Non</option>
                              <option value="repeat">Répéter</option>
                              <option value="repeat-x">Horizontal</option>
                              <option value="repeat-y">Vertical</option>
                            </select>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="vf-se-select-arrow"><polyline points="6 9 12 15 18 9"/></svg>
                          </div>
                        </div>
                        <div class="vf-se-toggle-row" style="margin-top:4px">
                          <span class="vf-se-label">Superposition</span>
                          <button :class="['vf-se-toggle-track', { 'vf-se-toggle-track--on': bgOverlay }]" @click="bgOverlay = !bgOverlay; applyBackground()">
                            <span :class="['vf-se-toggle-thumb', { 'vf-se-toggle-thumb--on': bgOverlay }]"/>
                          </button>
                        </div>
                        <template v-if="bgOverlay">
                          <div class="vf-se-color-row" style="margin-top:4px">
                            <input type="color" :value="bgOverlayCol.replace(/rgba?\([^)]+\)/,'#000000')" class="vf-se-color-swatch" @input="bgOverlayCol = ($event.target as HTMLInputElement).value; applyBackground()" />
                            <input type="text" :value="bgOverlayCol" class="vf-se-input" style="flex:1" placeholder="rgba(0,0,0,0.4)" @input="bgOverlayCol = ($event.target as HTMLInputElement).value; applyBackground()" />
                          </div>
                        </template>
                      </template>
                    </div>
                  </div>
                  <!-- Fill type label / hex -->
                  <span class="vf-se-fill-value">{{ bgMode === 'color' ? getStyleValue('backgroundColor','—') : bgMode }}</span>
                  <!-- Opacity -->
                  <div class="vf-se-fill-opacity-wrap">
                    <input type="number" min="0" max="100" class="vf-se-fill-opacity-input" :value="Math.round(parseFloat(getStyleValue('opacity','1'))*100)" @input="setStyleValue('opacity', String(Number(($event.target as HTMLInputElement).value)/100))" />
                    <span>%</span>
                  </div>
                  <!-- Remove fill -->
                  <button class="vf-se-fill-del" title="Supprimer" @click="bgMode='none';applyBackground()">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
                <!-- Empty fill (no fill) -->
                <div v-else class="vf-se-fill-empty">
                  <button class="vf-se-fill-add-btn" @click="bgMode='color';applyBackground()">+ Ajouter un fond</button>
                </div>

                <!-- Opacity row -->
                <div class="vf-se-sec-body__row">
                  <span class="vf-se-label">Opacité</span>
                  <div class="vf-se-opacity-row">
                    <input type="range" min="0" max="100" class="vf-se-slider" :value="Math.round(parseFloat(getStyleValue('opacity','1'))*100)" @input="setStyleValue('opacity', String(Number(($event.target as HTMLInputElement).value)/100))" />
                    <div class="vf-se-number-field" style="width:54px;flex-shrink:0">
                      <input type="number" min="0" max="100" class="vf-se-number-input" :value="Math.round(parseFloat(getStyleValue('opacity','1'))*100)" @input="setStyleValue('opacity', String(Number(($event.target as HTMLInputElement).value)/100))" />
                      <span class="vf-se-number-unit">%</span>
                    </div>
                  </div>
                </div>
                <!-- Overflow -->
                <div class="vf-se-sec-body__row">
                  <span class="vf-se-label">Overflow</span>
                  <div class="vf-se-select-wrap" style="flex:1">
                    <select class="vf-se-select" :value="getStyleValue('overflow','')" @change="setStyleValue('overflow',($event.target as HTMLSelectElement).value)">
                      <option value="">— hérité —</option>
                      <option value="visible">visible</option>
                      <option value="hidden">hidden</option>
                      <option value="scroll">scroll</option>
                      <option value="auto">auto</option>
                    </select>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="vf-se-select-arrow"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>

              </div>

              <!-- ─── EFFETS ─────────────────────────────────────────────────────────── -->
              <button class="vf-se-sec-hd" @click="panelOpen.effects = !panelOpen.effects">
                <svg class="vf-se-sec-hd__chevron" :class="{'vf-se-sec-hd__chevron--open': panelOpen.effects}" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                <span class="vf-se-sec-hd__label">Effets</span>
              </button>
              <div v-if="panelOpen.effects" class="vf-se-sec-body">

                <!-- Box shadow -->
                <div class="vf-se-effect-row">
                  <button :class="['vf-se-effect-toggle', { 'vf-se-effect-toggle--on': shadowEnabled }]"
                    @click="shadowEnabled = !shadowEnabled; applyBoxShadow()">
                    <span class="vf-se-effect-toggle__dot"/>
                  </button>
                  <span class="vf-se-effect-label">Ombre portée</span>
                  <template v-if="shadowEnabled">
                    <div class="vf-se-fill-swatch-wrap">
                      <button class="vf-se-fill-swatch" :style="{background: shadowColor}" @click.stop="colorPopupKey = colorPopupKey==='shadow'?null:'shadow'"/>
                      <div v-if="colorPopupKey==='shadow'" class="vf-se-color-popup" @click.stop>
                        <input type="color" class="vf-se-color-popup__picker" :value="shadowColor.startsWith('rgba')?'#000000':shadowColor" @input="shadowColor = ($event.target as HTMLInputElement).value; applyBoxShadow()" />
                        <div class="vf-se-color-popup__row">
                          <input type="text" class="vf-se-color-popup__hex" v-model="shadowColor" @input="applyBoxShadow()" />
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
                <template v-if="shadowEnabled">
                  <div class="vf-se-shadow-fields">
                    <div class="vf-se-shadow-field">
                      <span class="vf-se-shadow-lbl">X</span>
                      <input type="number" class="vf-se-number-input" style="width:100%" :value="shadowX" @input="shadowX=Number(($event.target as HTMLInputElement).value);applyBoxShadow()" />
                    </div>
                    <div class="vf-se-shadow-field">
                      <span class="vf-se-shadow-lbl">Y</span>
                      <input type="number" class="vf-se-number-input" style="width:100%" :value="shadowY" @input="shadowY=Number(($event.target as HTMLInputElement).value);applyBoxShadow()" />
                    </div>
                    <div class="vf-se-shadow-field">
                      <span class="vf-se-shadow-lbl">Flou</span>
                      <input type="number" min="0" class="vf-se-number-input" style="width:100%" :value="shadowBlur" @input="shadowBlur=Number(($event.target as HTMLInputElement).value);applyBoxShadow()" />
                    </div>
                    <div class="vf-se-shadow-field">
                      <span class="vf-se-shadow-lbl">Étendue</span>
                      <input type="number" class="vf-se-number-input" style="width:100%" :value="shadowSpread" @input="shadowSpread=Number(($event.target as HTMLInputElement).value);applyBoxShadow()" />
                    </div>
                  </div>
                  <label class="vf-se-toggle" style="margin-bottom:6px">
                    <input type="checkbox" :checked="shadowInner" @change="shadowInner=($event.target as HTMLInputElement).checked;applyBoxShadow()" />
                    <span class="vf-se-toggle-track"><span class="vf-se-toggle-thumb"/></span>
                    <span style="font-size:11px;color:#6b7280">Intérieure</span>
                  </label>
                </template>

                <div class="vf-se-fx-divider"/>

                <!-- Backdrop filter toggle -->
                <div class="vf-se-toggle-row">
                  <span class="vf-se-label">Flou d'arrière-plan</span>
                  <button :class="['vf-se-toggle-track', { 'vf-se-toggle-track--on': fxEnabled }]"
                    @click="fxEnabled = !fxEnabled; applyEffects()">
                    <span :class="['vf-se-toggle-thumb', { 'vf-se-toggle-thumb--on': fxEnabled }]"/>
                  </button>
                </div>
                <template v-if="fxEnabled">
                  <div class="vf-se-fx-row">
                    <span class="vf-se-fx-label">Flou</span>
                    <input type="range" min="0" max="40" class="vf-se-slider" :value="fxBlur" @input="fxBlur = Number(($event.target as HTMLInputElement).value); applyEffects()" />
                    <div class="vf-se-number-field" style="width:52px;flex-shrink:0">
                      <input type="number" min="0" max="40" class="vf-se-number-input" :value="fxBlur" @input="fxBlur = Number(($event.target as HTMLInputElement).value); applyEffects()" />
                      <span class="vf-se-number-unit">px</span>
                    </div>
                  </div>
                  <div class="vf-se-fx-row">
                    <span class="vf-se-fx-label">Luminosité</span>
                    <input type="range" min="0" max="200" class="vf-se-slider" :value="fxBrightness" @input="fxBrightness = Number(($event.target as HTMLInputElement).value); applyEffects()" />
                    <div class="vf-se-number-field" style="width:52px;flex-shrink:0">
                      <input type="number" min="0" max="200" class="vf-se-number-input" :value="fxBrightness" @input="fxBrightness = Number(($event.target as HTMLInputElement).value); applyEffects()" />
                      <span class="vf-se-number-unit">%</span>
                    </div>
                  </div>
                  <div class="vf-se-fx-row">
                    <span class="vf-se-fx-label">Saturation</span>
                    <input type="range" min="0" max="200" class="vf-se-slider" :value="fxSaturate" @input="fxSaturate = Number(($event.target as HTMLInputElement).value); applyEffects()" />
                    <div class="vf-se-number-field" style="width:52px;flex-shrink:0">
                      <input type="number" min="0" max="200" class="vf-se-number-input" :value="fxSaturate" @input="fxSaturate = Number(($event.target as HTMLInputElement).value); applyEffects()" />
                      <span class="vf-se-number-unit">%</span>
                    </div>
                  </div>
                  <div class="vf-se-fx-row">
                    <span class="vf-se-fx-label">Contraste</span>
                    <input type="range" min="0" max="200" class="vf-se-slider" :value="fxContrast" @input="fxContrast = Number(($event.target as HTMLInputElement).value); applyEffects()" />
                    <div class="vf-se-number-field" style="width:52px;flex-shrink:0">
                      <input type="number" min="0" max="200" class="vf-se-number-input" :value="fxContrast" @input="fxContrast = Number(($event.target as HTMLInputElement).value); applyEffects()" />
                      <span class="vf-se-number-unit">%</span>
                    </div>
                  </div>
                </template>

              </div>

              <!-- ─── BORDURE ────────────────────────────────────────────────────────── -->
              <button class="vf-se-sec-hd" @click="panelOpen.border = !panelOpen.border">
                <svg class="vf-se-sec-hd__chevron" :class="{'vf-se-sec-hd__chevron--open': panelOpen.border}" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                <span class="vf-se-sec-hd__label">Bordure</span>
              </button>
              <div v-if="panelOpen.border" class="vf-se-sec-body">

                  <!-- Border radius -->
                  <div class="vf-se-spacing-label-row">
                    <span class="vf-se-spacing-title">Rayon</span>
                    <button :class="['vf-se-link-btn', { 'vf-se-link-btn--active': radiusLinked }]" title="Lier les coins" @click="radiusLinked = !radiusLinked">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                    </button>
                  </div>
                  <!-- Linked radius -->
                  <div v-if="radiusLinked" class="vf-se-number-field">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="vf-se-number-icon"><path d="M3 12a9 9 0 019-9"/></svg>
                    <input type="number" min="0" class="vf-se-number-input" :value="getStyleNum('borderRadius')" placeholder="0" @input="setRadiusAll(($event.target as HTMLInputElement).value)" />
                    <span class="vf-se-number-unit">px</span>
                  </div>
                  <!-- Individual corners -->
                  <div v-else class="vf-se-radius-grid">
                    <div class="vf-se-number-field">
                      <span class="vf-se-corner-icon">◤</span>
                      <input type="number" min="0" class="vf-se-number-input" :value="getStyleNum('borderTopLeftRadius')" placeholder="0" @input="setStylePx('borderTopLeftRadius',($event.target as HTMLInputElement).value)" />
                    </div>
                    <div class="vf-se-number-field">
                      <span class="vf-se-corner-icon">◥</span>
                      <input type="number" min="0" class="vf-se-number-input" :value="getStyleNum('borderTopRightRadius')" placeholder="0" @input="setStylePx('borderTopRightRadius',($event.target as HTMLInputElement).value)" />
                    </div>
                    <div class="vf-se-number-field">
                      <span class="vf-se-corner-icon">◣</span>
                      <input type="number" min="0" class="vf-se-number-input" :value="getStyleNum('borderBottomLeftRadius')" placeholder="0" @input="setStylePx('borderBottomLeftRadius',($event.target as HTMLInputElement).value)" />
                    </div>
                    <div class="vf-se-number-field">
                      <span class="vf-se-corner-icon">◢</span>
                      <input type="number" min="0" class="vf-se-number-input" :value="getStyleNum('borderBottomRightRadius')" placeholder="0" @input="setStylePx('borderBottomRightRadius',($event.target as HTMLInputElement).value)" />
                    </div>
                  </div>

                  <!-- Border -->
                  <div class="vf-se-spacing-title" style="margin-top:10px">Contour</div>
                  <div class="vf-se-type-row">
                    <div class="vf-se-number-field" style="flex:1">
                      <input type="number" min="0" class="vf-se-number-input" :value="getStyleNum('borderWidth')" placeholder="0" @input="setStylePx('borderWidth',($event.target as HTMLInputElement).value)" />
                      <span class="vf-se-number-unit">px</span>
                    </div>
                    <div class="vf-se-select-wrap" style="flex:1.2">
                      <select class="vf-se-select" :value="getStyleValue('borderStyle','solid')" @change="setStyleValue('borderStyle',($event.target as HTMLSelectElement).value)">
                        <option value="solid">solid</option>
                        <option value="dashed">dashed</option>
                        <option value="dotted">dotted</option>
                        <option value="double">double</option>
                        <option value="none">none</option>
                      </select>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="vf-se-select-arrow"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>
                  <div class="vf-se-color-row">
                    <div class="vf-se-fill-swatch-wrap">
                      <button class="vf-se-fill-swatch vf-se-fill-swatch--sm"
                        :style="{background: getStyleValue('borderColor','#000')}"
                        @click.stop="colorPopupKey = colorPopupKey==='border' ? null : 'border'" />
                      <div v-if="colorPopupKey === 'border'" class="vf-se-color-popup" @click.stop>
                        <input type="color" class="vf-se-color-popup__picker" :value="getStyleValue('borderColor','#000000')" @input="setStyleValue('borderColor',($event.target as HTMLInputElement).value)" />
                        <div class="vf-se-color-popup__row">
                          <input type="text" class="vf-se-color-popup__hex" :value="getStyleValue('borderColor','')" placeholder="#000000" @input="setStyleValue('borderColor',($event.target as HTMLInputElement).value)" />
                        </div>
                      </div>
                    </div>
                    <span style="font-size:11px;color:#374151;flex:1">{{ getStyleValue('borderColor','') || '#000000' }}</span>
                  </div>

                </div>

            </div>

            <!-- Attrs tab -->
            <div v-else-if="rightTab === 'attrs'" class="vf-se-right__content vf-se-right__content--padded">
              <div class="vf-se-attrs-info">
                Attributs HTML ajoutés directement sur l'élément rendu (SEO, accessibilité).
              </div>

              <!-- Existing attrs -->
              <div v-for="(val, key) in currentBlockAttrs" :key="key" class="vf-se-attr-row">
                <input :value="key" class="vf-se-attr-key" readonly/>
                <input
                  :value="val"
                  class="vf-se-attr-val"
                  :placeholder="`valeur de ${key}`"
                  @input="setAttr(String(key), ($event.target as HTMLInputElement).value)"
                />
                <button class="vf-se-attr-del" @click="removeAttr(String(key))" title="Supprimer">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              <!-- Add new attr -->
              <div class="vf-se-attr-add">
                <div class="vf-se-attr-add__title">Ajouter un attribut</div>

                <!-- Quick-add buttons -->
                <div class="vf-se-attr-quick">
                  <button
                    v-for="qa in QUICK_ATTRS"
                    :key="qa"
                    class="vf-se-attr-quick-btn"
                    :disabled="qa in currentBlockAttrs"
                    @click="addQuickAttr(qa)"
                  >{{ qa }}</button>
                </div>

                <!-- Custom -->
                <div class="vf-se-attr-custom">
                  <input v-model="newAttrKey" class="vf-se-attr-key" placeholder="attribut (ex: data-section)"/>
                  <input v-model="newAttrVal" class="vf-se-attr-val" placeholder="valeur"/>
                  <button class="vf-se-attr-add-btn" :disabled="!newAttrKey.trim()" @click="addCustomAttr">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </template>

          <!-- No selection -->
          <div v-else class="vf-se-right__empty">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" opacity="0.3"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="17 1 21 5 17 9"/><line x1="12" y1="12" x2="21" y2="5"/></svg>
            <p>Cliquez sur un bloc pour le sélectionner</p>
          </div>
        </aside>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref, computed, watch, nextTick, reactive } from 'vue'
import type { SectionInstance, SectionTemplate, BlockDefinition, EditableProp, DesignSystemAdapter } from '../../types'
import { VfBlockTree } from '../BlockTree'
import { VfBlockRenderer } from '../BlockRenderer'
import { ICON_PATHS } from '../BlockRenderer/icon-paths'
import { resolveEditableProps } from '../../utils/block-props.util'
import { GENERIC_COMPONENT_LABELS } from '../../consts'

// ─── Props / Emits ────────────────────────────────────────────────────────────

interface Props {
  open: boolean
  instance: SectionInstance
  template: SectionTemplate | null
  adapter: DesignSystemAdapter
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'close': []
  'save': [payload: {
    instance: SectionInstance
    customBlocks: BlockDefinition[]
    attrOverrides: Record<string, Record<string, string>>
    textOverrides: Record<string, string>
    propOverrides: Record<string, Record<string, unknown>>
    styleOverrides: Record<string, Record<string, string>>
    sectionStyles: Record<string, string>
    wrapperStyles: Record<string, string>
  }]
}>()

// ─── State ────────────────────────────────────────────────────────────────────

const selectedBlockId = ref<string | null>(null)
const rightTab = ref<'props' | 'attrs'>('props')
const expandedIds = ref<Set<string>>(new Set())
const componentSearch = ref('')
const sectionSettingsOpen = ref(false)

// Panel sections open/close state (Figma-style collapsibles)
const panelOpen = reactive({
  props: true,
  image: true,
  icon: true,
  typo: true,
  layout: true,
  spacing: false,
  fill: false,
  effects: false,
  border: false,
})

const newAttrKey = ref('')
const newAttrVal = ref('')

// Working copies (deep clones — all reactive, shared between canvas and inputs)
const workingBlocks = ref<BlockDefinition[]>([])
const workingAttrs = ref<Record<string, Record<string, string>>>({})
const workingTextOverrides = ref<Record<string, string>>({})
const workingPropOverrides = ref<Record<string, Record<string, unknown>>>({})
const workingStyleOverrides = ref<Record<string, Record<string, string>>>({})
const workingSectionStyles = ref<Record<string, string>>({})
const workingWrapperStyles = ref<Record<string, string>>({})

// Initialize when opened or instance/template changes
watch(
  () => [props.open, props.instance, props.template] as const,
  ([open]) => {
    if (!open) return
    workingBlocks.value = JSON.parse(JSON.stringify(
      props.instance.customBlocks ?? props.template?.blocks ?? []
    ))
    workingAttrs.value = JSON.parse(JSON.stringify(props.instance.attrOverrides ?? {}))
    workingTextOverrides.value = JSON.parse(JSON.stringify(props.instance.textOverrides ?? {}))
    workingPropOverrides.value = JSON.parse(JSON.stringify(props.instance.propOverrides ?? {}))
    workingStyleOverrides.value = JSON.parse(JSON.stringify(props.instance.styleOverrides ?? {}))
    workingSectionStyles.value = JSON.parse(JSON.stringify(props.instance.sectionStyles ?? {}))
    workingWrapperStyles.value = JSON.parse(JSON.stringify(props.instance.wrapperStyles ?? {
      maxWidth: '1200px',
    }))
    selectedBlockId.value = null
    // Auto-expand all top-level blocks
    const ids = new Set<string>()
    workingBlocks.value.forEach((b) => { if (b.children?.length) ids.add(b.id) })
    expandedIds.value = ids
  },
  { immediate: true },
)

// ─── Block tree helpers ────────────────────────────────────────────────────────

function toggleExpand(blockId: string) {
  const s = new Set(expandedIds.value)
  if (s.has(blockId)) s.delete(blockId)
  else s.add(blockId)
  expandedIds.value = s
}

function findBlock(blocks: BlockDefinition[], id: string): BlockDefinition | null {
  for (const b of blocks) {
    if (b.id === id) return b
    if (b.children?.length) {
      const found = findBlock(b.children, id)
      if (found) return found
    }
  }
  return null
}

function deleteBlock(blocks: BlockDefinition[], id: string): BlockDefinition[] {
  return blocks
    .filter((b) => b.id !== id)
    .map((b) => ({
      ...b,
      children: b.children ? deleteBlock(b.children, id) : undefined,
    }))
}

function onDeleteBlock(blockId: string) {
  workingBlocks.value = deleteBlock(workingBlocks.value, blockId)
  if (selectedBlockId.value === blockId) selectedBlockId.value = null
}

function renameBlockInTree(blocks: BlockDefinition[], id: string, label: string): BlockDefinition[] {
  return blocks.map((b) => {
    if (b.id === id) return { ...b, meta: { ...b.meta, label } }
    if (b.children?.length) return { ...b, children: renameBlockInTree(b.children, id, label) }
    return b
  })
}

function onRenameBlock(payload: { blockId: string; label: string }) {
  workingBlocks.value = renameBlockInTree(workingBlocks.value, payload.blockId, payload.label)
}

// ─── Move block (drag & drop) ─────────────────────────────────────────────────

function extractBlock(
  blocks: BlockDefinition[],
  id: string,
): { extracted: BlockDefinition | null; remaining: BlockDefinition[] } {
  let extracted: BlockDefinition | null = null
  const remaining = blocks
    .filter((b) => {
      if (b.id === id) { extracted = b; return false }
      return true
    })
    .map((b) => {
      if (b.children?.length) {
        const res = extractBlock(b.children, id)
        if (res.extracted) {
          extracted = res.extracted
          return { ...b, children: res.remaining }
        }
      }
      return b
    })
  return { extracted, remaining }
}

function insertBlock(
  blocks: BlockDefinition[],
  targetId: string,
  block: BlockDefinition,
  position: 'before' | 'after' | 'inside',
): BlockDefinition[] {
  const result: BlockDefinition[] = []
  for (const b of blocks) {
    if (b.id === targetId) {
      if (position === 'before') {
        result.push(block, b)
      } else if (position === 'after') {
        result.push(b, block)
      } else {
        // inside — append as last child
        result.push({ ...b, children: [...(b.children ?? []), block] })
      }
    } else {
      result.push(
        b.children?.length
          ? { ...b, children: insertBlock(b.children, targetId, block, position) }
          : b,
      )
    }
  }
  return result
}

function isDescendant(blocks: BlockDefinition[], ancestorId: string, childId: string): boolean {
  for (const b of blocks) {
    if (b.id === ancestorId) {
      return !!findBlock(b.children ?? [], childId)
    }
    if (b.children?.length && isDescendant(b.children, ancestorId, childId)) return true
  }
  return false
}

function onMoveBlock(payload: { dragId: string; targetId: string; position: 'before' | 'after' | 'inside' }) {
  const { dragId, targetId, position } = payload
  if (dragId === targetId) return
  // Prevent dropping a block inside one of its own descendants
  if (position === 'inside' && isDescendant(workingBlocks.value, dragId, targetId)) return
  const { extracted, remaining } = extractBlock(workingBlocks.value, dragId)
  if (!extracted) return
  workingBlocks.value = insertBlock(remaining, targetId, extracted, position)
  // Auto-expand target when dropping inside
  if (position === 'inside') {
    const s = new Set(expandedIds.value)
    s.add(targetId)
    expandedIds.value = s
  }
}

// ─── Selected block ───────────────────────────────────────────────────────────

const selectedBlock = computed<BlockDefinition | null>(() => {
  if (!selectedBlockId.value) return null
  return findBlock(workingBlocks.value, selectedBlockId.value)
})

const selectedBlockLabel = computed(() =>
  selectedBlock.value?.meta?.label ?? selectedBlock.value?.type ?? ''
)

const editableProps = computed<EditableProp[]>(() => {
  if (!selectedBlock.value) return []
  const resolved = resolveEditableProps(selectedBlock.value.type, selectedBlock.value.meta?.editableProps)
  // Auto-inject text content prop if the block has text and no 'text' key already
  if (selectedBlock.value.text !== undefined && !resolved.some((p) => p.key === 'text')) {
    return [{ key: 'text', label: 'Contenu', type: 'textarea', default: '' }, ...resolved]
  }
  return resolved
})


function getTextValue(): string {
  if (!selectedBlockId.value) return ''
  return workingTextOverrides.value[selectedBlockId.value]
    ?? selectedBlock.value?.text
    ?? ''
}

function getPropValue(key: string, defaultValue: unknown): unknown {
  if (!selectedBlockId.value) return defaultValue
  return workingPropOverrides.value[selectedBlockId.value]?.[key]
    ?? selectedBlock.value?.props?.[key]
    ?? defaultValue
}

// ─── Prop/text update — reactive, reflected live on canvas and inputs ─────────

function onUpdateText(payload: { instanceId: string; blockId: string; text: string }) {
  workingTextOverrides.value = {
    ...workingTextOverrides.value,
    [payload.blockId]: payload.text,
  }
}

function onUpdateProp(payload: { instanceId: string; blockId: string; key: string; value: unknown }) {
  workingPropOverrides.value = {
    ...workingPropOverrides.value,
    [payload.blockId]: {
      ...(workingPropOverrides.value[payload.blockId] ?? {}),
      [payload.key]: payload.value,
    },
  }
}

// ─── Style overrides (typography) ────────────────────────────────────────────

const FONT_FAMILIES = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Raleway',
  'Playfair Display', 'Merriweather', 'Source Sans Pro',
  'System UI', 'Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Courier New',
]

const FONT_WEIGHTS = [
  { label: 'Thin', value: '100' },
  { label: 'Extra Light', value: '200' },
  { label: 'Light', value: '300' },
  { label: 'Regular', value: '400' },
  { label: 'Medium', value: '500' },
  { label: 'Semi Bold', value: '600' },
  { label: 'Bold', value: '700' },
  { label: 'Extra Bold', value: '800' },
  { label: 'Black', value: '900' },
]

const isTextBlock = computed(() =>
  selectedBlock.value !== null &&
  (selectedBlock.value.text !== undefined ||
    selectedBlock.value.type === 'vf-text' ||
    selectedBlock.value.type === 'vf-heading')
)

const isImageBlock = computed(() => selectedBlock.value?.type === 'vf-img')
const isIconBlock  = computed(() => selectedBlock.value?.type === 'vf-icon')

// ─── Image helpers ────────────────────────────────────────────────────────────

const imageFileInputRef = ref<HTMLInputElement | null>(null)

function pickImageFile() {
  imageFileInputRef.value?.click()
}

function onImageFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file || !selectedBlockId.value) return
  const reader = new FileReader()
  reader.onload = () => {
    onUpdateProp({ instanceId: props.instance.instanceId, blockId: selectedBlockId.value!, key: 'src', value: reader.result as string })
  }
  reader.readAsDataURL(file)
  // Reset so same file can be re-selected
  ;(e.target as HTMLInputElement).value = ''
}

// ─── Icon helpers ─────────────────────────────────────────────────────────────

const iconSearch = ref('')

const filteredIconNames = computed(() => {
  const q = iconSearch.value.toLowerCase()
  return Object.keys(ICON_PATHS).filter((name) => !q || name.includes(q))
})

// ─── Computed DOM styles (fallback — reads actual values from CSS classes) ────

const computedBlockStyles = ref<Record<string, string>>({})
// Declared CSS styles read from stylesheets — preserves original units (rem/em/%)
const declaredBlockStyles = ref<Record<string, string>>({})

// Properties we care about snapshotting from getComputedStyle
// Dimensions (width/height) are intentionally excluded: getComputedStyle always
// returns a pixel value even for auto elements, which would be misleading.
const COMPUTED_PROPS = [
  'paddingTop','paddingRight','paddingBottom','paddingLeft',
  'marginTop','marginRight','marginBottom','marginLeft',
  'display','flexDirection','flexWrap','justifyContent','alignItems','gap','columnGap','rowGap',
  'fontSize','fontWeight','fontFamily','lineHeight','letterSpacing','color','textAlign',
  'backgroundColor',
  'borderRadius','borderTopLeftRadius','borderTopRightRadius','borderBottomLeftRadius','borderBottomRightRadius',
  'borderWidth','borderStyle','borderColor',
  'opacity','boxShadow','backdropFilter',
] as const

// Values to ignore — browser defaults that aren't user-set
const COMPUTED_IGNORE = new Set(['none','normal','auto','0px','0','rgba(0, 0, 0, 0)',''])

function cssPropToCamel (hyphen: string): string {
  return hyphen.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
}

/** Read all matching CSS rules for `el` from loaded stylesheets (preserves rem/em/%). */
function snapshotDeclaredStyles (el: HTMLElement) {
  const snap: Record<string, string> = {}
  try {
    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRuleList
      try { rules = sheet.cssRules } catch { continue }
      for (const rule of Array.from(rules)) {
        if (!(rule instanceof CSSStyleRule)) continue
        try { if (!el.matches(rule.selectorText)) continue } catch { continue }
        const style = rule.style
        for (let i = 0; i < style.length; i++) {
          const hyphenProp = style[i]
          const val = style.getPropertyValue(hyphenProp).trim()
          if (val) snap[cssPropToCamel(hyphenProp)] = val
        }
      }
    }
  } catch { /* cross-origin sheets */ }
  declaredBlockStyles.value = snap
}

function snapshotComputedStyles() {
  computedBlockStyles.value = {}
  declaredBlockStyles.value = {}
  if (!selectedBlockId.value) return
  nextTick(() => {
    const el = document.querySelector(`[data-vf-block-id="${selectedBlockId.value}"]`) as HTMLElement | null
    if (!el) return
    // 1. Declared CSS rules (original units)
    snapshotDeclaredStyles(el)
    // 2. Computed styles (px fallback for non-spacing props)
    const cs = window.getComputedStyle(el)
    const snap: Record<string, string> = {}
    for (const p of COMPUTED_PROPS) {
      const v = cs[p as keyof CSSStyleDeclaration] as string
      if (v && !COMPUTED_IGNORE.has(v)) snap[p] = v
    }
    computedBlockStyles.value = snap
  })
}

function getStyleValue (prop: string, defaultValue = ''): string {
  if (!selectedBlockId.value) return defaultValue
  // 1. Explicit user override
  const override = workingStyleOverrides.value[selectedBlockId.value]?.[prop]
  if (override !== undefined && override !== '') return override
  // 2. Block template inline style
  const tpl = selectedBlock.value?.style?.[prop]
  if (tpl !== undefined && tpl !== '') return tpl
  // 3. Declared CSS rules (original units — rem/em/% preserved)
  const declared = declaredBlockStyles.value[prop]
  if (declared !== undefined && declared !== '') return declared
  // 4. Computed style from DOM (px values for non-spacing props)
  const computed = computedBlockStyles.value[prop]
  if (computed !== undefined && computed !== '') return computed
  return defaultValue
}

function setStyleValue (prop: string, value: string) {
  if (!selectedBlockId.value) return
  workingStyleOverrides.value = {
    ...workingStyleOverrides.value,
    [selectedBlockId.value]: {
      ...(workingStyleOverrides.value[selectedBlockId.value] ?? {}),
      [prop]: value,
    },
  }
}

function toggleBold () {
  setStyleValue('fontWeight', isBold.value ? '400' : '700')
}

function toggleItalic () {
  setStyleValue('fontStyle', getStyleValue('fontStyle') === 'italic' ? 'normal' : 'italic')
}

function toggleDecoration (deco: 'underline' | 'line-through') {
  const current = getStyleValue('textDecoration', '')
  const parts = current ? current.split(' ').filter(Boolean) : []
  const idx = parts.indexOf(deco)
  if (idx >= 0) parts.splice(idx, 1)
  else parts.push(deco)
  setStyleValue('textDecoration', parts.join(' '))
}

function parsePx (val: string): string {
  const n = parseFloat(val)
  return isNaN(n) ? '' : String(n)
}

// ─── Spacing modes ────────────────────────────────────────────────────────────

type SpacingMode = 'all' | 'axial' | 'individual'
const paddingMode  = ref<SpacingMode>('individual')
const marginMode   = ref<SpacingMode>('individual')
const radiusLinked = ref(true)

/** Normalize a CSS length: bare number → append 'px'; otherwise keep as-is */
function normalizeCssLen(val: string): string {
  const t = val.trim()
  return /^-?\d+(\.\d+)?$/.test(t) ? t + 'px' : t
}

function setSpacingAll(type: 'padding' | 'margin', val: string) {
  const sides: ('Top' | 'Right' | 'Bottom' | 'Left')[] = ['Top', 'Right', 'Bottom', 'Left']
  setStyleValue(type, '')
  const css = normalizeCssLen(val)
  sides.forEach(s => setStyleValue(type + s, css))
}

function setSpacingInline(type: 'padding' | 'margin', val: string) {
  const css = normalizeCssLen(val)
  setStyleValue(type + 'Left', css)
  setStyleValue(type + 'Right', css)
}

function setSpacingBlock(type: 'padding' | 'margin', val: string) {
  const css = normalizeCssLen(val)
  setStyleValue(type + 'Top', css)
  setStyleValue(type + 'Bottom', css)
}

// ─── Style helpers ────────────────────────────────────────────────────────────

/** Get numeric px value from style (strips 'px') */
function getStyleNum (prop: string, def = 0): number {
  const v = getStyleValue(prop, '')
  const n = parseFloat(v)
  return isNaN(n) ? def : n
}

/** Set px value — handles empty string as '0px' */
function setStylePx (prop: string, raw: string) {
  const n = parseFloat(raw)
  setStyleValue(prop, isNaN(n) ? '0px' : n + 'px')
}

/** Parse one side from a CSS spacing shorthand (1–4 values) */
function parseShorthand (shorthand: string, side: 'Top' | 'Right' | 'Bottom' | 'Left'): string {
  const parts = shorthand.trim().split(/\s+/)
  const idx = { Top: 0, Right: 1, Bottom: 2, Left: 3 }[side]
  if (parts.length === 1) return parts[0]
  if (parts.length === 2) return idx === 0 || idx === 2 ? parts[0] : parts[1]
  if (parts.length === 3) {
    if (idx === 0) return parts[0]
    if (idx === 2) return parts[2]
    return parts[1]
  }
  return parts[idx] ?? parts[0]
}

/** Get a spacing side value as a CSS string (e.g. "1rem", "16px").
 *  Priority: user override → template style → declared CSS shorthand/individual → computed (px). */
function getSpacingVal (type: 'padding' | 'margin', side: 'Top' | 'Right' | 'Bottom' | 'Left'): string {
  const id = selectedBlockId.value
  if (!id) return ''
  // 1. User override — individual side
  const ovIndiv = workingStyleOverrides.value[id]?.[`${type}${side}`]
  if (ovIndiv !== undefined && ovIndiv !== '') return ovIndiv
  // 2. User override — shorthand
  const ovShort = workingStyleOverrides.value[id]?.[type]
  if (ovShort !== undefined && ovShort !== '') return parseShorthand(ovShort, side)
  // 3. Template inline style — individual side
  const tplIndiv = selectedBlock.value?.style?.[`${type}${side}`]
  if (tplIndiv !== undefined && tplIndiv !== '') return tplIndiv
  // 4. Template inline style — shorthand
  const tplShort = selectedBlock.value?.style?.[type]
  if (tplShort !== undefined && tplShort !== '') return parseShorthand(tplShort, side)
  // 5. Declared CSS shorthand (preserves rem/em — e.g. DaisyUI `padding: 1rem`)
  const declShort = declaredBlockStyles.value[type]
  if (declShort) return parseShorthand(declShort, side)
  // 6. Declared CSS individual side
  const declIndiv = declaredBlockStyles.value[`${type}${side}`]
  if (declIndiv && !COMPUTED_IGNORE.has(declIndiv)) return declIndiv
  // 7. Computed (px values — last resort)
  const comp = computedBlockStyles.value[`${type}${side}`]
  if (comp && !COMPUTED_IGNORE.has(comp)) return comp
  return ''
}

/** Set padding or margin for a given side.
 *  Bare numbers are treated as px. Automatically expands shorthands. */
function setSpacing (type: 'padding' | 'margin', side: string, val: string) {
  const shorthand = getStyleValue(type, '')
  if (shorthand) {
    const allSides: ('Top' | 'Right' | 'Bottom' | 'Left')[] = ['Top', 'Right', 'Bottom', 'Left']
    allSides.forEach(s => {
      if (!getStyleValue(`${type}${s}`, '')) {
        setStyleValue(`${type}${s}`, parseShorthand(shorthand, s))
      }
    })
    setStyleValue(type, '')
  }
  setStyleValue(type + side, normalizeCssLen(val))
}

/** Set all border-radius corners to same value */
function setRadiusAll (val: string) {
  setStylePx('borderRadius', val)
}

// ─── Background state ─────────────────────────────────────────────────────────

type BgMode = 'none' | 'color' | 'gradient' | 'image'
interface GradientStop { color: string; position: number }

const bgMode       = ref<BgMode>('none')
const gradType     = ref<'linear' | 'radial' | 'conic'>('linear')
const gradAngle    = ref(135)
const gradStops    = ref<GradientStop[]>([{ color: '#6366f1', position: 0 }, { color: '#8b5cf6', position: 100 }])
const bgImgUrl     = ref('')
const bgSize       = ref('cover')
const bgPos        = ref('center')
const bgRepeat     = ref('no-repeat')
const bgOverlay    = ref(false)
const bgOverlayCol = ref('rgba(0,0,0,0.4)')

// ─── Effects state ────────────────────────────────────────────────────────────

const fxEnabled    = ref(false)
const fxBlur       = ref(0)
const fxBrightness = ref(100)
const fxSaturate   = ref(100)
const fxContrast   = ref(100)

// ─── Gradient builder ─────────────────────────────────────────────────────────

const builtGradient = computed(() => {
  const stops = [...gradStops.value]
    .sort((a, b) => a.position - b.position)
    .map(s => `${s.color} ${s.position}%`)
    .join(', ')
  if (gradType.value === 'linear')  return `linear-gradient(${gradAngle.value}deg, ${stops})`
  if (gradType.value === 'radial')  return `radial-gradient(circle at center, ${stops})`
  return `conic-gradient(from ${gradAngle.value}deg at center, ${stops})`
})

function addGradStop () {
  const last = gradStops.value[gradStops.value.length - 1]
  gradStops.value = [...gradStops.value, { color: last?.color ?? '#ffffff', position: Math.min(100, (last?.position ?? 50) + 20) }]
  applyBackground()
}
function removeGradStop (i: number) {
  if (gradStops.value.length <= 2) return
  gradStops.value = gradStops.value.filter((_, idx) => idx !== i)
  applyBackground()
}
function updateGradStop (i: number, key: 'color' | 'position', val: string | number) {
  const stops = [...gradStops.value]
  stops[i] = { ...stops[i], [key]: key === 'position' ? Number(val) : val }
  gradStops.value = stops
  applyBackground()
}

// ─── Background apply / parse ─────────────────────────────────────────────────

function applyBackground () {
  if (!selectedBlockId.value) return
  if (bgMode.value === 'none') {
    setStyleValue('backgroundColor', '')
    setStyleValue('backgroundImage', '')
    setStyleValue('backgroundSize', '')
    setStyleValue('backgroundPosition', '')
    setStyleValue('backgroundRepeat', '')
  } else if (bgMode.value === 'color') {
    setStyleValue('backgroundImage', '')
    setStyleValue('backgroundSize', '')
    setStyleValue('backgroundPosition', '')
    setStyleValue('backgroundRepeat', '')
  } else if (bgMode.value === 'gradient') {
    setStyleValue('backgroundImage', builtGradient.value)
    setStyleValue('backgroundColor', '')
    setStyleValue('backgroundSize', '')
    setStyleValue('backgroundPosition', '')
    setStyleValue('backgroundRepeat', '')
  } else if (bgMode.value === 'image') {
    const layers: string[] = []
    if (bgOverlay.value && bgOverlayCol.value) {
      layers.push(`linear-gradient(${bgOverlayCol.value}, ${bgOverlayCol.value})`)
    }
    if (bgImgUrl.value) layers.push(`url("${bgImgUrl.value}")`)
    setStyleValue('backgroundImage', layers.join(', '))
    setStyleValue('backgroundSize', bgSize.value)
    setStyleValue('backgroundPosition', bgPos.value)
    setStyleValue('backgroundRepeat', bgRepeat.value)
  }
}

function applyEffects () {
  if (!selectedBlockId.value) return
  if (!fxEnabled.value) {
    setStyleValue('backdropFilter', '')
    setStyleValue('WebkitBackdropFilter', '')
    return
  }
  const parts: string[] = []
  if (fxBlur.value > 0)         parts.push(`blur(${fxBlur.value}px)`)
  if (fxBrightness.value !== 100) parts.push(`brightness(${fxBrightness.value / 100})`)
  if (fxSaturate.value !== 100)   parts.push(`saturate(${fxSaturate.value / 100})`)
  if (fxContrast.value !== 100)   parts.push(`contrast(${fxContrast.value / 100})`)
  const val = parts.length ? parts.join(' ') : 'none'
  setStyleValue('backdropFilter', val)
  setStyleValue('WebkitBackdropFilter', val)
}

function initBgState () {
  const bgImg   = getStyleValue('backgroundImage', '')
  const bdFilter = getStyleValue('backdropFilter', '') || getStyleValue('WebkitBackdropFilter', '')

  if (!bgImg) {
    bgMode.value = 'none'
  } else if (bgImg.includes('url(')) {
    bgMode.value = 'image'
    const urlMatch = bgImg.match(/url\(["']?([^"')]+)["']?\)/)
    bgImgUrl.value   = urlMatch ? urlMatch[1] : ''
    bgOverlay.value  = bgImg.includes('linear-gradient') && bgImg.includes('url(')
    if (bgOverlay.value) {
      const ovMatch = bgImg.match(/linear-gradient\(([^,)]+)/)
      if (ovMatch) bgOverlayCol.value = ovMatch[1].trim()
    }
    bgSize.value   = getStyleValue('backgroundSize', 'cover')
    bgPos.value    = getStyleValue('backgroundPosition', 'center')
    bgRepeat.value = getStyleValue('backgroundRepeat', 'no-repeat')
  } else if (/^(linear|radial|conic)-gradient/.test(bgImg)) {
    bgMode.value = 'gradient'
    if (bgImg.startsWith('linear-gradient')) {
      gradType.value = 'linear'
      const m = bgImg.match(/linear-gradient\((\d+)deg/)
      if (m) gradAngle.value = parseInt(m[1])
    } else if (bgImg.startsWith('radial-gradient')) {
      gradType.value = 'radial'
    } else {
      gradType.value = 'conic'
      const m = bgImg.match(/conic-gradient\(from (\d+)deg/)
      if (m) gradAngle.value = parseInt(m[1])
    }
  } else {
    bgMode.value = 'none'
  }

  // set color mode if only backgroundColor is set
  if (bgMode.value === 'none' && getStyleValue('backgroundColor', '')) bgMode.value = 'color'

  // parse backdrop-filter
  if (bdFilter && bdFilter !== 'none') {
    fxEnabled.value = true
    const mBlur  = bdFilter.match(/blur\(([\d.]+)px\)/)
    const mBri   = bdFilter.match(/brightness\(([\d.]+)\)/)
    const mSat   = bdFilter.match(/saturate\(([\d.]+)\)/)
    const mCon   = bdFilter.match(/contrast\(([\d.]+)\)/)
    fxBlur.value       = mBlur  ? parseFloat(mBlur[1])  : 0
    fxBrightness.value = mBri   ? Math.round(parseFloat(mBri[1]) * 100) : 100
    fxSaturate.value   = mSat   ? Math.round(parseFloat(mSat[1]) * 100) : 100
    fxContrast.value   = mCon   ? Math.round(parseFloat(mCon[1]) * 100) : 100
  } else {
    fxEnabled.value = false; fxBlur.value = 0; fxBrightness.value = 100; fxSaturate.value = 100; fxContrast.value = 100
  }
}

watch(selectedBlockId, () => {
  paddingMode.value = 'individual'
  marginMode.value  = 'individual'
  computedBlockStyles.value = {}
  declaredBlockStyles.value = {}
  nextTick(() => {
    snapshotComputedStyles()
    initBgState()
    initBoxShadow()
  })
})

// ─── Typography constants ─────────────────────────────────────────────────────

const ALIGN_ICONS: Record<string, string> = {
  left:    'M4 6h16M4 10h10M4 14h16M4 18h10',
  center:  'M4 6h16M7 10h10M4 14h16M7 18h10',
  right:   'M4 6h16M10 10h10M4 14h16M10 18h10',
  justify: 'M4 6h16M4 10h16M4 14h16M4 18h16',
}

const isBold = computed(() => {
  const w = getStyleValue('fontWeight', '400')
  return w === 'bold' || parseInt(w) >= 700
})

// ─── HTML Attributes ──────────────────────────────────────────────────────────

const QUICK_ATTRS = ['id', 'class', 'aria-label', 'aria-hidden', 'role', 'tabindex', 'title', 'data-section']

const currentBlockAttrs = computed<Record<string, string>>(() => {
  if (!selectedBlockId.value) return {}
  return workingAttrs.value[selectedBlockId.value] ?? {}
})

function setAttr(key: string, value: string) {
  if (!selectedBlockId.value) return
  if (!workingAttrs.value[selectedBlockId.value]) workingAttrs.value[selectedBlockId.value] = {}
  workingAttrs.value[selectedBlockId.value][key] = value
}

function removeAttr(key: string) {
  if (!selectedBlockId.value) return
  const blockAttrs = workingAttrs.value[selectedBlockId.value]
  if (blockAttrs) delete blockAttrs[key]
}

function addQuickAttr(attr: string) {
  setAttr(attr, '')
}

function addCustomAttr() {
  if (!newAttrKey.value.trim()) return
  setAttr(newAttrKey.value.trim(), newAttrVal.value)
  newAttrKey.value = ''
  newAttrVal.value = ''
}

// ─── Add component ────────────────────────────────────────────────────────────

const BUILTIN_COMPONENTS: Array<{
  type: string
  label: string
  icon: string
  defaultStyle?: Record<string, string>
  defaultProps?: Record<string, unknown>
  defaultText?: string
  editableProps?: EditableProp[]
}> = [
  {
    type: 'vf-box',
    label: 'Box',
    icon: '□',
  },
  {
    type: 'vf-heading',
    label: 'Heading',
    icon: 'H',
    defaultText: 'Votre titre ici',
    defaultProps: { tag: 'h2' },
    editableProps: [
      {
        key: 'tag',
        label: 'Niveau',
        type: 'select',
        default: 'h2',
        options: [
          { value: 'h1', label: 'H1 — Titre principal' },
          { value: 'h2', label: 'H2 — Titre de section' },
          { value: 'h3', label: 'H3 — Sous-titre' },
          { value: 'h4', label: 'H4' },
          { value: 'h5', label: 'H5' },
          { value: 'h6', label: 'H6' },
        ],
      },
    ],
  },
  {
    type: 'vf-text',
    label: 'Text',
    icon: 'T',
    defaultText: 'Votre texte ici',
    defaultProps: { tag: 'p' },
    editableProps: [
      {
        key: 'tag',
        label: 'Balise HTML',
        type: 'select',
        default: 'p',
        options: [
          { value: 'p', label: 'p — Paragraphe' },
          { value: 'span', label: 'span — En ligne' },
          { value: 'div', label: 'div — Bloc' },
          { value: 'strong', label: 'strong — Gras sémantique' },
          { value: 'em', label: 'em — Italique sémantique' },
        ],
      },
    ],
  },
  {
    type: 'vf-img',
    label: 'Image',
    icon: '🖼',
    defaultProps: { src: '', alt: '' },
    defaultStyle: { width: '100%', height: 'auto', objectFit: 'cover' },
  },
  {
    type: 'vf-icon',
    label: 'Icône',
    icon: '★',
    defaultProps: { name: 'star', size: 32, color: 'currentColor' },
  },
]

const humanizeType = (type: string): string =>
  GENERIC_COMPONENT_LABELS[type as keyof typeof GENERIC_COMPONENT_LABELS]
    ?? type.replace(/^vf-/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

const availableComponents = computed(() => {
  const map = props.adapter.componentMap
  const adapterComps = Object.entries(map).map(([type, def]) => ({
    type,
    label: (def as { label?: string }).label ?? humanizeType(type),
    builtin: false,
  }))
  // Exclude builtins whose type is already provided by the active DS adapter
  const adapterTypes = new Set(Object.keys(map))
  const builtins = BUILTIN_COMPONENTS
    .filter((c) => !adapterTypes.has(c.type))
    .map((c) => ({ type: c.type, label: c.label, builtin: true }))
  return [...builtins, ...adapterComps.sort((a, b) => a.label.localeCompare(b.label))]
})

const filteredComponents = computed(() => {
  const q = componentSearch.value.toLowerCase().trim()
  if (!q) return availableComponents.value
  return availableComponents.value.filter((c) =>
    c.type.toLowerCase().includes(q) || c.label.toLowerCase().includes(q)
  )
})

function countBlocksOfType(blocks: BlockDefinition[], type: string): number {
  let n = 0
  for (const b of blocks) {
    if (b.type === type) n++
    if (b.children?.length) n += countBlocksOfType(b.children, type)
  }
  return n
}

function onAddBlock(type: string) {
  const builtin = BUILTIN_COMPONENTS.find((c) => c.type === type)
  const adapterDef = props.adapter.componentMap[type as keyof typeof props.adapter.componentMap]
  const baseName = builtin?.label ?? (adapterDef as { label?: string } | undefined)?.label ?? humanizeType(type)
  const count = countBlocksOfType(workingBlocks.value, type) + 1
  const label = `${baseName} ${count}`

  const newBlock: BlockDefinition = {
    id: `block-${Date.now()}`,
    type: type as BlockDefinition['type'],
    text: builtin?.defaultText ?? '',
    props: builtin?.defaultProps ?? {},
    meta: { label, editableProps: builtin?.editableProps },
  }
  workingBlocks.value = [...workingBlocks.value, newBlock]

  if (builtin?.defaultStyle && Object.keys(builtin.defaultStyle).length) {
    workingStyleOverrides.value = {
      ...workingStyleOverrides.value,
      [newBlock.id]: { ...builtin.defaultStyle },
    }
  }

  selectedBlockId.value = newBlock.id
}

// ─── Save ─────────────────────────────────────────────────────────────────────

function onSave() {
  emit('save', {
    instance: props.instance,
    customBlocks: JSON.parse(JSON.stringify(workingBlocks.value)),
    attrOverrides: JSON.parse(JSON.stringify(workingAttrs.value)),
    textOverrides: JSON.parse(JSON.stringify(workingTextOverrides.value)),
    propOverrides: JSON.parse(JSON.stringify(workingPropOverrides.value)),
    styleOverrides: JSON.parse(JSON.stringify(workingStyleOverrides.value)),
    sectionStyles: JSON.parse(JSON.stringify(workingSectionStyles.value)),
    wrapperStyles: JSON.parse(JSON.stringify(workingWrapperStyles.value)),
  })
}

// ─── Color popup ──────────────────────────────────────────────────────────────
const colorPopupKey = ref<string | null>(null)

function onRightPanelClick() { colorPopupKey.value = null }

// ─── Display / layout helpers ─────────────────────────────────────────────────
const currentDisplay = computed(() => getStyleValue('display', ''))
const isFlex = computed(() => currentDisplay.value.includes('flex'))
const flexDir = computed(() => getStyleValue('flexDirection', 'row'))
const isFlexRow = computed(() => !flexDir.value.includes('column'))

const DISPLAY_MODES = [
  {
    value: 'block', label: 'Block',
    icon: 'M3 5h18M3 12h18M3 19h18',
  },
  {
    value: 'flex', label: 'Flex',
    icon: 'M3 12h18M9 6l-6 6 6 6M15 6l6 6-6 6',
  },
  {
    value: 'grid', label: 'Grid',
    icon: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  },
  {
    value: 'inline-flex', label: 'Inline Flex',
    icon: 'M8 5H5a2 2 0 00-2 2v10a2 2 0 002 2h3M16 5h3a2 2 0 012 2v10a2 2 0 01-2 2h-3M8 12h8',
  },
]

interface AlignCell { key: string; justify: string; align: string; label: string; cx: number; cy: number }

const ALIGN_CELLS: AlignCell[] = [
  { key: 'tl', justify: 'flex-start', align: 'flex-start', label: 'Haut gauche',   cx: 3,  cy: 3  },
  { key: 'tc', justify: 'center',     align: 'flex-start', label: 'Haut centre',   cx: 7,  cy: 3  },
  { key: 'tr', justify: 'flex-end',   align: 'flex-start', label: 'Haut droite',   cx: 11, cy: 3  },
  { key: 'ml', justify: 'flex-start', align: 'center',     label: 'Milieu gauche', cx: 3,  cy: 7  },
  { key: 'mc', justify: 'center',     align: 'center',     label: 'Centre',        cx: 7,  cy: 7  },
  { key: 'mr', justify: 'flex-end',   align: 'center',     label: 'Milieu droite', cx: 11, cy: 7  },
  { key: 'bl', justify: 'flex-start', align: 'flex-end',   label: 'Bas gauche',    cx: 3,  cy: 11 },
  { key: 'bc', justify: 'center',     align: 'flex-end',   label: 'Bas centre',    cx: 7,  cy: 11 },
  { key: 'br', justify: 'flex-end',   align: 'flex-end',   label: 'Bas droite',    cx: 11, cy: 11 },
]

// Distribution values (space-between / space-around / space-evenly)
// SVG: container lines + 3 item rects at x positions [left, center, right]
const DISTRIB_VALUES = [
  { value: 'space-between', label: 'Space between', lines: 'M0.5 2v10M13.5 2v10', rects: [1,   6,   11  ] },
  { value: 'space-around',  label: 'Space around',  lines: 'M0.5 2v10M13.5 2v10', rects: [2,   6,   10  ] },
  { value: 'space-evenly',  label: 'Space evenly',  lines: 'M0.5 2v10M13.5 2v10', rects: [2.5, 6,   9.5 ] },
]

const DISTRIB_SET = new Set(DISTRIB_VALUES.map((d) => d.value))

function isAlignCellActive(cell: AlignCell): boolean {
  const jc = getStyleValue('justifyContent', '')
  // Distribution active → no 3×3 cell highlighted (distribution button takes over)
  if (DISTRIB_SET.has(jc)) return false
  const ai = getStyleValue('alignItems', '')
  return isFlexRow.value
    ? jc === cell.justify && ai === cell.align
    : ai === cell.justify && jc === cell.align
}

function setAlignCell(cell: AlignCell) {
  if (isFlexRow.value) {
    setStyleValue('justifyContent', cell.justify)
    setStyleValue('alignItems', cell.align)
  } else {
    setStyleValue('alignItems', cell.justify)
    setStyleValue('justifyContent', cell.align)
  }
}

// ─── Box shadow state ─────────────────────────────────────────────────────────
const shadowEnabled = ref(false)
const shadowX      = ref(0)
const shadowY      = ref(4)
const shadowBlur   = ref(8)
const shadowSpread = ref(0)
const shadowColor  = ref('rgba(0,0,0,0.15)')
const shadowInner  = ref(false)

function applyBoxShadow() {
  if (!selectedBlockId.value) return
  if (!shadowEnabled.value) { setStyleValue('boxShadow', ''); return }
  const inset = shadowInner.value ? 'inset ' : ''
  setStyleValue('boxShadow', `${inset}${shadowX.value}px ${shadowY.value}px ${shadowBlur.value}px ${shadowSpread.value}px ${shadowColor.value}`)
}

function initBoxShadow() {
  const bs = getStyleValue('boxShadow', '')
  if (!bs || bs === 'none') { shadowEnabled.value = false; return }
  shadowEnabled.value = true
  shadowInner.value   = bs.includes('inset')
  const clean = bs.replace('inset', '').trim()
  const nums  = clean.match(/-?\d+(?:\.\d+)?px/g) ?? []
  shadowX.value      = parseFloat(nums[0] ?? '0')
  shadowY.value      = parseFloat(nums[1] ?? '4')
  shadowBlur.value   = parseFloat(nums[2] ?? '8')
  shadowSpread.value = parseFloat(nums[3] ?? '0')
  const colMatch = clean.match(/(rgba?\([^)]+\)|hsla?\([^)]+\)|#[0-9a-fA-F]{3,8})/)
  shadowColor.value = colMatch ? colMatch[0] : 'rgba(0,0,0,0.15)'
}

// ─── Container mode (centered / full width) ───────────────────────────────────

const isCentered = computed(() => !!workingWrapperStyles.value.maxWidth)

function setContainerMode(mode: 'centered' | 'full') {
  if (mode === 'centered') {
    workingWrapperStyles.value = {
      ...workingWrapperStyles.value,
      maxWidth: workingWrapperStyles.value.maxWidth || '1200px',
    }
  } else {
    const { maxWidth, ...rest } = workingWrapperStyles.value
    void maxWidth
    workingWrapperStyles.value = rest
  }
}


</script>

<style lang="scss">
// Global styles (not scoped) for the overlay since it uses Teleport
.vf-se-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
  font-family: 'Inter', system-ui, sans-serif;
}

// ─── Header ───────────────────────────────────────────────────────────────────
.vf-se-header {
  display: flex; align-items: center; justify-content: space-between;
  height: 52px; padding: 0 16px;
  background: #1a1b23; border-bottom: 1px solid #2d2e3a;
  flex-shrink: 0;

  &__left { display: flex; align-items: center; gap: 10px; min-width: 0; }
  &__right { display: flex; align-items: center; gap: 8px; }

  &__back {
    display: flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border: 1px solid rgba(255,255,255,0.12);
    background: transparent; border-radius: 6px; color: rgba(255,255,255,0.6);
    cursor: pointer; outline: none; transition: all 120ms;
    &:hover { background: rgba(255,255,255,0.08); color: #fff; }
  }

  &__breadcrumb {
    display: flex; align-items: center; gap: 6px;
    font-size: 13px; color: rgba(255,255,255,0.5);
  }
  &__page { color: rgba(255,255,255,0.4); }
  &__section { color: rgba(255,255,255,0.85); font-weight: 600; }
  &__block { color: #818cf8; font-weight: 600; }

  &__cancel {
    padding: 6px 14px; border-radius: 6px; font-size: 12.5px; font-weight: 500;
    background: transparent; border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.6); cursor: pointer; outline: none; transition: all 120ms;
    font-family: inherit;
    &:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.9); }
  }

  &__save {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 16px; border-radius: 6px; font-size: 12.5px; font-weight: 600;
    background: #6366f1; border: 1px solid #6366f1; color: #fff;
    cursor: pointer; outline: none; transition: all 120ms; font-family: inherit;
    box-shadow: 0 1px 6px rgba(99,102,241,0.35);
    &:hover { background: #4f46e5; border-color: #4f46e5; box-shadow: 0 2px 12px rgba(99,102,241,0.5); }
  }
}

// ─── Body ─────────────────────────────────────────────────────────────────────
.vf-se-body {
  display: flex; flex: 1; overflow: hidden; min-height: 0;
}

// ─── Left panel ───────────────────────────────────────────────────────────────
.vf-se-left {
  width: 260px; min-width: 260px;
  background: #fff; border-right: 1px solid #e5e7eb;
  display: flex; flex-direction: column; overflow: hidden; flex-shrink: 0;

  &__header {
    display: flex; align-items: center; height: 44px; padding: 0 14px;
    background: #f8f9fa; border-bottom: 1px solid #e5e7eb; flex-shrink: 0;
  }
  &__title {
    font-size: 11px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.07em; color: #6b7280;
  }

  &__tree {
    flex: 1; min-height: 0; overflow-y: auto; padding: 6px 0;
    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-track { background: transparent; }
    &::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }
  }

  &__add-section {
    flex-shrink: 0; border-top: 1px solid #e5e7eb;
    max-height: 240px; display: flex; flex-direction: column; overflow: hidden;
  }
  &__add-header {
    display: flex; align-items: center; height: 38px; padding: 0 14px;
    background: #f8f9fa; border-bottom: 1px solid #f0f0f0; flex-shrink: 0;
  }
  &__add-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #6b7280; }
  &__add-search-wrap { position: relative; padding: 8px 10px; flex-shrink: 0; }
  &__add-search-icon { position: absolute; left: 19px; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; }
  &__add-search {
    width: 100%; padding: 5px 8px 5px 26px; background: #f9fafb; border: 1px solid #e5e7eb;
    border-radius: 5px; font-size: 12px; outline: none; box-sizing: border-box; font-family: inherit; color: #111827;
    &::placeholder { color: #9ca3af; }
    &:focus { border-color: #6366f1; }
  }
  &__add-list {
    flex: 1; min-height: 0; overflow-y: auto; padding: 0 8px 8px;
    display: flex; flex-direction: column; gap: 2px;
    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }
  }
  &__add-item {
    display: flex; align-items: center; gap: 7px; width: 100%; padding: 6px 8px;
    border: none; background: transparent; color: #374151; font-size: 12px;
    font-family: inherit; border-radius: 5px; cursor: pointer; text-align: left;
    outline: none; transition: background 120ms;
    &:hover { background: #f3f4f6; color: #111827; }
    svg { color: #9ca3af; flex-shrink: 0; }

    &--builtin {
      color: #6366f1;
      svg { color: #a5b4fc; }
      &:hover { background: #ede9fe; color: #4f46e5; }
    }
  }

  &__add-sep {
    height: 1px;
    background: #f0f0f0;
    margin: 4px 0;
  }
}

// ─── Canvas ───────────────────────────────────────────────────────────────────
.vf-se-canvas {
  flex: 1;
  min-width: 0;
  min-height: 0;
  position: relative;
  background: var(--vf-canvas-bg, #f0f2f5);
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.06) 1px, transparent 1px);
  background-size: 20px 20px;
}

.vf-se-canvas__scroll {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 28px 16px 56px;
}

.vf-se-page {
  max-width: 1280px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.08);
  border-radius: 6px; border: 1px solid #e5e7eb;
  min-height: 200px; overflow: visible;
}

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

// ─── Right panel ──────────────────────────────────────────────────────────────
.vf-se-right {
  width: 264px; min-width: 264px; background: #fff; border-left: 1px solid #e5e7eb;
  display: flex; flex-direction: column; overflow: hidden; flex-shrink: 0;

  &__tabs {
    display: flex; border-bottom: 1px solid #e5e7eb; flex-shrink: 0;
    background: #f8f9fa;
  }

  &__tab {
    flex: 1; height: 42px; border: none; background: transparent;
    font-size: 12px; font-weight: 600; font-family: inherit; cursor: pointer;
    color: #9ca3af; border-bottom: 2px solid transparent; margin-bottom: -1px;
    transition: color 150ms, border-color 150ms; outline: none;
    &:hover { color: #374151; }
    &--active { color: #6366f1; border-bottom-color: #6366f1; }
  }

  &__content {
    flex: 1; overflow-y: auto; padding: 0;
    display: flex; flex-direction: column;
    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }
  }

  &__section-settings {
    flex-shrink: 0;
    border-bottom: 1px solid #e5e7eb;
  }

  &__divider {
    height: 1px; background: #e5e7eb; flex-shrink: 0;
  }
}

.vf-se-collapse-header {
  display: flex;
  align-items: center;
  gap: 7px;
  width: 100%;
  padding: 10px 14px;
  border: none;
  background: transparent;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #6b7280;
  cursor: pointer;
  outline: none;
  font-family: inherit;
  transition: background 120ms;

  span { flex: 1; text-align: left; }
  &:hover { background: #f9fafb; }
}

.vf-se-collapse-chevron {
  color: #9ca3af;
  transition: transform 180ms;
  flex-shrink: 0;
  &--open { transform: rotate(180deg); }
}

.vf-se-collapse-body {
  padding: 0 14px 12px;
}

.vf-se-right {

  &__block-info {
    padding: 10px 12px; background: #f8f9fa; border-radius: 8px;
    border: 1px solid #e5e7eb; display: flex; flex-direction: column; gap: 2px;
  }

  &__block-type { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; }
  &__block-label { font-size: 13px; font-weight: 600; color: #111827; }

  &__empty {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 12px; padding: 32px 20px; text-align: center;
    p { font-size: 12px; color: #9ca3af; line-height: 1.6; max-width: 180px; }
  }

  &__content--padded {
    padding: 12px;
    gap: 10px;
    display: flex;
    flex-direction: column;
  }
}

// ─── Fields ───────────────────────────────────────────────────────────────────
.vf-se-field { display: flex; flex-direction: column; gap: 5px; }
.vf-se-label { font-size: 11px; font-weight: 600; color: #6b7280; letter-spacing: 0.02em; }

// Use .vf-se-overlay parent for specificity over Tailwind/DaisyUI resets
.vf-se-overlay {
  input.vf-se-input,
  textarea.vf-se-input,
  .vf-se-input {
    width: 100%; padding: 5px 8px; background: #f9fafb !important; border: 1px solid #e5e7eb !important;
    border-radius: 5px; color: #111827 !important; font-size: 12px; font-family: inherit;
    outline: none; box-sizing: border-box; transition: border-color 150ms, background 150ms;
    &::placeholder { color: #9ca3af; }
    &:focus { border-color: #6366f1 !important; background: #fff !important; }
  }

  textarea.vf-se-textarea,
  .vf-se-textarea {
    width: 100%; padding: 5px 8px; background: #f9fafb !important; border: 1px solid #e5e7eb !important;
    border-radius: 5px; color: #111827 !important; font-size: 12px; font-family: inherit;
    outline: none; box-sizing: border-box; resize: vertical; min-height: 68px; line-height: 1.55;
    transition: border-color 150ms, background 150ms;
    &::placeholder { color: #9ca3af; }
    &:focus { border-color: #6366f1 !important; background: #fff !important; }
  }

  select.vf-se-select,
  .vf-se-select {
    width: 100%; padding: 5px 26px 5px 8px; background: #f9fafb !important; border: 1px solid #e5e7eb !important;
    border-radius: 5px; color: #111827 !important; font-size: 12px; font-family: inherit;
    outline: none; appearance: none; cursor: pointer; box-sizing: border-box;
    &:focus { border-color: #6366f1 !important; }
  }

  input.vf-se-number-input,
  .vf-se-number-input {
    color: #111827 !important; background: transparent !important; border: none !important;
  }
}

.vf-se-select-wrap { position: relative; }
.vf-se-select-arrow { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; }

.vf-se-color-row { display: flex; align-items: center; gap: 8px; }
.vf-se-color-swatch { width: 28px; height: 28px; border-radius: 5px; border: 1px solid #e5e7eb; padding: 2px; cursor: pointer; background: transparent; flex-shrink: 0; }

.vf-se-toggle {
  display: flex; align-items: center; gap: 8px; cursor: pointer; width: fit-content;
  input[type='checkbox'] { display: none; &:checked + .vf-se-toggle-track { background: #6366f1; .vf-se-toggle-thumb { transform: translateX(16px); } } }
}
.vf-se-toggle-label {
  font-size: 12px; color: #374151;
}
.vf-se-toggle-track {
  display: flex; align-items: center; width: 38px; height: 22px; background: #e5e7eb;
  border-radius: 11px; padding: 2px; transition: background 200ms; cursor: pointer; border: none; flex-shrink: 0;
  &--on { background: #6366f1; }
}
.vf-se-toggle-thumb {
  width: 16px; height: 16px; background: #fff; border-radius: 50%; transition: transform 200ms;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  &--on { transform: translateX(16px); }
}
.vf-se-toggle-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 2px 0; }

// ─── Background ───────────────────────────────────────────────────────────────
.vf-se-bg-tabs {
  display: flex; gap: 2px; background: #f3f4f6; border-radius: 8px; padding: 3px;
}
.vf-se-bg-tab {
  flex: 1; padding: 5px 4px; border: none; background: transparent; font-size: 11px;
  font-weight: 500; color: #6b7280; border-radius: 6px; cursor: pointer; transition: all 120ms;
  white-space: nowrap;
  &--active { background: #fff; color: #4f46e5; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
  &:hover:not(&--active) { color: #374151; }
}
.vf-se-grad-preview {
  height: 24px; border-radius: 6px; margin: 6px 0; border: 1px solid rgba(0,0,0,0.08);
}
.vf-se-grad-stops { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }
.vf-se-grad-stop {
  display: flex; align-items: center; gap: 6px;
}
.vf-se-color-swatch--sm { width: 28px !important; height: 28px !important; flex-shrink: 0; }
.vf-se-stop-remove {
  display: flex; align-items: center; justify-content: center; width: 20px; height: 20px;
  border: none; background: transparent; color: #9ca3af; cursor: pointer; border-radius: 4px;
  flex-shrink: 0; transition: all 120ms;
  &:hover { background: #fee2e2; color: #ef4444; }
}
.vf-se-stop-add {
  display: flex; align-items: center; gap: 5px; width: 100%; padding: 5px 8px;
  border: 1px dashed #d1d5db; background: transparent; color: #6b7280; font-size: 11.5px;
  border-radius: 6px; cursor: pointer; transition: all 120ms;
  &:hover { border-color: #6366f1; color: #6366f1; background: rgba(99,102,241,0.04); }
}

// ─── Effects ──────────────────────────────────────────────────────────────────
.vf-se-fx-row {
  display: flex; align-items: center; gap: 8px; margin-top: 8px;
}
.vf-se-fx-label {
  font-size: 11.5px; color: #6b7280; width: 68px; flex-shrink: 0;
}

.vf-se-no-props { font-size: 12px; color: #9ca3af; padding: 8px 0; }

// ─── Attributes ───────────────────────────────────────────────────────────────
.vf-se-attrs-info { font-size: 11.5px; color: #9ca3af; line-height: 1.6; padding: 8px 10px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e5e7eb; }

.vf-se-attr-row { display: flex; align-items: center; gap: 6px; }
.vf-se-attr-key { width: 90px; flex-shrink: 0; padding: 6px 8px; background: #f3f4f6 !important; border: 1px solid #e5e7eb !important; border-radius: 5px; font-size: 11.5px; font-family: 'JetBrains Mono', monospace; color: #4f46e5 !important; outline: none; box-sizing: border-box; }
.vf-se-attr-val { flex: 1; min-width: 0; padding: 6px 8px; background: #fff !important; border: 1px solid #e5e7eb !important; border-radius: 5px; font-size: 12px; font-family: inherit; color: #111827 !important; outline: none; box-sizing: border-box; &:focus { border-color: #6366f1 !important; } }
.vf-se-attr-del { display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; border: none; background: transparent; color: #9ca3af; cursor: pointer; border-radius: 4px; outline: none; flex-shrink: 0; &:hover { background: #fee2e2; color: #ef4444; } }

.vf-se-attr-add { display: flex; flex-direction: column; gap: 8px; padding: 10px; background: #f8f9fa; border-radius: 8px; border: 1px dashed #e5e7eb; }
.vf-se-attr-add__title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #9ca3af; }
.vf-se-attr-quick { display: flex; flex-wrap: wrap; gap: 4px; }
.vf-se-attr-quick-btn { padding: 3px 8px; border: 1px solid #e5e7eb; background: #fff; color: #374151; font-size: 11px; font-family: 'JetBrains Mono', monospace; border-radius: 4px; cursor: pointer; outline: none; transition: all 120ms; &:hover:not(:disabled) { border-color: #6366f1; color: #6366f1; background: rgba(99,102,241,0.06); } &:disabled { opacity: 0.35; cursor: not-allowed; } }
.vf-se-attr-custom { display: flex; gap: 6px; align-items: center; }
.vf-se-attr-add-btn { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: none; background: #6366f1; color: #fff; border-radius: 5px; cursor: pointer; outline: none; flex-shrink: 0; transition: background 120ms; &:hover:not(:disabled) { background: #4f46e5; } &:disabled { opacity: 0.35; cursor: not-allowed; } }

// ─── Typography Panel ──────────────────────────────────────────────────────────

.vf-se-section-title {
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.08em; color: #9ca3af;
  padding: 2px 0 4px; border-top: 1px solid #f3f4f6; margin-top: 2px;
  &:first-child { border-top: none; margin-top: 0; padding-top: 0; }
}

.vf-se-container-toggle {
  display: flex;
  gap: 4px;
}

.vf-se-container-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #6b7280;
  font-size: 11px;
  font-family: inherit;
  cursor: pointer;
  transition: all 120ms;
  outline: none;

  &:hover { background: #f3f4f6; color: #374151; }

  &--active {
    background: #ede9fe;
    border-color: #6366f1;
    color: #6366f1;
    font-weight: 600;
  }
}

.vf-se-type-row {
  display: flex;
  gap: 6px;
  align-items: center;
}

.vf-se-number-field {
  display: flex; align-items: center; gap: 4px;
  background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 5px;
  padding: 0 7px; height: 28px; min-width: 0; flex: 1;
  transition: border-color 150ms;
  &:focus-within { border-color: #6366f1; background: #fff; }
}

.vf-se-number-input {
  width: 100%;
  min-width: 0;
  border: none;
  background: transparent;
  font-size: 12.5px;
  font-family: inherit;
  color: #111827;
  outline: none;
  text-align: right;

  &::placeholder { color: #9ca3af; }

  /* hide spinners */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button { -webkit-appearance: none; }
  -moz-appearance: textfield;
}

.vf-se-number-unit {
  font-size: 10px;
  font-weight: 600;
  color: #9ca3af;
  flex-shrink: 0;
  letter-spacing: 0.02em;
}

.vf-se-number-icon {
  color: #9ca3af;
  flex-shrink: 0;
}

// ─── Format toolbar ────────────────────────────────────────────────────────────

.vf-se-fmt-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 3px;
}

.vf-se-fmt-group {
  display: flex;
  align-items: center;
  gap: 1px;
  flex: 1;
  justify-content: space-around;
}

.vf-se-fmt-sep {
  width: 1px;
  height: 16px;
  background: #e5e7eb;
  flex-shrink: 0;
}

.vf-se-fmt-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: #6b7280;
  border-radius: 5px;
  cursor: pointer;
  transition: background 120ms, color 120ms;
  outline: none;
  font-family: inherit;

  &:hover { background: #e5e7eb; color: #111827; }

  &--active {
    background: #6366f1;
    color: #fff;
    &:hover { background: #4f46e5; }
  }

  &--text {
    font-size: 13px;
    font-weight: 700;
    line-height: 1;
  }

  &--italic { font-style: italic; }
  &--underline { text-decoration: underline; }
  &--strike { text-decoration: line-through; }
}

// ─── Block header (Figma-style: type badge + editable name) ───────────────────
.vf-se-block-hd {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 12px; border-bottom: 1px solid #e5e7eb; flex-shrink: 0;

  &__type {
    font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em;
    color: #6366f1; background: rgba(99,102,241,0.08); padding: 2px 6px; border-radius: 4px;
    flex-shrink: 0; white-space: nowrap;
  }

  &__name {
    flex: 1; min-width: 0; font-size: 12.5px; font-weight: 500; color: #111827;
    background: transparent; border: 1px solid transparent; border-radius: 4px;
    padding: 3px 6px; font-family: inherit; outline: none;
    &:hover { background: #f3f4f6; border-color: #e5e7eb; }
    &:focus { background: #fff; border-color: #6366f1; }
  }
}

// ─── Collapsible section header (Figma-style) ─────────────────────────────────
.vf-se-sec-hd {
  display: flex; align-items: center; gap: 6px;
  width: 100%; height: 34px; padding: 0 12px;
  border: none; border-top: 1px solid #f0f0f0; background: transparent;
  cursor: pointer; outline: none; font-family: inherit; flex-shrink: 0;
  &:hover { background: #f9fafb; }

  &__label {
    flex: 1; text-align: left; font-size: 11px; font-weight: 600; color: #6b7280;
    text-transform: uppercase; letter-spacing: 0.06em;
  }

  &__chevron {
    color: #9ca3af; flex-shrink: 0; transition: transform 150ms;
    &--open { transform: rotate(90deg); }
  }
}

// ─── Collapsible section body ─────────────────────────────────────────────────
.vf-se-sec-body {
  padding: 10px 12px; display: flex; flex-direction: column; gap: 8px;
  border-top: 1px solid #f5f5f5;
}

// ─── Legacy flat panel body (kept for backward compat) ────────────────────────
.vf-se-panel__bd {
  display: flex; flex-direction: column; gap: 8px;
}

// ─── Spacing cross (Figma-style) ──────────────────────────────────────────────
.vf-se-spacing-group {
  display: flex; flex-direction: column; gap: 6px;
}

.vf-se-spacing-label-row {
  display: flex; align-items: center; justify-content: space-between;
}

.vf-se-spacing-title {
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.06em; color: #9ca3af;
}

.vf-se-link-btn {
  display: flex; align-items: center; justify-content: center;
  width: 22px; height: 22px; border: 1px solid #e5e7eb;
  background: #fff; border-radius: 4px; cursor: pointer;
  color: #9ca3af; outline: none; transition: all 120ms;
  &:hover { border-color: #6366f1; color: #6366f1; }
  &--active { border-color: #6366f1; background: rgba(99,102,241,0.08); color: #6366f1; }
}

.vf-se-spacing-cross {
  display: flex; flex-direction: column; align-items: center; gap: 2px;

  &__top, &__bottom {
    display: flex; justify-content: center;
  }

  &__middle {
    display: flex; align-items: center; gap: 2px; width: 100%;
  }

  &__center {
    flex: 1; display: flex; align-items: center; justify-content: center;
    height: 36px; background: #f3f4f6; border: 1px dashed #d1d5db;
    border-radius: 6px;
  }

  &__label {
    font-size: 10px; font-weight: 700; color: #9ca3af; letter-spacing: 0.06em;
  }
}

.vf-se-spacing-input {
  width: 52px; height: 28px; padding: 0 6px;
  background: #f9fafb !important; border: 1px solid #e5e7eb !important;
  border-radius: 5px; color: #111827 !important; font-size: 12px;
  font-family: inherit; text-align: center; outline: none; box-sizing: border-box;
  &:focus { border-color: #6366f1 !important; background: #fff !important; }
  /* hide spinners */
  &::-webkit-outer-spin-button, &::-webkit-inner-spin-button { -webkit-appearance: none; }
  -moz-appearance: textfield;
}

// ─── Border radius grid ────────────────────────────────────────────────────────
.vf-se-radius-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 6px;
}

.vf-se-corner-icon {
  font-size: 11px; color: #9ca3af; flex-shrink: 0;
}

// ─── Opacity row ──────────────────────────────────────────────────────────────
.vf-se-opacity-row {
  display: flex; align-items: center; gap: 8px;
}

.vf-se-slider {
  flex: 1; height: 4px; appearance: none; background: #e5e7eb;
  border-radius: 2px; outline: none; cursor: pointer;
  &::-webkit-slider-thumb {
    appearance: none; width: 14px; height: 14px;
    background: #6366f1; border-radius: 50%; cursor: pointer;
    box-shadow: 0 1px 4px rgba(99,102,241,0.4);
  }
}

// ─── Number icon label ────────────────────────────────────────────────────────
.vf-se-number-icon-label {
  font-size: 10px; font-weight: 700; color: #9ca3af;
  flex-shrink: 0; letter-spacing: 0.02em; min-width: 14px;
}

// ─── Image panel ──────────────────────────────────────────────────────────────
.vf-se-img-preview {
  width: 100%;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  margin-bottom: 8px;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  max-height: 140px;

  img {
    width: 100%;
    height: 140px;
    object-fit: cover;
    display: block;
  }
}

.vf-se-img-pick-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 7px 10px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  color: #374151;
  cursor: pointer;
  transition: background 120ms;

  &:hover { background: #e5e7eb; }
}

// ─── Icon panel ───────────────────────────────────────────────────────────────
.vf-se-icon-search-wrap {
  position: relative;
  margin: 8px 0 6px;
}

.vf-se-icon-search-icon {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.vf-se-icon-search {
  width: 100%;
  padding: 5px 8px 5px 26px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 5px;
  font-size: 12px;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
  color: #111827;

  &:focus { border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99,102,241,0.12); }
}

.vf-se-icon-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 3px;
  max-height: 200px;
  overflow-y: auto;
}

.vf-se-icon-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 1;
  border: 1px solid transparent;
  border-radius: 5px;
  background: transparent;
  color: #374151;
  cursor: pointer;
  transition: all 120ms;

  &:hover {
    background: #f3f4f6;
    border-color: #e5e7eb;
    color: #4f46e5;
  }

  &--active {
    background: rgba(99, 102, 241, 0.1);
    border-color: #6366f1;
    color: #4f46e5;
  }
}

// ─── Block header opacity ─────────────────────────────────────────────────────
.vf-se-block-hd {
  &__opacity {
    display: flex; align-items: center; gap: 2px; flex-shrink: 0;
    background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 4px;
    padding: 2px 5px; min-width: 0;
  }
  &__opacity-input {
    width: 28px; border: none; background: transparent; outline: none;
    font-size: 11px; color: #374151; text-align: right; font-family: inherit;
    &::-webkit-inner-spin-button, &::-webkit-outer-spin-button { -webkit-appearance: none; }
  }
  &__opacity-unit { font-size: 10px; color: #9ca3af; }
}

// ─── Dimension row (W/H) ──────────────────────────────────────────────────────
.vf-se-dim-row {
  display: flex; gap: 6px;
}
.vf-se-dim-field {
  display: flex; align-items: center; gap: 4px; flex: 1;
  background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 5px;
  padding: 0 7px; height: 28px; min-width: 0;
  transition: border-color 150ms;
  &:focus-within { border-color: #6366f1; background: #fff; }
}
.vf-se-dim-lbl {
  font-size: 10px; font-weight: 600; color: #9ca3af; flex-shrink: 0; width: 10px;
}
.vf-se-dim-input {
  flex: 1; min-width: 0; border: none; background: transparent; outline: none;
  font-size: 12px; color: #111827; font-family: inherit;
  &::placeholder { color: #d1d5db; }
}

// ─── Display mode buttons ─────────────────────────────────────────────────────
.vf-se-display-row {
  display: flex; gap: 2px; align-items: center;
  background: #f3f4f6; border-radius: 6px; padding: 2px;
}
.vf-se-display-btn {
  display: flex; align-items: center; justify-content: center;
  flex: 1; height: 26px; border: none; background: transparent; border-radius: 4px;
  color: #6b7280; cursor: pointer; outline: none; transition: all 120ms;
  &:hover { color: #374151; background: rgba(0,0,0,0.05); }
  &--active { background: #fff; color: #6366f1; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
}

// ─── Auto layout ─────────────────────────────────────────────────────────────
.vf-se-autolayout-row {
  display: flex; gap: 6px; align-items: flex-start;
}
.vf-se-dir-btns {
  display: flex; flex-direction: column; gap: 2px;
}
.vf-se-dir-btn {
  display: flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; border: 1px solid #e5e7eb;
  background: #f9fafb; border-radius: 5px; color: #6b7280;
  cursor: pointer; outline: none; transition: all 120ms;
  &:hover { border-color: #6366f1; color: #6366f1; background: #f0f0ff; }
  &--active { background: #eff0fe; border-color: #6366f1; color: #6366f1; }
}
.vf-se-align-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; flex: 1;
}
.vf-se-align-cell {
  display: flex; align-items: center; justify-content: center;
  height: 26px; border: 1px solid #e5e7eb; background: #f9fafb;
  border-radius: 4px; cursor: pointer; outline: none; transition: all 120ms;
  color: #9ca3af;
  &:hover { border-color: #6366f1; color: #6366f1; background: #f0f0ff; }
  &--active { background: #eff0fe; border-color: #6366f1; color: #6366f1; }
}
.vf-se-gap-row {
  display: flex; gap: 6px;
}

// ─── Distribution buttons ─────────────────────────────────────────────────────
.vf-se-distrib-row {
  display: flex; gap: 2px;
}
.vf-se-distrib-btn {
  display: flex; align-items: center; justify-content: center;
  flex: 1; height: 24px; border: 1px solid #e5e7eb;
  background: #f9fafb; border-radius: 4px; cursor: pointer; outline: none;
  color: #9ca3af; transition: all 120ms;
  &:hover { border-color: #6366f1; color: #6366f1; background: #f0f0ff; }
  &--active { background: #eff0fe; border-color: #6366f1; color: #6366f1; }
}

// ─── Spacing box (padding + margin) ─────────────────────────────────────────
.vf-se-spacing-box {
  display: flex; flex-direction: column; gap: 6px;
  & + & { margin-top: 2px; padding-top: 8px; border-top: 1px solid #f3f4f6; }

  &__hd {
    display: flex; align-items: center; justify-content: space-between;
  }
  &__title {
    font-size: 10px; font-weight: 600; color: #9ca3af;
    text-transform: uppercase; letter-spacing: 0.06em;
  }
}

.vf-se-spacing-modes {
  display: flex; gap: 1px;
  background: #f3f4f6; border-radius: 4px; padding: 1px;
}
.vf-se-spacing-mode {
  display: flex; align-items: center; justify-content: center;
  width: 22px; height: 20px; border: none; background: transparent;
  border-radius: 3px; cursor: pointer; outline: none; color: #9ca3af;
  transition: all 100ms;
  &:hover { color: #374151; }
  &.active { background: #fff; color: #6366f1; box-shadow: 0 1px 2px rgba(0,0,0,0.08); }
}

// ─── Fill list ────────────────────────────────────────────────────────────────
.vf-se-sec-hd-wrap {
  display: flex; align-items: center; width: 100%;
  border-top: 1px solid #f0f0f0;
  & > .vf-se-sec-hd { flex: 1; border-top: none; }
}
.vf-se-sec-hd-add {
  width: 28px; height: 34px; border: none; background: transparent;
  color: #9ca3af; cursor: pointer; outline: none; font-size: 14px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  transition: color 120ms;
  &:hover { color: #6366f1; }
}
.vf-se-fill-row {
  display: flex; align-items: center; gap: 6px; padding: 0 2px;
}
.vf-se-fill-swatch-wrap {
  position: relative; flex-shrink: 0;
}
.vf-se-fill-swatch {
  width: 22px; height: 22px; border-radius: 4px; border: 1px solid rgba(0,0,0,0.15);
  cursor: pointer; padding: 0; outline: none;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: transform 120ms;
  &:hover { transform: scale(1.1); }
  &--sm { width: 18px; height: 18px; }
}
.vf-se-fill-value {
  flex: 1; min-width: 0; font-size: 11px; color: #374151;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.vf-se-fill-opacity-wrap {
  display: flex; align-items: center; gap: 1px;
  font-size: 11px; color: #6b7280;
}
.vf-se-fill-opacity-input {
  width: 30px; border: none; background: transparent; outline: none;
  font-size: 11px; color: #374151; text-align: right; font-family: inherit;
  &::-webkit-inner-spin-button { -webkit-appearance: none; }
}
.vf-se-fill-del {
  width: 18px; height: 18px; border: none; background: transparent;
  color: #9ca3af; cursor: pointer; outline: none; border-radius: 3px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  &:hover { color: #ef4444; background: #fef2f2; }
}
.vf-se-fill-add-btn {
  width: 100%; padding: 6px; border: 1px dashed #d1d5db; border-radius: 5px;
  background: transparent; color: #9ca3af; font-size: 11px; cursor: pointer; outline: none;
  font-family: inherit;
  &:hover { border-color: #6366f1; color: #6366f1; background: #f5f5ff; }
}
.vf-se-fill-empty { padding: 0 2px; }

// ─── Color popup ──────────────────────────────────────────────────────────────
.vf-se-color-popup {
  position: absolute; top: calc(100% + 6px); left: 0; z-index: 1000;
  background: #fff; border: 1px solid #e5e7eb; border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.14), 0 2px 6px rgba(0,0,0,0.08);
  padding: 10px; width: 220px;
  display: flex; flex-direction: column; gap: 8px;
}
.vf-se-color-popup__picker {
  width: 100%; height: 120px; border: none; padding: 0; cursor: pointer;
  border-radius: 5px; outline: none;
}
.vf-se-color-popup__row {
  display: flex; gap: 6px; align-items: center;
}
.vf-se-color-popup__hex {
  flex: 1; padding: 5px 8px; border: 1px solid #e5e7eb; border-radius: 5px;
  font-size: 12px; color: #111827; background: #f9fafb; outline: none; font-family: inherit;
  &:focus { border-color: #6366f1; background: #fff; }
}
.vf-se-popup-tabs {
  display: flex; gap: 2px;
  background: #f3f4f6; border-radius: 5px; padding: 2px;
}
.vf-se-popup-tab {
  flex: 1; height: 24px; border: none; background: transparent;
  border-radius: 4px; font-size: 11px; color: #6b7280; cursor: pointer; outline: none; font-family: inherit;
  &.active { background: #fff; color: #6366f1; font-weight: 600; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
}

// ─── Section body row ─────────────────────────────────────────────────────────
.vf-se-sec-body__row {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
}

// ─── Effects ─────────────────────────────────────────────────────────────────
.vf-se-effect-row {
  display: flex; align-items: center; gap: 8px;
}
.vf-se-effect-toggle {
  width: 14px; height: 14px; border-radius: 50%; border: 1.5px solid #d1d5db;
  background: transparent; cursor: pointer; outline: none; padding: 0;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  transition: all 120ms;
  &--on { border-color: #6366f1; background: #6366f1; }
  &__dot { width: 5px; height: 5px; border-radius: 50%; background: #fff; }
}
.vf-se-effect-label {
  flex: 1; font-size: 12px; color: #374151;
}
.vf-se-shadow-fields {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px;
}
.vf-se-shadow-field {
  display: flex; flex-direction: column; gap: 2px;
}
.vf-se-shadow-lbl {
  font-size: 9px; color: #9ca3af; text-align: center; text-transform: uppercase;
}
.vf-se-fx-divider {
  height: 1px; background: #f0f0f0; margin: 4px 0;
}
</style>
