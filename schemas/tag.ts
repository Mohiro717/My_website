import {defineType} from 'sanity'

export const tagSchema = defineType({
  name: 'tag',
  title: 'タグ',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'タイトル',
      type: 'string',
      validation: (Rule: any) => Rule.required().max(30)
    },
    {
      name: 'slug',
      title: 'スラッグ',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'color',
      title: '色',
      type: 'string',
      options: {
        list: [
          { title: '青', value: 'blue' },
          { title: 'ピンク', value: 'pink' },
          { title: '緑', value: 'green' },
          { title: '紫', value: 'purple' },
          { title: 'オレンジ', value: 'orange' },
          { title: 'グレー', value: 'gray' }
        ]
      }
    }
  ]
})