import { createClient } from '@sanity/client'

const isDev = import.meta.env.DEV

const projectId = (import.meta.env.VITE_SANITY_PROJECT_ID ?? '').trim()
const dataset = (import.meta.env.VITE_SANITY_DATASET ?? '').trim() || 'production'
const apiVersion = (import.meta.env.VITE_SANITY_API_VERSION ?? '2024-01-01').trim() || '2024-01-01'

const missingProjectMessage =
  '[Sanity] Missing VITE_SANITY_PROJECT_ID. Follow https://www.sanity.io/docs/connect-your-frontend-to-sanity to configure your environment.'

if (!projectId) {
  if (isDev) {
    try {
      console.warn(missingProjectMessage)
    } catch {}
  } else {
    throw new Error(missingProjectMessage)
  }
}

export const isSanityConfigured = Boolean(projectId)

if (isDev && isSanityConfigured) {
  try {
    console.log('[Sanity] Client configured', { projectId, dataset, apiVersion })
  } catch {}
}

const sharedConfig = isSanityConfigured
  ? {
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      perspective: 'published' as const,
    }
  : null

export const sanityClient = sharedConfig ? createClient(sharedConfig) : null

export const missingSanityConfigMessage = missingProjectMessage
