<template>
  <div class="p-4">
    <div v-if="!user" class="text-center py-8">
      <p class="text-xl mb-4">Please login to start trading</p>
      <NuxtLink
        to="/login"
        class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded"
      >
        Login
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Chart Section -->
      <div class="lg:col-span-2 bg-gray-800 rounded-lg p-4">
        <TradingChart />
      </div>

      <!-- Order Book Section -->
      <div>
        <OrderBook />
      </div>

      <!-- Trading Form Section -->
      <div class="lg:col-span-2">
        <TradeForm />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSupabaseUser } from '#imports'
import { useTradingStore } from '~/stores/trading'

const user = useSupabaseUser()
const tradingStore = useTradingStore()

// Server-side initialization
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// Price simulation only on client side
onMounted(() => {
  if (user.value) {
    setInterval(() => {
      tradingStore.simulatePriceMovement()
    }, 3000)
  }
})
</script>