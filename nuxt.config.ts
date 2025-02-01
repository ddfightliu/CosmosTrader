// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@nuxtjs/i18n'
  ],
  i18n: {
    vueI18n: './i18n.config.ts',
    locales: [
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' },
      { code: 'zh', iso: 'zh-CN', name: '中文', file: 'zh.json' }
    ],
    lazy: false,
    langDir: 'locales',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: true,
      fallbackLocale: 'en'
    }
  },
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', '/register']
    },
    url: process.env.SUPABASE_URL || '',
    key: process.env.SUPABASE_KEY || '',
    serviceKey: process.env.SUPABASE_SERVICE_KEY || '',
    clientOptions: {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    }
  },
  runtimeConfig: {
    public: {
      supabase: {
        url: process.env.SUPABASE_URL || '',
        key: process.env.SUPABASE_KEY || ''
      }
    }
  }
})