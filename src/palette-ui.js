/**
 * CommandCuts — Palette UI
 * 
 * Glassmorphic command palette rendered inside Shadow DOM.
 * Handles rendering, keyboard navigation, focus trapping,
 * shortcut recording, and the add/edit modal.
 */

import PaletteSearch from './palette-search.js';
import ActionRunner from './action-runner.js';

class PaletteUI {
  /**
   * @param {Object} deps - Injected dependencies
   * @param {import('./shortcut-engine.js').default} deps.engine
   * @param {import('./conflict-detector.js').default} deps.detector
   * @param {import('./shortcut-config.js').default} deps.config
   * @param {Object} deps.options
   */
  constructor(deps) {
    this.engine = deps.engine;
    this.detector = deps.detector;
    this.config = deps.config;
    this.options = deps.options || {};

    this._isOpen = false;
    this._focusIndex = -1;
    this._filteredShortcuts = [];
    this._recording = false;
    this._recordedCombo = '';
    this._editingCombo = null;
    this._selectedActionType = '';
    this._onShortcutExecute = deps.onShortcutExecute || (() => {});
    this._onShortcutAdded = deps.onShortcutAdded || (() => {});
    this._onShortcutRemoved = deps.onShortcutRemoved || (() => {});

    this._createHost();
    this._render();
    this._bindEvents();
  }

  // ─── Shadow DOM Host ──────────────────────────────────────────

  _createHost() {
    this.host = document.createElement('div');
    this.host.id = 'commandcuts-root';
    this.host.setAttribute('data-theme', this.options.theme || 'dark');
    this.host.setAttribute('data-position', this.options.position || 'center');
    this.shadow = this.host.attachShadow({ mode: 'open' });
    document.body.appendChild(this.host);
  }

  // ─── Render ───────────────────────────────────────────────────

  _render() {
    const cssText = this._getCSS();
    
    this.shadow.innerHTML = `
      <style>${cssText}</style>
      <div class="cc-backdrop" id="cc-backdrop"></div>
      <div class="cc-palette" id="cc-palette" role="dialog" aria-modal="true" aria-label="Command Palette">
        <!-- Header / Search -->
        <div class="cc-header">
          <svg class="cc-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            type="text"
            class="cc-search-input"
            id="cc-search"
            placeholder="Search shortcuts, actions…"
            autocomplete="off"
            spellcheck="false"
            aria-label="Search shortcuts"
          />
          <span class="cc-trigger-badge" id="cc-trigger-badge">ESC</span>
        </div>

        <!-- Body / List -->
        <div class="cc-body" id="cc-body" role="listbox">
          <!-- Rendered dynamically -->
        </div>

        <!-- Footer -->
        <div class="cc-footer">
          <div class="cc-footer-hints">
            <span class="cc-footer-hint">
              <span class="cc-key">↑↓</span> Navigate
            </span>
            <span class="cc-footer-hint">
              <span class="cc-key">↵</span> Execute
            </span>
            <span class="cc-footer-hint">
              <span class="cc-key">Esc</span> Close
            </span>
          </div>
          ${this.options.allowUserShortcuts !== false ? 
            '<button class="cc-add-btn" id="cc-add-btn">+ Add Shortcut</button>' : ''}
        </div>

        <!-- Add/Edit Modal -->
        <div class="cc-modal-overlay" id="cc-modal-overlay">
          <div class="cc-modal" id="cc-modal">
            <div class="cc-modal-title" id="cc-modal-title">Add New Shortcut</div>
            
            <div class="cc-field">
              <label class="cc-field-label">Label</label>
              <input type="text" class="cc-field-input" id="cc-field-label" placeholder="e.g. Toggle Dark Mode" />
            </div>

            <div class="cc-field">
              <label class="cc-field-label">Description (optional)</label>
              <input type="text" class="cc-field-input" id="cc-field-desc" placeholder="e.g. Switches between light and dark theme" />
            </div>

            <div class="cc-field">
              <label class="cc-field-label">Key Combination</label>
              <div class="cc-key-recorder" id="cc-key-recorder" tabindex="0" role="button" aria-label="Press keys to record shortcut">
                Press keys…
              </div>
              <div id="cc-conflict-area"></div>
            </div>

            <div class="cc-field">
              <label class="cc-field-label">Action — What should this shortcut do?</label>
              <select class="cc-field-input cc-action-select" id="cc-action-select">
                <option value="">Select an action…</option>
              </select>
              <div class="cc-action-description" id="cc-action-description"></div>
            </div>

            <div id="cc-action-params" class="cc-action-params"></div>

            <div class="cc-modal-actions">
              <button class="cc-btn cc-btn-secondary" id="cc-modal-cancel">Cancel</button>
              <button class="cc-btn cc-btn-primary" id="cc-modal-save" disabled>Save Shortcut</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Toast -->
      <div class="cc-toast" id="cc-toast"></div>
    `;
  }

