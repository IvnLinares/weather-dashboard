<script setup lang="ts">
import { computed, type Component } from 'vue'
import type { WeatherCondition } from '@/types/weather'
import { Sun, CloudSun, Thermometer, Cloud, CloudRain, CloudDrizzle, CloudLightning, Snowflake, CloudFog } from 'lucide-vue-next'

const props = defineProps<{
  condition: WeatherCondition
  temp: number
}>()

interface Phrase {
  text: string
  highlight: string
}

const phrases: Record<string, Phrase[]> = {
  Clear_hot: [
    { text: 'Está bien', highlight: 'hecho mierda el sol.' },
    { text: 'Hoy sí', highlight: 'pega el solazo.' },
    { text: 'Se siente', highlight: 'bien horny.' },
    { text: 'Qué', highlight: 'calorón tan púchica.' },
  ],
  Clear_nice: [
    { text: 'Está', highlight: 'bien cheineado el cielo.' },
    { text: 'El día está', highlight: 'bien coqueto.' },
    { text: 'Qué', highlight: 'bonito el día, vea.' },
  ],
  Clear_cold: [
    { text: 'Está haciendo', highlight: 'un frío bien cabal.' },
    { text: 'Hoy sí', highlight: 'pega el fresquito.' },
  ],
  Clouds: [
    { text: 'Está', highlight: 'bien nublado.' },
    { text: 'El cielo está', highlight: 'todo tapado.' },
    { text: 'Anda', highlight: 'cerrado el cielo, vea.' },
  ],
  Rain: [
    { text: 'Está', highlight: 'cayendo elver.' },
    { text: 'Se vino', highlight: 'el agua, cipote.' },
    { text: 'Agarrá', highlight: 'paraguas que llueve.' },
    { text: 'Está', highlight: 'lloviendo bien recio.' },
  ],
  Drizzle: [
    { text: 'Está', highlight: 'cirniendo apenitas.' },
    { text: 'Anda pariendo', highlight: 'un chivo.' },
    { text: 'Está como', highlight: 'medio lloviendo.' },
  ],
  Thunderstorm: [
    { text: 'Se armó', highlight: 'el tormentón, cipote.' },
    { text: 'Están cayendo', highlight: 'los rempalagos.' },
    { text: 'Puta,', highlight: 'qué pijazo de agua.' },
  ],
  Snow: [
    { text: 'Se puso', highlight: 'bien helado.' },
    { text: 'Está', highlight: 'cayendo nieve, bicho.' },
  ],
  Fog: [
    { text: 'No se ve', highlight: 'ni mierda.' },
    { text: 'Están', highlight: 'fumando en el cielo.' },
    { text: 'Anda todo', highlight: 'tapado el diya.' },
  ],
}

function getConditionKey(condition: WeatherCondition, temp: number): string {
  if (condition === 'Clear') {
    if (temp >= 30) return 'Clear_hot'
    if (temp >= 20) return 'Clear_nice'
    return 'Clear_cold'
  }
  if (condition === 'Mist' || condition === 'Fog' || condition === 'Haze') return 'Fog'
  return condition
}

function seededRandom(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

const conditionIcons: Record<string, Component> = {
  Clear_hot: Sun,
  Clear_nice: CloudSun,
  Clear_cold: Thermometer,
  Clouds: Cloud,
  Rain: CloudRain,
  Drizzle: CloudDrizzle,
  Thunderstorm: CloudLightning,
  Snow: Snowflake,
  Fog: CloudFog,
}

const phrase = computed(() => {
  const key = getConditionKey(props.condition, props.temp)
  const list = phrases[key] || phrases['Clouds']
  const today = new Date().toISOString().slice(0, 10)
  const idx = seededRandom(today + key) % list.length
  return list[idx]
})

const icon = computed(() => {
  const key = getConditionKey(props.condition, props.temp)
  return conditionIcons[key] || Cloud
})
</script>

<template>
  <div class="w-full select-none lg:text-left flex items-start gap-3">
    <component :is="icon" :size="28" class="text-gray-300 dark:text-white/30 shrink-0 mt-1" />
    <p class="text-3xl sm:text-4xl lg:text-4xl font-bold leading-snug tracking-tight">
      <span class="text-gray-400 dark:text-white/40">{{ phrase.text }} </span>
      <span class="text-gray-900 dark:text-white">{{ phrase.highlight }}</span>
    </p>
  </div>
</template>
