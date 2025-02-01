import { ref } from 'vue'
import { createSupabaseClient } from '~/utils/supabase'
import { useTradingStore } from '~/stores/trading'

export const useSupabaseInit = () => {
  const initialized = ref(false)
  const initError = ref<Error | null>(null)
  const isInitializing = ref(false)

  const initialize = async () => {
    if (initialized.value || isInitializing.value) return
    isInitializing.value = true

    try {
      const supabase = createSupabaseClient()
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) throw sessionError

      if (session) {
        const tradingStore = useTradingStore()
        await tradingStore.loadUserBalance()
      }

      initialized.value = true
    } catch (err) {
      initError.value = err as Error
      console.error('Supabase initialization error:', err)
      throw err // Re-throw to handle in component
    } finally {
      isInitializing.value = false
    }
  }

  return {
    initialize,
    initialized,
    initError,
    isInitializing
  }
}