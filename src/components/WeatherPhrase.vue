<script setup lang="ts">
import { computed } from 'vue'
import type { WeatherCondition } from '@/types/weather'

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
    { text: 'Está bien', highlight: 'arrecho\nel sol.' },
    { text: 'Hoy sí', highlight: 'pega\nel solazo.' },
    { text: 'Se siente', highlight: 'bien\nchilero.' },
    { text: 'Qué', highlight: 'calorón\ntan púchica.' },
  ],
  Clear_nice: [
    { text: 'Está', highlight: 'bien\nchinón\nafuera.' },
    { text: 'El día\nestá', highlight: 'bien\nchivo.' },
    { text: 'Qué', highlight: 'bonito\nel día,\nvá.' },
  ],
  Clear_cold: [
    { text: 'Está\nhaciendo', highlight: 'un frío\nbien cabal.' },
    { text: 'Hoy sí', highlight: 'pega\nel fresquito.' },
  ],
  Clouds: [
    { text: 'Está', highlight: 'bien\nnublado.' },
    { text: 'El cielo\nestá', highlight: 'todo\ntapado.' },
    { text: 'Anda', highlight: 'cerrado\nel cielo,\nvá.' },
  ],
  Rain: [
    { text: 'Está', highlight: 'cayendo\nel aguazo.' },
    { text: 'Se vino', highlight: 'el agua,\ncipote.' },
    { text: 'Agarrá', highlight: 'paraguas\nque llueve.' },
    { text: 'Está', highlight: 'lloviendo\nbien recio.' },
  ],
  Drizzle: [
    { text: 'Está', highlight: 'chipiando\napenitas.' },
    { text: 'Anda\ncayendo', highlight: 'una\nchipía.' },
    { text: 'Está como', highlight: 'medio\nlloviendo.' },
  ],
  Thunderstorm: [
    { text: 'Se armó', highlight: 'el\ntormentón,\ncipote.' },
    { text: 'Están\ncayendo', highlight: 'unos\nryazos.' },
    { text: 'Puta,', highlight: 'qué\ntormenta.' },
  ],
  Snow: [
    { text: 'Se puso', highlight: 'bien\nhelado.' },
    { text: 'Está', highlight: 'cayendo\nnieve, bicho.' },
  ],
  Fog: [
    { text: 'No se\nmira', highlight: 'ni mierda\nafuera.' },
    { text: 'Está', highlight: 'bien\nneblinoso.' },
    { text: 'Anda\ntodo', highlight: 'tapado\nde neblina.' },
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

const phrase = computed(() => {
  const key = getConditionKey(props.condition, props.temp)
  const list = phrases[key] || phrases['Clouds']
  const today = new Date().toISOString().slice(0, 10)
  const idx = seededRandom(today + key) % list.length
  return list[idx]
})
</script>

<template>
  <div class="w-full max-w-lg mx-auto select-none">
    <p class="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] tracking-tight">
      <span class="text-gray-800 dark:text-white whitespace-pre-line">{{ phrase.text }} </span>
      <span class="bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent whitespace-pre-line">{{ phrase.highlight }}</span>
    </p>
  </div>
</template>
