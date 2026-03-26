<script setup lang="ts">
import type { ForecastDay } from '@/types/weather'
import ForecastCard from './ForecastCard.vue'

defineProps<{ days: ForecastDay[] }>()
</script>

<template>
  <div class="w-full max-w-lg mx-auto">
    <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
      Pronóstico 5 días
    </h2>
    <div class="grid grid-cols-5 gap-2">
      <ForecastCard v-for="day in days" :key="day.date" :day="day" />
    </div>
  </div>
</template>
