<script setup lang="ts">
defineProps<{ message: string }>()
</script>

<template>
  <div
    class="w-full max-w-lg mx-auto glass rounded-3xl px-5 py-4
           border-red-300/30 dark:border-red-500/20
           text-red-600 dark:text-red-300
           flex items-start gap-3"
    role="alert"
  >
    <span class="text-xl mt-0.5">⚠️</span>
    <p class="text-sm font-medium">{{ message }}</p>
  </div>
</template>
