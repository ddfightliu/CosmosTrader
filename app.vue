<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <div v-if="initError" class="p-4 bg-red-600 text-white text-center">
      {{ initError }}
    </div>

    <header v-if="!isInitializing" class="p-4 bg-gray-800 flex justify-between items-center">
      <h1 class="text-3xl font-bold">Crypto Trading Platform</h1>
      <div v-if="user" class="flex items-center space-x-4">
        <span class="text-gray-300">{{ user.email }}</span>
        <button @click="handleLogout" class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded">
          Logout
        </button>
      </div>
    </header>

    <div v-if="isInitializing" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p class="mt-4">Loading...</p>
      </div>
    </div>

    <header v-else class="p-4 bg-gray-800 flex justify-between items-center">
      <NuxtLink to="/" class="text-3xl font-bold">{{ $t('trading.platform') }}</NuxtLink>
      <div class="flex items-center space-x-4">
        <LanguageSelector />
        <div v-if="user" class="relative">
          <button @click="isMenuOpen = !isMenuOpen" class="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">
            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              {{ user.email?.charAt(0).toUpperCase() }}
            </div>
            <span class="text-gray-300">{{ user.email }}</span>
          </button>

          <!-- Dropdown Menu -->
          <div v-if="isMenuOpen" class="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl py-2">
            <NuxtLink to="/settings" class="block px-4 py-2 text-gray-300 hover:bg-gray-700"
              @click="isMenuOpen = false">
              {{ $t('common.settings') }}
            </NuxtLink>
            <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700">
              {{ $t('common.logout') }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <template v-else>
      <NuxtLoadingIndicator />
      <NuxtPage />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useSupabaseUser } from '#imports'
import { useAuthStore } from '~/stores/auth'
import { useTradingStore } from '~/stores/trading'
import { watch, onMounted, ref } from 'vue'
import type { User } from '@supabase/supabase-js'

const user = useSupabaseUser()
const authStore = useAuthStore()
const tradingStore = useTradingStore()
const { initialize, isInitializing, initError } = useSupabaseInit()
const isMenuOpen = ref(false)
const router = useRouter()

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
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.user-menu')) {
      isMenuOpen.value = false
    }
  })
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