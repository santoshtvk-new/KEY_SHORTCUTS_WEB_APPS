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

export default RESERVED_SHORTCUTS;
