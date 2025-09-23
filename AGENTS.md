# AGENTS.md

## 技術スタック
- React 19 + TypeScript + Vite（SPA、`HashRouter` でルーティング）
- Tailwind CSS（CDN で読み込み）、カスタム UI コンポーネント群
- Sanity（`@sanity/client` + GROQ、`sanityService` にクエリ集約）
- Vercel デプロイ（`vercel.json` で SPA リライト）、PWA 設定・`public/` アセット

## リポジトリ境界
- このリポジトリはフロントエンド SPA、Sanity スキーマ、補助スクリプト、PWA アセット、Vercel 向け設定を含む。
- Sanity プロジェクト本体（データセット、Studio デプロイ先）、Vercel プロジェクト設定、環境変数ファイル（`.env.local` など個人差分）は外部管理とする。
- Gemini API キーや Sanity トークンなどの機密情報はコミット禁止。必要な場合は `.env.local` を各自で用意する。
- Codex CLI は常にリポジトリルート（このディレクトリ）で起動し、ホームディレクトリ等の上位パスでは実行しない。

## 実行コマンド
- `npm install` — 依存関係のインストール
- `npm run dev` — Vite 開発サーバ起動（SW は開発時未登録）
- `npm run test` — Node 組み込みテストランナー（tests/ または __tests__/ が無ければスキップ）
- `npm run lint` — TypeScript ベースの簡易リンタ（`tsc --noEmit` を実行）
- `npm run typecheck` — 型チェック専用（`tsc --noEmit`）
- `npm run build` — 本番ビルド
- `npm run preview` — ビルド成果物のローカル確認
- `npm run studio` — Sanity Studio（ローカル）
- `npm run studio:deploy` — Sanity Studio デプロイ
- `node scripts/github-workflow.js <command>` — GitHub 向け作業補助（`status`/`summary`/`prepare`）

## コーディング規約
- TypeScript を徹底し `any` 乱用を避ける。既存の `types.ts` を再利用・拡張する。
- React は関数コンポーネント + フックで記述し、副作用は `useEffect` に集約、依存配列を厳密管理。
- 命名はコンポーネント `PascalCase.tsx`、ユーティリティ `camelCase.ts`。可読性を最優先。
- 既存レイアウト・スタイルを尊重し、必要最小限の差分に留める。フォーマッタ未導入のため大規模整形は禁止。
- 秘密情報はハードコードせず環境変数を使用。ログにも出力しない。

## 触って良い範囲
- 既存機能のバグ修正、小規模な UI/UX 改善、Sanity クエリ・型の整合性調整。
- `components/`, `pages/`, `services/`, `schemas/`, `utils/`, `public/` 配下の既存構造に沿った追加・修正。
- 依存追加・メジャーアップグレード、大規模リファクタ、機能削除、設定破壊はユーザー指示がない限り不可。
- 新規スクリプト作成やドキュメント更新はプロジェクト方針に合致する場合のみ実施。

## Definition of Done
- CI 成功条件として `npm run lint` → `npm run typecheck` → `npm test` → `npm run build` がすべて成功する。
- `npm run dev` で主要ルート（`/`, `/blog`, 個別記事など）が正常に表示・遷移できる。
- Sanity からのデータ取得（一覧・詳細・カテゴリ/タグ）が期待通り動作し、例外時は適切にハンドリングされている。
- PWA/アセット参照（`manifest.json`, `sw.js`, `public/images/*`）が破損していない。
- 関連ドキュメント（README, SANITY_SETUP など）との整合性が取れており、変更点が反映されている。
