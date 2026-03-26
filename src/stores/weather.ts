import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {
  WeatherData,
  ForecastDay,
  ForecastItem,
  AirQualityData,
  OWMWeatherResponse,
  OWMForecastResponse,
  OWMForecastItem,
  OWMAirQualityResponse,
  WeatherCondition,
} from '@/types/weather'
import { useWeatherCache } from '@/composables/useWeatherCache'

const BASE_URL = 'https://api.openweathermap.org/data/2.5'

const AQI_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Buena', color: 'text-green-500' },
  2: { label: 'Aceptable', color: 'text-yellow-500' },
  3: { label: 'Moderada', color: 'text-orange-500' },
  4: { label: 'Mala', color: 'text-red-500' },
  5: { label: 'Muy mala', color: 'text-purple-500' },
}

function getApiKey(): string {
  const key = import.meta.env.VITE_OPENWEATHER_API_KEY
  if (!key) throw new Error('Falta VITE_OPENWEATHER_API_KEY en las variables de entorno')
  return key
}

function mapWeatherResponse(raw: OWMWeatherResponse): WeatherData {
  return {
    city: raw.name,
    country: raw.sys.country,
    lat: raw.coord.lat,
    lon: raw.coord.lon,
    temp: Math.round(raw.main.temp),
    feelsLike: Math.round(raw.main.feels_like),
    tempMin: Math.round(raw.main.temp_min),
    tempMax: Math.round(raw.main.temp_max),
    humidity: raw.main.humidity,
    windSpeed: raw.wind.speed,
    windDeg: raw.wind.deg,
    description: raw.weather[0].description,
    icon: raw.weather[0].icon,
    conditionMain: raw.weather[0].main as WeatherCondition,
    conditionId: raw.weather[0].id,
    sunrise: raw.sys.sunrise,
    sunset: raw.sys.sunset,
    pressure: raw.main.pressure,
    visibility: raw.visibility,
    dt: raw.dt,
  }
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
    const noonItem =
      dayItems.find((i) => new Date(i.dt * 1000).getHours() === 12) ??
      dayItems[Math.floor(dayItems.length / 2)]
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

export const useWeatherStore = defineStore('weather', () => {
  const weather = ref<WeatherData | null>(null)
  const forecast = ref<ForecastDay[]>([])
  const airQuality = ref<AirQualityData | null>(null)

  const weatherLoading = ref(false)
  const forecastLoading = ref(false)
  const aqiLoading = ref(false)

  const weatherError = ref<string | null>(null)
  const forecastError = ref<string | null>(null)

  const cache = useWeatherCache()

  // --- helpers ---
  function handleApiKeyError(err: unknown, target: 'weather' | 'forecast') {
    const msg = err instanceof Error ? err.message : 'API key no configurada.'
    if (target === 'weather') weatherError.value = msg
    else forecastError.value = msg
  }

  // --- current weather ---
  async function fetchByCity(city: string) {
    if (!city.trim()) return
    const cached = cache.get<WeatherData>('weather', city)
    if (cached) { weather.value = cached; weatherError.value = null; return }

    weatherLoading.value = true
    weatherError.value = null
    weather.value = null

    let key: string
    try { key = getApiKey() } catch (e) { handleApiKeyError(e, 'weather'); weatherLoading.value = false; return }

    try {
      const url = `${BASE_URL}/weather?q=${encodeURIComponent(city.trim())}&appid=${key}&units=metric&lang=es`
      const res = await fetch(url)
      const data: OWMWeatherResponse = await res.json()
      if (!res.ok) {
        weatherError.value = res.status === 404
          ? `No se encontró "${city}". Verifica el nombre e inténtalo de nuevo.`
          : res.status === 401
            ? 'API key inválida. Revisa en tu archivo .env.'
            : (data.message ?? 'Error al consultar el clima.')
        return
      }
      weather.value = mapWeatherResponse(data)
      cache.set('weather', city, weather.value)
    } catch {
      weatherError.value = 'Sin conexión a internet. Verifica tu red e inténtalo de nuevo.'
    } finally {
      weatherLoading.value = false
    }
  }

  async function fetchByCoords(lat: number, lon: number) {
    const coordKey = `${lat.toFixed(2)},${lon.toFixed(2)}`
    const cached = cache.get<WeatherData>('weather', coordKey)
    if (cached) { weather.value = cached; weatherError.value = null; return }

    weatherLoading.value = true
    weatherError.value = null
    weather.value = null

    let key: string
    try { key = getApiKey() } catch (e) { handleApiKeyError(e, 'weather'); weatherLoading.value = false; return }

    try {
      const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=es`
      const res = await fetch(url)
      const data: OWMWeatherResponse = await res.json()
      if (!res.ok) { weatherError.value = data.message ?? 'Error al consultar el clima.'; return }
      weather.value = mapWeatherResponse(data)
      cache.set('weather', coordKey, weather.value)
    } catch {
      weatherError.value = 'Sin conexión a internet. Verifica tu red e inténtalo de nuevo.'
    } finally {
      weatherLoading.value = false
    }
  }

  // --- forecast ---
  async function fetchForecastByCity(city: string) {
    if (!city.trim()) return
    const cached = cache.get<ForecastDay[]>('forecast', city)
    if (cached) { forecast.value = cached; forecastError.value = null; return }

    forecastLoading.value = true
    forecastError.value = null
    forecast.value = []

    let key: string
    try { key = getApiKey() } catch (e) { handleApiKeyError(e, 'forecast'); forecastLoading.value = false; return }

    try {
      const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city.trim())}&appid=${key}&units=metric&lang=es`
      const res = await fetch(url)
      const data: OWMForecastResponse = await res.json()
      if (!res.ok) { forecastError.value = data.message ?? 'Error al obtener el pronóstico.'; return }
      forecast.value = groupByDay(data.list)
      cache.set('forecast', city, forecast.value)
    } catch {
      forecastError.value = 'Sin conexión a internet.'
    } finally {
      forecastLoading.value = false
    }
  }

  async function fetchForecastByCoords(lat: number, lon: number) {
    const coordKey = `${lat.toFixed(2)},${lon.toFixed(2)}`
    const cached = cache.get<ForecastDay[]>('forecast', coordKey)
    if (cached) { forecast.value = cached; forecastError.value = null; return }

    forecastLoading.value = true
    forecastError.value = null
    forecast.value = []

    let key: string
    try { key = getApiKey() } catch (e) { handleApiKeyError(e, 'forecast'); forecastLoading.value = false; return }

    try {
      const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=es`
      const res = await fetch(url)
      const data: OWMForecastResponse = await res.json()
      if (!res.ok) { forecastError.value = data.message ?? 'Error al obtener el pronóstico.'; return }
      forecast.value = groupByDay(data.list)
      cache.set('forecast', coordKey, forecast.value)
    } catch {
      forecastError.value = 'Sin conexión a internet.'
    } finally {
      forecastLoading.value = false
    }
  }

  // --- air quality ---
  async function fetchAirQuality(lat: number, lon: number) {
    aqiLoading.value = true
    airQuality.value = null

    let key: string
    try { key = getApiKey() } catch { aqiLoading.value = false; return }

    try {
      const url = `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${key}`
      const res = await fetch(url)
      if (!res.ok) return
      const data: OWMAirQualityResponse = await res.json()
      const entry = data.list[0]
      if (!entry) return
      const { label, color } = AQI_LABELS[entry.main.aqi]
      airQuality.value = {
        aqi: entry.main.aqi,
        label,
        color,
        pm25: entry.components.pm2_5,
        pm10: entry.components.pm10,
      }
    } catch {
      // AQI is supplementary — fail silently
    } finally {
      aqiLoading.value = false
    }
  }

  // --- combined helpers ---
  async function fetchAllByCity(city: string) {
    await Promise.all([fetchByCity(city), fetchForecastByCity(city)])
    if (weather.value) {
      fetchAirQuality(weather.value.lat, weather.value.lon)
    }
  }

  async function fetchAllByCoords(lat: number, lon: number) {
    await Promise.all([fetchByCoords(lat, lon), fetchForecastByCoords(lat, lon), fetchAirQuality(lat, lon)])
  }

  function clear() {
    weather.value = null
    forecast.value = []
    airQuality.value = null
    weatherError.value = null
    forecastError.value = null
  }

  return {
    weather, forecast, airQuality,
    weatherLoading, forecastLoading, aqiLoading,
    weatherError, forecastError,
    fetchByCity, fetchByCoords,
    fetchForecastByCity, fetchForecastByCoords,
    fetchAirQuality,
    fetchAllByCity, fetchAllByCoords,
    clear,
  }
})
