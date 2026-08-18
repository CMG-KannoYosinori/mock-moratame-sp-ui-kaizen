# mock-moratame-sp-ui-kaizen

モラタメ SP 会員登録まわりの静的 UI モックです。共通のヘッダー・フッター・ドロワーは Astro の Layout / コンポーネントで管理しています。

## セットアップ

```bash
npm install
```

## 開発サーバ

```bash
npm run dev
```

ブラウザで http://localhost:4321/ を開き、モック一覧から各ページへ移動します。

直接開く場合:

- http://localhost:4321/s/contents/signup01.html
- http://localhost:4321/s/contents/signup03.html
- http://localhost:4321/s/contents/signup05.html
- http://localhost:4321/s/login/sms_auth_input.html
- http://localhost:4321/s/login/sms_auth_confirm.html

## ビルド

```bash
npm run build
```

静的 HTML は `dist/` に出力されます。プレビューは `npm run preview`（http://localhost:4321/）です。

Live Server で見る場合は、**リポジトリ直下をルートのまま** `dist` 内の HTML を開いてください。

- http://127.0.0.1:5500/dist/s/login/index-no-jqm.html
- http://127.0.0.1:5500/dist/s/login/index.html

`.astro` の `<style>`（比較バナーや Layout 内の追加スタイルなど）はビルド時に HTML へ埋め込みます。`dist/_astro` のハッシュ付き CSS は出さないので、PHP 組み込み時にそのフォルダを配る必要はありません。

`/styles/`・`/scripts/`・モック同士の `/s/` はビルド時に各 HTML からの相対パスへ書き換えます。`http://127.0.0.1:5500/s/login/...` はワークスペース直下にそのパスが無いため 404（Cannot GET）になります。先に `npm run build` してください。

jQM 排除ドロワー用の CSS / JS は `src/styles/`・`src/scripts/` がソースで、ビルド時に **`dist/styles/`・`dist/scripts/`** へそのままコピーされます。ソース上の参照は `/styles/drawer.css`・`/scripts/drawer.js` で、ビルド後の HTML では相対パスになります。

CSS / JS は本番サイト（`www.moratame.net`）の資産を読み込みます。
