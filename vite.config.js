import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@pages": "/src/pages",
      "@components": "/src/components",
      "@routes": "/src/routes",
      "@assets": "/src/assets",
      "@contexts": "/src/contexts",
    }
  }
})