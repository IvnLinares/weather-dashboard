<script setup lang="ts">
import type { WeatherData } from '@/types/weather'
import { Droplets, Wind, Sunrise, Sunset } from 'lucide-vue-next'

const { weather } = defineProps<{ weather: WeatherData }>()

function formatTime(unix: number): string {
  return new Date(unix * 1000).toLocaleTimeString('es-SV', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function windDirection(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO']
  return dirs[Math.round(deg / 45) % 8]
}
</script>

<template>
  <div class="w-full grid grid-cols-2 gap-3">
    <!-- Humedad -->
    <div class="glass rounded-2xl p-4 flex flex-col gap-1.5">
      <div class="flex items-center gap-1.5">
        <Droplets :size="14" class="text-sky-400" />
        <p class="text-[10px] sm:text-xs text-gray-500/70 dark:text-gray-400/50 font-semibold uppercase tracking-wider">Humedad</p>
      </div>
      <p class="text-2xl sm:text-3xl font-bold">{{ weather.humidity }}%</p>
    </div>

    <!-- Viento -->
    <div class="glass rounded-2xl p-4 flex flex-col gap-1.5">
      <div class="flex items-center gap-1.5">
        <Wind :size="14" class="text-teal-400" />
        <p class="text-[10px] sm:text-xs text-gray-500/70 dark:text-gray-400/50 font-semibold uppercase tracking-wider">Viento</p>
      </div>
      <p class="text-2xl sm:text-3xl font-bold">{{ weather.windSpeed }}<span class="text-sm font-medium text-gray-500/70 ml-1">m/s</span></p>
      <p class="text-xs text-gray-500/60 dark:text-gray-400/40">{{ windDirection(weather.windDeg) }}</p>
    </div>

    <!-- Amanecer -->
    <div class="glass rounded-2xl p-4 flex flex-col gap-1.5">
      <div class="flex items-center gap-1.5">
        <Sunrise :size="14" class="text-orange-400" />
        <p class="text-[10px] sm:text-xs text-gray-500/70 dark:text-gray-400/50 font-semibold uppercase tracking-wider">Amanecer</p>
      </div>
      <p class="text-2xl sm:text-3xl font-bold">{{ formatTime(weather.sunrise) }}</p>
    </div>

    <!-- Atardecer -->
    <div class="glass rounded-2xl p-4 flex flex-col gap-1.5">
      <div class="flex items-center gap-1.5">
        <Sunset :size="14" class="text-rose-400" />
        <p class="text-[10px] sm:text-xs text-gray-500/70 dark:text-gray-400/50 font-semibold uppercase tracking-wider">Atardecer</p>
      </div>
      <p class="text-2xl sm:text-3xl font-bold">{{ formatTime(weather.sunset) }}</p>
    </div>
  </div>
</template>
