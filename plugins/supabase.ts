import { defineNuxtPlugin } from '#app'
import { createSupabaseClient } from '~/utils/supabase'

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre', // Run before other plugins
  async setup() {
    try {
      const supabase = createSupabaseClient()
      
      // Add error handling for Supabase client
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          // Clear any user data from stores
          const tradingStore = useTradingStore()
          const authStore = useAuthStore()
          tradingStore.$reset()
          authStore.$reset()
        }
      })
    } catch (error) {
      console.error('Supabase plugin initialization error:', error)
    }
  }
})