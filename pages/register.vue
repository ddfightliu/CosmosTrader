<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
    <div class="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 class="text-2xl font-bold text-white mb-6">Register</h1>
      
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="mt-1 block w-full rounded bg-gray-700 border-gray-600 text-white"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="mt-1 block w-full rounded bg-gray-700 border-gray-600 text-white"
          >
        </div>

        <div v-if="authStore.error" class="text-red-500 text-sm">
          {{ authStore.error }}
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
          {{ authStore.loading ? 'Loading...' : 'Register' }}
        </button>

        <div class="text-center text-gray-400">
          Already have an account?
          <NuxtLink to="/login" class="text-blue-400 hover:text-blue-300">
            Login
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from '#imports'

const router = useRouter()
const authStore = useAuthStore()

const email = ref<string>('')
const password = ref<string>('')

const handleRegister = async (): Promise<void> => {
  await authStore.register(email.value, password.value)
  if (!authStore.error) {
    router.push('/confirm')
  }
}

</script>