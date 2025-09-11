# Sanityセットアップガイド

このプロジェクトをSanityを使って動作させるための設定手順です。

## 1. Sanityアカウント・プロジェクト作成

1. [Sanity.io](https://www.sanity.io/) にアクセス
2. アカウント作成またはログイン
3. 新しいプロジェクトを作成
4. プロジェクト名を入力（例：`mohiro-portfolio-blog`）
5. データセット名を設定（推奨：`production`）

## 2. プロジェクトID・API設定

### プロジェクトIDの取得
- Sanityダッシュボードでプロジェクト名をクリック
- **Settings** → **API** でProject IDを確認

### CORS設定
- **Settings** → **API** → **CORS Origins**で以下を追加：
  - `http://localhost:5173` (開発環境)
  - 本番環境のドメイン

### APIトークン（オプション）
- 非公開コンテンツが必要な場合のみ
- **Settings** → **API** → **Tokens**で新規作成

## 3. 環境変数の設定

`.env.local`ファイルを編集：

```bash
# Sanity Configuration
VITE_SANITY_PROJECT_ID=your-actual-project-id
VITE_SANITY_DATASET=production

# Gemini API (existing)
GEMINI_API_KEY=your-gemini-api-key
```

## 4. Sanityスタジオでのコンテンツ管理

### スタジオURL
プロジェクト作成後、以下のURLでアクセス可能：
`https://your-project-id.sanity.studio/`

### データ構造
以下のコンテンツタイプが利用可能：

#### Author（著者）
- 名前、プロフィール画像、略歴

#### Category（カテゴリ）
- タイトル、スラッグ、説明

#### Tag（タグ）
- タイトル、スラッグ、色

#### Post（記事）
- タイトル、スラッグ、抜粋
- メイン画像、著者、公開日
- カテゴリ、タグ
- 本文（リッチテキスト）
- 注目記事フラグ

## 5. 初期データの投入

1. Sanityスタジオにログイン
2. **Author**から著者情報を作成
3. **Category**でカテゴリを作成
4. **Tag**でタグを作成
5. **Post**で記事を作成

## 6. 動作確認

```bash
npm run dev
```

ブラウザで`http://localhost:5173`にアクセスして、Sanityからデータが取得できることを確認。

## トラブルシューティング

### よくある問題

1. **コンテンツが表示されない**
   - プロジェクトIDが正しく設定されているか確認
   - CORS設定が正しいか確認
   - Sanityスタジオにデータが投入されているか確認

2. **ビルドエラー**
   - 環境変数が正しく設定されているか確認
   - 型定義とAPIレスポンスが一致しているか確認

3. **画像が表示されない**
   - 画像のURLが正しく生成されているか確認
   - `urlFor`関数を使用しているか確認

## 参考リンク

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Sanity React Client](https://www.sanity.io/docs/js-client)