# theme-2026.css 実装時の注意事項

## 概要

`theme-2026.css` は、既存の CSS（`member-registration.css` 等）の上に重ねて読み込むスキン上書き用スタイルシートです。ソースは `src/styles/theme-2026.scss`（[Modern BEM の構成](https://github.com/YoshinoriKanno/doc-modern-bem)）で、ページと PHP が読むのはコンパイル後の CSS です。現在は jQuery Mobile（jQM）を使用しないページ（`no-jqm` 系）でのみ使用しています。

## 現在の読み込み状況

| ファイル | 読み込み |
|---|---|
| `signup01-no-jqm.astro` | あり |
| `signup01-no-jqm-error.astro` | あり |
| `signup03-no-jqm.astro` | あり |
| `signup04-no-jqm.astro` | あり |
| `signup-complete-no-jqm.astro` | あり |
| `ui/index.astro` | あり（`ui.css` も） |
| その他全ページ（jQM あり含む） | **なし** |

`BaseLayout` への共通読み込みは行っていません。ページ単位で `<link>` タグを記述する方式です。

## 懸念事項：既存ページへの混入リスク

### 何が起きるか

`theme-2026.css` を jQM ありページや既存テンプレートに誤って読み込んだ場合、以下の問題が発生する可能性があります。

1. **スタイルの上書き** — `.page-heading` など汎用的なクラス名が、既存 HTML 内の同名クラスと衝突し、意図しない見た目の変更が起きる
2. **レイアウト崩れ** — jQM が管理する要素に対して `theme-2026.css` のスタイルが適用され、jQM のレイアウト制御と競合する

### 現在の設計では接頭辞・スコープを付けていない

`theme-2026.css` 内のクラス名（`.stepper`、`.page-heading` 等）には、`t26-` などの接頭辞や `body.no-jqm` などのスコープセレクタを付けていません。これは現時点で `no-jqm` ページ限定の運用であり、jQM ありページには読み込まれない前提のためです。

### 将来対応が必要になるケース

以下のいずれかに該当する場合、接頭辞またはスコープセレクタの導入を検討してください。

- `theme-2026.css` を jQM ありページにも読み込む必要が出た場合
- PHP テンプレートへの組み込み時に、読み込み対象ページの制御が難しい場合（共通ヘッダーで一括読み込みするなど）
- サイト全体のスキン置き換えとして `theme-2026.css` を拡大する場合

### 対策の選択肢

| 方式 | 概要 | 影響範囲 |
|---|---|---|
| **接頭辞** | `.t26-stepper` のようにクラス名に接頭辞を付ける | CSS + HTML 両方の変更が必要 |
| **スコープセレクタ** | `body.no-jqm .stepper` のように `body` クラスで限定する | CSS のみの変更で済む。jQM ありページに混入してもスタイルが不活性になるフェイルセーフ |
| **CSS レイヤー** | `@layer renewal { ... }` で優先度を制御する | CSS のみ。ただし既存 CSS が `@layer` 非対応の場合は効果が薄い |
| **運用ルール** | 「このファイルは no-jqm テンプレートにのみ読む」とドキュメントで管理する | コード変更不要。人的ミスのリスクは残る |

## PHP 組み込み時のルール

- `theme-2026.css` は **jQM を読み込んでいないページにのみ** `<link>` で追加してください
- `BaseLayout` や共通ヘッダーテンプレートへの一括追加は **行わないでください**
- 読み込み順は「本番 CSS → `theme-2026.css`」です。`theme-2026.css` は既存スタイルを上書きする前提で書かれています

## 本番実装時の指示

このリポジトリは UI モックです。PHP へ載せるときは見た目の HTML / CSS を使い、モック専用の重複・固定文言・ダミー JS は載せないでください。

### 納品物

| 載せる | 載せない |
|---|---|
| コンパイル後の `theme-2026.css` | Sass ソース（`src/styles/`）そのもの。ビルドして CSS を配置する |
| 対象ページのマークアップ（クラス名はモックと同じ） | `/ui/` の UI ライブラリーページ |
| 既存の `profile_edit.exec.php` など本番 Ajax | `src/scripts/nickname-check.js`（結果を固定表示するだけ） |

### ページの分け方

- 通常入力とバリデーションエラー表示は **別テンプレート** にする（モックの `signup01-no-jqm` と `signup01-no-jqm-error` に相当）
- 通常入力には `.form-error` と `.field-error` を出さない
- ニックネーム欄は **1 つだけ**。モックは使用可 / 使用済みを見比べるため 2 つ並べている

### マークアップで守ること

- テキスト入力のクラスは `input.input`（必要なら `input--with-action`）。本番 CSS の `input[type="text"]` より負けるため、要素名付きセレクタにしている
- ページ全体のエラーは `.form-error`（薄ピンク地・赤文字）。項目下のエラーは `.field-error`（警告アイコン付きリスト）。本番の `.form_error` / `.error` は使わない
- エラー中の入力には `input--error`（赤枠＋薄ピンク背景）を足す
- 虫眼鏡ボタンは `type="button"`。フォーム送信や古い `name="name_check"` の submit にしない
- 隠し欄 `#mode` はニックネームチェック・郵便番号・生年月日末日の Ajax で使う。見た目用ではない。削るなら関連 JS もセットで外す
- `id="nickname"` / `id="nicknamealert"` はニックネームチェック結果の差し込み先。紹介コード欄には置かない（ページ内で重複させない）

### ニックネームチェック

現行の「登録可能なニックネームかチェック」ボタン注入（`#nickname` への `html()`）と `onblur` の `namecheck()` は使わない。虫眼鏡クリックで既存 API を呼ぶ。

**残すもの（現行と同じ）**

- POST 先: `profile_edit.exec.php`
- `$('#mode').val(1)` のあと、フォーム `#new-signup-input` を serialize して送る
- 応答 JSON の `status == "1"` が使用可、`status == "0"` が使用済み。文言は `data.message` を使う

**変えるもの**

1. 入力が空なら API を呼ばず、入力へフォーカスを戻す
2. 応答が返ったら `.nickname-check__result` の `hidden` を外し、中身を差し替える
3. 使用可: `.nickname-check__status--ok` にメッセージ（例: 使用可能なニックネームです）
4. 使用済み: `.nickname-check__status--ng` にメッセージ（例: 同一のニックネームが登録されています）
5. 使用済みで似たニックネームを出す場合は、API から候補配列を返す。モックの「ポッケ1」「ポッケ123456」は固定例なので PHP に書かない
6. 候補は `.nickname-check__suggestion` にし、クリックで同じブロック内の `input.input` へ文字列を入れる
7. チェック後は虫眼鏡の `aria-expanded="true"` にする

候補 API がまだないときは、使用済みメッセージだけ出せばよい。候補用の見出し・リストは空なら出さない。

結果ボックスの骨組み（中身は JS で入れる）:

```html
<div class="nickname-check">
  <div class="input-search">
    <input type="text" class="input input--with-action" name="disp_id" id="disp_id" value="" placeholder="入力後、使用可能かチェック！" />
    <button type="button" class="input-search__button" aria-label="ニックネームをチェック" aria-expanded="false" aria-controls="nickname-result">
      <!-- 虫眼鏡 SVG はモックと同じ -->
    </button>
  </div>
  <div class="nickname-check__result" id="nickname-result" hidden></div>
</div>
```

エラー確認テンプレートでは、サーバーが既にエラーを持っているときだけ結果ボックスを最初から出す（`hidden` を付けない）。通常入力の初期表示では出さない。

### Smart Banner（jQM なし）

- `.page` / `data-role="page"` は使わない（本番 CSS の詳細度が高い）
- `smartbanner:disable-positioning` を出し、`smartbanner-offset.js` で `.smartbanner-offset` にバナー高さ分の `top` を付ける

## 関連ファイル

| ファイル | 役割 |
|---|---|
| `src/styles/theme-2026.scss` | スキン上書きの Sass エントリ（出力は `theme-2026.css`） |
| `src/styles/blocks/` | 再利用 UI Block（1 ファイル = 1 Block） |
| `src/styles/layout/` | 余白・配置などコンテキスト依存のスタイル |
| `src/styles/foundation/_tokens.scss` | 色などのトークン |
| `src/styles/drawer.scss` | ドロワー用エントリ（出力は `drawer.css`） |
| `src/scripts/smartbanner-offset.js` | no-jqm ページ用の Smart Banner オフセット補正（対象は `.smartbanner-offset`） |
| `src/scripts/nickname-check.js` | **モック専用。** 虫眼鏡で固定の結果ボックスを出すだけ。本番の Ajax には使わない |
| `src/components/Stepper.astro` | 会員登録 4 ステップ。`activeStep` で現在地を指定 |
| `src/components/Footer.astro` | no-jqm では `engine="css"`（`data-role="footer"` / `.ui-footer` を出さない） |
| `src/styles/blocks/_input-search.scss` | 入力欄＋右側アクション（虫眼鏡） |
| `src/styles/blocks/_nickname-check.scss` | ニックネームチェックの結果ボックス |
| `.cursor/rules/modern-bem.mdc` | CSS 命名規約（Modern BEM） |
