import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` keeps every asset path relative, so the same build works on
// Vercel, Netlify, and GitHub Pages (even under /<repo-name>/).
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2019',
    cssTarget: 'safari14',
  },
});
