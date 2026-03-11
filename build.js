/**
 * CommandCuts — Build Script
 * 
 * Bundles all source files into a single CDN-ready IIFE.
 * Run: node build.js
 * Output: dist/commandcuts.bundle.js
 */

const fs = require('fs');
const path = require('path');

// ─── Config ─────────────────────────────────────────────────

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');

// Files in dependency order
const SOURCE_FILES = [
  'reserved-shortcuts.js',
  'shortcut-engine.js',
  'conflict-detector.js',
  'shortcut-config.js',
  'palette-search.js',
  'action-runner.js',
  'palette-ui.js',
  'commandcuts.js',
];

const CSS_FILE = path.join(SRC_DIR, 'palette.css');

// ─── Read sources ───────────────────────────────────────────

console.log('🔨 Building CommandCuts...\n');

// Read CSS
const cssContent = fs.readFileSync(CSS_FILE, 'utf-8')
  .replace(/\\/g, '\\\\')
  .replace(/`/g, '\\`')
  .replace(/\$/g, '\\$');

// Read and process JS files
let combinedJS = '';

for (const file of SOURCE_FILES) {
  const filePath = path.join(SRC_DIR, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Strip import/export statements (we're bundling into one IIFE)
  content = content
    .replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '')
    .replace(/^export\s+default\s+/gm, '')
    .replace(/^export\s+/gm, '');

  // Add file banner
  combinedJS += `\n// ════════════════════════════════════════════════\n`;
  combinedJS += `// Source: ${file}\n`;
  combinedJS += `// ════════════════════════════════════════════════\n\n`;
  combinedJS += content;
  combinedJS += '\n';
}

// ─── Replace CSS placeholder ────────────────────────────────

combinedJS = combinedJS.replace(
  "'__CSS_PLACEHOLDER__'",
  '`' + cssContent + '`'
);

// ─── Wrap in IIFE ───────────────────────────────────────────

const banner = `/**
 * CommandCuts v1.0.0
 * A drop-in glassmorphic command palette & keyboard shortcuts widget
 * https://github.com/commandcuts/commandcuts
 * 
 * (c) ${new Date().getFullYear()} CommandCuts
 * Released under the MIT License
 */
`;

const bundle = `${banner}
(function(global) {
  'use strict';

  // Prevent duplicate loading
  if (global.__COMMANDCUTS_LOADED__) {
    console.warn('[CommandCuts] Already loaded — skipping duplicate.');
    return;
  }

${combinedJS}

})(typeof window !== 'undefined' ? window : this);
`;

// ─── Write output ───────────────────────────────────────────

if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

const outputPath = path.join(DIST_DIR, 'commandcuts.bundle.js');
fs.writeFileSync(outputPath, bundle, 'utf-8');

const sizeKB = (Buffer.byteLength(bundle, 'utf-8') / 1024).toFixed(1);
console.log(`✅ Bundle written to: ${outputPath}`);
console.log(`📦 Size: ${sizeKB} KB\n`);

// ─── Optional: Simple minification (strip comments, extra whitespace) ──

const minified = bundle
  .replace(/\/\*[\s\S]*?\*\//g, '')   // Block comments
  .replace(/\/\/[^\n]*/g, '')          // Line comments
  .replace(/\n\s*\n/g, '\n')          // Multiple blank lines
  .replace(/^\s+/gm, '')              // Leading whitespace
  .trim();

const minPath = path.join(DIST_DIR, 'commandcuts.bundle.min.js');
fs.writeFileSync(minPath, minified, 'utf-8');

const minSizeKB = (Buffer.byteLength(minified, 'utf-8') / 1024).toFixed(1);
console.log(`✅ Minified bundle written to: ${minPath}`);
console.log(`📦 Minified size: ${minSizeKB} KB`);
console.log('\n🚀 Done!');