  _getCSS() {
    // CSS is inlined by the build script; during dev, we return an empty string
    // and load it via <link>. For the bundle, build.js replaces this.
    return '__CSS_PLACEHOLDER__';
  }

  // ─── Element accessors ────────────────────────────────────────

  get _backdrop() { return this.shadow.getElementById('cc-backdrop'); }
  get _palette() { return this.shadow.getElementById('cc-palette'); }
  get _searchInput() { return this.shadow.getElementById('cc-search'); }
  get _body() { return this.shadow.getElementById('cc-body'); }
  get _addBtn() { return this.shadow.getElementById('cc-add-btn'); }
  get _modalOverlay() { return this.shadow.getElementById('cc-modal-overlay'); }
  get _modal() { return this.shadow.getElementById('cc-modal'); }
  get _modalTitle() { return this.shadow.getElementById('cc-modal-title'); }
  get _fieldLabel() { return this.shadow.getElementById('cc-field-label'); }
  get _fieldDesc() { return this.shadow.getElementById('cc-field-desc'); }
  get _keyRecorder() { return this.shadow.getElementById('cc-key-recorder'); }
  get _conflictArea() { return this.shadow.getElementById('cc-conflict-area'); }
  get _actionSelect() { return this.shadow.getElementById('cc-action-select'); }
  get _actionDescription() { return this.shadow.getElementById('cc-action-description'); }
  get _actionParamsContainer() { return this.shadow.getElementById('cc-action-params'); }
  get _modalCancel() { return this.shadow.getElementById('cc-modal-cancel'); }
  get _modalSave() { return this.shadow.getElementById('cc-modal-save'); }
  get _toast() { return this.shadow.getElementById('cc-toast'); }

  // ─── Event Binding ────────────────────────────────────────────

  _bindEvents() {
    // Backdrop click to close
    this._backdrop.addEventListener('click', () => this.close());

    // Search input
    this._searchInput.addEventListener('input', () => this._onSearchInput());

    // Keyboard navigation inside palette
    this._palette.addEventListener('keydown', (e) => this._onPaletteKeyDown(e));

    // Add button
    if (this._addBtn) {
      this._addBtn.addEventListener('click', () => this._openModal());
    }

    // Modal events
    this._modalCancel.addEventListener('click', () => this._closeModal());
    this._modalSave.addEventListener('click', () => this._saveShortcut());

    // Key recorder
    this._keyRecorder.addEventListener('focus', () => this._startRecording());
    this._keyRecorder.addEventListener('blur', () => this._stopRecording());
    this._keyRecorder.addEventListener('keydown', (e) => {
      if (this._recording) {
        e.preventDefault();
        e.stopPropagation();
        this._recordKey(e);
      }
    });

    // Close modal on overlay click (outside the modal)
    this._modalOverlay.addEventListener('click', (e) => {
      if (e.target === this._modalOverlay) this._closeModal();
    });

    // Action select change handler
    this._actionSelect.addEventListener('change', () => this._onActionSelectChange());

    // Populate action select dropdown
    this._populateActionSelect();
  }

