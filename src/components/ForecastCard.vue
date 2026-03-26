<script setup lang="ts">
import type { ForecastDay } from '@/types/weather'
import { useSettingsStore } from '@/stores/settings'

defineProps<{ day: ForecastDay }>()
const settings = useSettingsStore()
</script>

<template>
  <div
    class="flex flex-col items-center gap-1.5 glass rounded-2xl
           px-3 py-4 text-center hover:bg-white/40 dark:hover:bg-white/[0.1]
           transition-all duration-300"
  >
    <!-- Día -->
    <p class="text-xs font-semibold text-gray-600/80 dark:text-gray-300/60 capitalize">
      {{ day.date }}
    </p>

    <!-- Icono -->
    <img
      :src="`https://openweathermap.org/img/wn/${day.icon}@2x.png`"
      :alt="day.description"
      class="w-12 h-12 drop-shadow-md"
    />

    <!-- Descripción -->
    <p class="text-xs text-gray-500/70 dark:text-gray-400/50 capitalize leading-tight">
      {{ day.description }}
    </p>

    <!-- Temperaturas -->
    <div class="flex items-center gap-2 mt-1">
      <span class="text-sm font-bold bg-gradient-to-r from-sky-500 to-blue-500 bg-clip-text text-transparent">{{ settings.toDisplay(day.tempMax) }}°</span>
      <span class="text-xs text-gray-400/70">/ {{ settings.toDisplay(day.tempMin) }}°</span>
    </div>
  </div>
</template>
