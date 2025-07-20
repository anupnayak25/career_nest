import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    allowedHosts: ['career-nest-1.onrender.com', 'careernest.anupnayak.me'],
  },
  plugins: [react()],
})
