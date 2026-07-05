import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Lottie from 'lottie-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:2000',
    },
  },
  optimizeDeps: {
     include: ["lottie-react"], //added for the lottie animation new version
   },
})
