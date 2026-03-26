<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWeatherStore } from '@/stores/weather'
import { useSettingsStore } from '@/stores/settings'
import SearchBar from '@/components/SearchBar.vue'
import WeatherCard from '@/components/WeatherCard.vue'
import WeatherSkeleton from '@/components/WeatherSkeleton.vue'
import ForecastList from '@/components/ForecastList.vue'
import ForecastSkeleton from '@/components/ForecastSkeleton.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import TemperatureChart from '@/components/TemperatureChart.vue'
import AirQualityBadge from '@/components/AirQualityBadge.vue'
import HourlyForecast from '@/components/HourlyForecast.vue'

const route = useRoute()
const router = useRouter()
const store = useWeatherStore()
const settings = useSettingsStore()

function handleSearch(city: string) {
  settings.addToHistory(city)
  router.push(`/city/${encodeURIComponent(city)}`)
}

onMounted(() => {
  const city = decodeURIComponent(route.params.name as string)
  store.fetchAllByCity(city)
})
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-10 flex flex-col items-center gap-8">

    <!-- Header -->
    <div class="w-full flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button
          @click="router.push('/')"
          class="text-gray-400 hover:text-sky-500 transition-colors"
          aria-label="Volver al inicio"
        >
          ← Inicio
        </button>
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          🌤️ Weather Dashboard
        </h1>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="settings.toggleUnit()"
          class="px-3 py-1.5 rounded-full bg-white dark:bg-gray-700 shadow hover:shadow-md
                 text-sm font-semibold transition-all text-gray-700 dark:text-gray-200"
        >
          {{ settings.unitSymbol() }}
        </button>
        <button
          @click="settings.toggleDark()"
          class="p-2 rounded-full bg-white dark:bg-gray-700 shadow hover:shadow-md transition-all text-xl leading-none"
        >
          {{ settings.isDark ? '☀️' : '🌙' }}
        </button>
      </div>
    </div>

    <!-- Búsqueda -->
    <SearchBar @search="handleSearch" />

    <!-- Clima actual -->
    <WeatherSkeleton v-if="store.weatherLoading" />
    <ErrorMessage v-else-if="store.weatherError" :message="store.weatherError" />
    <WeatherCard v-else-if="store.weather" :weather="store.weather" />

    <!-- AQI -->
    <AirQualityBadge v-if="store.airQuality" :data="store.airQuality" />

    <!-- Vista horaria 24h -->
    <HourlyForecast v-if="store.forecast.length && !store.forecastLoading" :days="store.forecast" />

    <!-- Pronóstico 5 días -->
    <ForecastSkeleton v-if="store.forecastLoading" />
    <ForecastList v-else-if="store.forecast.length" :days="store.forecast" />

    <!-- Gráfico temperatura 24h -->
    <TemperatureChart v-if="store.forecast.length && !store.forecastLoading" :days="store.forecast" />

  </div>
</template>
