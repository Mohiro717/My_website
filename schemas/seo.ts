import {defineType} from 'sanity'

export const seoSchema = defineType({
  name: 'seo',
  title: 'SEO設定',
  type: 'object',
  fields: [
    {
      name: 'metaTitle',
      title: 'メタタイトル',
      type: 'string',
      description: '検索結果などで表示されるタイトル。最大60文字を推奨。',
      validation: (Rule: any) => Rule.max(60)
    },
    {
      name: 'metaDescription',
      title: 'メタディスクリプション',
      type: 'text',
      rows: 3,
      description: '検索結果などで表示される説明文。最大160文字を推奨。',
      validation: (Rule: any) => Rule.max(160)
    },
    {
      name: 'noIndex',
      title: 'インデックスを避ける',
      type: 'boolean',
      description: '検索エンジンにインデックスさせたくない場合に有効化します。',
      initialValue: false
    }
  ]
})
