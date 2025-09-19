# AGENTS.md

このリポジトリでエージェント（Codex CLI など）が安全かつ一貫性を保って作業するための指針です。特に明記がない限り、このファイルのスコープはリポジトリ全体に及びます。

## プロジェクト概要
- 技術スタック: React 19 + TypeScript + Vite
- ルーティング: React Router（`HashRouter`）
- CMS/データ取得: Sanity（`@sanity/client`、GROQ）
- 配布/ホスティング: Vercel（`vercel.json` あり）
- PWA/アセット: `public/manifest.json`, `public/sw.js`, `public/images/*`
 - PWA/アセット: `public/manifest.json`, `public/sw.js`, `public/images/*`（SWは開発時は登録しない）

主要エントリ:
- `index.html`（Tailwind CDN、フォント、SW 登録、インポートマップ）
- `index.tsx`（`HashRouter` + `App` マウント）
- `App.tsx`（ルーティング、遅延読み込み、UI 構成）
- `services/sanityService.ts`（GROQ クエリとデータ取得）
- `sanity.client.ts`（Sanity クライアント初期化）

関連ドキュメント:
- `README.md`（起動手順）
- `SANITY_SETUP.md`（Sanity 設定手順）
- `vercel.json`（ビルド・配信設定）

## 実行・開発コマンド
- 依存関係: `npm install`
- 開発サーバ: `npm run dev`
- 本番ビルド: `npm run build`
- ローカルプレビュー: `npm run preview`
- Sanity Studio（ローカル）: `npm run studio`
- Sanity Studio（デプロイ）: `npm run studio:deploy`

## 環境変数
`.env.local` を作成し、最低限以下を設定してください。

```
# Gemini API（Vite により `vite.config.ts` 経由で注入）
GEMINI_API_KEY=your-gemini-api-key

# Sanity（`sanity.client.ts` で参照）
VITE_SANITY_PROJECT_ID=your-sanity-project-id
VITE_SANITY_DATASET=production

# Sanity write token（`api/increment-view.ts` 経由で閲覧数を更新）
SANITY_WRITE_TOKEN=your-sanity-write-token
```

`vite.config.ts` では `loadEnv` により `process.env.GEMINI_API_KEY` を定義しています。Sanity の Project ID/Dataset は Vite の `import.meta.env` から読み取ります。フォールバックは廃止し、`VITE_SANITY_PROJECT_ID` が未設定の場合は本番でエラーとします（誤プロジェクト参照を防止）。`VITE_SANITY_DATASET` は未設定時に `production` を使用します。Sanity クライアント設定のコンソール出力は開発時のみ行います（`sanity.client.ts` を参照）。

## ディレクトリ構成ガイド
- `components/layout/` レイアウト（`Header`, `Footer`）
- `components/ui/` 汎用 UI（`Card`, `Tag`, `Spinner`, `SEOHead`, 画像最適化系など）
- `pages/` ルート単位のページ（`HomePage`, `BlogListPage`, `BlogPostPage` など）
- `services/` データ取得（Sanity クライアントとクエリ）
- `utils/` 便利関数（画像最適化、パフォーマンス、サイトマップ）
- `schemas/` Sanity スキーマ（`post`, `category`, `tag`, `author`）
- `public/` 静的ファイル（`manifest.json`, `sw.js`, 画像等）
- `scripts/` 生成・最適化スクリプト（例: `generate-icons.js`, `optimize-images.js`）

パス解決には `tsconfig.json` の `paths` 設定（`@/*` → プロジェクトルート）を優先してください。

## コーディング規約
- TypeScript を徹底（`any` の安易な使用は避ける）。型は既存の `types.ts` を再利用・拡張。
- React は関数コンポーネント + フックで実装。副作用は `useEffect` に集約し、依存配列を正しく管理。
- コンポーネント命名は `PascalCase.tsx`、ユーティリティは `camelCase.ts`。
- 1 文字の変数名や不要な省略は避け、読みやすさを優先。
- 既存スタイル・構造を尊重し、変更は最小限（「必要な箇所だけ」を原則）。
- 不要なロジック・依存の追加、破壊的リファクタは避ける。
- 文書（`README.md` / 本ファイル）に齟齬が出る変更は、内容を更新する。

## セキュリティと秘密情報
- 秘密情報（API キー、トークン、パスワード等）をコードにハードコードしない。
- 環境変数経由で取り扱い、ログに出力しない。
- ユーザー生成コンテンツを表示する際は XSS を意識し、危険な HTML の挿入は避ける。
- 将来的に API エンドポイントを追加する場合は、入力バリデーション・認可・エラーハンドリングを必須とする。

## 変更方針（エージェント向け）
- 目的の問題に対する最小限かつ根本原因への修正を優先。
- 無関係なファイル・命名・構造の変更は行わない。
- 既存のコードスタイルに合わせる（フォーマッタ未導入のため、過度な自動整形は避ける）。
- 大きな改変や破壊的変更、依存の大幅追加は事前相談。
- ドキュメントの追随更新を行う（本ファイル/README/SANITY_SETUP）。

## 検証チェックリスト
- `npm run build` が成功する。
- `npm run dev` で主要ページが表示できる（`/`, `/blog`, 個別記事等）。
- TypeScript の型エラーが出ていない。
- 主要リンク・ナビゲーション・遅延読み込みが動作する。
- Sanity の取得（一覧・個別・カテゴリ/タグ・検索）が機能する（ダミーでも可）。
- PWA/アセット参照（`manifest.json`, `sw.js`, `public/images/*`）に破損がない。

## Sanity に関する注意
- セットアップは `SANITY_SETUP.md` を参照。CORS/トークン/プロジェクト ID の設定を確認。
- クエリは `services/sanityService.ts` に集約。GROQ の変更は既存型と整合性を取る。
- 画像は `@sanity/image-url` の `urlFor` を使用。

## デプロイ
- Vercel を想定。`vercel.json` により SPA のリライト設定、ビルド/出力ディレクトリ（`dist`）を管理。
- 本番前に `npm run build` → `npm run preview` で表示確認。
 - Service Worker は本番のみ有効。開発（localhost）では自動的に未登録化し、Vite/HMR と干渉しない。

## スクリプト/ユーティリティ
- 画像最適化: `scripts/optimize-images.js`（Sharp を使う場合は別途導入）。
- アイコン生成ガイド: `scripts/generate-icons.js`（必要サイズと指針を出力）。
- サイトマップ/パフォーマンス計測の補助は `utils/` を参照。

## 作業オペレーション（Codex などのエージェントへ）
- ファイル検索は `rg` を優先。出力は 250 行以内で分割して確認。
- 変更は `apply_patch` を用いてパッチ単位で行う（小さく、可逆的に）。
- ビルド/起動・フォーマット・テスト等のコマンド実行は必要最小限に留める。
- 破壊的/広範囲な操作やネットワーク依存タスクは事前にユーザー承認を得る。

## 禁止事項
- 機能に関係のない大規模リファクタ・命名一括変更。
- 無断での依存追加/削除、メジャーアップグレード。
- 機能削除、データ削除、設定の破壊的変更。
- 秘密情報の出力・埋め込み、デバッグ情報の放置。

---

必要に応じて本ファイルは更新してください。プロダクトの意図や制約が変化した場合は、まず本ファイルにその方針を反映し、以降の作業の基準とします。
