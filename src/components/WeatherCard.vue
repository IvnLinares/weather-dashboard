<script setup lang="ts">
import type { WeatherData } from '@/types/weather'
import WeatherAnimation from '@/components/WeatherAnimation.vue'
import { useSettingsStore } from '@/stores/settings'

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
    class="w-full max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6
           flex flex-col gap-4"
  >
    <!-- Ciudad y país -->
    <div class="flex items-start justify-between">
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ weather.city }}, {{ weather.country }}
          </h2>
          <!-- Favorito toggle -->
          <button
            @click="settings.toggleFavorite(weather.city)"
            :aria-label="settings.isFavorite(weather.city) ? 'Quitar de favoritos' : 'Agregar a favoritos'"
            class="text-xl leading-none transition-transform hover:scale-125"
          >
            {{ settings.isFavorite(weather.city) ? '⭐' : '☆' }}
          </button>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 capitalize mt-0.5">
          {{ weather.description }}
        </p>
      </div>
      <div class="flex items-center gap-2 -mt-1">
        <WeatherAnimation :condition="weather.conditionMain" :condition-id="weather.conditionId" />
        <img
          :src="`https://openweathermap.org/img/wn/${weather.icon}@2x.png`"
          :alt="weather.description"
          class="w-14 h-14"
        />
      </div>
    </div>

    <!-- Temperatura principal -->
    <div class="flex items-end gap-3">
      <span class="text-6xl font-extrabold text-sky-500">
        {{ settings.toDisplay(weather.temp) }}{{ settings.unitSymbol() }}
      </span>
      <div class="text-sm text-gray-500 dark:text-gray-400 pb-2">
        <p>Sensación: <span class="font-medium">{{ settings.toDisplay(weather.feelsLike) }}{{ settings.unitSymbol() }}</span></p>
        <p>Máx {{ settings.toDisplay(weather.tempMax) }}° / Mín {{ settings.toDisplay(weather.tempMin) }}°</p>
      </div>
    </div>

    <!-- Detalles -->
    <div class="grid grid-cols-2 gap-3 border-t border-gray-100 dark:border-gray-700 pt-4">
      <!-- Humedad -->
      <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <span class="text-xl">💧</span>
        <div>
          <p class="text-xs text-gray-400">Humedad</p>
          <p class="font-semibold">{{ weather.humidity }}%</p>
        </div>
      </div>

      <!-- Viento -->
      <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <span class="text-xl">💨</span>
        <div>
          <p class="text-xs text-gray-400">Viento</p>
          <p class="font-semibold">{{ weather.windSpeed }} m/s {{ windDirection(weather.windDeg) }}</p>
        </div>
      </div>

      <!-- Amanecer -->
      <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <span class="text-xl">🌅</span>
        <div>
          <p class="text-xs text-gray-400">Amanecer</p>
          <p class="font-semibold">{{ formatTime(weather.sunrise) }}</p>
        </div>
      </div>

      <!-- Atardecer -->
      <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <span class="text-xl">🌇</span>
        <div>
          <p class="text-xs text-gray-400">Atardecer</p>
          <p class="font-semibold">{{ formatTime(weather.sunset) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

