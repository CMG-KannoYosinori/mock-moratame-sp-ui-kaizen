// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  trailingSlash: 'never',
  compressHTML: false,
  build: {
    format: 'file',
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      minify: false,
      cssMinify: false,
    },
  },
});
