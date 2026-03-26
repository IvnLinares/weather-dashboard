<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next'
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
    <AlertTriangle :size="20" class="text-red-400 shrink-0 mt-0.5" />
    <p class="text-sm font-medium">{{ message }}</p>
  </div>
</template>
