import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
   server: {
    host: true, // This exposes the server to the local network
      allowedHosts:'all',
  },
  plugins: [react()],
})
