<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()
onMounted(() => settings.init())
</script>

<template>
  <main
    class="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 dark:from-gray-900 dark:to-gray-800
           text-gray-900 dark:text-gray-100 transition-colors duration-300"
  >
    <RouterView />
  </main>
</template>

