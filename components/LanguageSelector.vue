<template>
  <div class="relative">
    <button 
      @click="isOpen = !isOpen"
      class="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded"
    >
      <span class="text-gray-300">{{ currentLocale.name }}</span>
    </button>
    
    <div 
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl py-2"
    >
      <button
        v-for="locale in availableLocales"
        :key="locale.code"
        @click="switchLanguage(locale.code)"
        class="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700"
      >
        {{ locale.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const { locale, locales } = useI18n()
const isOpen = ref(false)

const availableLocales = computed(() => {
  return locales.value.map(l => ({
    code: l.code,
    name: l.name
  }))
})

const currentLocale = computed(() => {
  return locales.value.find(l => l.code === locale.value) || locales.value[0]
})

const switchLanguage = (code: string) => {
  locale.value = code
  isOpen.value = false
}

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.language-selector')) {
      isOpen.value = false
    }
  })
})
</script>