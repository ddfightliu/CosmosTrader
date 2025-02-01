import { useSupabaseUser, useRouter } from '#imports'

export const useServerAuth = () => {
  const user = useSupabaseUser()
  const { push } = useRouter()

  const checkAuth = async () => {
    try {
      const { data: { session } } = await useSupabaseClient().auth.getSession()
      if (!session) {
        await push('/login')
      }
      return session
    } catch (error) {
      console.error('Auth check error:', error)
      await push('/login')
    }
  }

  return {
    checkAuth,
    user
  }
}