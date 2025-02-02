<template>
  <div class="bg-gray-800 p-4 rounded-lg">
    <h2 class="text-xl font-bold mb-4 text-white">{{ $t('trading.placeOrder') }}</h2>
    <div class="space-y-4">
      <!-- Trade Type Selection -->
      <div class="flex space-x-4">
        <button 
          @click="tradeType = 'buy'"
          :class="[
            'flex-1 py-2 px-4 rounded',
            tradeType === 'buy' ? 'bg-green-600' : 'bg-gray-700'
          ]"
        >
          {{ $t('trading.buy') }}
        </button>
        <button 
          @click="tradeType = 'sell'"
          :class="[
            'flex-1 py-2 px-4 rounded',
            tradeType === 'sell' ? 'bg-red-600' : 'bg-gray-700'
          ]"
        >
          {{ $t('trading.sell') }}
        </button>
      </div>

      <!-- Price Input -->
      <div>
        <label class="block text-sm font-medium text-gray-300">{{ $t('trading.price') }}</label>
        <input
          v-model.number="price"
          type="number"
          class="mt-1 block w-full rounded bg-gray-700 border-gray-600 text-white"
        >
      </div>

      <!-- Amount Input -->
      <div>
        <label class="block text-sm font-medium text-gray-300">{{ $t('trading.amount') }}</label>
        <input
          v-model.number="amount"
          type="number"
          class="mt-1 block w-full rounded bg-gray-700 border-gray-600 text-white"
        >
      </div>

      <!-- Total -->
      <div class="text-gray-300">
        Total: {{ (price * amount).toFixed(2) }} USD
      </div>

      <!-- Submit Button -->
      <button
        @click="placeOrder"
        class="w-full py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white"
      >
        Place {{ tradeType === 'buy' ? 'Buy' : 'Sell' }} Order
      </button>

      <!-- Balance Display -->
      <div class="mt-4 text-gray-300">
        <div>USD Balance: {{ balance.usd.toFixed(2) }}</div>
        <div>BTC Balance: {{ balance.btc.toFixed(8) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTradingStore } from '~/stores/trading'

const tradingStore = useTradingStore()
const { balance } = storeToRefs(tradingStore)

const tradeType = ref('buy')
const price = ref(0)
const amount = ref(0)

function placeOrder() {
  if (tradeType.value === 'buy') {
    tradingStore.placeBuyOrder(price.value, amount.value)
  } else {
    tradingStore.placeSellOrder(price.value, amount.value)
  }
}
</script>