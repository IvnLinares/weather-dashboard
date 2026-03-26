<script setup lang="ts">
import type { ForecastDay } from '@/types/weather'
import ForecastCard from './ForecastCard.vue'

defineProps<{ days: ForecastDay[] }>()
</script>

<template>
  <div class="w-full">
    <h2 class="text-xs font-semibold text-gray-500/70 dark:text-gray-400/50 uppercase tracking-wider mb-3">
      Pronóstico 5 días
    </h2>
    <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-none sm:grid sm:grid-cols-5 sm:overflow-visible">
      <ForecastCard
        v-for="day in days"
        :key="day.date"
        :day="day"
        class="min-w-[110px] sm:min-w-0"
      />
    </div>
  </div>
</template>
