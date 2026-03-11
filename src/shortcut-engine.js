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

export default ShortcutEngine;
