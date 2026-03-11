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

import ShortcutEngine from './shortcut-engine.js';
import ConflictDetector from './conflict-detector.js';
import ShortcutConfig from './shortcut-config.js';
import PaletteUI from './palette-ui.js';

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
      // User shortcuts don't have actions stored (they're function refs)
      // They are registered with a no-op and rely on palette click to trigger
      engine.register(s.combo, () => {
        console.log(`[CommandCuts] User shortcut "${s.label}" (${s.combo}) triggered`);
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
        engine.register(shortcut.combo, () => {
          console.log(`[CommandCuts] User shortcut "${shortcut.label}" (${shortcut.combo}) triggered`);
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
export default CommandCuts;
