#todo: modify URL in supubase
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 text-white">
    <div class="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6">{{ $t('confirm.title') }}</h1>
      <p>{{ $t('confirm.message') }}</p>
      <p>{{ authStore.data }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
//import { useSupabaseClient } from '@supabase/supabase-js'

const router = useRouter()
const supabase = useSupabaseClient()
const authdata = ref<any>(authStore.data)
onMounted(async () => {
  const { error } = await supabase.auth.verifyOtp({
    type: 'signup',
    token: router.currentRoute.value.query.token as string
  })

  if (error) {
    console.error('Verification error:', error)
  } else {
    alert('Email verified successfully!')
    router.push('/login')
  }
})
</script>

