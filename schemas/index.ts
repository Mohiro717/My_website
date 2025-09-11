import { postSchema } from './post'
import { categorySchema } from './category'
import { tagSchema } from './tag'
import { authorSchema } from './author'

export { postSchema, categorySchema, tagSchema, authorSchema }

export const schemas = [
  postSchema,
  categorySchema,
  tagSchema,
  authorSchema
]