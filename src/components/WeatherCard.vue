<script setup lang="ts">
import type { WeatherData } from '@/types/weather'
import WeatherAnimation from '@/components/WeatherAnimation.vue'
import { useSettingsStore } from '@/stores/settings'
import { Star } from 'lucide-vue-next'

const { weather } = defineProps<{ weather: WeatherData }>()
const settings = useSettingsStore()
</script>

<template>
  <div class="w-full flex flex-col items-center text-center gap-1">
    <!-- Weather animation -->
    <WeatherAnimation :condition="weather.conditionMain" :condition-id="weather.conditionId" />

    <!-- City name -->
    <div class="flex items-center gap-2 mt-1">
      <h2 class="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300">
        {{ weather.city }}, {{ weather.country }}
      </h2>
      <button
        @click="settings.toggleFavorite(weather.city)"
        :aria-label="settings.isFavorite(weather.city) ? 'Quitar de favoritos' : 'Agregar a favoritos'"
        class="leading-none transition-transform hover:scale-125 active:scale-95"
      >
        <Star :size="16" :class="settings.isFavorite(weather.city) ? 'fill-amber-400 text-amber-400' : 'text-gray-400 dark:text-gray-500'" />
      </button>
    </div>

    <!-- Temperature -->
    <span class="text-7xl sm:text-8xl lg:text-9xl font-extrabold bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent leading-none mt-1">
      {{ settings.toDisplay(weather.temp) }}°
    </span>

    <!-- Description -->
    <p class="text-base sm:text-lg text-gray-600/80 dark:text-gray-300/60 capitalize mt-1">
      {{ weather.description }}
    </p>

    <!-- Min/Max + Feels like -->
    <p class="text-sm text-gray-500/70 dark:text-gray-400/50">
      Máx {{ settings.toDisplay(weather.tempMax) }}° / Mín {{ settings.toDisplay(weather.tempMin) }}°
      <span class="mx-1.5">·</span>
      Sensación {{ settings.toDisplay(weather.feelsLike) }}°
    </p>
  </div>
</template>

