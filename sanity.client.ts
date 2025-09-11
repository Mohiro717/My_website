import { createClient } from '@sanity/client'

console.log('Sanity Client Config:')
console.log('PROJECT_ID:', import.meta.env.VITE_SANITY_PROJECT_ID || 'iqc6wbsd')
console.log('DATASET:', import.meta.env.VITE_SANITY_DATASET || 'production')

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'iqc6wbsd',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})