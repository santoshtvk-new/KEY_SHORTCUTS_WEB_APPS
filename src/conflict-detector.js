/**
 * CommandCuts — Conflict Detector
 * 
 * Checks proposed shortcuts against the reserved shortcuts database.
 * Provides conflict info, severity, and alternative suggestions.
 */

import RESERVED_SHORTCUTS from './reserved-shortcuts.js';

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

export default ConflictDetector;
