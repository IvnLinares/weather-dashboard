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
import { Sun, Moon, ChevronLeft } from 'lucide-vue-next'

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
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-10 flex flex-col items-center gap-6">

    <!-- Header -->
    <div class="w-full flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button
          @click="router.push('/')"
          class="glass-btn px-3.5 py-1.5 rounded-full text-sm font-medium flex items-center gap-1"
          aria-label="Volver al inicio"
        >
          <ChevronLeft :size="16" /> Inicio
        </button>
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">
          Weather
        </h1>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="settings.toggleUnit()"
          class="glass-btn px-3 py-1.5 rounded-full
                 text-sm font-semibold"
        >
          {{ settings.unitSymbol() }}
        </button>
        <button
          @click="settings.toggleDark()"
          class="glass-btn p-2.5 rounded-full leading-none flex items-center justify-center"
        >
          <Sun v-if="settings.isDark" :size="18" class="text-amber-400" />
          <Moon v-else :size="18" class="text-indigo-400" />
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
