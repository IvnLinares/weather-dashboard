<script setup lang="ts">
import { computed } from 'vue'
import type { ForecastDay } from '@/types/weather'
import { useSettingsStore } from '@/stores/settings'
import { Calendar } from 'lucide-vue-next'

const props = defineProps<{ days: ForecastDay[] }>()
const settings = useSettingsStore()

const weekMin = computed(() => Math.min(...props.days.map(d => d.tempMin)))
const weekMax = computed(() => Math.max(...props.days.map(d => d.tempMax)))

function barStyle(min: number, max: number) {
  const range = weekMax.value - weekMin.value || 1
  const left = ((min - weekMin.value) / range) * 100
  const right = ((max - weekMin.value) / range) * 100
  return { left: `${left}%`, width: `${right - left}%` }
}
</script>

<template>
  <div class="w-full glass rounded-3xl px-5 pt-5 pb-2 lg:rounded-2xl">
    <h2 class="text-xs font-semibold text-gray-500/70 dark:text-gray-400/50 uppercase tracking-wider mb-3 flex items-center gap-1.5">
      <Calendar :size="14" /> Pronóstico 5 días
    </h2>
    <div class="flex flex-col">
      <div
        v-for="(day, i) in days"
        :key="day.date"
        class="flex items-center gap-3 py-3"
        :class="{ 'border-t border-white/10 dark:border-white/[0.06]': i > 0 }"
      >
        <!-- Day name -->
        <p class="w-16 text-sm font-semibold capitalize shrink-0">
          {{ day.date }}
        </p>

        <!-- Icon -->
        <img
          :src="`https://openweathermap.org/img/wn/${day.icon}@2x.png`"
          :alt="day.description"
          class="w-8 h-8 shrink-0 drop-shadow-md"
        />

        <!-- Min temp -->
        <span class="text-sm text-gray-400 dark:text-gray-500 w-8 text-right shrink-0">
          {{ settings.toDisplay(day.tempMin) }}°
        </span>

        <!-- Temperature bar -->
        <div class="flex-1 h-1 rounded-full bg-white/20 dark:bg-white/[0.08] relative min-w-[60px]">
          <div
            class="absolute h-full rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-orange-500"
            :style="barStyle(day.tempMin, day.tempMax)"
          />
        </div>

        <!-- Max temp -->
        <span class="text-sm font-semibold w-8 text-right shrink-0">
          {{ settings.toDisplay(day.tempMax) }}°
        </span>
      </div>
    </div>
  </div>
</template>