  // ─── Open / Close ─────────────────────────────────────────────

  open() {
    if (this._isOpen) return;
    this._isOpen = true;
    this._focusIndex = -1;

    this._renderShortcuts();
    this._backdrop.classList.add('cc-visible');
    this._palette.classList.add('cc-visible');

    // Focus the search input after a tick
    requestAnimationFrame(() => {
      this._searchInput.value = '';
      this._searchInput.focus();
    });
  }

  close() {
    if (!this._isOpen) return;
    this._isOpen = false;

    this._backdrop.classList.remove('cc-visible');
    this._palette.classList.remove('cc-visible');
    this._closeModal();
    this._searchInput.value = '';
  }

  toggle() {
    this._isOpen ? this.close() : this.open();
  }

  get isOpen() {
    return this._isOpen;
  }

  // ─── Render Shortcuts List ────────────────────────────────────

  _renderShortcuts(query = '') {
    const allShortcuts = this.config.getAllShortcuts();
    const filtered = PaletteSearch.filter(allShortcuts, query);
    this._filteredShortcuts = filtered;

    if (filtered.length === 0) {
      this._body.innerHTML = `
        <div class="cc-empty">
          <div class="cc-empty-icon">${query ? '🔍' : '⌨️'}</div>
          <div class="cc-empty-title">${query ? 'No matching shortcuts' : 'No shortcuts configured'}</div>
          <div class="cc-empty-subtitle">${query ? 'Try a different search term' : 'Add one to get started!'}</div>
        </div>
      `;
      return;
    }

    // Group by category
    const groups = new Map();
    for (const s of filtered) {
      const cat = s.category || 'General';
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat).push(s);
    }

    let html = '';
    let globalIdx = 0;

    for (const [category, shortcuts] of groups) {
      html += `<div class="cc-category">${this._escapeHtml(category)}</div>`;
      for (const s of shortcuts) {
        const isAdmin = s.adminLocked;
        const comboKeys = this.engine.formatCombo(s.combo).split(this.engine.os === 'macos' ? /(?=.)/ : ' + ');
        const keysHtml = comboKeys
          .filter(k => k.trim())
          .map(k => {
            if (k.trim() === '+') return '<span class="cc-key-separator">+</span>';
            return `<span class="cc-key">${this._escapeHtml(k.trim())}</span>`;
          })
          .join('');

        const labelHtml = query ? PaletteSearch.highlight(s.label, query) : this._escapeHtml(s.label);
        const descHtml = s.description
          ? (query ? PaletteSearch.highlight(s.description, query) : this._escapeHtml(s.description))
          : '';

        html += `
          <div class="cc-shortcut ${globalIdx === this._focusIndex ? 'cc-focused' : ''}"
               data-idx="${globalIdx}"
               data-combo="${this._escapeHtml(s.combo)}"
               role="option"
               tabindex="-1">
            <div class="cc-shortcut-icon">${s.icon || '⌨️'}</div>
            <div class="cc-shortcut-info">
              <div class="cc-shortcut-label">${labelHtml}</div>
              ${descHtml ? `<div class="cc-shortcut-desc">${descHtml}</div>` : ''}
            </div>
            <div class="cc-shortcut-keys">${keysHtml}</div>
            ${isAdmin 
              ? '<div class="cc-admin-badge" title="Admin shortcut (locked)">🔒</div>'
              : `<div class="cc-shortcut-actions">
                  <button class="cc-action-btn cc-edit" title="Edit" data-action="edit" data-combo="${this._escapeHtml(s.combo)}">✏️</button>
                  <button class="cc-action-btn cc-delete" title="Delete" data-action="delete" data-combo="${this._escapeHtml(s.combo)}">🗑️</button>
                </div>`
            }
          </div>
        `;
        globalIdx++;
      }
    }

    this._body.innerHTML = html;

