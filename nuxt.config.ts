// nuxt.config.ts

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  runtimeConfig: {
    // hanya untuk server
    OA_SECRET: process.env.OA_SECRET,
    public: {
      OA_API: process.env.NUXT_PUBLIC_OA_API,
      OA_TOKEN: process.env.NUXT_PUBLIC_OA_TOKEN,
      ADMIN_WHATSAPP_NUMBER: process.env.NUXT_PUBLIC_ADMIN_WHATSAPP_NUMBER,
    },
  },

  app: {
    head: {
      title: "Konek Membership",
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "/konekmarketlogo.png", // Path
        },
      ],
    },
  },

  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {},
    },
  },
});
