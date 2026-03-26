<script setup lang="ts">
import type { WeatherData } from '@/types/weather'
import WeatherAnimation from '@/components/WeatherAnimation.vue'
import { useSettingsStore } from '@/stores/settings'
import { Star, Droplets, Wind, Sunrise, Sunset } from 'lucide-vue-next'

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
</script>

<template>
  <div
    class="w-full max-w-lg mx-auto glass-strong rounded-3xl p-4 sm:p-6
           flex flex-col gap-3 sm:gap-4"
  >
    <!-- Ciudad y país -->
    <div class="flex items-start justify-between">
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-lg sm:text-2xl font-bold truncate max-w-[200px] sm:max-w-none">
            {{ weather.city }}, {{ weather.country }}
          </h2>
          <!-- Favorito toggle -->
          <button
            @click="settings.toggleFavorite(weather.city)"
            :aria-label="settings.isFavorite(weather.city) ? 'Quitar de favoritos' : 'Agregar a favoritos'"
            class="leading-none transition-transform hover:scale-125 active:scale-95"
          >
            <Star :size="18" :class="settings.isFavorite(weather.city) ? 'fill-amber-400 text-amber-400' : 'text-gray-400 dark:text-gray-500'" />
          </button>
        </div>
        <p class="text-sm text-gray-600/80 dark:text-gray-300/60 capitalize mt-0.5">
          {{ weather.description }}
        </p>
      </div>
      <div class="flex items-center gap-2 -mt-1">
        <WeatherAnimation :condition="weather.conditionMain" :condition-id="weather.conditionId" />
        <img
          :src="`https://openweathermap.org/img/wn/${weather.icon}@2x.png`"
          :alt="weather.description"
          class="w-14 h-14 drop-shadow-lg"
        />
      </div>
    </div>

    <!-- Temperatura principal -->
    <div class="flex items-end gap-2 sm:gap-3">
      <span class="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-sky-500 to-blue-500 bg-clip-text text-transparent">
        {{ settings.toDisplay(weather.temp) }}{{ settings.unitSymbol() }}
      </span>
      <div class="text-xs sm:text-sm text-gray-600/80 dark:text-gray-300/60 pb-1 sm:pb-2">
        <p>Sensación: <span class="font-semibold">{{ settings.toDisplay(weather.feelsLike) }}{{ settings.unitSymbol() }}</span></p>
        <p>Máx {{ settings.toDisplay(weather.tempMax) }}° / Mín {{ settings.toDisplay(weather.tempMin) }}°</p>
      </div>
    </div>

    <!-- Detalles -->
    <div class="grid grid-cols-2 gap-3 border-t border-white/20 dark:border-white/[0.06] pt-4">
      <!-- Humedad -->
      <div class="flex items-center gap-2.5 text-sm">
        <Droplets :size="20" class="text-sky-400 shrink-0" />
        <div>
          <p class="text-xs text-gray-500/70 dark:text-gray-400/50 font-medium">Humedad</p>
          <p class="font-semibold">{{ weather.humidity }}%</p>
        </div>
      </div>

      <!-- Viento -->
      <div class="flex items-center gap-2.5 text-sm">
        <Wind :size="20" class="text-teal-400 shrink-0" />
        <div>
          <p class="text-xs text-gray-500/70 dark:text-gray-400/50 font-medium">Viento</p>
          <p class="font-semibold">{{ weather.windSpeed }} m/s {{ windDirection(weather.windDeg) }}</p>
        </div>
      </div>

      <!-- Amanecer -->
      <div class="flex items-center gap-2.5 text-sm">
        <Sunrise :size="20" class="text-orange-400 shrink-0" />
        <div>
          <p class="text-xs text-gray-500/70 dark:text-gray-400/50 font-medium">Amanecer</p>
          <p class="font-semibold">{{ formatTime(weather.sunrise) }}</p>
        </div>
      </div>

      <!-- Atardecer -->
      <div class="flex items-center gap-2.5 text-sm">
        <Sunset :size="20" class="text-rose-400 shrink-0" />
        <div>
          <p class="text-xs text-gray-500/70 dark:text-gray-400/50 font-medium">Atardecer</p>
          <p class="font-semibold">{{ formatTime(weather.sunset) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

