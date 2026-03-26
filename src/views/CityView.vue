<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWeatherStore } from '@/stores/weather'
import { useSettingsStore } from '@/stores/settings'
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
import { ChevronLeft } from 'lucide-vue-next'

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
  <div class="max-w-xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-safe flex flex-col gap-8">

    <!-- Top bar: back + search -->
    <div class="flex items-center gap-2">
      <button
        @click="router.push('/')"
        class="glass-btn p-2 rounded-full leading-none flex items-center justify-center shrink-0"
        aria-label="Volver al inicio"
      >
        <ChevronLeft :size="18" />
      </button>
      <SearchBar @search="handleSearch" class="flex-1 min-w-0" />
    </div>

    <!-- Loading / Error -->
    <WeatherSkeleton v-if="store.weatherLoading" />
    <ErrorMessage v-if="store.weatherError" :message="store.weatherError" />

    <!-- ═══ DESKTOP: Two-column layout ═══ -->
    <template v-if="store.weather">
      <div class="flex flex-col lg:flex-row lg:gap-10 gap-8">

        <!-- LEFT: Hero -->
        <div class="flex flex-col items-center gap-6 -mt-2 lg:mt-0 lg:w-[380px] lg:shrink-0 lg:sticky lg:top-10 lg:self-start animate-fade-in-up stagger-1">
          <WeatherPhrase :condition="store.weather.conditionMain" :temp="store.weather.temp" />
          <WeatherCard :weather="store.weather" />
        </div>

        <!-- RIGHT: Data -->
        <div class="flex flex-col gap-6 lg:flex-1 lg:min-w-0">
          <div class="flex flex-col gap-3 animate-fade-in-up stagger-2">
            <AirQualityBadge v-if="store.airQuality" :data="store.airQuality" />
            <WeatherDetails :weather="store.weather" />
          </div>

          <template v-if="store.forecast.length && !store.forecastLoading">
            <HourlyForecast :days="store.forecast" class="animate-fade-in-up stagger-3" />
            <ForecastList :days="store.forecast" class="animate-fade-in-up stagger-4" />
            <TemperatureChart :days="store.forecast" class="animate-fade-in-up stagger-5" />
          </template>
          <ForecastSkeleton v-if="store.forecastLoading" />
        </div>
      </div>
    </template>

  </div>
</template>
