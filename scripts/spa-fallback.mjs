// Copies dist/index.html to dist/404.html so GitHub Pages serves the app for
// any unknown path (Vercel and Netlify use their own rewrite configs).
import { copyFileSync, existsSync } from 'node:fs';

const src = new URL('../dist/index.html', import.meta.url);
const dest = new URL('../dist/404.html', import.meta.url);

if (existsSync(src)) {
  copyFileSync(src, dest);
  console.log('spa-fallback: wrote dist/404.html');
}
