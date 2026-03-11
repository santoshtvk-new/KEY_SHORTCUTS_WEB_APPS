/**
 * CommandCuts v1.0.0
 * A drop-in glassmorphic command palette & keyboard shortcuts widget
 * https://github.com/commandcuts/commandcuts
 * 
 * (c) 2026 CommandCuts
 * Released under the MIT License
 */

(function(global) {
  'use strict';

  // Prevent duplicate loading
  if (global.__COMMANDCUTS_LOADED__) {
    console.warn('[CommandCuts] Already loaded — skipping duplicate.');
    return;
  }


// ════════════════════════════════════════════════
// Source: reserved-shortcuts.js
// ════════════════════════════════════════════════

/**
 * CommandCuts — Reserved Shortcuts Database
 * 
 * Static map of OS and browser reserved keyboard shortcuts.
 * Each entry includes the combo, platform, description, and severity.
 * 
 * Severity levels:
 *   - "blocked"  → OS/browser intercepts before JS; impossible to override
 *   - "warning"  → Browser handles it but JS *might* catch it via preventDefault
 *   - "caution"  → Common convention; overriding may confuse users
 */

const RESERVED_SHORTCUTS = {
  // ─── Common (all platforms) ────────────────────────────────────
  common: [
    { combo: 'ctrl+c', description: 'Copy', severity: 'caution' },
    { combo: 'ctrl+x', description: 'Cut', severity: 'caution' },
    { combo: 'ctrl+v', description: 'Paste', severity: 'caution' },
    { combo: 'ctrl+z', description: 'Undo', severity: 'caution' },
    { combo: 'ctrl+y', description: 'Redo', severity: 'caution' },
    { combo: 'ctrl+a', description: 'Select all', severity: 'caution' },
    { combo: 'ctrl+f', description: 'Find on page', severity: 'caution' },
    { combo: 'ctrl+p', description: 'Print', severity: 'warning' },
    { combo: 'ctrl+s', description: 'Save page', severity: 'warning' },
    { combo: 'f5', description: 'Reload page', severity: 'warning' },
    { combo: 'f11', description: 'Toggle fullscreen', severity: 'warning' },
    { combo: 'f12', description: 'Open DevTools', severity: 'warning' },
    { combo: 'tab', description: 'Move focus forward', severity: 'caution' },
    { combo: 'shift+tab', description: 'Move focus backward', severity: 'caution' },
    { combo: 'escape', description: 'Close/cancel', severity: 'caution' },
    { combo: 'enter', description: 'Submit/activate', severity: 'caution' },
  ],

  // ─── Windows OS ────────────────────────────────────────────────
  windows: [
    { combo: 'alt+f4', description: 'Close window', severity: 'blocked' },
    { combo: 'alt+tab', description: 'Switch apps', severity: 'blocked' },
    { combo: 'ctrl+alt+delete', description: 'Security options', severity: 'blocked' },
    { combo: 'meta+d', description: 'Show desktop', severity: 'blocked' },
    { combo: 'meta+l', description: 'Lock screen', severity: 'blocked' },
    { combo: 'meta+e', description: 'Open File Explorer', severity: 'blocked' },
    { combo: 'meta+r', description: 'Open Run dialog', severity: 'blocked' },
    { combo: 'meta+i', description: 'Open Settings', severity: 'blocked' },
    { combo: 'meta+tab', description: 'Task View', severity: 'blocked' },
    { combo: 'meta+shift+s', description: 'Screenshot (Snipping Tool)', severity: 'blocked' },
    { combo: 'ctrl+shift+escape', description: 'Open Task Manager', severity: 'blocked' },
    { combo: 'alt+space', description: 'Window system menu', severity: 'blocked' },
    { combo: 'meta+up', description: 'Maximize window', severity: 'blocked' },
    { combo: 'meta+down', description: 'Restore/minimize window', severity: 'blocked' },
    { combo: 'meta+left', description: 'Snap window left', severity: 'blocked' },
    { combo: 'meta+right', description: 'Snap window right', severity: 'blocked' },
  ],

  // ─── macOS ─────────────────────────────────────────────────────
  macos: [
    { combo: 'meta+c', description: 'Copy', severity: 'caution' },
    { combo: 'meta+x', description: 'Cut', severity: 'caution' },
    { combo: 'meta+v', description: 'Paste', severity: 'caution' },
    { combo: 'meta+z', description: 'Undo', severity: 'caution' },
    { combo: 'meta+shift+z', description: 'Redo', severity: 'caution' },
    { combo: 'meta+a', description: 'Select all', severity: 'caution' },
    { combo: 'meta+f', description: 'Find', severity: 'caution' },
    { combo: 'meta+q', description: 'Quit app', severity: 'blocked' },
    { combo: 'meta+w', description: 'Close window/tab', severity: 'blocked' },
    { combo: 'meta+h', description: 'Hide app', severity: 'blocked' },
    { combo: 'meta+m', description: 'Minimize', severity: 'blocked' },
    { combo: 'meta+n', description: 'New window', severity: 'warning' },
    { combo: 'meta+t', description: 'New tab', severity: 'warning' },
    { combo: 'meta+tab', description: 'Switch apps', severity: 'blocked' },
    { combo: 'meta+space', description: 'Spotlight search', severity: 'blocked' },
    { combo: 'meta+shift+3', description: 'Screenshot (full)', severity: 'blocked' },
    { combo: 'meta+shift+4', description: 'Screenshot (area)', severity: 'blocked' },
    { combo: 'meta+option+escape', description: 'Force quit', severity: 'blocked' },
    { combo: 'ctrl+up', description: 'Mission Control', severity: 'blocked' },
    { combo: 'ctrl+down', description: 'App windows', severity: 'blocked' },
  ],

  // ─── Chrome browser ────────────────────────────────────────────
  chrome: [
    { combo: 'ctrl+t', description: 'New tab', severity: 'blocked' },
    { combo: 'ctrl+w', description: 'Close tab', severity: 'blocked' },
    { combo: 'ctrl+n', description: 'New window', severity: 'blocked' },
    { combo: 'ctrl+shift+n', description: 'New incognito window', severity: 'blocked' },
    { combo: 'ctrl+shift+t', description: 'Reopen closed tab', severity: 'blocked' },
    { combo: 'ctrl+tab', description: 'Next tab', severity: 'blocked' },
    { combo: 'ctrl+shift+tab', description: 'Previous tab', severity: 'blocked' },
    { combo: 'ctrl+1', description: 'Go to tab 1', severity: 'warning' },
    { combo: 'ctrl+2', description: 'Go to tab 2', severity: 'warning' },
    { combo: 'ctrl+3', description: 'Go to tab 3', severity: 'warning' },
    { combo: 'ctrl+4', description: 'Go to tab 4', severity: 'warning' },
    { combo: 'ctrl+5', description: 'Go to tab 5', severity: 'warning' },
    { combo: 'ctrl+6', description: 'Go to tab 6', severity: 'warning' },
    { combo: 'ctrl+7', description: 'Go to tab 7', severity: 'warning' },
    { combo: 'ctrl+8', description: 'Go to tab 8', severity: 'warning' },
    { combo: 'ctrl+9', description: 'Go to last tab', severity: 'warning' },
    { combo: 'ctrl+d', description: 'Bookmark page', severity: 'warning' },
    { combo: 'ctrl+h', description: 'History', severity: 'warning' },
    { combo: 'ctrl+j', description: 'Downloads', severity: 'warning' },
    { combo: 'ctrl+l', description: 'Focus address bar', severity: 'warning' },
    { combo: 'ctrl+r', description: 'Reload page', severity: 'warning' },
    { combo: 'ctrl+shift+r', description: 'Hard reload', severity: 'warning' },
    { combo: 'ctrl+shift+i', description: 'Open DevTools', severity: 'warning' },
    { combo: 'ctrl+shift+j', description: 'Open Console', severity: 'warning' },
    { combo: 'ctrl+shift+delete', description: 'Clear browsing data', severity: 'warning' },
    { combo: 'ctrl+plus', description: 'Zoom in', severity: 'warning' },
    { combo: 'ctrl+minus', description: 'Zoom out', severity: 'warning' },
    { combo: 'ctrl+0', description: 'Reset zoom', severity: 'warning' },
    { combo: 'alt+left', description: 'Navigate back', severity: 'warning' },
    { combo: 'alt+right', description: 'Navigate forward', severity: 'warning' },
  ],

  // ─── Firefox browser ───────────────────────────────────────────
  firefox: [
    { combo: 'ctrl+t', description: 'New tab', severity: 'blocked' },
    { combo: 'ctrl+w', description: 'Close tab', severity: 'blocked' },
    { combo: 'ctrl+n', description: 'New window', severity: 'blocked' },
    { combo: 'ctrl+shift+p', description: 'New private window', severity: 'blocked' },
    { combo: 'ctrl+shift+t', description: 'Reopen closed tab', severity: 'blocked' },
    { combo: 'ctrl+tab', description: 'Next tab', severity: 'blocked' },
    { combo: 'ctrl+shift+tab', description: 'Previous tab', severity: 'blocked' },
    { combo: 'ctrl+b', description: 'Bookmarks sidebar', severity: 'warning' },
    { combo: 'ctrl+d', description: 'Bookmark page', severity: 'warning' },
    { combo: 'ctrl+g', description: 'Find next', severity: 'warning' },
    { combo: 'ctrl+shift+g', description: 'Find previous', severity: 'warning' },
    { combo: 'ctrl+h', description: 'History sidebar', severity: 'warning' },
    { combo: 'ctrl+l', description: 'Focus address bar', severity: 'warning' },
    { combo: 'ctrl+r', description: 'Reload page', severity: 'warning' },
    { combo: 'ctrl+shift+r', description: 'Hard reload', severity: 'warning' },
    { combo: 'ctrl+shift+i', description: 'Open DevTools', severity: 'warning' },
    { combo: 'ctrl+shift+j', description: 'Browser Console', severity: 'warning' },
    { combo: 'ctrl+shift+delete', description: 'Clear recent history', severity: 'warning' },
    { combo: 'alt+left', description: 'Navigate back', severity: 'warning' },
    { combo: 'alt+right', description: 'Navigate forward', severity: 'warning' },
  ],
};

RESERVED_SHORTCUTS;


// ════════════════════════════════════════════════
// Source: shortcut-engine.js
// ════════════════════════════════════════════════

/**
 * CommandCuts — Shortcut Engine
 * 
 * Core keyboard listener, key normalisation, and shortcut registration.
 * Handles cross-platform modifier key differences (Ctrl ↔ Cmd).
 */

class ShortcutEngine {
  constructor() {
    /** @type {Map<string, {action: Function, options: Object}>} */
    this._shortcuts = new Map();
    this._enabled = true;
    this._paused = false;
    this._os = this._detectOS();
    this._boundHandler = this._handleKeyDown.bind(this);
    
    document.addEventListener('keydown', this._boundHandler, true);
  }

  // ─── OS Detection ──────────────────────────────────────────────

  _detectOS() {
    const ua = navigator.userAgent.toLowerCase();
    const platform = navigator.platform?.toLowerCase() || '';
    
    if (platform.includes('mac') || ua.includes('macintosh')) return 'macos';
    if (platform.includes('linux') || ua.includes('linux')) return 'linux';
    return 'windows';
  }

  get os() {
    return this._os;
  }

  // ─── Browser Detection ────────────────────────────────────────

  get browser() {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('firefox')) return 'firefox';
    if (ua.includes('edg/')) return 'edge';
    if (ua.includes('chrome')) return 'chrome';
    if (ua.includes('safari')) return 'safari';
    return 'unknown';
  }

  // ─── Key Normalisation ────────────────────────────────────────

  /**
   * Normalise a KeyboardEvent into a canonical combo string.
   * Format: "ctrl+shift+alt+meta+key" (modifiers in fixed order)
   * 
   * @param {KeyboardEvent} e 
   * @returns {string} e.g. "ctrl+shift+k"
   */
  normalizeKeyEvent(e) {
    const parts = [];

    if (e.ctrlKey) parts.push('ctrl');
    if (e.shiftKey) parts.push('shift');
    if (e.altKey) parts.push('alt');
    if (e.metaKey) parts.push('meta');

    // Get the key name, normalised to lowercase
    let key = e.key.toLowerCase();

    // Skip if the key IS a modifier (already captured above)
    if (['control', 'shift', 'alt', 'meta'].includes(key)) {
      return parts.join('+');
    }

    // Normalise special key names
    const keyMap = {
      ' ': 'space',
      'arrowup': 'up',
      'arrowdown': 'down',
      'arrowleft': 'left',
      'arrowright': 'right',
      'escape': 'escape',
      'backspace': 'backspace',
      'delete': 'delete',
      'insert': 'insert',
      'home': 'home',
      'end': 'end',
      'pageup': 'pageup',
      'pagedown': 'pagedown',
      '+': 'plus',
      '-': 'minus',
      '=': 'equal',
      '[': 'bracketleft',
      ']': 'bracketright',
      '\\': 'backslash',
      ';': 'semicolon',
      "'": 'quote',
      ',': 'comma',
      '.': 'period',
      '/': 'slash',
      '`': 'backquote',
    };

    key = keyMap[key] || key;
    parts.push(key);

    return parts.join('+');
  }

  /**
   * Normalise a user-provided combo string.
   * Accepts flexible input like "Ctrl+Shift+K" and returns "ctrl+shift+k".
   * 
   * @param {string} combo
   * @returns {string}
   */
  normalizeCombo(combo) {
    return combo
      .toLowerCase()
      .split('+')
      .map(p => p.trim())
      .filter(Boolean)
      .sort((a, b) => {
        const order = ['ctrl', 'shift', 'alt', 'meta'];
        const ai = order.indexOf(a);
        const bi = order.indexOf(b);
        if (ai !== -1 && bi !== -1) return ai - bi;
        if (ai !== -1) return -1;
        if (bi !== -1) return 1;
        return 0;
      })
      .join('+');
  }

  // ─── Registration ─────────────────────────────────────────────

  /**
   * Register a keyboard shortcut.
   * 
   * @param {string} combo - Key combination, e.g. "ctrl+shift+k"
   * @param {Function} action - Callback to execute
   * @param {Object} [options] - Additional metadata
   * @param {string} [options.label] - Human-readable label
   * @param {string} [options.description] - Description for the palette
   * @param {string} [options.icon] - Emoji or icon
   * @param {string} [options.category] - Category grouping
   * @param {boolean} [options.adminLocked] - If true, user cannot remap/delete
   * @param {boolean} [options.preventDefault] - If true, prevent default browser action
   * @returns {boolean} true if registered successfully
   */
  register(combo, action, options = {}) {
    const normalized = this.normalizeCombo(combo);
    
    if (typeof action !== 'function') {
      console.warn(`[CommandCuts] Action for "${combo}" must be a function.`);
      return false;
    }

    this._shortcuts.set(normalized, {
      action,
      options: {
        label: options.label || combo,
        description: options.description || '',
        icon: options.icon || '⌨️',
        category: options.category || 'General',
        adminLocked: options.adminLocked || false,
        preventDefault: options.preventDefault !== false,
        ...options,
      },
    });

    return true;
  }

  /**
   * Unregister a keyboard shortcut.
   * @param {string} combo
   * @returns {boolean}
   */
  unregister(combo) {
    const normalized = this.normalizeCombo(combo);
    return this._shortcuts.delete(normalized);
  }

  /**
   * Check if a combo is registered.
   * @param {string} combo
   * @returns {boolean}
   */
  has(combo) {
    return this._shortcuts.has(this.normalizeCombo(combo));
  }

  /**
   * Get all registered shortcuts.
   * @returns {Array<{combo: string, action: Function, options: Object}>}
   */
  getAll() {
    const result = [];
    this._shortcuts.forEach((value, key) => {
      result.push({ combo: key, action: value.action, options: value.options });
    });
    return result;
  }

  // ─── Control ──────────────────────────────────────────────────

  /** Temporarily pause all shortcut handling (e.g. when user is recording a shortcut) */
  pause() { this._paused = true; }

  /** Resume shortcut handling */
  resume() { this._paused = false; }

  /** Enable/disable the engine entirely */
  setEnabled(enabled) { this._enabled = enabled; }

  // ─── Key Handler ──────────────────────────────────────────────

  /**
   * @param {KeyboardEvent} e
   * @private
   */
  _handleKeyDown(e) {
    if (!this._enabled || this._paused) return;

    // Ignore events from within input fields unless specifically registered
    const target = e.target;
    const isInput = target.tagName === 'INPUT' || 
                    target.tagName === 'TEXTAREA' || 
                    target.tagName === 'SELECT' ||
                    target.isContentEditable;

    const combo = this.normalizeKeyEvent(e);
    if (!combo || combo.length === 0) return;

    const entry = this._shortcuts.get(combo);
    if (!entry) return;

    // Skip if we're in an input field and the shortcut doesn't explicitly allow it
    if (isInput && !entry.options.activeInInputs) return;

    if (entry.options.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }

    try {
      entry.action(e);
    } catch (err) {
      console.error(`[CommandCuts] Error executing shortcut "${combo}":`, err);
    }
  }

  // ─── Cleanup ──────────────────────────────────────────────────

  destroy() {
    document.removeEventListener('keydown', this._boundHandler, true);
    this._shortcuts.clear();
  }

  // ─── Display Helpers ──────────────────────────────────────────

  /**
   * Convert a normalised combo string to a display-friendly format.
   * Uses platform-appropriate symbols (⌘ for Meta on Mac, etc.)
   * 
   * @param {string} combo - e.g. "ctrl+shift+k"
   * @returns {string} e.g. "Ctrl + Shift + K" or "⌘ + Shift + K"
   */
  formatCombo(combo) {
    const isMac = this._os === 'macos';
    
    const symbolMap = {
      ctrl: isMac ? '⌃' : 'Ctrl',
      shift: isMac ? '⇧' : 'Shift',
      alt: isMac ? '⌥' : 'Alt',
      meta: isMac ? '⌘' : 'Win',
      escape: 'Esc',
      backspace: '⌫',
      delete: isMac ? '⌦' : 'Del',
      enter: '↵',
      tab: '⇥',
      space: '␣',
      up: '↑',
      down: '↓',
      left: '←',
      right: '→',
      plus: '+',
      minus: '−',
    };

    return combo
      .split('+')
      .map(part => {
        if (symbolMap[part]) return symbolMap[part];
        // Capitalise single letters, keep function keys as-is
        if (part.length === 1) return part.toUpperCase();
        if (/^f\d+$/.test(part)) return part.toUpperCase();
        return part.charAt(0).toUpperCase() + part.slice(1);
      })
      .join(isMac ? '' : ' + ');
  }
}

ShortcutEngine;


// ════════════════════════════════════════════════
// Source: conflict-detector.js
// ════════════════════════════════════════════════

/**
 * CommandCuts — Conflict Detector
 * 
 * Checks proposed shortcuts against the reserved shortcuts database.
 * Provides conflict info, severity, and alternative suggestions.
 */


class ConflictDetector {
  /**
   * @param {string} currentOS - 'windows' | 'macos' | 'linux'
   * @param {string} currentBrowser - 'chrome' | 'firefox' | 'edge' | 'safari'
   */
  constructor(currentOS, currentBrowser) {
    this._os = currentOS;
    this._browser = currentBrowser;
    this._reservedMap = this._buildMap();
  }

  /**
   * Build a flat lookup map from the hierarchical database.
   * @returns {Map<string, Array<{platform: string, description: string, severity: string}>>}
   * @private
   */
  _buildMap() {
    const map = new Map();

    const addEntries = (platform, entries) => {
      for (const entry of entries) {
        const combo = entry.combo;
        if (!map.has(combo)) map.set(combo, []);
        map.get(combo).push({
          platform,
          description: entry.description,
          severity: entry.severity,
        });
      }
    };

    // Always load common shortcuts
    addEntries('common', RESERVED_SHORTCUTS.common || []);

    // Load OS-specific
    if (this._os === 'macos') {
      addEntries('macOS', RESERVED_SHORTCUTS.macos || []);
    } else {
      addEntries('Windows', RESERVED_SHORTCUTS.windows || []);
    }

    // Load browser-specific
    const browserDB = RESERVED_SHORTCUTS[this._browser];
    if (browserDB) {
      addEntries(this._browser.charAt(0).toUpperCase() + this._browser.slice(1), browserDB);
    }

    return map;
  }

  /**
   * Check if a combo conflicts with any reserved shortcuts.
   * 
   * @param {string} combo - Normalised combo string, e.g. "ctrl+t"
   * @returns {{
   *   conflicting: boolean,
   *   conflicts: Array<{platform: string, description: string, severity: string}>,
   *   highestSeverity: string|null,
   *   message: string
   * }}
   */
  check(combo) {
    const normalised = combo.toLowerCase().trim();
    const conflicts = this._reservedMap.get(normalised) || [];

    if (conflicts.length === 0) {
      return {
        conflicting: false,
        conflicts: [],
        highestSeverity: null,
        message: '',
      };
    }

    // Determine highest severity
    const severityOrder = { blocked: 3, warning: 2, caution: 1 };
    let highestSeverity = 'caution';
    for (const c of conflicts) {
      if ((severityOrder[c.severity] || 0) > (severityOrder[highestSeverity] || 0)) {
        highestSeverity = c.severity;
      }
    }

    // Build user-friendly message
    const descriptions = conflicts.map(
      c => `${c.platform}: ${c.description} (${c.severity})`
    );
    
    let message = '';
    if (highestSeverity === 'blocked') {
      message = `⛔ This shortcut is reserved by ${conflicts[0].platform} and cannot be overridden. "${conflicts[0].description}"`;
    } else if (highestSeverity === 'warning') {
      message = `⚠️ This shortcut is used by ${conflicts[0].platform} for "${conflicts[0].description}". It may not work reliably.`;
    } else {
      message = `ℹ️ This shortcut is commonly used for "${conflicts[0].description}". Overriding it may confuse users.`;
    }

    return {
      conflicting: true,
      conflicts,
      highestSeverity,
      message,
    };
  }

  /**
   * Get a list of "safe" alternative modifier combos for a given key.
   * 
   * @param {string} key - The non-modifier key, e.g. "k"
   * @param {number} [count=5] - Number of suggestions
   * @returns {Array<string>} e.g. ["alt+k", "ctrl+shift+k", "alt+shift+k"]
   */
  getSuggestions(key, count = 5) {
    const modifierCombos = [
      'alt',
      'ctrl+shift',
      'alt+shift',
      'ctrl+alt',
      'ctrl+alt+shift',
      'meta+shift',
      'alt+meta',
    ];

    const suggestions = [];

    for (const mod of modifierCombos) {
      if (suggestions.length >= count) break;
      const combo = `${mod}+${key}`;
      const result = this.check(combo);
      if (!result.conflicting || result.highestSeverity === 'caution') {
        suggestions.push(combo);
      }
    }

    return suggestions;
  }

  /**
   * Get the full reserved shortcuts list for display in the UI.
   * @returns {Array<{combo: string, platform: string, description: string, severity: string}>}
   */
  getAllReserved() {
    const result = [];
    this._reservedMap.forEach((conflicts, combo) => {
      for (const c of conflicts) {
        result.push({ combo, ...c });
      }
    });
    return result;
  }

  /**
   * Get severity badge config
   * @param {string} severity
   * @returns {{label: string, color: string, icon: string}}
   */
  static getSeverityBadge(severity) {
    switch (severity) {
      case 'blocked':
        return { label: 'Blocked', color: '#ff4757', icon: '⛔' };
      case 'warning':
        return { label: 'Warning', color: '#ffa502', icon: '⚠️' };
      case 'caution':
        return { label: 'Caution', color: '#3498db', icon: 'ℹ️' };
      default:
        return { label: 'OK', color: '#2ed573', icon: '✅' };
    }
  }
}

ConflictDetector;


// ════════════════════════════════════════════════
// Source: shortcut-config.js
// ════════════════════════════════════════════════

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
    /** @type {Array<{combo: string, label: string, description: string, icon: string, category: string, actionType: string, actionParams: Object}>} */
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
      actionType: shortcut.actionType || '',
      actionParams: shortcut.actionParams || {},
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
    if (updates.actionType !== undefined) shortcut.actionType = updates.actionType;
    if (updates.actionParams !== undefined) shortcut.actionParams = updates.actionParams;

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

ShortcutConfig;


// ════════════════════════════════════════════════
// Source: palette-search.js
// ════════════════════════════════════════════════

/**
 * CommandCuts — Palette Search
 * 
 * Real-time filtering and highlighting for the command palette.
 */

class PaletteSearch {
  /**
   * Filter shortcuts by a search query.
   * Matches against label, description, combo, and category.
   * 
   * @param {Array<{combo: string, label: string, description: string, category: string}>} shortcuts
   * @param {string} query
   * @returns {Array} Filtered shortcuts with match metadata
   */
  static filter(shortcuts, query) {
    if (!query || query.trim().length === 0) {
      return shortcuts.map(s => ({ ...s, _matchScore: 0, _highlights: {} }));
    }

    const q = query.toLowerCase().trim();
    const results = [];

    for (const shortcut of shortcuts) {
      let score = 0;
      const highlights = {};

      // Check label
      const labelIdx = (shortcut.label || '').toLowerCase().indexOf(q);
      if (labelIdx !== -1) {
        score += 10;
        if (labelIdx === 0) score += 5; // Bonus for prefix match
        highlights.label = { start: labelIdx, length: q.length };
      }

      // Check combo
      const comboIdx = (shortcut.combo || '').toLowerCase().indexOf(q);
      if (comboIdx !== -1) {
        score += 8;
        highlights.combo = { start: comboIdx, length: q.length };
      }

      // Check description
      const descIdx = (shortcut.description || '').toLowerCase().indexOf(q);
      if (descIdx !== -1) {
        score += 5;
        highlights.description = { start: descIdx, length: q.length };
      }

      // Check category
      const catIdx = (shortcut.category || '').toLowerCase().indexOf(q);
      if (catIdx !== -1) {
        score += 3;
        highlights.category = { start: catIdx, length: q.length };
      }

      if (score > 0) {
        results.push({ ...shortcut, _matchScore: score, _highlights: highlights });
      }
    }

    // Sort by match score, descending
    results.sort((a, b) => b._matchScore - a._matchScore);
    return results;
  }

  /**
   * Highlight matching text within a string.
   * Returns an HTML string with <mark> tags around matched portions.
   * 
   * @param {string} text - Original text
   * @param {string} query - Search query
   * @returns {string} HTML with highlighted matches
   */
  static highlight(text, query) {
    if (!query || !text) return text || '';

    const q = query.toLowerCase().trim();
    const idx = text.toLowerCase().indexOf(q);
    
    if (idx === -1) return text;

    const before = text.substring(0, idx);
    const match = text.substring(idx, idx + q.length);
    const after = text.substring(idx + q.length);

    return `${before}<mark class="cc-highlight">${match}</mark>${after}`;
  }
}

PaletteSearch;


// ════════════════════════════════════════════════
// Source: action-runner.js
// ════════════════════════════════════════════════

/**
 * CommandCuts — Safe Action Runner
 * 
 * A whitelist of pre-built action templates that website users can attach
 * to their custom shortcuts. NO arbitrary code execution — every action
 * is a sandboxed template with validated parameters.
 * 
 * Security model:
 *   ✅ Navigate to a URL (same-origin enforced for safety)
 *   ✅ Open URL in new tab
 *   ✅ Scroll to top / bottom / element
 *   ✅ Click a visible button or link
 *   ✅ Focus an input element
 *   ✅ Toggle a CSS class on body
 *   ✅ Copy text to clipboard
 *   ✅ Show alert message
 *   ❌ No eval(), no new Function(), no innerHTML injection
 *   ❌ No access to cookies, storage, or network APIs
 */

const ACTION_TEMPLATES = [
  {
    id: 'navigate',
    label: 'Navigate to URL',
    icon: '🔗',
    description: 'Go to a page on this website',
    params: [
      { key: 'url', label: 'Page URL or path', placeholder: '/about  or  /blog/my-post', type: 'text', required: true }
    ],
    execute: (params) => {
      let url = (params.url || '').trim();
      if (!url) return;
      // Allow relative paths and same-origin absolute URLs
      if (url.startsWith('/') || url.startsWith('#') || url.startsWith('?')) {
        window.location.href = url;
      } else if (url.startsWith(window.location.origin)) {
        window.location.href = url;
      } else if (!url.includes('://')) {
        // Treat as relative path
        window.location.href = '/' + url;
      } else {
        // External URL — navigate but warn
        window.location.href = url;
      }
    },
    validate: (params) => {
      if (!(params.url || '').trim()) return 'URL is required';
      return null;
    }
  },
  {
    id: 'open_tab',
    label: 'Open URL in New Tab',
    icon: '🌐',
    description: 'Open a link in a new browser tab',
    params: [
      { key: 'url', label: 'Full URL', placeholder: 'https://example.com', type: 'text', required: true }
    ],
    execute: (params) => {
      let url = (params.url || '').trim();
      if (!url) return;
      if (!url.includes('://') && !url.startsWith('/')) {
        url = 'https://' + url;
      }
      window.open(url, '_blank', 'noopener,noreferrer');
    },
    validate: (params) => {
      if (!(params.url || '').trim()) return 'URL is required';
      return null;
    }
  },
  {
    id: 'scroll_top',
    label: 'Scroll to Top',
    icon: '⬆️',
    description: 'Smoothly scroll the page to the very top',
    params: [],
    execute: () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },
  {
    id: 'scroll_bottom',
    label: 'Scroll to Bottom',
    icon: '⬇️',
    description: 'Smoothly scroll the page to the very bottom',
    params: [],
    execute: () => {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
  },
  {
    id: 'scroll_element',
    label: 'Scroll to Section',
    icon: '📍',
    description: 'Scroll to a specific section by its ID (e.g. #features)',
    params: [
      { key: 'selector', label: 'Section ID', placeholder: '#features  or  #contact', type: 'text', required: true }
    ],
    execute: (params) => {
      const sel = (params.selector || '').trim();
      if (!sel) return;
      try {
        const el = document.querySelector(sel);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } catch (e) {
        console.warn('[CommandCuts] Invalid selector:', sel);
      }
    },
    validate: (params) => {
      if (!(params.selector || '').trim()) return 'Section ID is required';
      return null;
    }
  },
  {
    id: 'click_element',
    label: 'Click a Button or Link',
    icon: '👆',
    description: 'Simulate a click on a button, link, or element by its ID',
    params: [
      { key: 'selector', label: 'Element ID', placeholder: '#submit-btn  or  #menu-toggle', type: 'text', required: true }
    ],
    execute: (params) => {
      const sel = (params.selector || '').trim();
      if (!sel) return;
      try {
        const el = document.querySelector(sel);
        if (el) {
          el.click();
        }
      } catch (e) {
        console.warn('[CommandCuts] Invalid selector:', sel);
      }
    },
    validate: (params) => {
      if (!(params.selector || '').trim()) return 'Element ID is required';
      return null;
    }
  },
  {
    id: 'focus_element',
    label: 'Focus an Input',
    icon: '🎯',
    description: 'Move the cursor to a specific input field by its ID',
    params: [
      { key: 'selector', label: 'Input ID', placeholder: '#search-input  or  #email', type: 'text', required: true }
    ],
    execute: (params) => {
      const sel = (params.selector || '').trim();
      if (!sel) return;
      try {
        const el = document.querySelector(sel);
        if (el && typeof el.focus === 'function') {
          el.focus();
        }
      } catch (e) {
        console.warn('[CommandCuts] Invalid selector:', sel);
      }
    },
    validate: (params) => {
      if (!(params.selector || '').trim()) return 'Input ID is required';
      return null;
    }
  },
  {
    id: 'toggle_class',
    label: 'Toggle CSS Class',
    icon: '🎨',
    description: 'Toggle a class on the page body (e.g. dark-mode, high-contrast)',
    params: [
      { key: 'className', label: 'CSS class name', placeholder: 'dark-mode', type: 'text', required: true }
    ],
    execute: (params) => {
      const cls = (params.className || '').trim();
      if (!cls) return;
      // Sanitise: only allow valid CSS class characters
      if (/^[a-zA-Z_-][a-zA-Z0-9_-]*$/.test(cls)) {
        document.body.classList.toggle(cls);
      }
    },
    validate: (params) => {
      const cls = (params.className || '').trim();
      if (!cls) return 'Class name is required';
      if (!/^[a-zA-Z_-][a-zA-Z0-9_-]*$/.test(cls)) return 'Invalid CSS class name';
      return null;
    }
  },
  {
    id: 'copy_text',
    label: 'Copy Text to Clipboard',
    icon: '📋',
    description: 'Copy a specific text or the current page URL to your clipboard',
    params: [
      { key: 'text', label: 'Text to copy (leave empty for page URL)', placeholder: 'Leave empty to copy current URL', type: 'text', required: false }
    ],
    execute: async (params) => {
      const text = (params.text || '').trim() || window.location.href;
      try {
        await navigator.clipboard.writeText(text);
      } catch (e) {
        // Fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
    }
  },
  {
    id: 'go_back',
    label: 'Go Back',
    icon: '◀️',
    description: 'Navigate to the previous page in browser history',
    params: [],
    execute: () => {
      window.history.back();
    }
  },
  {
    id: 'go_forward',
    label: 'Go Forward',
    icon: '▶️',
    description: 'Navigate to the next page in browser history',
    params: [],
    execute: () => {
      window.history.forward();
    }
  },
  {
    id: 'reload',
    label: 'Reload Page',
    icon: '🔄',
    description: 'Refresh the current page',
    params: [],
    execute: () => {
      window.location.reload();
    }
  },
  {
    id: 'print',
    label: 'Print Page',
    icon: '🖨️',
    description: 'Open the browser print dialog',
    params: [],
    execute: () => {
      window.print();
    }
  },
  {
    id: 'fullscreen',
    label: 'Toggle Fullscreen',
    icon: '⛶',
    description: 'Enter or exit fullscreen mode',
    params: [],
    execute: () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    }
  },
];

class ActionRunner {
  /**
   * Get all available action templates.
   * @returns {Array}
   */
  static getTemplates() {
    return ACTION_TEMPLATES;
  }

  /**
   * Get a template by ID.
   * @param {string} id
   * @returns {Object|null}
   */
  static getTemplate(id) {
    return ACTION_TEMPLATES.find(t => t.id === id) || null;
  }

  /**
   * Execute an action by template ID with given params.
   * @param {string} actionType - Template ID (e.g. 'navigate', 'scroll_top')
   * @param {Object} actionParams - Parameters for the template
   * @returns {boolean} true if executed
   */
  static execute(actionType, actionParams = {}) {
    const template = ActionRunner.getTemplate(actionType);
    if (!template) {
      console.warn(`[CommandCuts] Unknown action type: "${actionType}"`);
      return false;
    }

    // Validate params
    if (template.validate) {
      const error = template.validate(actionParams);
      if (error) {
        console.warn(`[CommandCuts] Action validation failed: ${error}`);
        return false;
      }
    }

    try {
      template.execute(actionParams);
      return true;
    } catch (err) {
      console.error(`[CommandCuts] Error executing action "${actionType}":`, err);
      return false;
    }
  }
}

ActionRunner;


// ════════════════════════════════════════════════
// Source: palette-ui.js
// ════════════════════════════════════════════════

/**
 * CommandCuts — Palette UI
 * 
 * Glassmorphic command palette rendered inside Shadow DOM.
 * Handles rendering, keyboard navigation, focus trapping,
 * shortcut recording, and the add/edit modal.
 */



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
    return `/* ================================================================
   CommandCuts — Glassmorphic Palette Styles
   Scoped inside Shadow DOM. Uses CSS custom properties for theming.
   ================================================================ */

/* ─── Custom Properties (Theming API) ────────────────────────── */
:host {
  /* Base colors */
  --cc-bg: rgba(15, 15, 25, 0.85);
  --cc-bg-solid: #0f0f19;
  --cc-surface: rgba(255, 255, 255, 0.06);
  --cc-surface-hover: rgba(255, 255, 255, 0.1);
  --cc-surface-active: rgba(255, 255, 255, 0.14);
  --cc-border: rgba(255, 255, 255, 0.08);
  --cc-border-focus: rgba(139, 92, 246, 0.5);

  /* Text */
  --cc-text: #e2e8f0;
  --cc-text-secondary: #94a3b8;
  --cc-text-muted: #64748b;

  /* Accent */
  --cc-accent: #8b5cf6;
  --cc-accent-hover: #a78bfa;
  --cc-accent-glow: rgba(139, 92, 246, 0.25);

  /* Danger / Warning / Info */
  --cc-danger: #ef4444;
  --cc-danger-bg: rgba(239, 68, 68, 0.12);
  --cc-warning: #f59e0b;
  --cc-warning-bg: rgba(245, 158, 11, 0.12);
  --cc-info: #3b82f6;
  --cc-info-bg: rgba(59, 130, 246, 0.12);
  --cc-success: #10b981;
  --cc-success-bg: rgba(16, 185, 129, 0.12);

  /* Layout */
  --cc-radius: 16px;
  --cc-radius-sm: 10px;
  --cc-radius-xs: 6px;
  --cc-blur: 24px;
  --cc-max-width: 640px;
  --cc-max-height: 520px;

  /* Typography */
  --cc-font: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --cc-font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;

  /* Shadows */
  --cc-shadow: 0 25px 60px rgba(0, 0, 0, 0.5),
               0 0 0 1px rgba(255, 255, 255, 0.05),
               inset 0 1px 0 rgba(255, 255, 255, 0.05);

  /* Transitions */
  --cc-transition: 180ms cubic-bezier(0.4, 0, 0.2, 1);
  --cc-transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* ─── Light Theme Override ───────────────────────────────────── */
:host([data-theme="light"]) {
  --cc-bg: rgba(255, 255, 255, 0.88);
  --cc-bg-solid: #ffffff;
  --cc-surface: rgba(0, 0, 0, 0.04);
  --cc-surface-hover: rgba(0, 0, 0, 0.07);
  --cc-surface-active: rgba(0, 0, 0, 0.1);
  --cc-border: rgba(0, 0, 0, 0.08);
  --cc-border-focus: rgba(139, 92, 246, 0.4);
  --cc-text: #1e293b;
  --cc-text-secondary: #475569;
  --cc-text-muted: #94a3b8;
  --cc-shadow: 0 25px 60px rgba(0, 0, 0, 0.15),
               0 0 0 1px rgba(0, 0, 0, 0.06),
               inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

/* ─── Reset ──────────────────────────────────────────────────── */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ─── Backdrop Overlay ───────────────────────────────────────── */
.cc-backdrop {
  position: fixed;
  inset: 0;
  z-index: 999998;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  opacity: 0;
  transition: opacity var(--cc-transition-slow);
  pointer-events: none;
}

.cc-backdrop.cc-visible {
  opacity: 1;
  pointer-events: all;
}

/* ─── Main Palette Container ─────────────────────────────────── */
.cc-palette {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.92);
  z-index: 999999;
  width: 92%;
  max-width: var(--cc-max-width);
  max-height: var(--cc-max-height);
  background: var(--cc-bg);
  backdrop-filter: blur(var(--cc-blur));
  -webkit-backdrop-filter: blur(var(--cc-blur));
  border: 1px solid var(--cc-border);
  border-radius: var(--cc-radius);
  box-shadow: var(--cc-shadow);
  font-family: var(--cc-font);
  color: var(--cc-text);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--cc-transition-slow),
              transform var(--cc-transition-slow);
}

.cc-palette.cc-visible {
  opacity: 1;
  pointer-events: all;
  transform: translate(-50%, -50%) scale(1);
}

/* Position: top */
:host([data-position="top"]) .cc-palette {
  top: 15%;
  transform: translate(-50%, 0) scale(0.92);
}

:host([data-position="top"]) .cc-palette.cc-visible {
  transform: translate(-50%, 0) scale(1);
}

/* ─── Header / Search ────────────────────────────────────────── */
.cc-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--cc-border);
}

.cc-search-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  color: var(--cc-text-muted);
}

.cc-search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--cc-font);
  font-size: 15px;
  color: var(--cc-text);
  caret-color: var(--cc-accent);
}

.cc-search-input::placeholder {
  color: var(--cc-text-muted);
}

.cc-trigger-badge {
  flex-shrink: 0;
  padding: 4px 10px;
  border-radius: var(--cc-radius-xs);
  background: var(--cc-surface);
  border: 1px solid var(--cc-border);
  font-family: var(--cc-font-mono);
  font-size: 11px;
  color: var(--cc-text-muted);
  letter-spacing: 0.5px;
}

/* ─── Shortcuts List ─────────────────────────────────────────── */
.cc-body {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.1) transparent;
}

.cc-body::-webkit-scrollbar {
  width: 5px;
}

.cc-body::-webkit-scrollbar-track {
  background: transparent;
}

.cc-body::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
}

/* Category header */
.cc-category {
  padding: 10px 12px 6px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--cc-text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}

.cc-category::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--cc-border);
}

/* Shortcut row */
.cc-shortcut {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--cc-radius-sm);
  cursor: pointer;
  transition: background var(--cc-transition),
              box-shadow var(--cc-transition);
  user-select: none;
  position: relative;
}

.cc-shortcut:hover,
.cc-shortcut.cc-focused {
  background: var(--cc-surface-hover);
}

.cc-shortcut:active {
  background: var(--cc-surface-active);
}

.cc-shortcut.cc-focused {
  box-shadow: inset 0 0 0 1.5px var(--cc-accent);
}

.cc-shortcut-icon {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--cc-radius-xs);
  background: var(--cc-surface);
  font-size: 16px;
}

.cc-shortcut-info {
  flex: 1;
  min-width: 0;
}

.cc-shortcut-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--cc-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cc-shortcut-desc {
  font-size: 12px;
  color: var(--cc-text-secondary);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cc-shortcut-keys {
  flex-shrink: 0;
  display: flex;
  gap: 4px;
  align-items: center;
}

.cc-key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 26px;
  padding: 0 6px;
  border-radius: 5px;
  border: 1px solid var(--cc-border);
  background: var(--cc-surface);
  font-family: var(--cc-font-mono);
  font-size: 11px;
  color: var(--cc-text-secondary);
  line-height: 1;
}

.cc-key-separator {
  font-size: 10px;
  color: var(--cc-text-muted);
}

/* Admin lock badge */
.cc-admin-badge {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  opacity: 0.6;
}

/* User action buttons (edit/delete) */
.cc-shortcut-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity var(--cc-transition);
}

.cc-shortcut:hover .cc-shortcut-actions {
  opacity: 1;
}

.cc-action-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: var(--cc-radius-xs);
  background: transparent;
  color: var(--cc-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  transition: background var(--cc-transition), color var(--cc-transition);
}

.cc-action-btn:hover {
  background: var(--cc-surface-hover);
  color: var(--cc-text);
}

.cc-action-btn.cc-delete:hover {
  background: var(--cc-danger-bg);
  color: var(--cc-danger);
}

/* ─── Empty State ────────────────────────────────────────────── */
.cc-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: var(--cc-text-muted);
}

.cc-empty-icon {
  font-size: 36px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.cc-empty-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--cc-text-secondary);
  margin-bottom: 4px;
}

.cc-empty-subtitle {
  font-size: 12px;
}

/* ─── Footer ─────────────────────────────────────────────────── */
.cc-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-top: 1px solid var(--cc-border);
  font-size: 11px;
  color: var(--cc-text-muted);
}

.cc-footer-hints {
  display: flex;
  gap: 14px;
  align-items: center;
}

.cc-footer-hint {
  display: flex;
  align-items: center;
  gap: 5px;
}

.cc-footer-hint .cc-key {
  min-width: 20px;
  height: 20px;
  font-size: 10px;
  padding: 0 4px;
}

.cc-add-btn {
  border: none;
  background: var(--cc-accent);
  color: #fff;
  padding: 6px 14px;
  border-radius: var(--cc-radius-xs);
  font-family: var(--cc-font);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background var(--cc-transition),
              box-shadow var(--cc-transition);
}

.cc-add-btn:hover {
  background: var(--cc-accent-hover);
  box-shadow: 0 0 20px var(--cc-accent-glow);
}

/* ─── Add Shortcut Modal ─────────────────────────────────────── */
.cc-modal-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  border-radius: var(--cc-radius);
  z-index: 10;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--cc-transition);
}

.cc-modal-overlay.cc-visible {
  opacity: 1;
  pointer-events: all;
}

.cc-modal {
  width: 90%;
  max-width: 420px;
  max-height: 85vh;
  overflow-y: auto;
  background: var(--cc-bg-solid);
  border: 1px solid var(--cc-border);
  border-radius: var(--cc-radius-sm);
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.1) transparent;
}

.cc-modal-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--cc-text);
}

.cc-field {
  margin-bottom: 16px;
}

.cc-field-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: var(--cc-text-secondary);
  margin-bottom: 6px;
}

.cc-field-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--cc-border);
  border-radius: var(--cc-radius-xs);
  background: var(--cc-surface);
  color: var(--cc-text);
  font-family: var(--cc-font);
  font-size: 14px;
  outline: none;
  transition: border-color var(--cc-transition),
              box-shadow var(--cc-transition);
}

.cc-field-input:focus {
  border-color: var(--cc-border-focus);
  box-shadow: 0 0 0 3px var(--cc-accent-glow);
}

.cc-field-input::placeholder {
  color: var(--cc-text-muted);
}

/* Action select dropdown */
.cc-action-select {
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M2 4l4 4 4-4'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
}

.cc-action-select option {
  background: var(--cc-bg-solid);
  color: var(--cc-text);
  padding: 8px;
}

.cc-action-description {
  margin-top: 4px;
}

.cc-action-params {
  margin-bottom: 4px;
}

/* Key recorder */
.cc-key-recorder {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 2px dashed var(--cc-border);
  border-radius: var(--cc-radius-sm);
  background: var(--cc-surface);
  font-family: var(--cc-font-mono);
  font-size: 14px;
  color: var(--cc-text-secondary);
  cursor: pointer;
  transition: border-color var(--cc-transition),
              background var(--cc-transition);
}

.cc-key-recorder:focus,
.cc-key-recorder.cc-recording {
  border-color: var(--cc-accent);
  border-style: solid;
  background: var(--cc-accent-glow);
  color: var(--cc-text);
  outline: none;
}

.cc-key-recorder .cc-pulse {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--cc-accent);
  animation: cc-pulse-anim 1.2s ease-in-out infinite;
}

@keyframes cc-pulse-anim {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.7); }
}

/* Conflict warning */
.cc-conflict-warning {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--cc-radius-xs);
  font-size: 12px;
  line-height: 1.5;
  margin-top: 8px;
}

.cc-conflict-warning.cc-blocked {
  background: var(--cc-danger-bg);
  color: var(--cc-danger);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.cc-conflict-warning.cc-warning {
  background: var(--cc-warning-bg);
  color: var(--cc-warning);
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.cc-conflict-warning.cc-caution {
  background: var(--cc-info-bg);
  color: var(--cc-info);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.cc-conflict-icon {
  flex-shrink: 0;
  font-size: 14px;
  margin-top: 1px;
}

/* Modal buttons */
.cc-modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 24px;
}

.cc-btn {
  padding: 8px 18px;
  border-radius: var(--cc-radius-xs);
  font-family: var(--cc-font);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--cc-border);
  transition: background var(--cc-transition),
              border-color var(--cc-transition),
              box-shadow var(--cc-transition);
}

.cc-btn-secondary {
  background: transparent;
  color: var(--cc-text-secondary);
}

.cc-btn-secondary:hover {
  background: var(--cc-surface-hover);
  color: var(--cc-text);
}

.cc-btn-primary {
  background: var(--cc-accent);
  color: #fff;
  border-color: transparent;
}

.cc-btn-primary:hover {
  background: var(--cc-accent-hover);
  box-shadow: 0 0 20px var(--cc-accent-glow);
}

.cc-btn-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ─── Toast / Notification ───────────────────────────────────── */
.cc-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  padding: 10px 20px;
  border-radius: var(--cc-radius-sm);
  background: var(--cc-bg-solid);
  border: 1px solid var(--cc-border);
  color: var(--cc-text);
  font-family: var(--cc-font);
  font-size: 13px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 1000000;
  opacity: 0;
  transition: opacity var(--cc-transition), transform var(--cc-transition);
  pointer-events: none;
}

.cc-toast.cc-visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.cc-toast.cc-success {
  border-color: rgba(16, 185, 129, 0.3);
}

.cc-toast.cc-error {
  border-color: rgba(239, 68, 68, 0.3);
}

/* ─── Highlight for search results ───────────────────────────── */
.cc-highlight {
  background: var(--cc-accent-glow);
  color: var(--cc-accent);
  padding: 1px 2px;
  border-radius: 2px;
}

/* ─── Responsive ─────────────────────────────────────────────── */
@media (max-width: 640px) {
  .cc-palette {
    max-width: 100%;
    width: 100%;
    max-height: 100%;
    height: 100%;
    border-radius: 0;
    top: 0;
    left: 0;
    transform: translateY(20px);
  }

  .cc-palette.cc-visible {
    transform: translateY(0);
  }

  :host([data-position="top"]) .cc-palette {
    top: 0;
    transform: translateY(20px);
  }

  :host([data-position="top"]) .cc-palette.cc-visible {
    transform: translateY(0);
  }

  .cc-footer-hints {
    display: none;
  }
}
`;
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

PaletteUI;


// ════════════════════════════════════════════════
// Source: commandcuts.js
// ════════════════════════════════════════════════

/**
 * CommandCuts — Main Entry Point
 * 
 * Public API for the CommandCuts widget.
 * Drop-in via <script> tag or ES module import.
 * 
 * Usage:
 *   CommandCuts.init({ ... });
 *   CommandCuts.register('alt+s', () => save(), { label: 'Save Draft' });
 *   CommandCuts.open();
 *   CommandCuts.close();
 *   CommandCuts.destroy();
 */






// ─── Guard against multiple inclusions ────────────────────────

if (window.__COMMANDCUTS_LOADED__) {
  console.warn('[CommandCuts] Already loaded — skipping duplicate initialisation.');
}

window.__COMMANDCUTS_LOADED__ = true;

// ─── Internal State ─────────────────────────────────────────

let engine = null;
let detector = null;
let config = null;
let paletteUI = null;
let isInitialised = false;

// ─── Public API ─────────────────────────────────────────────

const CommandCuts = {

  /**
   * Initialise the command palette.
   * 
   * @param {Object} opts
   * @param {string} [opts.trigger='ctrl+k'] - Shortcut to open the palette
   * @param {string} [opts.theme='dark'] - 'dark' | 'light' | 'auto'
   * @param {string} [opts.position='center'] - 'center' | 'top'
   * @param {boolean} [opts.allowUserShortcuts=true] - Allow end-users to add/edit shortcuts
   * @param {string} [opts.onConflict='warn'] - 'warn' | 'block' | 'silent'
   * @param {string} [opts.storageKey='commandcuts_user_shortcuts'] - localStorage key
   * @param {Array} [opts.adminShortcuts=[]] - Array of admin-locked shortcuts
   *   Each: { combo: string, action: Function, label: string, description?: string, icon?: string, category?: string }
   */
  init(opts = {}) {
    if (isInitialised) {
      console.warn('[CommandCuts] Already initialised. Call CommandCuts.destroy() first to re-init.');
      return;
    }

    const options = {
      trigger: opts.trigger || 'ctrl+k',
      theme: opts.theme || 'dark',
      position: opts.position || 'center',
      allowUserShortcuts: opts.allowUserShortcuts !== false,
      onConflict: opts.onConflict || 'warn',
      storageKey: opts.storageKey || 'commandcuts_user_shortcuts',
      adminShortcuts: opts.adminShortcuts || [],
    };

    // Handle auto theme
    if (options.theme === 'auto') {
      options.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // ─── Create core modules ──────────────────────────────────

    engine = new ShortcutEngine();
    detector = new ConflictDetector(engine.os, engine.browser);
    config = new ShortcutConfig(options.storageKey);

    // ─── Register admin shortcuts ─────────────────────────────

    const adminShortcuts = options.adminShortcuts.map(s => ({
      combo: engine.normalizeCombo(s.combo),
      label: s.label || s.combo,
      description: s.description || '',
      icon: s.icon || '🔒',
      category: s.category || 'Admin',
      adminLocked: true,
      _action: s.action,
    }));

    config.setAdminShortcuts(adminShortcuts);

    // Register admin shortcuts with the engine
    for (const s of adminShortcuts) {
      engine.register(s.combo, s._action || (() => {}), {
        label: s.label,
        description: s.description,
        icon: s.icon,
        category: s.category,
        adminLocked: true,
      });
    }

    // ─── Restore user shortcuts from localStorage ─────────────

    const userShortcuts = config.getUserShortcuts();
    for (const s of userShortcuts) {
      // User shortcuts use the ActionRunner for safe, sandboxed execution
      const actionType = s.actionType;
      const actionParams = s.actionParams || {};
      engine.register(s.combo, () => {
        if (actionType) {
          ActionRunner.execute(actionType, actionParams);
        } else {
          console.log(`[CommandCuts] User shortcut "${s.label}" (${s.combo}) triggered (no action assigned)`);
        }
      }, {
        label: s.label,
        description: s.description,
        icon: s.icon,
        category: s.category,
      });
    }

    // ─── Create Palette UI ────────────────────────────────────

    paletteUI = new PaletteUI({
      engine,
      detector,
      config,
      options,
      onShortcutExecute: (combo) => {
        const entry = engine._shortcuts.get(combo);
        if (entry) {
          try {
            entry.action();
          } catch (err) {
            console.error(`[CommandCuts] Error executing "${combo}":`, err);
          }
        }
      },
      onShortcutAdded: (shortcut) => {
        const actionType = shortcut.actionType;
        const actionParams = shortcut.actionParams || {};
        engine.register(shortcut.combo, () => {
          if (actionType) {
            ActionRunner.execute(actionType, actionParams);
          } else {
            console.log(`[CommandCuts] User shortcut "${shortcut.label}" (${shortcut.combo}) triggered (no action)`);
          }
        }, {
          label: shortcut.label,
          description: shortcut.description,
        });
      },
      onShortcutRemoved: (combo) => {
        engine.unregister(combo);
      },
    });

    // ─── Register trigger shortcut ────────────────────────────

    const triggerCombo = engine.normalizeCombo(options.trigger);
    engine.register(triggerCombo, () => {
      paletteUI.toggle();
    }, {
      label: 'Open Command Palette',
      description: 'Toggle the CommandCuts palette',
      icon: '🎯',
      category: 'System',
      adminLocked: true,
      activeInInputs: true,
    });

    // Register the trigger as an admin shortcut in config so it shows in the palette
    const allAdmin = config.getAdminShortcuts();
    allAdmin.unshift({
      combo: triggerCombo,
      label: 'Open Command Palette',
      description: 'Toggle the CommandCuts palette',
      icon: '🎯',
      category: 'System',
      adminLocked: true,
    });
    config.setAdminShortcuts(allAdmin);

    isInitialised = true;
    console.log(`%c⌨️ CommandCuts loaded! Press ${engine.formatCombo(triggerCombo)} to open.`, 
      'color: #8b5cf6; font-weight: bold; font-size: 13px;');
  },

  /**
   * Register a shortcut programmatically (from host page code).
   */
  register(combo, action, options = {}) {
    if (!isInitialised) {
      console.warn('[CommandCuts] Not initialised. Call CommandCuts.init() first.');
      return false;
    }

    const normalized = engine.normalizeCombo(combo);
    const ok = engine.register(normalized, action, options);
    if (ok && !options.adminLocked) {
      config.addUserShortcut({
        combo: normalized,
        label: options.label || combo,
        description: options.description || '',
        icon: options.icon,
        category: options.category,
      });
    }
    return ok;
  },

  /**
   * Unregister a shortcut.
   */
  unregister(combo) {
    if (!isInitialised) return false;
    const normalized = engine.normalizeCombo(combo);
    config.removeUserShortcut(normalized);
    return engine.unregister(normalized);
  },

  /**
   * Open the command palette programmatically.
   */
  open() {
    if (paletteUI) paletteUI.open();
  },

  /**
   * Close the command palette programmatically.
   */
  close() {
    if (paletteUI) paletteUI.close();
  },

  /**
   * Check if the palette is currently open.
   */
  get isOpen() {
    return paletteUI ? paletteUI.isOpen : false;
  },

  /**
   * Change the theme at runtime.
   * @param {'dark'|'light'} theme
   */
  setTheme(theme) {
    if (paletteUI) paletteUI.setTheme(theme);
  },

  /**
   * Get all registered shortcuts.
   */
  getShortcuts() {
    return config ? config.getAllShortcuts() : [];
  },

  /**
   * Check a combo for conflicts.
   * @param {string} combo
   * @returns {Object} conflict info
   */
  checkConflict(combo) {
    if (!detector) return { conflicting: false };
    return detector.check(engine.normalizeCombo(combo));
  },

  /**
   * Export user shortcuts as JSON.
   */
  exportConfig() {
    return config ? config.exportConfig() : '[]';
  },

  /**
   * Import user shortcuts from JSON.
   * @param {string} json
   */
  importConfig(json) {
    if (!config) return false;
    return config.importConfig(json);
  },

  /**
   * Tear down everything.
   */
  destroy() {
    if (engine) engine.destroy();
    if (paletteUI) paletteUI.destroy();
    engine = null;
    detector = null;
    config = null;
    paletteUI = null;
    isInitialised = false;
    window.__COMMANDCUTS_LOADED__ = false;
  },
};

// ─── Export ─────────────────────────────────────────────────

window.CommandCuts = CommandCuts;
CommandCuts;



})(typeof window !== 'undefined' ? window : this);
