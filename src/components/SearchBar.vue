<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  search: [city: string]
}>()

const query = ref('')

function handleSubmit() {
  const city = query.value.trim()
  if (city) emit('search', city)
}
</script>

<template>
  <form
    class="flex items-center gap-2 w-full max-w-lg mx-auto"
    @submit.prevent="handleSubmit"
  >
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
</template>
