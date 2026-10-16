import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// SITE_URL is the public address of the website (used for canonical links, sitemap, Open Graph and schema).
// Change it with an environment variable when building, e.g. SITE_URL=https://example.com npm run build
const DEFAULT_SITE_URL = 'https://thecosmohillresort.com'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (process.env.SITE_URL || env.SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '')
  return {
    plugins: [react()],
    define: { __SITE_URL__: JSON.stringify(siteUrl) },
    // In development, /api requests go to the payment server (npm run server).
    server: { proxy: { '/api': 'http://localhost:5000' } },
  }
})
