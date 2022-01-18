import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import checker from 'vite-plugin-checker'
import { VitePWA } from "vite-plugin-pwa"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      mode: "development",
      base: "/",
      srcDir: "src",
      filename: "sw.ts",
      includeAssets: ["/favicon.ico"],
      strategies: "injectManifest",
      manifest: {
        name: "Memorama!",
        short_name: "Memorama!",
        theme_color: "#ec489d",
        start_url: "/",
        display: "standalone",
        background_color: "#ffd4f1",
        icons: [
            {
                "src": "icons/android-chrome-192x192.png",
                "sizes": "192x192",
                "type": "image/png"
            },
            {
                "src": "icons/android-chrome-512x512.png",
                "sizes": "512x512",
                "type": "image/png"
            },
            {
                src: "icons/android-chrome-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any maskable",
            },
        ],
      },
    }),
  ],
  server: {
    host: true
  }
})