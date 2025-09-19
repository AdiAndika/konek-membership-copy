// nuxt.config.ts

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        '/api': {
          // GANTI URL INI
          target: 'https://debug.openaccess.co.id', 
          changeOrigin: true,
        },
      },
    },
  },
});