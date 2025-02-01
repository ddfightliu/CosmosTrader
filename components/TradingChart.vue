<template>
  <div ref="chartContainer" class="w-full h-[400px]"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { createChart, ColorType } from 'lightweight-charts'
import { useTradingStore } from '~/stores/trading'

const chartContainer = ref(null)
const chart = ref(null)
const candleSeries = ref(null)
const tradingStore = useTradingStore()

onMounted(() => {
  chart.value = createChart(chartContainer.value, {
    layout: {
      background: { color: '#1E1E1E' },
      textColor: '#DDD',
    },
    grid: {
      vertLines: { color: '#2B2B2B' },
      horzLines: { color: '#2B2B2B' },
    },
    width: chartContainer.value.clientWidth,
    height: 400
  })

  candleSeries.value = chart.value.addCandlestickSeries()
  
  // Initial data
  const initialData = generateInitialData()
  candleSeries.value.setData(initialData)

  // Update chart on window resize
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (chart.value) {
    chart.value.remove()
  }
  window.removeEventListener('resize', handleResize)
})

function handleResize() {
  if (chart.value) {
    chart.value.applyOptions({
      width: chartContainer.value.clientWidth
    })
  }
}

function generateInitialData() {
  const data = []
  const numberOfPoints = 100
  let basePrice = tradingStore.currentPrice
  let time = new Date(Date.now() - (numberOfPoints * 60000))

  for (let i = 0; i < numberOfPoints; i++) {
    const open = basePrice + Math.random() * 100 - 50
    const high = open + Math.random() * 50
    const low = open - Math.random() * 50
    const close = (open + high + low) / 3

    data.push({
      time: time.getTime() / 1000,
      open,
      high,
      low,
      close
    })

    time = new Date(time.getTime() + 60000)
    basePrice = close
  }

  return data
}
</script>