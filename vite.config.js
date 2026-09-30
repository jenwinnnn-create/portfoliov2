import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,              // bind 0.0.0.0 so the live preview works
    allowedHosts: true,      // allow the sandbox preview host
  },
})
