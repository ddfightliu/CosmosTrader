export default defineNuxtPlugin(() => {
  const { locale } = useI18n()
  
  // Get browser language
  const getBrowserLocale = () => {
    if (process.client) {
      const navigatorLocale = 
        navigator.languages?.[0] || 
        navigator.language || 
        'en'
      
      // Convert to short locale code
      const shortLocale = navigatorLocale.split('-')[0]
      
      return shortLocale
    }
    return 'en'
  }

  // Set initial locale based on browser language
  if (process.client) {
    onMounted(() => {
      const browserLocale = getBrowserLocale()
      if (['en', 'zh'].includes(browserLocale) && locale.value !== browserLocale) {
        locale.value = browserLocale
      }
    })
  }
})