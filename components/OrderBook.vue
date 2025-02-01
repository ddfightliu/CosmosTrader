<template>
  <div class="bg-gray-800 p-4 rounded-lg">
    <h2 class="text-xl font-bold mb-4 text-white">{{ $t('trading.orderBook') }}</h2>
    <div class="grid grid-cols-2 gap-4">
      <!-- Asks (Sell Orders) -->
      <div>
        <h3 class="text-red-500 font-semibold mb-2">{{ $t('trading.asks') }}</h3>
        <div class="space-y-1">
          <div v-for="[price, amount] in orderBook.asks" :key="price" class="text-red-400">
            <span>{{ price.toFixed(2) }}</span>
            <span class="float-right">{{ amount.toFixed(4) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Bids (Buy Orders) -->
      <div>
        <h3 class="text-green-500 font-semibold mb-2">{{ $t('trading.bids') }}</h3>
        <div class="space-y-1">
          <div v-for="[price, amount] in orderBook.bids" :key="price" class="text-green-400">
            <span>{{ price.toFixed(2) }}</span>
            <span class="float-right">{{ amount.toFixed(4) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useTradingStore } from '~/stores/trading'

const tradingStore = useTradingStore()
const { orderBook } = storeToRefs(tradingStore)
</script>