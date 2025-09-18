
import imageUrlBuilder from '@sanity/image-url'
import type { Post, Category, Tag, Author } from '../types'
import { sanityClient, missingSanityConfigMessage } from '../sanity.client'

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null

const noopImageBuilder = (() => {
  const chain: any = {}
  chain.width = () => chain
  chain.height = () => chain
  chain.fit = () => chain
  chain.quality = () => chain
  chain.url = () => ''
  return chain
})()

export const urlFor = (source: any) => {
  if (!builder) {
    if (import.meta.env.DEV) {
      try {
        console.warn('[Sanity] Image builder unavailable. Returning empty URL.')
      } catch {}
    }
    return noopImageBuilder
  }

  return builder.image(source)
}

const handleMissingClient = <T>(fallback: T): T => {
  if (import.meta.env.DEV) {
    try {
      console.warn(`${missingSanityConfigMessage} Returning fallback data in dev mode.`)
    } catch {}
    return fallback
  }

  throw new Error(missingSanityConfigMessage)
}

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
    if (!sanityClient) {
      return handleMissingClient<Post[]>([])
    }

    return await sanityClient.fetch(query)
  },

  getPostBySlug: async (slug: string): Promise<Post | undefined> => {
    const query = `*[_type == "post" && slug.current == $slug][0] {
      ${postFields}
    }`
    if (!sanityClient) {
      return handleMissingClient<Post | undefined>(undefined)
    }

    return await sanityClient.fetch(query, { slug })
  },

  getPostsByCategory: async (categorySlug: string): Promise<Post[]> => {
    const query = `*[_type == "post" && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(publishedAt desc) {
      ${postFields}
    }`
    if (!sanityClient) {
      return handleMissingClient<Post[]>([])
    }

    return await sanityClient.fetch(query, { categorySlug })
  },

  getPostsByTag: async (tagSlug: string): Promise<Post[]> => {
    const query = `*[_type == "post" && references(*[_type == "tag" && slug.current == $tagSlug]._id)] | order(publishedAt desc) {
      ${postFields}
    }`
    if (!sanityClient) {
      return handleMissingClient<Post[]>([])
    }

    return await sanityClient.fetch(query, { tagSlug })
  },

  getCategories: async (): Promise<Category[]> => {
    const query = `*[_type == "category"] | order(title asc) {
      _id,
      title,
      slug,
      description
    }`
    if (!sanityClient) {
      return handleMissingClient<Category[]>([])
    }

    return await sanityClient.fetch(query)
  },

  getTags: async (): Promise<Tag[]> => {
    const query = `*[_type == "tag"] | order(title asc) {
      _id,
      title,
      slug,
      color
    }`
    if (!sanityClient) {
      return handleMissingClient<Tag[]>([])
    }

    return await sanityClient.fetch(query)
  },

  getFeaturedPosts: async (): Promise<Post[]> => {
    const query = `*[_type == "post" && featured == true] | order(publishedAt desc) [0...3] {
      ${postFields}
    }`
    if (!sanityClient) {
      return handleMissingClient<Post[]>([])
    }

    return await sanityClient.fetch(query)
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
    if (!sanityClient) {
      return handleMissingClient<Post[]>([])
    }

    return await sanityClient.fetch(query, { searchQuery })
  }
}
