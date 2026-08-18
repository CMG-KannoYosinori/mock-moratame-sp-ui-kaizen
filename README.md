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

静的 HTML は `dist/` に出力されます。プレビューは `npm run preview` です。

jQM 排除ドロワー用の CSS / JS は `src/styles/`・`src/scripts/` がソースで、ビルド時に **`dist/styles/`・`dist/scripts/`** へそのままコピーされます（`/_astro/` のハッシュ付きファイルにはしません）。HTML からは `/styles/drawer.css`・`/scripts/drawer.js` で参照します。

CSS / JS は本番サイト（`www.moratame.net`）の資産を読み込みます。
