<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import { useSettingsStore } from '@/stores/settings'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import type { ForecastDay } from '@/types/weather'
import { Thermometer } from 'lucide-vue-next'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const props = defineProps<{ days: ForecastDay[] }>()
const settings = useSettingsStore()

// Flatten all items from all days, take next 8 (≈ 24h)
const next24hItems = computed(() =>
  props.days
    .flatMap((d) => d.items)
    .slice(0, 8),
)

const labels = computed(() =>
  next24hItems.value.map((item) => {
    const d = new Date(item.dt * 1000)
    return d.toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit', hour12: false })
  }),
)

const temps = computed(() => next24hItems.value.map((item) => settings.toDisplay(item.temp)))

const chartData = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      label: `Temperatura (${settings.unitSymbol()})`,
      data: temps.value,
      borderColor: '#38bdf8',
      backgroundColor: 'rgba(56,189,248,0.15)',
      pointBackgroundColor: '#0ea5e9',
      pointRadius: 5,
      pointHoverRadius: 7,
      borderWidth: 2,
      tension: 0.4,
      fill: true,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: { parsed: { y: number | null } }) => ` ${ctx.parsed.y ?? ''}${settings.unitSymbol()}`,
      },
    },
  },
  scales: {
    x: {
      ticks: { color: '#94a3b8', font: { size: 11 } },
      grid: { color: 'rgba(148,163,184,0.1)' },
    },
    y: {
      ticks: {
        color: '#94a3b8',
        font: { size: 11 },
        callback: (value: number | string) => `${value}°`,
      },
      grid: { color: 'rgba(148,163,184,0.1)' },
    },
  },
}
</script>

<template>
  <div class="w-full glass rounded-3xl p-5">
    <h2 class="text-xs font-semibold text-gray-500/70 dark:text-gray-400/50 uppercase tracking-wider mb-4 flex items-center gap-1.5">
      <Thermometer :size="14" /> Temperatura próximas 24h
    </h2>
    <div class="h-48">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
