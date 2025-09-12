import { createClient } from '@sanity/client'

const normalize = (v: unknown): string => (typeof v === 'string' ? v.trim() : '')
const isValidId = (v: string): boolean => /^[a-z0-9-]+$/i.test(v)

// Read from Vite env at build/runtime
const rawProjectId = (import.meta as any)?.env?.VITE_SANITY_PROJECT_ID
const rawDataset = (import.meta as any)?.env?.VITE_SANITY_DATASET

const normalizedProjectId = normalize(rawProjectId)
const normalizedDataset = normalize(rawDataset)

const projectId = isValidId(normalizedProjectId) ? normalizedProjectId.toLowerCase() : 'iqc6wbsd'
const dataset = isValidId(normalizedDataset) ? normalizedDataset : 'production'

try {
  // Debug in browser console only
  console.log('Sanity Client Config:', { projectId, dataset })
} catch {}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: true,
  perspective: 'published',
})

