import { postSchema } from './post'
import { categorySchema } from './category'
import { tagSchema } from './tag'
import { authorSchema } from './author'
import { seoSchema } from './seo'

export { postSchema, categorySchema, tagSchema, authorSchema, seoSchema }

export const schemas = [
  postSchema,
  categorySchema,
  tagSchema,
  authorSchema,
  seoSchema
]