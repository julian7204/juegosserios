import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Rutas relativas: el build funciona en cualquier subcarpeta (GitHub Pages)
  base: './',
  plugins: [react(),tailwindcss()],
})
