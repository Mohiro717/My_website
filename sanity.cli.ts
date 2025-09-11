import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.VITE_SANITY_PROJECT_ID || 'iqc6wbsd',
    dataset: process.env.VITE_SANITY_DATASET || 'production'
  },
  studioHost: 'mohiro-portfolio'
})