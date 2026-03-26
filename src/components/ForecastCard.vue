<script setup lang="ts">
import type { ForecastDay } from '@/types/weather'

defineProps<{ day: ForecastDay }>()
</script>

<template>
  <div
    class="flex flex-col items-center gap-1 bg-white dark:bg-gray-800 rounded-xl
           shadow px-3 py-4 text-center"
  >
    <!-- Día -->
    <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 capitalize">
      {{ day.date }}
    </p>

    <!-- Icono -->
    <img
      :src="`https://openweathermap.org/img/wn/${day.icon}@2x.png`"
      :alt="day.description"
      class="w-12 h-12"
    />

    <!-- Descripción -->
    <p class="text-xs text-gray-500 dark:text-gray-400 capitalize leading-tight">
      {{ day.description }}
    </p>

    <!-- Temperaturas -->
    <div class="flex items-center gap-2 mt-1">
      <span class="text-sm font-bold text-sky-500">{{ day.tempMax }}°</span>
      <span class="text-xs text-gray-400">/ {{ day.tempMin }}°</span>
    </div>
  </div>
</template>
