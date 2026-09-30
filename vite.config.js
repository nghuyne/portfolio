import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // served from https://nghuyne.github.io/portfolio/
  base: '/portfolio/',
  // three.js is lazy-loaded in its own chunk; it is large by nature
  build: { chunkSizeWarningLimit: 1100 },
})
