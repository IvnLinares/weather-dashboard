import { ref } from 'vue'
import type { ForecastDay, ForecastItem, OWMForecastResponse, OWMForecastItem } from '@/types/weather'
import { useWeatherCache } from '@/composables/useWeatherCache'

const BASE_URL = 'https://api.openweathermap.org/data/2.5'

function getApiKey(): string {
  const key = import.meta.env.VITE_OPENWEATHER_API_KEY
  if (!key) throw new Error('Falta VITE_OPENWEATHER_API_KEY en las variables de entorno')
  return key
}

function mapForecastItem(raw: OWMForecastItem): ForecastItem {
  return {
    dt: raw.dt,
    temp: Math.round(raw.main.temp),
    tempMin: Math.round(raw.main.temp_min),
    tempMax: Math.round(raw.main.temp_max),
    feelsLike: Math.round(raw.main.feels_like),
    humidity: raw.main.humidity,
    windSpeed: raw.wind.speed,
    description: raw.weather[0].description,
    icon: raw.weather[0].icon,
    conditionId: raw.weather[0].id,
  }
}

/**
 * Agrupa los items del forecast (cada 3h) por día local.
 * Devuelve un array de hasta 5 días con temp min/max representativa.
 */
function groupByDay(items: OWMForecastItem[]): ForecastDay[] {
  const dayMap = new Map<string, OWMForecastItem[]>()

  for (const item of items) {
    const date = new Date(item.dt * 1000).toLocaleDateString('es-SV', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
    if (!dayMap.has(date)) dayMap.set(date, [])
    dayMap.get(date)!.push(item)
  }

  const days: ForecastDay[] = []

  for (const [date, dayItems] of dayMap.entries()) {
    // El icono y descripción representativa: preferir el item de mediodía (12:00)
    const noonItem =
      dayItems.find((i) => new Date(i.dt * 1000).getHours() === 12) ?? dayItems[Math.floor(dayItems.length / 2)]

    days.push({
      date,
      tempMin: Math.round(Math.min(...dayItems.map((i) => i.main.temp_min))),
      tempMax: Math.round(Math.max(...dayItems.map((i) => i.main.temp_max))),
      description: noonItem.weather[0].description,
      icon: noonItem.weather[0].icon,
      conditionId: noonItem.weather[0].id,
      items: dayItems.map(mapForecastItem),
    })

    if (days.length === 5) break
  }

  return days
}

export function useForecast() {
  const forecast = ref<ForecastDay[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const cache = useWeatherCache()

  async function fetchForecastByCity(city: string) {
    if (!city.trim()) return

    const cached = cache.get<ForecastDay[]>('forecast', city)
    if (cached) {
      forecast.value = cached
      error.value = null
      return
    }

    loading.value = true
    error.value = null
    forecast.value = []

    try {
      const key = getApiKey()
      const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city.trim())}&appid=${key}&units=metric&lang=es`
      const res = await fetch(url)
      const data: OWMForecastResponse = await res.json()

      if (!res.ok) {
        error.value = data.message ?? 'Error al obtener el pronóstico.'
        return
      }

      forecast.value = groupByDay(data.list)
      cache.set('forecast', city, forecast.value)
    } catch {
      error.value = 'Sin conexión a internet.'
    } finally {
      loading.value = false
    }
  }

  async function fetchForecastByCoords(lat: number, lon: number) {
    const coordKey = `${lat.toFixed(2)},${lon.toFixed(2)}`
    const cached = cache.get<ForecastDay[]>('forecast', coordKey)
    if (cached) {
      forecast.value = cached
      error.value = null
      return
    }

    loading.value = true
    error.value = null
    forecast.value = []

    try {
      const key = getApiKey()
      const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=es`
      const res = await fetch(url)
      const data: OWMForecastResponse = await res.json()

      if (!res.ok) {
        error.value = data.message ?? 'Error al obtener el pronóstico.'
        return
      }

      forecast.value = groupByDay(data.list)
      cache.set('forecast', coordKey, forecast.value)
    } catch {
      error.value = 'Sin conexión a internet.'
    } finally {
      loading.value = false
    }
  }

  return { forecast, loading, error, fetchForecastByCity, fetchForecastByCoords }
}
