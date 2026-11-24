import fs from 'fs';

const html = fs.readFileSync('student-dashboard.html', 'utf8');

// 1. Search for width in styles
const styleMatches = [...html.matchAll(/style=["'][^"']*width:[^"']*["']/gi)];
console.log('Inline style widths:', styleMatches.map(m => m[0]));

// 2. Search for fixed width in elements
const fixedW = [...html.matchAll(/\b(w-\d+|w-\[[^\]]+\]|min-w-\[[^\]]+\])\b/g)];
const uniqueW = [...new Set(fixedW.map(m => m[1]))];
console.log('Width classes:', uniqueW);

// 3. Search for any elements with px values > 320
const largePx = [...html.matchAll(/(\d{3,})px/g)];
const uniquePx = [...new Set(largePx.map(m => parseInt(m[1])))].filter(p => p > 320 && p < 2000);
console.log('Large pixel values in HTML:', uniquePx);

// 4. Look for modals, overlays, or wide tables
const tables = [...html.matchAll(/<table[^>]*>/gi)];
console.log('Tables found:', tables.map(t => t[0]));

// 5. Look for any section or div with fixed widths or grid with minmax
const gridCols = [...html.matchAll(/grid-cols-[^\s"']+/g)];
console.log('Grid cols classes:', [...new Set(gridCols.map(g => g[0]))]);
