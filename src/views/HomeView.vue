<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWeatherStore } from '@/stores/weather'
import { useSettingsStore } from '@/stores/settings'
import { useGeolocation } from '@/composables/useGeolocation'
import SearchBar from '@/components/SearchBar.vue'
import WeatherCard from '@/components/WeatherCard.vue'
import WeatherDetails from '@/components/WeatherDetails.vue'
import WeatherSkeleton from '@/components/WeatherSkeleton.vue'
import ForecastList from '@/components/ForecastList.vue'
import ForecastSkeleton from '@/components/ForecastSkeleton.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import TemperatureChart from '@/components/TemperatureChart.vue'
import AirQualityBadge from '@/components/AirQualityBadge.vue'
import HourlyForecast from '@/components/HourlyForecast.vue'
import WeatherPhrase from '@/components/WeatherPhrase.vue'
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
  <div class="max-w-xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-safe flex flex-col gap-8">

    <!-- Top bar -->
    <div class="flex items-center justify-between">
      <SearchBar @search="handleSearch" class="flex-1 mr-3" />
      <div class="flex items-center gap-1.5 shrink-0">
        <button
          @click="settings.toggleUnit()"
          class="glass-btn px-2.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold"
          :aria-label="`Cambiar a ${settings.unit === 'metric' ? 'Fahrenheit' : 'Celsius'}`"
        >
          {{ settings.unitSymbol() }}
        </button>
        <button
          @click="settings.toggleDark()"
          class="glass-btn p-2 rounded-full leading-none flex items-center justify-center"
          :aria-label="settings.isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
        >
          <Sun v-if="settings.isDark" :size="16" class="text-amber-400" />
          <Moon v-else :size="16" class="text-indigo-400" />
        </button>
      </div>
    </div>

    <!-- Favorites + Geo -->
    <div v-if="settings.favorites.length || !store.weather" class="flex flex-col gap-4 -mt-4">
      <div v-if="settings.favorites.length" class="flex flex-wrap gap-2">
        <button
          v-for="city in settings.favorites"
          :key="city"
          @click="handleSearch(city)"
          class="glass-btn px-3 py-1.5 text-xs sm:text-sm rounded-full font-medium flex items-center gap-1.5"
        >
          <Star :size="12" class="fill-amber-400 text-amber-400" /> {{ city }}
        </button>
      </div>
      <div v-if="!store.weather && !store.weatherLoading" class="flex flex-col items-center gap-3">
        <button
          @click="handleLocate"
          :disabled="geoLoading"
          class="glass-btn-primary flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold
                 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="geoLoading" class="flex items-center gap-2"><Loader :size="16" class="animate-spin" /> Obteniendo ubicación…</span>
          <span v-else class="flex items-center gap-2"><MapPin :size="16" /> Usar mi ubicación</span>
        </button>
        <ErrorMessage v-if="geoError" :message="geoError" />
      </div>
    </div>

    <!-- Loading / Error -->
    <WeatherSkeleton v-if="store.weatherLoading" />
    <ErrorMessage v-if="store.weatherError" :message="store.weatherError" />

    <!-- ═══ DESKTOP: Two-column layout ═══ -->
    <template v-if="store.weather">
      <!-- Mobile: stacked / Desktop: side by side -->
      <div class="flex flex-col lg:flex-row lg:gap-10 gap-8">

        <!-- LEFT: Hero (phrase + weather) — sticky on desktop -->
        <div class="flex flex-col items-center gap-6 -mt-2 lg:mt-0 lg:w-[380px] lg:shrink-0 lg:sticky lg:top-10 lg:self-start animate-fade-in-up stagger-1">
          <WeatherPhrase :condition="store.weather.conditionMain" :temp="store.weather.temp" />
          <WeatherCard :weather="store.weather" />
        </div>

        <!-- RIGHT: All data sections -->
        <div class="flex flex-col gap-6 lg:flex-1 lg:min-w-0">
          <!-- Conditions -->
          <div class="flex flex-col gap-3 animate-fade-in-up stagger-2">
            <AirQualityBadge v-if="store.airQuality" :data="store.airQuality" />
            <WeatherDetails :weather="store.weather" />
          </div>

          <!-- Forecast -->
          <template v-if="store.forecast.length && !store.forecastLoading">
            <HourlyForecast :days="store.forecast" class="animate-fade-in-up stagger-3" />
            <ForecastList :days="store.forecast" class="animate-fade-in-up stagger-4" />
            <TemperatureChart :days="store.forecast" class="animate-fade-in-up stagger-5" />
          </template>
          <ForecastSkeleton v-if="store.forecastLoading" />
        </div>
      </div>
    </template>

    <!-- Forecast without weather (edge case: forecast loads separately) -->
    <template v-if="!store.weather && store.forecast.length && !store.forecastLoading">
      <div class="flex flex-col gap-3">
        <HourlyForecast :days="store.forecast" />
        <ForecastList :days="store.forecast" />
      </div>
      <TemperatureChart :days="store.forecast" />
    </template>
    <ForecastSkeleton v-if="!store.weather && store.forecastLoading" />

    <!-- Empty state -->
    <div
      v-if="!store.weatherLoading && !store.weather && !store.weatherError && !geoLoading"
      class="text-center text-gray-400/60 dark:text-gray-600/60 mt-8"
    >
      <Search :size="48" class="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
      <p class="text-base font-medium">Buscá una ciudad o usá tu ubicación</p>
    </div>

  </div>
</template>
