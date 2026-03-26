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
import { Sun, Moon, Star, Loader, MapPin, Search } from 'lucide-vue-next'

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
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-10 flex flex-col items-center gap-6">

    <!-- Header -->
    <div class="w-full flex items-center justify-between">
      <div>
        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight">
          Weather
        </h1>
        <p class="text-gray-500/80 dark:text-gray-400/60 mt-0.5 text-sm font-medium">
          Consulta el clima en tiempo real
        </p>
      </div>
      <div class="flex items-center gap-2">
        <!-- °C / °F toggle -->
        <button
          @click="settings.toggleUnit()"
          class="glass-btn px-3 py-1.5 rounded-full
                 text-sm font-semibold"
          :aria-label="`Cambiar a ${settings.unit === 'metric' ? 'Fahrenheit' : 'Celsius'}`"
        >
          {{ settings.unitSymbol() }}
        </button>
        <!-- Dark mode toggle -->
        <button
          @click="settings.toggleDark()"
          class="glass-btn p-2.5 rounded-full leading-none flex items-center justify-center"
          :aria-label="settings.isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
        >
          <Sun v-if="settings.isDark" :size="18" class="text-amber-400" />
          <Moon v-else :size="18" class="text-indigo-400" />
        </button>
      </div>
    </div>

    <!-- Búsqueda -->
    <SearchBar @search="handleSearch" />

    <!-- Favoritos -->
    <div v-if="settings.favorites.length" class="w-full max-w-lg">
      <p class="text-xs text-gray-400/80 dark:text-gray-500/60 mb-2 font-semibold uppercase tracking-wider">
        Favoritos
      </p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="city in settings.favorites"
          :key="city"
          @click="handleSearch(city)"
          class="glass-btn px-3.5 py-1.5 text-sm rounded-full font-medium flex items-center gap-1.5"
        >
          <Star :size="14" class="fill-amber-400 text-amber-400" /> {{ city }}
        </button>
      </div>
    </div>

    <!-- Botón geolocalización -->
    <div class="flex flex-col items-center gap-2">
      <button
        @click="handleLocate"
        :disabled="geoLoading"
        class="glass-btn-primary flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold
               disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Usar mi ubicación actual"
      >
        <span v-if="geoLoading" class="flex items-center gap-2"><Loader :size="16" class="animate-spin" /> Obteniendo ubicación…</span>
        <span v-else class="flex items-center gap-2"><MapPin :size="16" /> Usar mi ubicación</span>
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
      class="text-center text-gray-400/60 dark:text-gray-600/60 mt-4"
    >
      <Search :size="40" class="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
      <p class="text-sm font-medium">Escribe el nombre de una ciudad o usa tu ubicación</p>
    </div>

  </div>
</template>
