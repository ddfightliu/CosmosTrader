<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Account Settings</h1>
    
    <div class="bg-gray-800 rounded-lg p-6">
      <form @submit.prevent="updateProfile" class="space-y-6">
        <!-- Profile Section -->
        <div>
          <h2 class="text-xl font-semibold mb-4">Profile Information</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                :value="user?.email"
                disabled
                class="mt-1 block w-full rounded bg-gray-700 border-gray-600 text-white opacity-50"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300">Display Name</label>
              <input
                v-model="profile.display_name"
                type="text"
                class="mt-1 block w-full rounded bg-gray-700 border-gray-600 text-white"
              >
            </div>
          </div>
        </div>

        <!-- Preferences Section -->
        <div>
          <h2 class="text-xl font-semibold mb-4">Preferences</h2>
          <div class="space-y-4">
            <div>
              <label class="flex items-center space-x-2">
                <input
                  v-model="profile.notifications_enabled"
                  type="checkbox"
                  class="rounded bg-gray-700 border-gray-600 text-blue-600"
                >
                <span class="text-gray-300">Enable Trade Notifications</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="text-red-500 text-sm">
          {{ error }}
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSupabaseUser, useSupabaseClient } from '#imports'

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const loading = ref(false)
const error = ref<string | null>(null)

const profile = ref({
  display_name: '',
  notifications_enabled: false
})

// Load user profile
const loadProfile = async () => {
  try {
    const { data, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .single()

    if (profileError) throw profileError
    if (data) {
      profile.value = {
        display_name: data.display_name || '',
        notifications_enabled: data.notifications_enabled || false
      }
    }
  } catch (err: any) {
    console.error('Error loading profile:', err)
  }
}

// Update user profile
const updateProfile = async () => {
  loading.value = true
  error.value = null

  try {
    const { error: updateError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.value?.id,
        display_name: profile.value.display_name,
        notifications_enabled: profile.value.notifications_enabled,
        updated_at: new Date().toISOString()
      })

    if (updateError) throw updateError
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Load profile on mount
onMounted(() => {
  loadProfile()
})

// Add page meta
definePageMeta({
  middleware: 'auth'
})
</script>