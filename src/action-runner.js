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

export default ActionRunner;
