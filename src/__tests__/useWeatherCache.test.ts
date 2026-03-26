import { describe, it, expect, beforeEach } from 'vitest'
import { useWeatherCache } from '../composables/useWeatherCache'

beforeEach(() => localStorage.clear())

describe('useWeatherCache', () => {
  it('returns null for missing key', () => {
    const { get } = useWeatherCache()
    expect(get('weather', 'Madrid')).toBeNull()
  })

  it('stores and retrieves data', () => {
    const { get, set } = useWeatherCache()
    const data = { temp: 25, city: 'Madrid' }
    set('weather', 'Madrid', data)
    expect(get('weather', 'Madrid')).toEqual(data)
  })

  it('is case-insensitive', () => {
    const { get, set } = useWeatherCache()
    set('weather', 'Madrid', { temp: 25 })
    expect(get('weather', 'madrid')).toEqual({ temp: 25 })
  })

  it('returns null for expired entries', () => {
    const { get } = useWeatherCache()
    const key = 'wdash_weather_madrid'
    const entry = { data: { temp: 25 }, timestamp: Date.now() - 11 * 60 * 1000 }
    localStorage.setItem(key, JSON.stringify(entry))
    expect(get('weather', 'Madrid')).toBeNull()
  })

  it('returns data for non-expired entries', () => {
    const { get } = useWeatherCache()
    const key = 'wdash_weather_madrid'
    const entry = { data: { temp: 25 }, timestamp: Date.now() - 5 * 60 * 1000 }
    localStorage.setItem(key, JSON.stringify(entry))
    expect(get('weather', 'Madrid')).toEqual({ temp: 25 })
  })
})
