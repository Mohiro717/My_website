import {defineCliConfig} from 'sanity/cli'

const projectId = (process.env.VITE_SANITY_PROJECT_ID || '').trim()
const dataset = (process.env.VITE_SANITY_DATASET || 'production').trim() || 'production'

if (!projectId) {
  throw new Error('Missing VITE_SANITY_PROJECT_ID for Sanity CLI. Set it in your environment.')
}

export default defineCliConfig({
  api: {
    projectId,
    dataset
  },
  studioHost: 'mohiro-portfolio'
})
