// @ts-check
import { defineConfig } from 'astro/config';
import { copyStylesScriptsIntegration } from './integrations/copy-styles-scripts.mjs';

export default defineConfig({
  integrations: [copyStylesScriptsIntegration()],
  // preserve: signup-form.astro → signup-form.html、login/index.astro → login/index.html
  trailingSlash: 'ignore',
  compressHTML: false,
  build: {
    format: 'preserve',
    // ページ／コンポーネントの <style> は HTML に埋め込む（dist/_astro のハッシュ付き CSS を納品しない）。
    inlineStylesheets: 'always',
  },
  vite: {
    build: {
      minify: false,
      cssMinify: false,
    },
  },
});
