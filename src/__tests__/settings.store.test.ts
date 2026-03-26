import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSettingsStore } from '../stores/settings'

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
  // jsdom doesn't provide matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
      addListener: () => {},
      removeListener: () => {},
    }),
  })
})

describe('settings store', () => {
  describe('unit toggle', () => {
    it('defaults to metric', () => {
      const s = useSettingsStore()
      expect(s.unit).toBe('metric')
      expect(s.unitSymbol()).toBe('°C')
    })

    it('toggles to imperial', () => {
      const s = useSettingsStore()
      s.toggleUnit()
      expect(s.unit).toBe('imperial')
      expect(s.unitSymbol()).toBe('°F')
    })

    it('converts celsius to fahrenheit', () => {
      const s = useSettingsStore()
      s.toggleUnit()
      expect(s.toDisplay(0)).toBe(32)
      expect(s.toDisplay(100)).toBe(212)
    })

    it('persists in localStorage', () => {
      const s = useSettingsStore()
      s.toggleUnit()
      expect(localStorage.getItem('wdash_unit')).toBe('imperial')
    })
  })

  describe('search history', () => {
    it('adds cities', () => {
      const s = useSettingsStore()
      s.addToHistory('Madrid')
      s.addToHistory('London')
      expect(s.history).toEqual(['London', 'Madrid'])
    })

    it('moves repeat to front', () => {
      const s = useSettingsStore()
      s.addToHistory('Madrid')
      s.addToHistory('London')
      s.addToHistory('madrid')
      expect(s.history[0]).toBe('madrid')
      expect(s.history).toHaveLength(2)
    })

    it('limits to 5 entries', () => {
      const s = useSettingsStore()
      for (const c of ['A', 'B', 'C', 'D', 'E', 'F']) s.addToHistory(c)
      expect(s.history).toHaveLength(5)
      expect(s.history[0]).toBe('F')
    })
  })

  describe('favorites', () => {
    it('toggles favorites', () => {
      const s = useSettingsStore()
      s.toggleFavorite('Madrid')
      expect(s.isFavorite('Madrid')).toBe(true)
      expect(s.isFavorite('madrid')).toBe(true)
    })

    it('removes on second toggle', () => {
      const s = useSettingsStore()
      s.toggleFavorite('Madrid')
      s.toggleFavorite('madrid')
      expect(s.isFavorite('Madrid')).toBe(false)
    })

    it('persists in localStorage', () => {
      const s = useSettingsStore()
      s.toggleFavorite('London')
      const saved = JSON.parse(localStorage.getItem('wdash_favorites')!)
      expect(saved).toContain('London')
    })
  })

  describe('init', () => {
    it('restores saved history and favorites', () => {
      localStorage.setItem('wdash_history', JSON.stringify(['Madrid', 'London']))
      localStorage.setItem('wdash_favorites', JSON.stringify(['Tokyo']))
      const s = useSettingsStore()
      s.init()
      expect(s.history).toEqual(['Madrid', 'London'])
      expect(s.favorites).toEqual(['Tokyo'])
    })
  })
})
