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
  <div class="w-full glass rounded-3xl p-5">
    <h2 class="text-xs font-semibold text-gray-500/70 dark:text-gray-400/50 uppercase tracking-wider mb-4">
      ⏱️ Próximas 24h
    </h2>
    <div class="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
      <div
        v-for="item in items"
        :key="item.dt"
        class="flex flex-col items-center gap-1 min-w-[64px] glass-subtle
               rounded-2xl px-2 py-3 text-center hover:bg-white/30 dark:hover:bg-white/[0.08]
               transition-all duration-200"
      >
        <p class="text-xs text-gray-600/70 dark:text-gray-300/50 font-medium">
          {{ formatTime(item.dt) }}
        </p>
        <img
          :src="`https://openweathermap.org/img/wn/${item.icon}.png`"
          :alt="item.description"
          class="w-10 h-10 drop-shadow-md"
        />
        <p class="text-sm font-bold">
          {{ settings.toDisplay(item.temp) }}°
        </p>
        <p class="text-xs text-gray-500/60 dark:text-gray-400/40">
          💧 {{ item.humidity }}%
        </p>
      </div>
    </div>
  </div>
</template>
