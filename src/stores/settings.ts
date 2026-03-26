import { ref } from 'vue'
import { defineStore } from 'pinia'

export type TempUnit = 'metric' | 'imperial'

export const useSettingsStore = defineStore('settings', () => {
  const isDark = ref(false)
  const unit = ref<TempUnit>('metric')
  const history = ref<string[]>([])
  const favorites = ref<string[]>([])

  function toggleDark() {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('wdash_theme', isDark.value ? 'dark' : 'light')
  }

  function toggleUnit() {
    unit.value = unit.value === 'metric' ? 'imperial' : 'metric'
    localStorage.setItem('wdash_unit', unit.value)
  }

  function unitSymbol(): string {
    return unit.value === 'imperial' ? '°F' : '°C'
  }

  function toDisplay(celsius: number): number {
    return unit.value === 'imperial' ? Math.round(celsius * 9 / 5 + 32) : celsius
  }

  function addToHistory(city: string) {
    const normalized = city.trim()
    if (!normalized) return
    history.value = [
      normalized,
      ...history.value.filter((c) => c.toLowerCase() !== normalized.toLowerCase()),
    ].slice(0, 5)
    localStorage.setItem('wdash_history', JSON.stringify(history.value))
  }

  function toggleFavorite(city: string) {
    const normalized = city.trim()
    const idx = favorites.value.findIndex((c) => c.toLowerCase() === normalized.toLowerCase())
    if (idx >= 0) {
      favorites.value.splice(idx, 1)
    } else {
      favorites.value.push(normalized)
    }
    localStorage.setItem('wdash_favorites', JSON.stringify(favorites.value))
  }

  function isFavorite(city: string): boolean {
    return favorites.value.some((c) => c.toLowerCase() === city.toLowerCase())
  }

  function init() {
    const savedTheme = localStorage.getItem('wdash_theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDark.value = savedTheme ? savedTheme === 'dark' : prefersDark
    document.documentElement.classList.toggle('dark', isDark.value)

    const savedUnit = localStorage.getItem('wdash_unit') as TempUnit | null
    if (savedUnit) unit.value = savedUnit

    try {
      const savedHistory = localStorage.getItem('wdash_history')
      if (savedHistory) history.value = JSON.parse(savedHistory)

      const savedFavorites = localStorage.getItem('wdash_favorites')
      if (savedFavorites) favorites.value = JSON.parse(savedFavorites)
    } catch {
      // Corrupt storage — start fresh
    }
  }

  return { isDark, unit, history, favorites, toggleDark, toggleUnit, unitSymbol, toDisplay, addToHistory, toggleFavorite, isFavorite, init }
})
