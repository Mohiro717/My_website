import {defineType} from 'sanity'

export const authorSchema = defineType({
  name: 'author',
  title: '著者',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: '名前',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'slug',
      title: 'スラッグ',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      }
    },
    {
      name: 'image',
      title: 'プロフィール画像',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'bio',
      title: 'プロフィール',
      type: 'text',
      rows: 4
    }
  ]
})