<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWeatherStore } from '@/stores/weather'
import { useSettingsStore } from '@/stores/settings'
import { useGeolocation } from '@/composables/useGeolocation'
import SearchBar from '@/components/SearchBar.vue'
import WeatherCard from '@/components/WeatherCard.vue'
import WeatherSkeleton from '@/components/WeatherSkeleton.vue'
import ForecastList from '@/components/ForecastList.vue'
import ForecastSkeleton from '@/components/ForecastSkeleton.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import TemperatureChart from '@/components/TemperatureChart.vue'
import AirQualityBadge from '@/components/AirQualityBadge.vue'
import HourlyForecast from '@/components/HourlyForecast.vue'

const store = useWeatherStore()
const settings = useSettingsStore()
const { loading: geoLoading, error: geoError, locate } = useGeolocation()
const router = useRouter()

function handleSearch(city: string) {
  settings.addToHistory(city)
  router.push(`/city/${encodeURIComponent(city)}`)
}

async function handleLocate() {
  const pos = await locate()
  if (pos) {
    store.fetchAllByCoords(pos.lat, pos.lon)
  }
}

onMounted(() => handleLocate())
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-10 flex flex-col items-center gap-8">

    <!-- Header -->
    <div class="w-full flex items-center justify-between">
      <div>
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          🌤️ Weather Dashboard
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Consulta el clima de cualquier ciudad en tiempo real
        </p>
      </div>
      <div class="flex items-center gap-2">
        <!-- °C / °F toggle -->
        <button
          @click="settings.toggleUnit()"
          class="px-3 py-1.5 rounded-full bg-white dark:bg-gray-700 shadow hover:shadow-md
                 text-sm font-semibold transition-all text-gray-700 dark:text-gray-200"
          :aria-label="`Cambiar a ${settings.unit === 'metric' ? 'Fahrenheit' : 'Celsius'}`"
        >
          {{ settings.unitSymbol() }}
        </button>
        <!-- Dark mode toggle -->
        <button
          @click="settings.toggleDark()"
          class="p-2 rounded-full bg-white dark:bg-gray-700 shadow hover:shadow-md transition-all
                 text-xl leading-none"
          :aria-label="settings.isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
        >
          {{ settings.isDark ? '☀️' : '🌙' }}
        </button>
      </div>
    </div>

    <!-- Búsqueda -->
    <SearchBar @search="handleSearch" />

    <!-- Favoritos -->
    <div v-if="settings.favorites.length" class="w-full max-w-lg">
      <p class="text-xs text-gray-400 dark:text-gray-500 mb-2 font-medium uppercase tracking-wide">
        ⭐ Favoritos
      </p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="city in settings.favorites"
          :key="city"
          @click="handleSearch(city)"
          class="px-3 py-1 text-sm rounded-full bg-yellow-100 dark:bg-yellow-900/30
                 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-800/50
                 transition-colors font-medium"
        >
          {{ city }}
        </button>
      </div>
    </div>

    <!-- Botón geolocalización -->
    <div class="flex flex-col items-center gap-2">
      <button
        @click="handleLocate"
        :disabled="geoLoading"
        class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
               bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed
               text-white transition-colors"
        aria-label="Usar mi ubicación actual"
      >
        <span v-if="geoLoading">⏳ Obteniendo ubicación…</span>
        <span v-else>📍 Usar mi ubicación</span>
      </button>
      <ErrorMessage v-if="geoError" :message="geoError" />
    </div>

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

    <!-- Pantalla vacía -->
    <div
      v-if="!store.weatherLoading && !store.weather && !store.weatherError && !geoLoading"
      class="text-center text-gray-400 dark:text-gray-600 mt-4"
    >
      <p class="text-5xl mb-3">🔍</p>
      <p class="text-sm">Escribe el nombre de una ciudad o usa tu ubicación</p>
    </div>

  </div>
</template>
