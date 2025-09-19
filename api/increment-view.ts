import { createClient } from '@sanity/client'

type VercelRequest = {
  method?: string;
  body?: any;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (payload: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

const projectId = (process.env.VITE_SANITY_PROJECT_ID ?? '').trim()
const dataset = (process.env.VITE_SANITY_DATASET ?? '').trim() || 'production'
const apiVersion = (process.env.VITE_SANITY_API_VERSION ?? '2024-01-01').trim() || '2024-01-01'
const token = (process.env.SANITY_WRITE_TOKEN ?? '').trim()

const client = projectId && token
  ? createClient({ projectId, dataset, apiVersion, useCdn: false, token })
  : null

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  if (!client) {
    res.status(500).json({ error: 'Sanity client is not configured on the server.' })
    return
  }

  const { slug } = req.body ?? {}

  if (!slug || typeof slug !== 'string') {
    res.status(400).json({ error: 'A valid slug is required.' })
    return
  }

  try {
    const post = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0]{ _id, viewCount }`,
      { slug }
    )

    if (!post?._id) {
      res.status(404).json({ error: 'Post not found.' })
      return
    }

    const updated = await client
      .patch(post._id)
      .setIfMissing({ viewCount: 0 })
      .inc({ viewCount: 1 })
      .commit({ returnDocuments: true })

    res.status(200).json({ viewCount: updated.viewCount ?? 0 })
  } catch (error) {
    console.error('Failed to increment view count', error)
    res.status(500).json({ error: 'Failed to increment view count.' })
  }
}
