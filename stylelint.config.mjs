/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-recess-order'],
  rules: {
    // 警告のみ（--fix では行削除されない）。標準プロパティがある場合はプレフィックスを書かない。
    'property-no-vendor-prefix': true,
  },
  ignoreFiles: [
    '**/node_modules/**',
    'dist/**',
    '**/*.css',
    '!src/styles/**/*.css',
  ],
};
