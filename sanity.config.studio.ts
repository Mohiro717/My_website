import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemas} from './schemas'

export default defineConfig({
  name: 'mohiro-portfolio-studio',
  title: 'Mohiro Portfolio & Blog',
  
  projectId: process.env.VITE_SANITY_PROJECT_ID || 'iqc6wbsd',
  dataset: process.env.VITE_SANITY_DATASET || 'production',

  plugins: [
    structureTool(),
    visionTool(),
  ],

  schema: {
    types: schemas,
  },
})