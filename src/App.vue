<script setup lang="ts">
import { useWeather } from '@/composables/useWeather'
import { useForecast } from '@/composables/useForecast'
import SearchBar from '@/components/SearchBar.vue'
import WeatherCard from '@/components/WeatherCard.vue'
import WeatherSkeleton from '@/components/WeatherSkeleton.vue'
import ForecastList from '@/components/ForecastList.vue'
import ForecastSkeleton from '@/components/ForecastSkeleton.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'

const { weather, loading: weatherLoading, error: weatherError, fetchByCity } = useWeather()
const { forecast, loading: forecastLoading, fetchForecastByCity } = useForecast()

function handleSearch(city: string) {
  fetchByCity(city)
  fetchForecastByCity(city)
}
</script>

<template>
  <main class="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 dark:from-gray-900 dark:to-gray-800
               text-gray-900 dark:text-gray-100">
    <div class="max-w-2xl mx-auto px-4 py-12 flex flex-col items-center gap-8">

      <!-- Header -->
      <div class="text-center">
        <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          🌤️ Weather Dashboard
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Consulta el clima de cualquier ciudad en tiempo real
        </p>
      </div>

      <!-- Búsqueda -->
      <SearchBar @search="handleSearch" />

      <!-- Clima actual -->
      <WeatherSkeleton v-if="weatherLoading" />
      <ErrorMessage v-else-if="weatherError" :message="weatherError" />
      <WeatherCard v-else-if="weather" :weather="weather" />

      <!-- Pronóstico 5 días -->
      <ForecastSkeleton v-if="forecastLoading" />
      <ForecastList v-else-if="forecast.length" :days="forecast" />

      <!-- Pantalla vacía -->
      <div
        v-if="!weatherLoading && !weather && !weatherError"
        class="text-center text-gray-400 dark:text-gray-600 mt-4"
      >
        <p class="text-5xl mb-3">🔍</p>
        <p class="text-sm">Escribe el nombre de una ciudad para ver el clima</p>
      </div>

    </div>
  </main>
</template>
