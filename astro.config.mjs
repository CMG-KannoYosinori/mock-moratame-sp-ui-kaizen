// @ts-check
import { defineConfig } from 'astro/config';
import { copyStylesScriptsIntegration } from './integrations/copy-styles-scripts.mjs';

export default defineConfig({
  // GitHub Pages: https://cmg-kannoyosinori.github.io/mock-moratame-sp-ui-kaizen/
  // base は付けない。ビルド後に /styles /scripts /s /ui /icons を相対パスへ直すため、
  // プロジェクト配下でもローカル（astro dev / Live Server）でも同じ HTML で動く。
  site: 'https://cmg-kannoyosinori.github.io',
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