    // Attach click handlers
    this._body.querySelectorAll('.cc-shortcut').forEach(el => {
      el.addEventListener('click', (e) => {
        // Check if an action button was clicked
        const actionBtn = e.target.closest('[data-action]');
        if (actionBtn) {
          const action = actionBtn.dataset.action;
          const combo = actionBtn.dataset.combo;
          if (action === 'delete') this._deleteShortcut(combo);
          if (action === 'edit') this._editShortcut(combo);
          return;
        }
        // Execute the shortcut
        const combo = el.dataset.combo;
        this._executeShortcut(combo);
      });
    });
  }

  // ─── Search ───────────────────────────────────────────────────

  _onSearchInput() {
    const query = this._searchInput.value;
    this._focusIndex = -1;
    this._renderShortcuts(query);
  }

  // ─── Keyboard Navigation ──────────────────────────────────────

  _onPaletteKeyDown(e) {
    // If the modal is open, let it handle keys
    if (this._modalOverlay.classList.contains('cc-visible')) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this._moveFocus(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this._moveFocus(-1);
        break;
      case 'Enter':
        e.preventDefault();
        if (this._focusIndex >= 0 && this._focusIndex < this._filteredShortcuts.length) {
          this._executeShortcut(this._filteredShortcuts[this._focusIndex].combo);
        }
        break;
      case 'Escape':
        e.preventDefault();
        this.close();
        break;
      case 'Tab':
        // Trap focus inside the palette
        e.preventDefault();
        break;
    }
  }

  _moveFocus(direction) {
    const count = this._filteredShortcuts.length;
    if (count === 0) return;

    this._focusIndex += direction;
    if (this._focusIndex < 0) this._focusIndex = count - 1;
    if (this._focusIndex >= count) this._focusIndex = 0;

    // Update visual focus
    this._body.querySelectorAll('.cc-shortcut').forEach((el, idx) => {
      el.classList.toggle('cc-focused', idx === this._focusIndex);
      if (idx === this._focusIndex) {
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });
  }

  // ─── Execute Shortcut ─────────────────────────────────────────

  _executeShortcut(combo) {
    this.close();
    this._onShortcutExecute(combo);
  }

  // ─── Add/Edit Modal ───────────────────────────────────────────

  _openModal(editCombo = null) {
    this._editingCombo = editCombo;
    this._recordedCombo = '';

    if (editCombo) {
      const shortcut = this.config.getUserShortcuts().find(s => s.combo === editCombo);
      if (shortcut) {
        this._modalTitle.textContent = 'Edit Shortcut';
        this._fieldLabel.value = shortcut.label || '';
        this._fieldDesc.value = shortcut.description || '';
        this._recordedCombo = shortcut.combo;
        this._keyRecorder.innerHTML = this._renderRecordedKeys(shortcut.combo);
        // Restore action selection
        if (shortcut.actionType) {
          this._actionSelect.value = shortcut.actionType;
          this._selectedActionType = shortcut.actionType;
          this._onActionSelectChange();
          // Populate saved params
          this._restoreActionParams(shortcut.actionParams || {});
        }
      }
    } else {
      this._modalTitle.textContent = 'Add New Shortcut';
      this._fieldLabel.value = '';
      this._fieldDesc.value = '';
      this._keyRecorder.textContent = 'Press keys…';
      this._actionSelect.value = '';
      this._selectedActionType = '';
      this._actionDescription.innerHTML = '';
      this._actionParamsContainer.innerHTML = '';
    }

    this._conflictArea.innerHTML = '';
    this._updateSaveButton();
    this._modalOverlay.classList.add('cc-visible');

    requestAnimationFrame(() => this._fieldLabel.focus());
  }

  _closeModal() {
    this._modalOverlay.classList.remove('cc-visible');
    this._recording = false;
    this._editingCombo = null;
    this._recordedCombo = '';
    this._selectedActionType = '';
  }

  // ─── Key Recording ────────────────────────────────────────────

  _startRecording() {
    this._recording = true;
    this._keyRecorder.classList.add('cc-recording');
    if (!this._recordedCombo) {
      this._keyRecorder.innerHTML = '<span class="cc-pulse"></span> Listening…';
    }
    this.engine.pause();
  }

  _stopRecording() {
    this._recording = false;
    this._keyRecorder.classList.remove('cc-recording');
    if (!this._recordedCombo) {
      this._keyRecorder.textContent = 'Press keys…';
    }
    this.engine.resume();
  }

  _recordKey(e) {
    const combo = this.engine.normalizeKeyEvent(e);
    
    // Need at least a modifier + key (not just a modifier alone)
    if (!combo || ['ctrl', 'shift', 'alt', 'meta'].includes(combo)) {
      return;
    }

    this._recordedCombo = combo;
    this._keyRecorder.innerHTML = this._renderRecordedKeys(combo);

    // Check for conflicts
    const result = this.detector.check(combo);
    if (result.conflicting) {
      this._conflictArea.innerHTML = `
        <div class="cc-conflict-warning cc-${result.highestSeverity}">
          <span class="cc-conflict-icon">${result.highestSeverity === 'blocked' ? '⛔' : result.highestSeverity === 'warning' ? '⚠️' : 'ℹ️'}</span>
          <span>${this._escapeHtml(result.message)}</span>
        </div>
      `;
    } else {
      this._conflictArea.innerHTML = `
        <div class="cc-conflict-warning cc-caution" style="background:var(--cc-success-bg);color:var(--cc-success);border-color:rgba(16,185,129,0.2)">
          <span class="cc-conflict-icon">✅</span>
          <span>This shortcut is available!</span>
        </div>
      `;
    }

    this._updateSaveButton();
  }

  _renderRecordedKeys(combo) {
    const formatted = this.engine.formatCombo(combo);
    const parts = this.engine.os === 'macos' 
      ? [...formatted].filter(c => c.trim())
      : formatted.split(' + ');
    
    return parts
      .map(k => `<span class="cc-key" style="font-size:14px;min-width:30px;height:30px">${this._escapeHtml(k.trim())}</span>`)
      .join('<span class="cc-key-separator" style="margin:0 2px">+</span>');
  }

  _updateSaveButton() {
    const hasLabel = (this._fieldLabel?.value || '').trim().length > 0;
    const hasCombo = this._recordedCombo.length > 0;
    const hasAction = !!this._selectedActionType;
    const conflict = this.detector.check(this._recordedCombo);
    const isBlocked = conflict.highestSeverity === 'blocked';

    const saveBtn = this._modalSave;
    if (saveBtn) {
      saveBtn.disabled = !(hasLabel && hasCombo && hasAction && !isBlocked);
    }
  }

  // ─── Save/Delete/Edit ─────────────────────────────────────────

  _saveShortcut() {
    const label = (this._fieldLabel?.value || '').trim();
    const description = (this._fieldDesc?.value || '').trim();
    const combo = this._recordedCombo;
    const actionType = this._selectedActionType;
    const actionParams = this._collectActionParams();

    if (!label || !combo || !actionType) return;

    // Validate action params
    const template = ActionRunner.getTemplate(actionType);
    if (template && template.validate) {
      const error = template.validate(actionParams);
      if (error) {
        this._showToast(error, 'error');
        return;
      }
    }

    // Get icon from template
    const icon = template ? template.icon : '✏️';

    if (this._editingCombo) {
      // Update existing
      this.config.updateUserShortcut(this._editingCombo, { combo, label, description, actionType, actionParams, icon });
      this._onShortcutRemoved(this._editingCombo);
      this._onShortcutAdded({ combo, label, description, actionType, actionParams, icon });
      this._showToast('Shortcut updated ✨', 'success');
    } else {
      // Add new
      const ok = this.config.addUserShortcut({ combo, label, description, actionType, actionParams, icon });
      if (!ok) {
        this._showToast('Shortcut combo already exists', 'error');
        return;
      }
      this._onShortcutAdded({ combo, label, description, actionType, actionParams, icon });
      this._showToast('Shortcut added ✨', 'success');
    }

    this._closeModal();
    this._renderShortcuts(this._searchInput?.value || '');
  }

  _deleteShortcut(combo) {
    this.config.removeUserShortcut(combo);
    this._onShortcutRemoved(combo);
    this._renderShortcuts(this._searchInput?.value || '');
    this._showToast('Shortcut removed', 'success');
  }

  _editShortcut(combo) {
    this._openModal(combo);
  }

  // ─── Toast ────────────────────────────────────────────────────

  _showToast(message, type = 'success') {
    const toast = this._toast;
    if (!toast) return;

    toast.textContent = message;
    toast.className = `cc-toast cc-${type} cc-visible`;

    clearTimeout(this._toastTimeout);
    this._toastTimeout = setTimeout(() => {
      toast.classList.remove('cc-visible');
    }, 2500);
  }

  // ─── Theme ────────────────────────────────────────────────────

  setTheme(theme) {
    this.host.setAttribute('data-theme', theme);
  }

  // ─── Helpers ──────────────────────────────────────────────────

  _escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ─── Action Template System ───────────────────────────────────

  /** Populate the action select dropdown with all available templates */
  _populateActionSelect() {
    const select = this._actionSelect;
    if (!select) return;

    const templates = ActionRunner.getTemplates();
    for (const t of templates) {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = `${t.icon}  ${t.label}`;
      select.appendChild(opt);
    }
  }

  /** Handle action type selection change */
  _onActionSelectChange() {
    const actionId = this._actionSelect.value;
    this._selectedActionType = actionId;

    const template = ActionRunner.getTemplate(actionId);
    const descEl = this._actionDescription;
    const paramsEl = this._actionParamsContainer;

    if (!template) {
      descEl.innerHTML = '';
      paramsEl.innerHTML = '';
      this._updateSaveButton();
      return;
    }

    // Show description
    descEl.innerHTML = `<div style="font-size:12px;color:var(--cc-text-muted);margin-top:6px;">${this._escapeHtml(template.description)}</div>`;

    // Render parameter fields
    if (template.params && template.params.length > 0) {
      paramsEl.innerHTML = template.params.map(p => `
        <div class="cc-field">
          <label class="cc-field-label">${this._escapeHtml(p.label)}${p.required ? ' *' : ''}</label>
          <input
            type="${p.type || 'text'}"
            class="cc-field-input cc-action-param"
            data-param-key="${this._escapeHtml(p.key)}"
            placeholder="${this._escapeHtml(p.placeholder || '')}"
            ${p.required ? 'required' : ''}
          />
        </div>
      `).join('');

      // Listen for input on params to update save button
      paramsEl.querySelectorAll('.cc-action-param').forEach(input => {
        input.addEventListener('input', () => this._updateSaveButton());
      });
    } else {
      paramsEl.innerHTML = '<div style="font-size:12px;color:var(--cc-success);margin-top:4px;">✅ No additional setup needed — just save!</div>';
    }

    this._updateSaveButton();
  }

  /** Collect values from the dynamic action param fields */
  _collectActionParams() {
    const params = {};
    const paramsEl = this._actionParamsContainer;
    if (!paramsEl) return params;

    paramsEl.querySelectorAll('.cc-action-param').forEach(input => {
      const key = input.dataset.paramKey;
      if (key) {
        params[key] = input.value;
      }
    });

    return params;
  }

  /** Restore saved param values when editing a shortcut */
  _restoreActionParams(savedParams) {
    const paramsEl = this._actionParamsContainer;
    if (!paramsEl || !savedParams) return;

    paramsEl.querySelectorAll('.cc-action-param').forEach(input => {
      const key = input.dataset.paramKey;
      if (key && savedParams[key] !== undefined) {
        input.value = savedParams[key];
      }
    });
  }

  // ─── Cleanup ──────────────────────────────────────────────────

  destroy() {
    clearTimeout(this._toastTimeout);
    if (this.host && this.host.parentNode) {
      this.host.parentNode.removeChild(this.host);
    }
  }
}

export default PaletteUI;
