<script setup lang="ts">
import { ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { Clock, Search } from 'lucide-vue-next'

const emit = defineEmits<{ search: [city: string] }>()
const settings = useSettingsStore()

const query = ref('')

function handleSubmit() {
  const city = query.value.trim()
  if (city) emit('search', city)
}

function selectHistory(city: string) {
  query.value = city
  emit('search', city)
}
</script>

<template>
  <div class="flex flex-col gap-2 w-full">
    <form class="flex items-center gap-2" @submit.prevent="handleSubmit">
      <input
        v-model="query"
        type="text"
        placeholder="Buscar ciudad..."
        aria-label="Buscar ciudad"
        class="flex-1 px-4 py-2 rounded-full glass-input
               text-gray-900 dark:text-gray-100 text-sm"
      />
      <button
        type="submit"
        aria-label="Buscar"
        class="glass-btn-primary p-2 sm:px-4 sm:py-2 rounded-full flex items-center justify-center gap-1.5 font-semibold text-sm shrink-0"
      >
        <Search :size="16" />
        <span class="hidden sm:inline">Buscar</span>
      </button>
    </form>

    <!-- Historial de búsquedas -->
    <div v-if="settings.history.length" class="flex flex-wrap gap-1.5">
      <button
        v-for="city in settings.history"
        :key="city"
        @click="selectHistory(city)"
        class="glass-subtle px-2.5 py-0.5 text-xs rounded-full
               text-gray-600 dark:text-gray-300
               hover:bg-white/40 dark:hover:bg-white/[0.1]
               transition-all duration-200 flex items-center gap-1"
      >
        <Clock :size="10" /> {{ city }}
      </button>
    </div>
  </div>
</template>

