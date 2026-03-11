/**
 * CommandCuts — Shortcut Config Manager
 * 
 * Manages admin-locked vs. user-editable shortcuts.
 * Handles localStorage persistence, export/import.
 */

class ShortcutConfig {
  /**
   * @param {string} [storageKey='commandcuts_user_shortcuts'] - localStorage key
   */
  constructor(storageKey = 'commandcuts_user_shortcuts') {
    this._storageKey = storageKey;
    /** @type {Array<{combo: string, label: string, description: string, icon: string, category: string, adminLocked: boolean}>} */
    this._adminShortcuts = [];
    /** @type {Array<{combo: string, label: string, description: string, icon: string, category: string}>} */
    this._userShortcuts = [];

    this._loadFromStorage();
  }

  // ─── Admin Shortcuts ──────────────────────────────────────────

  /**
   * Set admin shortcuts (typically called once during init).
   * These cannot be modified by end-users.
   * @param {Array} shortcuts
   */
  setAdminShortcuts(shortcuts) {
    this._adminShortcuts = shortcuts.map(s => ({
      combo: s.combo,
      label: s.label || s.combo,
      description: s.description || '',
      icon: s.icon || '🔒',
      category: s.category || 'Admin',
      adminLocked: true,
    }));
  }

  getAdminShortcuts() {
    return [...this._adminShortcuts];
  }

  // ─── User Shortcuts ───────────────────────────────────────────

  /**
   * Add a user shortcut.
   * @param {{combo: string, label: string, description?: string, icon?: string, category?: string}} shortcut
   * @returns {boolean}
   */
  addUserShortcut(shortcut) {
    // Check for duplicate combo
    if (this._userShortcuts.some(s => s.combo === shortcut.combo)) {
      return false;
    }
    // Check if it clashes with admin shortcuts
    if (this._adminShortcuts.some(s => s.combo === shortcut.combo)) {
      return false;
    }

    this._userShortcuts.push({
      combo: shortcut.combo,
      label: shortcut.label || shortcut.combo,
      description: shortcut.description || '',
      icon: shortcut.icon || '✏️',
      category: shortcut.category || 'Custom',
    });

    this._saveToStorage();
    return true;
  }

  /**
   * Remove a user shortcut by combo.
   * @param {string} combo
   * @returns {boolean}
   */
  removeUserShortcut(combo) {
    const idx = this._userShortcuts.findIndex(s => s.combo === combo);
    if (idx === -1) return false;
    this._userShortcuts.splice(idx, 1);
    this._saveToStorage();
    return true;
  }

  /**
   * Update a user shortcut (e.g. remap to a new combo).
   * @param {string} oldCombo
   * @param {Object} updates - fields to update
   * @returns {boolean}
   */
  updateUserShortcut(oldCombo, updates) {
    const shortcut = this._userShortcuts.find(s => s.combo === oldCombo);
    if (!shortcut) return false;

    if (updates.combo) shortcut.combo = updates.combo;
    if (updates.label) shortcut.label = updates.label;
    if (updates.description !== undefined) shortcut.description = updates.description;
    if (updates.icon) shortcut.icon = updates.icon;
    if (updates.category) shortcut.category = updates.category;

    this._saveToStorage();
    return true;
  }

  getUserShortcuts() {
    return [...this._userShortcuts];
  }

  // ─── Combined ─────────────────────────────────────────────────

  /**
   * Get all shortcuts (admin + user), admin first.
   * @returns {Array}
   */
  getAllShortcuts() {
    return [...this._adminShortcuts, ...this._userShortcuts];
  }

  // ─── Persistence ──────────────────────────────────────────────

  /** @private */
  _saveToStorage() {
    try {
      localStorage.setItem(this._storageKey, JSON.stringify(this._userShortcuts));
    } catch (e) {
      console.warn('[CommandCuts] Failed to save shortcuts to localStorage:', e);
    }
  }

  /** @private */
  _loadFromStorage() {
    try {
      const raw = localStorage.getItem(this._storageKey);
      if (raw) {
        this._userShortcuts = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('[CommandCuts] Failed to load shortcuts from localStorage:', e);
      this._userShortcuts = [];
    }
  }

  /**
   * Export all user shortcuts as a JSON string (for sharing).
   * @returns {string}
   */
  exportConfig() {
    return JSON.stringify(this._userShortcuts, null, 2);
  }

  /**
   * Import user shortcuts from a JSON string.
   * @param {string} json
   * @returns {boolean}
   */
  importConfig(json) {
    try {
      const parsed = JSON.parse(json);
      if (!Array.isArray(parsed)) return false;
      this._userShortcuts = parsed;
      this._saveToStorage();
      return true;
    } catch (e) {
      console.warn('[CommandCuts] Failed to import config:', e);
      return false;
    }
  }

  /**
   * Clear all user shortcuts.
   */
  clearUserShortcuts() {
    this._userShortcuts = [];
    this._saveToStorage();
  }
}

export default ShortcutConfig;
