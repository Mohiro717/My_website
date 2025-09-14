import { createClient } from '@sanity/client'

// Read from Vite env (direct access ensures compile-time inlining)
const isDev = import.meta.env.DEV
const projectIdRaw = import.meta.env.VITE_SANITY_PROJECT_ID || ''
const datasetRaw = import.meta.env.VITE_SANITY_DATASET || ''

const projectId = projectIdRaw.trim()
const dataset = (datasetRaw.trim() || 'production')

if (!projectId) {
  const msg = 'Missing VITE_SANITY_PROJECT_ID. Set it in your environment (Vercel/locally).'
  if (isDev) {
    try { console.warn(msg) } catch {}
  } else {
    throw new Error(msg)
  }
}

if (isDev) {
  try { console.log('Sanity Client Config:', { projectId, dataset }) } catch {}
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  perspective: 'published',
  // Ensure no HTTP cache is used for queries
  fetch: (input: RequestInfo, init: RequestInit = {}) => {
    const headers = new Headers(init.headers || {})
    headers.set('Cache-Control', 'no-store')
    headers.set('Pragma', 'no-cache')
    return fetch(input as any, { ...init, cache: 'no-store', headers })
  },
})

