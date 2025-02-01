import { createClient } from '@supabase/supabase-js'

// Use runtime config instead of direct env access
export const createSupabaseClient = () => {
  const config = useRuntimeConfig()
  
  if (!config.public.supabase.url || !config.public.supabase.key) {
    throw new Error('Missing Supabase configuration. Please check your environment variables.')
  }

  return createClient(
    config.public.supabase.url,
    config.public.supabase.key,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    }
  )
}