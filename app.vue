<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <div v-if="initError" class="p-4 bg-red-600 text-white text-center">
      {{ initError }}
    </div>

    <header v-if="!isInitializing" class="p-4 bg-gray-800 flex justify-between items-center">
      <h1 class="text-3xl font-bold">{{ $t('nav.platform') }}</h1>
      <div class="flex items-center space-x-4">
        <!-- 语言选择器 -->
        <select v-model="currentLocale" @change="switchLanguage" class="bg-gray-700 text-white rounded px-2 py-1">
          <option value="en">English</option>
          <option value="zh">中文</option>
        </select>

        <div v-if="user" class="flex items-center space-x-4">
          <span class="text-gray-300">{{ user.email }}</span>
          <button @click="handleLogout" class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded">
            {{ $t('nav.logout') }}
          </button>
        </div>
      </div>
    </header>

    <div v-if="isInitializing" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p class="mt-4">{{ $t('loading') }}</p>
      </div>
    </div>

    <template v-else>
      <NuxtLoadingIndicator />
      <NuxtPage />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSupabaseUser } from '#imports'
import { useAuthStore } from '~/stores/auth'
import { useTradingStore } from '~/stores/trading'
import { watch, onMounted } from 'vue'
import type { User } from '@supabase/supabase-js'
import { useSupabaseInit } from '~/composables/useSupabaseInit'

const user = useSupabaseUser()
const authStore = useAuthStore()
const tradingStore = useTradingStore()
const { initialize, isInitializing, initError } = useSupabaseInit()
const isMenuOpen = ref(false)
const router = useRouter()
const { locale } = useI18n()
const currentLocale = ref(locale.value)

// Get browser language
const getBrowserLocale = () => {
  if (process.client) {
    const navigatorLocale =
      navigator.languages?.[0] ||
      navigator.language ||
      'en'

    // Convert to short locale code
    const shortLocale = navigatorLocale.split('-')[0]
    console.log('Browser locale:', shortLocale)
    return shortLocale
  }
  return 'en'
}

// Change locale
const switchLanguage = () => {
  locale.value = currentLocale.value
}

// Handle logout
const handleLogout = async () => {
  try {
    await authStore.logout()
    tradingStore.$reset() // Reset trading store state on logout
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Initialize Supabase and load data
onMounted(async () => {
  const browserLocale = getBrowserLocale()
  console.log('Current locale:', locale.value)
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.user-menu')) {
      isMenuOpen.value = false
    }
  })


  if (['en', 'zh'].includes(browserLocale) && locale.value !== browserLocale) {
    locale.value = browserLocale
  }


  try {
    await initialize()
  } catch (error) {
    console.error('App initialization error:', error)
  }
})

// Watch for user changes
watch(user, async (newUser: User | null) => {
  if (newUser) {
    try {
      await tradingStore.loadUserBalance()
    } catch (error) {
      console.error('Error loading user balance:', error)
    }
  }
}, { immediate: true })
</script>