<script setup lang="ts">
import type { WeatherData } from '@/types/weather'
import { useSettingsStore } from '@/stores/settings'
import { Droplets, Wind, Sunrise, Sunset, Thermometer, Eye, Gauge } from 'lucide-vue-next'

const { weather } = defineProps<{ weather: WeatherData }>()
const settings = useSettingsStore()

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

function formatVisibility(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`
  return `${meters} m`
}
</script>

<template>
  <div class="w-full grid grid-cols-2 gap-3">
    <!-- Sensación -->
    <div class="glass rounded-2xl p-4 lg:p-5 flex flex-col gap-1.5">
      <div class="flex items-center gap-1.5">
        <Thermometer :size="14" class="text-red-400" />
        <p class="text-[10px] sm:text-xs text-gray-500/70 dark:text-gray-400/50 font-semibold uppercase tracking-wider">Sensación</p>
      </div>
      <p class="text-2xl sm:text-3xl lg:text-4xl font-bold">{{ settings.toDisplay(weather.feelsLike) }}°</p>
    </div>

    <!-- Humedad -->
    <div class="glass rounded-2xl p-4 lg:p-5 flex flex-col gap-1.5">
      <div class="flex items-center gap-1.5">
        <Droplets :size="14" class="text-sky-400" />
        <p class="text-[10px] sm:text-xs text-gray-500/70 dark:text-gray-400/50 font-semibold uppercase tracking-wider">Humedad</p>
      </div>
      <p class="text-2xl sm:text-3xl lg:text-4xl font-bold">{{ weather.humidity }}%</p>
    </div>

    <!-- Viento -->
    <div class="glass rounded-2xl p-4 lg:p-5 flex flex-col gap-1.5">
      <div class="flex items-center gap-1.5">
        <Wind :size="14" class="text-teal-400" />
        <p class="text-[10px] sm:text-xs text-gray-500/70 dark:text-gray-400/50 font-semibold uppercase tracking-wider">Viento</p>
      </div>
      <p class="text-2xl sm:text-3xl lg:text-4xl font-bold">{{ weather.windSpeed }}<span class="text-sm font-medium text-gray-500/70 ml-1">m/s {{ windDirection(weather.windDeg) }}</span></p>
    </div>

    <!-- Visibilidad -->
    <div class="glass rounded-2xl p-4 lg:p-5 flex flex-col gap-1.5">
      <div class="flex items-center gap-1.5">
        <Eye :size="14" class="text-indigo-400" />
        <p class="text-[10px] sm:text-xs text-gray-500/70 dark:text-gray-400/50 font-semibold uppercase tracking-wider">Visibilidad</p>
      </div>
      <p class="text-2xl sm:text-3xl lg:text-4xl font-bold">{{ formatVisibility(weather.visibility) }}</p>
    </div>

    <!-- Amanecer -->
    <div class="glass rounded-2xl p-4 lg:p-5 flex flex-col gap-1.5">
      <div class="flex items-center gap-1.5">
        <Sunrise :size="14" class="text-orange-400" />
        <p class="text-[10px] sm:text-xs text-gray-500/70 dark:text-gray-400/50 font-semibold uppercase tracking-wider">Amanecer</p>
      </div>
      <p class="text-2xl sm:text-3xl lg:text-4xl font-bold">{{ formatTime(weather.sunrise) }}</p>
    </div>

    <!-- Atardecer -->
    <div class="glass rounded-2xl p-4 lg:p-5 flex flex-col gap-1.5">
      <div class="flex items-center gap-1.5">
        <Sunset :size="14" class="text-rose-400" />
        <p class="text-[10px] sm:text-xs text-gray-500/70 dark:text-gray-400/50 font-semibold uppercase tracking-wider">Atardecer</p>
      </div>
      <p class="text-2xl sm:text-3xl lg:text-4xl font-bold">{{ formatTime(weather.sunset) }}</p>
    </div>

    <!-- Presión -->
    <div class="glass rounded-2xl p-4 lg:p-5 flex flex-col gap-1.5 col-span-2">
      <div class="flex items-center gap-1.5">
        <Gauge :size="14" class="text-violet-400" />
        <p class="text-[10px] sm:text-xs text-gray-500/70 dark:text-gray-400/50 font-semibold uppercase tracking-wider">Presión</p>
      </div>
      <p class="text-2xl sm:text-3xl lg:text-4xl font-bold">{{ weather.pressure }}<span class="text-sm font-medium text-gray-500/70 ml-1">hPa</span></p>
    </div>
  </div>
</template>
