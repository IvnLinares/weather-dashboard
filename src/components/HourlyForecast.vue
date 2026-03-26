<script setup lang="ts">
import { computed } from 'vue'
import type { ForecastDay } from '@/types/weather'
import { useSettingsStore } from '@/stores/settings'

const props = defineProps<{ days: ForecastDay[] }>()
const settings = useSettingsStore()

const items = computed(() =>
  props.days
    .flatMap((d) => d.items)
    .slice(0, 8),
)

function formatTime(dt: number): string {
  return new Date(dt * 1000).toLocaleTimeString('es-SV', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}
</script>

<template>
  <div class="w-full bg-white dark:bg-gray-800 rounded-2xl shadow p-5">
    <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
      ⏱️ Próximas 24h
    </h2>
    <div class="flex gap-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
      <div
        v-for="item in items"
        :key="item.dt"
        class="flex flex-col items-center gap-1 min-w-[64px] bg-sky-50 dark:bg-gray-700/50
               rounded-xl px-2 py-3 text-center"
      >
        <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">
          {{ formatTime(item.dt) }}
        </p>
        <img
          :src="`https://openweathermap.org/img/wn/${item.icon}.png`"
          :alt="item.description"
          class="w-10 h-10"
        />
        <p class="text-sm font-bold text-gray-800 dark:text-gray-100">
          {{ settings.toDisplay(item.temp) }}°
        </p>
        <p class="text-xs text-gray-400 dark:text-gray-400">
          💧 {{ item.humidity }}%
        </p>
      </div>
    </div>
  </div>
</template>
