// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: 'https://playonweb.org/favicon.ico' }
      ],
    },
  },

  compatibilityDate: '2024-11-01',

  // css: ['~/assets/css/tailwind.css'],
  devtools: { enabled: true },

  modules: [
    '@nuxt/icon',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
    'pinia-plugin-persistedstate/nuxt'
  ]
})