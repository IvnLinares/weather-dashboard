<script setup lang="ts">
import { useWeather } from '@/composables/useWeather'
import SearchBar from '@/components/SearchBar.vue'
import WeatherCard from '@/components/WeatherCard.vue'
import WeatherSkeleton from '@/components/WeatherSkeleton.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'

const { weather, loading, error, fetchByCity } = useWeather()
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
      <SearchBar @search="fetchByCity" />

      <!-- Estados -->
      <WeatherSkeleton v-if="loading" />
      <ErrorMessage v-else-if="error" :message="error" />
      <WeatherCard v-else-if="weather" :weather="weather" />

      <!-- Pantalla vacía -->
      <div
        v-else
        class="text-center text-gray-400 dark:text-gray-600 mt-4"
      >
        <p class="text-5xl mb-3">🔍</p>
        <p class="text-sm">Escribe el nombre de una ciudad para ver el clima</p>
      </div>

    </div>
  </main>
</template>
