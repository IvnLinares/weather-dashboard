<script setup lang="ts">
defineProps<{ message: string }>()
</script>

<template>
  <div
    class="w-full max-w-lg mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200
           dark:border-red-800 text-red-700 dark:text-red-300 rounded-2xl px-5 py-4
           flex items-start gap-3"
    role="alert"
  >
    <span class="text-xl mt-0.5">⚠️</span>
    <p class="text-sm">{{ message }}</p>
  </div>
</template>
