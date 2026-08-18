// @ts-check
import { defineConfig } from 'astro/config';
import { copyStylesScriptsIntegration } from './integrations/copy-styles-scripts.mjs';

export default defineConfig({
  integrations: [copyStylesScriptsIntegration()],
  // preserve: signup00.astro → signup00.html、login/index.astro → login/index.html
  trailingSlash: 'ignore',
  compressHTML: false,
  build: {
    format: 'preserve',
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      minify: false,
      cssMinify: false,
    },
  },
});
