<script setup lang="ts">
import { ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'

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
  <div class="flex flex-col gap-2 w-full max-w-lg mx-auto">
    <form class="flex items-center gap-2" @submit.prevent="handleSubmit">
      <input
        v-model="query"
        type="text"
        placeholder="Buscar ciudad... (ej: San Salvador)"
        aria-label="Buscar ciudad"
        class="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600
               bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
               placeholder-gray-400 dark:placeholder-gray-500
               focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
      />
      <button
        type="submit"
        aria-label="Buscar"
        class="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 active:bg-sky-700
               text-white font-semibold rounded-xl transition"
      >
        Buscar
      </button>
    </form>

    <!-- Historial de búsquedas -->
    <div v-if="settings.history.length" class="flex flex-wrap gap-1.5">
      <button
        v-for="city in settings.history"
        :key="city"
        @click="selectHistory(city)"
        class="px-2.5 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700
               text-gray-600 dark:text-gray-300 hover:bg-sky-100 dark:hover:bg-sky-900/40
               hover:text-sky-600 dark:hover:text-sky-300 transition-colors"
      >
        🕐 {{ city }}
      </button>
    </div>
  </div>
</template>

