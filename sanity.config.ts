import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemas} from './schemas'

const projectId = (process.env.VITE_SANITY_PROJECT_ID || '').trim()
const dataset = (process.env.VITE_SANITY_DATASET || 'production').trim() || 'production'

if (!projectId) {
  throw new Error('Missing VITE_SANITY_PROJECT_ID for Sanity Studio. Set it in your environment.')
}

export default defineConfig({
  name: 'mohiro-portfolio',
  title: 'Mohiro Portfolio & Blog',
  
  projectId,
  dataset,

  plugins: [
    structureTool(),
    visionTool(),
  ],

  schema: {
    types: schemas,
  },
})
