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

export default PaletteSearch;
