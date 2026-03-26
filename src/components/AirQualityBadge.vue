<script setup lang="ts">
import type { AirQualityData } from '@/types/weather'

defineProps<{ data: AirQualityData }>()
</script>

<template>
  <div class="w-full max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow p-4 flex items-center justify-between gap-4">
    <div class="flex items-center gap-3">
      <span class="text-2xl">🌿</span>
      <div>
        <p class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium">
          Calidad del aire
        </p>
        <p :class="['text-lg font-bold', data.color]">
          {{ data.label }}
          <span class="text-xs font-normal text-gray-400 ml-1">(AQI {{ data.aqi }}/5)</span>
        </p>
      </div>
    </div>
    <div class="flex gap-4 text-right">
      <div>
        <p class="text-xs text-gray-400">PM2.5</p>
        <p class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ data.pm25.toFixed(1) }} µg/m³</p>
      </div>
      <div>
        <p class="text-xs text-gray-400">PM10</p>
        <p class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ data.pm10.toFixed(1) }} µg/m³</p>
      </div>
    </div>
  </div>
</template>
