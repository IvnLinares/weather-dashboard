<script setup lang="ts">
import type { AirQualityData } from '@/types/weather'
import { Leaf } from 'lucide-vue-next'

defineProps<{ data: AirQualityData }>()
</script>

<template>
  <div class="w-full max-w-lg mx-auto glass rounded-3xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
    <div class="flex items-center gap-3">
      <Leaf :size="22" class="text-emerald-500 shrink-0" />
      <div>
        <p class="text-xs text-gray-500/70 dark:text-gray-400/50 uppercase tracking-wider font-semibold">
          Calidad del aire
        </p>
        <p :class="['text-lg font-bold', data.color]">
          {{ data.label }}
          <span class="text-xs font-normal text-gray-400/70 ml-1">(AQI {{ data.aqi }}/5)</span>
        </p>
      </div>
    </div>
    <div class="flex gap-4 sm:text-right pl-9 sm:pl-0">
      <div>
        <p class="text-xs text-gray-500/60 dark:text-gray-400/40 font-medium">PM2.5</p>
        <p class="text-sm font-semibold">{{ data.pm25.toFixed(1) }} µg/m³</p>
      </div>
      <div>
        <p class="text-xs text-gray-500/60 dark:text-gray-400/40 font-medium">PM10</p>
        <p class="text-sm font-semibold">{{ data.pm10.toFixed(1) }} µg/m³</p>
      </div>
    </div>
  </div>
</template>
