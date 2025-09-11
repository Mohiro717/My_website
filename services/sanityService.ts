
import imageUrlBuilder from '@sanity/image-url'
import type { Post, Category, Tag, Author } from '../types'
import { sanityClient } from '../sanity.client'

const client = sanityClient

const builder = imageUrlBuilder(client)

export const urlFor = (source: any) => builder.image(source)

// GROQ queries
const postFields = `
  _id,
  title,
  slug,
  excerpt,
  mainImage,
  publishedAt,
  featured,
  author->{
    name,
    image
  },
  categories[]->{
    _id,
    title,
    slug
  },
  tags[]->{
    _id,
    title,
    slug,
    color
  },
  body
`

export const sanityService = {
  getPosts: async (): Promise<Post[]> => {
    const query = `*[_type == "post"] | order(publishedAt desc) {
      ${postFields}
    }`
    return await client.fetch(query)
  },

  getPostBySlug: async (slug: string): Promise<Post | undefined> => {
    const query = `*[_type == "post" && slug.current == $slug][0] {
      ${postFields}
    }`
    return await client.fetch(query, { slug })
  },

  getPostsByCategory: async (categorySlug: string): Promise<Post[]> => {
    const query = `*[_type == "post" && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(publishedAt desc) {
      ${postFields}
    }`
    return await client.fetch(query, { categorySlug })
  },

  getPostsByTag: async (tagSlug: string): Promise<Post[]> => {
    const query = `*[_type == "post" && references(*[_type == "tag" && slug.current == $tagSlug]._id)] | order(publishedAt desc) {
      ${postFields}
    }`
    return await client.fetch(query, { tagSlug })
  },

  getCategories: async (): Promise<Category[]> => {
    const query = `*[_type == "category"] | order(title asc) {
      _id,
      title,
      slug,
      description
    }`
    return await client.fetch(query)
  },

  getTags: async (): Promise<Tag[]> => {
    const query = `*[_type == "tag"] | order(title asc) {
      _id,
      title,
      slug,
      color
    }`
    return await client.fetch(query)
  },

  getFeaturedPosts: async (): Promise<Post[]> => {
    const query = `*[_type == "post" && featured == true] | order(publishedAt desc) [0...3] {
      ${postFields}
    }`
    return await client.fetch(query)
  },

  searchPosts: async (searchQuery: string): Promise<Post[]> => {
    const query = `*[
      _type == "post" && (
        title match $searchQuery + "*" ||
        excerpt match $searchQuery + "*" ||
        pt::text(body) match $searchQuery + "*" ||
        categories[]->title match $searchQuery + "*" ||
        tags[]->title match $searchQuery + "*"
      )
    ] | order(publishedAt desc) {
      ${postFields}
    }`
    return await client.fetch(query, { searchQuery })
  }
}
