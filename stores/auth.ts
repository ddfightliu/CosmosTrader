import { defineStore } from 'pinia'
import { useSupabaseClient } from '#imports'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  loading: boolean
  error: string | null
  user: User | null
  register_data: any 
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    loading: false,
    error: null,
    user: null,
    register_data: null,
  }),

  actions: {
    async register(email: string, password: string) {
      this.loading = true
      this.error = null
      const supabase = useSupabaseClient()

      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/login`
          }
        })
        
        if (error) {
          this.error = error.message
          throw error
        }
        
        // Wait a moment for the trigger to complete
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.register_data = data
        return data
      } catch (err: any) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async login(email: string, password: string) {
      this.loading = true
      this.error = null
      const supabase = useSupabaseClient()

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        return data
      } catch (err: any) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async logout() {
      const supabase = useSupabaseClient()
      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        this.user = null
      } catch (err: any) {
        this.error = err.message
        throw err
      }
    }
  }
})