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

CSS / JS は本番サイト（`www.moratame.net`）の資産を読み込みます。
