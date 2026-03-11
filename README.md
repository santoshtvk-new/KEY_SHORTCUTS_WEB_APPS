# ⌨️ CommandCuts

> A drop-in glassmorphic command palette & keyboard shortcuts widget for **any** website.

![Version](https://img.shields.io/badge/version-1.0.0-8b5cf6)
![Size](https://img.shields.io/badge/size-~50KB_min-green)
![Dependencies](https://img.shields.io/badge/dependencies-0-blue)
![License](https://img.shields.io/badge/license-MIT-yellow)

---

## Table of Contents

- [What is CommandCuts?](#what-is-commandcuts)
- [Features](#features)
- [For Website Builders (Developers / Admins)](#-for-website-builders-developers--admins)
  - [Step 1 — Install](#step-1--install)
  - [Step 2 — Initialise](#step-2--initialise)
  - [Step 3 — Define Admin Shortcuts](#step-3--define-admin-shortcuts)
  - [Step 4 — Customise Appearance](#step-4--customise-appearance)
  - [Step 5 — Advanced Configuration](#step-5--advanced-configuration)
  - [Step 6 — Programmatic API](#step-6--programmatic-api)
  - [Step 7 — Building from Source](#step-7--building-from-source)
- [For Website Users (Visitors)](#-for-website-users-visitors)
  - [Opening the Palette](#opening-the-palette)
  - [Navigating Shortcuts](#navigating-shortcuts)
  - [Adding Your Own Shortcut](#adding-your-own-shortcut)
  - [Editing or Deleting Shortcuts](#editing-or-deleting-shortcuts)
  - [Understanding Conflict Warnings](#understanding-conflict-warnings)
  - [Persistence & Privacy](#persistence--privacy)
- [Full API Reference](#full-api-reference)
- [CSS Custom Properties (Theming)](#css-custom-properties-theming)
- [Conflict Severity Levels](#conflict-severity-levels)
- [Browser Support](#browser-support)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## What is CommandCuts?

CommandCuts is a single JavaScript file you add to your website that gives it a **keyboard shortcut system** with a beautiful **command palette** (think VS Code's `Ctrl+K` or Spotlight on macOS).

- **Website builders** define shortcuts for common actions (navigate home, toggle dark mode, open search, etc.)
- **Website visitors** can add their own shortcuts, search through all available actions, and trigger them with key combos or mouse clicks.
- **Conflict detection** warns when a shortcut clashes with OS or browser reserved keys (like `Ctrl+T` or `Alt+F4`).

The palette is rendered inside a [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM), so it never interferes with your site's existing styles.

---

## Features

| Feature | Description |
|---------|-------------|
| 🎨 **Glassmorphic UI** | Frosted glass, blur effects, smooth animations |
| 🌗 **Dark & Light themes** | Switch at runtime, or auto-detect from OS preference |
| ⚡ **Zero dependencies** | Pure vanilla JS — works with React, Vue, Angular, WordPress, or plain HTML |
| 🛡️ **Conflict detection** | ~80 reserved OS/browser shortcuts tracked, with severity levels |
| 🔒 **Admin shortcuts** | Locked by the site owner — visitors cannot remap or delete them |
| ✏️ **User shortcuts** | Visitors can add, edit, and remove their own key combos |
| 🔍 **Real-time search** | Filters across names, descriptions, key combos, and categories |
| 💾 **localStorage persistence** | User shortcuts survive page reloads (same device/browser) |
| 📤 **Export / Import** | Share shortcut configs as JSON |
| 🌐 **Cross-platform** | Auto-detects Windows, macOS, Linux; shows ⌘ vs Ctrl correctly |
| ♿ **Accessible** | Keyboard-navigable, ARIA roles, focus trapping |

---

## 🔧 For Website Builders (Developers / Admins)

This section explains how to **add CommandCuts to your website** and configure it.

### Step 1 — Install

You have three options:

#### Option A: CDN Script Tag (Easiest)

Add this single line before your closing `</body>` tag:

```html
<script src="https://cdn.example.com/commandcuts/1.0.0/commandcuts.bundle.min.js"></script>
```

> **Self-hosting?** Copy `dist/commandcuts.bundle.min.js` to your server and point the `src` to your own URL.

#### Option B: Download & Self-Host

1. Download or clone this repository
2. Run the build (see [Step 7](#step-7--building-from-source))
3. Copy `dist/commandcuts.bundle.min.js` into your project's `assets/` or `static/` folder
4. Reference it in your HTML:

```html
<script src="/assets/js/commandcuts.bundle.min.js"></script>
```

#### Option C: ES Module Import

If you're using a bundler (Webpack, Vite, Rollup):

```js
import CommandCuts from './src/commandcuts.js';
```

---

### Step 2 — Initialise

After loading the script, call `CommandCuts.init()` with your configuration:

```html
<script>
  CommandCuts.init({
    trigger: 'ctrl+k',          // Key combo to open the palette
    theme: 'dark',              // 'dark', 'light', or 'auto'
    position: 'center',         // 'center' or 'top'
    allowUserShortcuts: true,   // Let visitors add their own shortcuts
    onConflict: 'warn',         // 'warn', 'block', or 'silent'
  });
</script>
```

**That's it!** Press `Ctrl+K` (or `⌘+K` on Mac) and the palette appears.

#### Init Options Explained

| Option | Type | Default | What it does |
|--------|------|---------|--------------|
| `trigger` | `string` | `'ctrl+k'` | The key combo that opens/closes the palette |
| `theme` | `string` | `'dark'` | Visual theme. `'auto'` follows the user's OS preference |
| `position` | `string` | `'center'` | Where the palette appears. `'top'` pins it near the top |
| `allowUserShortcuts` | `boolean` | `true` | Set to `false` to disable the "Add Shortcut" button entirely |
| `onConflict` | `string` | `'warn'` | How to handle conflict warnings when users bind reserved keys |
| `storageKey` | `string` | `'commandcuts_user_shortcuts'` | localStorage key (change this if you have multiple sites) |
| `adminShortcuts` | `Array` | `[]` | Your pre-defined shortcuts (see Step 3) |

---

### Step 3 — Define Admin Shortcuts

Admin shortcuts are **locked** — visitors see them with a 🔒 icon and cannot remap or delete them. This is where you wire up your site's core actions.

```html
<script>
  CommandCuts.init({
    trigger: 'ctrl+k',
    theme: 'dark',
    adminShortcuts: [
      {
        combo: 'alt+h',
        label: 'Go Home',
        description: 'Navigate to the homepage',
        icon: '🏠',
        category: 'Navigation',
        action: () => {
          window.location.href = '/';
        }
      },
      {
        combo: 'alt+t',
        label: 'Scroll to Top',
        description: 'Smoothly scroll the page to the top',
        icon: '⬆️',
        category: 'Navigation',
        action: () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
      {
        combo: 'alt+d',
        label: 'Toggle Dark Mode',
        description: 'Switch between dark and light theme',
        icon: '🌓',
        category: 'Appearance',
        action: () => {
          document.body.classList.toggle('dark-mode');
        }
      },
      {
        combo: 'alt+s',
        label: 'Open Search',
        description: 'Focus the site search bar',
        icon: '🔍',
        category: 'Navigation',
        action: () => {
          document.getElementById('search-input')?.focus();
        }
      },
    ]
  });
</script>
```

#### Admin Shortcut Object — All Fields

| Field | Type | Required? | Description |
|-------|------|-----------|-------------|
| `combo` | `string` | ✅ Yes | Key combination, e.g. `'alt+h'`, `'ctrl+shift+k'` |
| `action` | `function` | ✅ Yes | JavaScript function to run when triggered |
| `label` | `string` | ✅ Yes | Name shown in the palette |
| `description` | `string` | Optional | Extra detail shown below the label |
| `icon` | `string` | Optional | Emoji or text icon (default: `'🔒'`) |
| `category` | `string` | Optional | Group heading (e.g. `'Navigation'`, `'Actions'`) |

#### 💡 Tips for Choosing Key Combos

- ✅ **Safe choices**: `Alt + letter` combos are rarely reserved and work cross-browser
- ✅ **Also safe**: `Ctrl + Shift + letter` combos
- ⚠️ **Avoid**: `Ctrl+T`, `Ctrl+W`, `Ctrl+N`, `Alt+F4` — these are browser/OS reserved
- 🔍 **Use the built-in checker**: Call `CommandCuts.checkConflict('ctrl+t')` to verify any combo

---

### Step 4 — Customise Appearance

#### Theme Selection

```js
// Set during init
CommandCuts.init({ theme: 'dark' });     // Always dark
CommandCuts.init({ theme: 'light' });    // Always light
CommandCuts.init({ theme: 'auto' });     // Follow OS preference

// Change at runtime
CommandCuts.setTheme('light');
```

#### Custom Colours (CSS Custom Properties)

CommandCuts uses CSS custom properties, so you can override any colour in your own stylesheet:

```css
/* Add this to your site's CSS */
#commandcuts-root {
  /* Accent colour (buttons, focus rings, highlights) */
  --cc-accent: #10b981;
  --cc-accent-hover: #34d399;
  --cc-accent-glow: rgba(16, 185, 129, 0.25);

  /* Background */
  --cc-bg: rgba(15, 15, 25, 0.9);
  --cc-bg-solid: #0f0f19;

  /* Text */
  --cc-text: #e2e8f0;
  --cc-text-secondary: #94a3b8;

  /* Border */
  --cc-border: rgba(255, 255, 255, 0.1);

  /* Corner radius */
  --cc-radius: 20px;
  --cc-radius-sm: 12px;

  /* Blur intensity */
  --cc-blur: 30px;

  /* Font family */
  --cc-font: 'Poppins', sans-serif;
  --cc-font-mono: 'Fira Code', monospace;

  /* Max size */
  --cc-max-width: 700px;
  --cc-max-height: 600px;
}
```

> See [`src/palette.css`](src/palette.css) for the complete list of 30+ CSS variables.

#### Palette Position

```js
CommandCuts.init({ position: 'center' });  // Centred on screen (default)
CommandCuts.init({ position: 'top' });     // Pinned near the top (Spotlight-style)
```

---

### Step 5 — Advanced Configuration

#### Disable User Shortcuts (Admin-Only Mode)

```js
CommandCuts.init({
  allowUserShortcuts: false,  // Removes the "Add Shortcut" button
  adminShortcuts: [ /* ... */ ]
});
```

#### Custom localStorage Key

If you run multiple sites on the same domain, use unique keys to avoid conflicts:

```js
CommandCuts.init({
  storageKey: 'my_site_shortcuts',  // Default: 'commandcuts_user_shortcuts'
});
```

#### Conflict Handling Modes

| Mode | Behaviour |
|------|-----------|
| `'warn'` | Shows a warning badge but still allows the binding |
| `'block'` | Prevents binding shortcuts marked as "blocked" severity |
| `'silent'` | No conflict UI at all |

```js
CommandCuts.init({ onConflict: 'block' });
```

#### Multiple Widgets on One Page

CommandCuts automatically prevents duplicate loading. If the script is included twice, the second instance is silently skipped.

---

### Step 6 — Programmatic API

You can control CommandCuts from your own JavaScript code:

#### Register Shortcuts Dynamically

```js
// Register a new shortcut at any time
CommandCuts.register('alt+p', () => {
  window.print();
}, {
  label: 'Print Page',
  description: 'Open the browser print dialog',
  icon: '🖨️',
  category: 'Actions'
});

// Remove it later
CommandCuts.unregister('alt+p');
```

#### Open/Close Palette from Code

```js
// Open from a button click
document.getElementById('my-btn').addEventListener('click', () => {
  CommandCuts.open();
});

// Close programmatically
CommandCuts.close();

// Check if open
if (CommandCuts.isOpen) { /* ... */ }
```

#### Check for Conflicts

```js
const result = CommandCuts.checkConflict('ctrl+t');
console.log(result);
// {
//   conflicting: true,
//   highestSeverity: 'blocked',
//   message: '⛔ Reserved by Chrome: "Open new tab"',
//   conflicts: [ { platform: 'Chrome', description: 'New tab', severity: 'blocked' } ]
// }
```

#### Export / Import User Shortcuts

```js
// Export as JSON string
const json = CommandCuts.exportConfig();
console.log(json);  // '[{"combo":"alt+1","label":"My Action",...}]'

// Import from JSON string
CommandCuts.importConfig(json);
```

#### Get All Registered Shortcuts

```js
const shortcuts = CommandCuts.getShortcuts();
// Returns array of all admin + user shortcuts
```

#### Teardown

```js
// Remove CommandCuts completely (cleans up listeners, DOM, etc.)
CommandCuts.destroy();
```

---

### Step 7 — Building from Source

If you cloned the repository and want to rebuild the bundle:

**Prerequisites:** [Node.js](https://nodejs.org/) (v14 or later)

```bash
# 1. Navigate to the project folder
cd KEY_SHORTCUTS_WEB_APPS

# 2. Run the build script
node build.js
```

**Output files:**

| File | Description | Size |
|------|-------------|------|
| `dist/commandcuts.bundle.js` | Development bundle (readable, with comments) | ~81 KB |
| `dist/commandcuts.bundle.min.js` | Production bundle (minified) | ~50 KB |

**Test locally:**

```bash
# Serve the project folder
npx http-server -p 8080

# Open in browser
# → http://localhost:8080/demo.html
```

---

## 👤 For Website Users (Visitors)

This section is for **people visiting a website** that has CommandCuts installed. No coding required!

### Opening the Palette

| Method | How |
|--------|-----|
| **Keyboard** | Press **Ctrl + K** (Windows/Linux) or **⌘ + K** (Mac) |
| **Button** | Click any "Open Palette" button the site provides |

> The site admin may have chosen a different trigger key — check the bottom-right badge in the palette for the actual shortcut.

### Navigating Shortcuts

Once the palette is open:

| Key | Action |
|-----|--------|
| **↑ / ↓** | Move up/down through the shortcut list |
| **Enter** | Execute the highlighted shortcut |
| **Esc** | Close the palette |
| **Type anything** | Search/filter shortcuts by name, description, or key combo |

You can also **click** any shortcut row with your mouse to trigger it.

### Adding Your Own Shortcut

> ⚠️ This is only available if the site admin has enabled user shortcuts.

1. Open the palette (`Ctrl+K`)
2. Click the **"+ Add Shortcut"** button in the bottom-right corner
3. Fill in the form:
   - **Label** — Give your shortcut a name (e.g. "Go to Blog")
   - **Description** — Optional extra detail
   - **Key Combination** — Click the dashed box labelled "Press keys…" and then press your desired key combo (e.g. `Alt + B`)
4. Look at the feedback below the key recorder:
   - ✅ **Green "Available"** — You're good to go!
   - ⚠️ **Yellow warning** — The combo is used by your browser; it may not work reliably
   - ⛔ **Red "Blocked"** — The combo is reserved by your OS/browser and **cannot** be used
5. Click **"Save Shortcut"**

Your shortcut is now saved and will appear in the palette!

### Editing or Deleting Shortcuts

- **Hover** over any user shortcut (the ones without the 🔒 icon)
- Two buttons appear:
  - ✏️ **Edit** — Opens the form to change the label, description, or key combo
  - 🗑️ **Delete** — Removes the shortcut immediately

> 🔒 **Admin shortcuts cannot be edited or deleted** — they are locked by the site owner.

### Understanding Conflict Warnings

When you try to bind a key combo, CommandCuts checks it against known reserved shortcuts:

| Icon | Severity | Meaning |
|------|----------|---------|
| ⛔ | **Blocked** | Your OS/browser intercepts this key before the website can use it (e.g. `Ctrl+W` closes the tab). **You cannot use this combo.** |
| ⚠️ | **Warning** | Your browser uses this key (e.g. `Ctrl+D` bookmarks the page). It *might* work, but it's unreliable. |
| ℹ️ | **Caution** | This is a common convention (e.g. `Ctrl+C` for copy). Overriding it may be confusing, but it works. |
| ✅ | **Available** | This combo is free — no conflicts detected! |

### Persistence & Privacy

- Your custom shortcuts are stored in your browser's **localStorage** (on your device only)
- **They persist** across page reloads and browser restarts (same browser, same device)
- **They do NOT sync** across devices, browsers, or incognito/private windows
- **Clearing browser data** will erase your custom shortcuts
- No data is sent to any server — everything stays on your machine

---

## Full API Reference

| Method | Description |
|--------|-------------|
| `CommandCuts.init(options)` | Set up the widget (call once) |
| `CommandCuts.register(combo, action, options)` | Add a shortcut programmatically |
| `CommandCuts.unregister(combo)` | Remove a shortcut by key combo |
| `CommandCuts.open()` | Open the palette |
| `CommandCuts.close()` | Close the palette |
| `CommandCuts.isOpen` | `true` if the palette is currently visible |
| `CommandCuts.setTheme(theme)` | Switch theme (`'dark'` or `'light'`) |
| `CommandCuts.getShortcuts()` | Get array of all registered shortcuts |
| `CommandCuts.checkConflict(combo)` | Check a combo for OS/browser conflicts |
| `CommandCuts.exportConfig()` | Export user shortcuts as JSON string |
| `CommandCuts.importConfig(json)` | Import user shortcuts from JSON string |
| `CommandCuts.destroy()` | Remove widget and clean up all listeners |

---

## CSS Custom Properties (Theming)

All visual aspects can be customised via CSS variables on `#commandcuts-root`:

| Variable | Default (Dark) | Controls |
|----------|---------------|----------|
| `--cc-bg` | `rgba(15,15,25,0.85)` | Palette background |
| `--cc-bg-solid` | `#0f0f19` | Modal background (solid) |
| `--cc-surface` | `rgba(255,255,255,0.06)` | Card/row backgrounds |
| `--cc-surface-hover` | `rgba(255,255,255,0.1)` | Hover state |
| `--cc-border` | `rgba(255,255,255,0.08)` | Borders |
| `--cc-border-focus` | `rgba(139,92,246,0.5)` | Focus ring colour |
| `--cc-text` | `#e2e8f0` | Primary text |
| `--cc-text-secondary` | `#94a3b8` | Secondary text |
| `--cc-text-muted` | `#64748b` | Muted/hint text |
| `--cc-accent` | `#8b5cf6` | Accent colour (buttons, highlights) |
| `--cc-accent-hover` | `#a78bfa` | Accent hover |
| `--cc-accent-glow` | `rgba(139,92,246,0.25)` | Glow effects |
| `--cc-danger` | `#ef4444` | Error/blocked colour |
| `--cc-warning` | `#f59e0b` | Warning colour |
| `--cc-info` | `#3b82f6` | Info/caution colour |
| `--cc-success` | `#10b981` | Success colour |
| `--cc-radius` | `16px` | Main border radius |
| `--cc-radius-sm` | `10px` | Secondary radius |
| `--cc-blur` | `24px` | Glassmorphism blur intensity |
| `--cc-max-width` | `640px` | Palette max width |
| `--cc-max-height` | `520px` | Palette max height |
| `--cc-font` | `'Inter', system fonts` | Body font |
| `--cc-font-mono` | `'JetBrains Mono', monospace` | Key badge font |

---

## Conflict Severity Levels

CommandCuts tracks **~80 reserved shortcuts** across Windows, macOS, Chrome, Firefox, Edge, and Safari:

| Severity | Count | Examples | Can Override? |
|----------|-------|----------|---------------|
| **Blocked** | ~30 | `Ctrl+W`, `Ctrl+T`, `Alt+F4`, `⌘+Q`, `Win+L` | ❌ No — OS/browser intercepts first |
| **Warning** | ~35 | `Ctrl+D`, `Ctrl+H`, `Ctrl+R`, `F5`, `F12` | ⚠️ Maybe — browser may still handle it |
| **Caution** | ~15 | `Ctrl+C`, `Ctrl+V`, `Ctrl+Z`, `Tab`, `Escape` | ✅ Yes — but may confuse users |

---

## Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 80+ |
| Firefox | 78+ |
| Safari | 14+ |
| Edge (Chromium) | 80+ |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Palette doesn't open | Check browser console for errors. Ensure the script loaded before `CommandCuts.init()` is called |
| `Ctrl+K` opens browser address bar instead | Some browsers capture `Ctrl+K`. Try using `ctrl+shift+k` or `alt+k` as the trigger instead |
| User shortcuts disappear | They're stored in localStorage. Clearing browser data erases them. Incognito mode also starts fresh |
| Styles look broken | CommandCuts uses Shadow DOM for isolation. If you see issues, ensure no polyfills are interfering with Shadow DOM |
| Widget loads twice (console warning) | The script is included more than once in your HTML. Remove the duplicate `<script>` tag |
| Shortcut doesn't fire inside text inputs | By default, shortcuts are disabled when typing in `<input>`, `<textarea>`, or `contenteditable` fields to avoid interfering with normal typing |

---

## License

MIT — free to use in personal and commercial projects.
