import { useSupabaseUser } from '#imports'

export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()

  // Public pages that don't require authentication
  const publicPages = ['/', '/login', '/register']
  const isPublicPage = publicPages.includes(to.path)

  if (!user.value && !isPublicPage) {
    return navigateTo('/login')
  }
})