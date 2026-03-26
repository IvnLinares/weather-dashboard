import { ref } from 'vue'
import type { WeatherData, OWMWeatherResponse, WeatherCondition } from '@/types/weather'
import { useWeatherCache } from '@/composables/useWeatherCache'

const BASE_URL = 'https://api.openweathermap.org/data/2.5'

function getApiKey(): string {
  const key = import.meta.env.VITE_OPENWEATHER_API_KEY
  if (!key) throw new Error('Falta VITE_OPENWEATHER_API_KEY en las variables de entorno')
  return key
}

function mapWeatherResponse(raw: OWMWeatherResponse): WeatherData {
  return {
    city: raw.name,
    country: raw.sys.country,
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
    dt: raw.dt,
  }
}

export function useWeather() {
  const weather = ref<WeatherData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const cache = useWeatherCache()

  async function fetchByCity(city: string) {
    if (!city.trim()) return

    const cached = cache.get<WeatherData>('weather', city)
    if (cached) {
      weather.value = cached
      error.value = null
      return
    }

    loading.value = true
    error.value = null
    weather.value = null

    let key: string
    try {
      key = getApiKey()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'API key no configurada.'
      loading.value = false
      return
    }

    try {
      const url = `${BASE_URL}/weather?q=${encodeURIComponent(city.trim())}&appid=${key}&units=metric&lang=es`
      const res = await fetch(url)
      const data: OWMWeatherResponse = await res.json()

      if (!res.ok) {
        if (res.status === 404) {
          error.value = `No se encontró la ciudad "${city}". Verifica el nombre e inténtalo de nuevo.`
        } else if (res.status === 401) {
          error.value = 'API key inválida. Revisa tu archivo .env.'
        } else {
          error.value = data.message ?? 'Error al consultar el clima.'
        }
        return
      }

      weather.value = mapWeatherResponse(data)
      cache.set('weather', city, weather.value)
    } catch {
      error.value = 'Sin conexión a internet. Verifica tu red e inténtalo de nuevo.'
    } finally {
      loading.value = false
    }
  }

  async function fetchByCoords(lat: number, lon: number) {
    const coordKey = `${lat.toFixed(2)},${lon.toFixed(2)}`
    const cached = cache.get<WeatherData>('weather', coordKey)
    if (cached) {
      weather.value = cached
      error.value = null
      return
    }

    loading.value = true
    error.value = null
    weather.value = null

    let key: string
    try {
      key = getApiKey()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'API key no configurada.'
      loading.value = false
      return
    }

    try {
      const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=es`
      const res = await fetch(url)
      const data: OWMWeatherResponse = await res.json()

      if (!res.ok) {
        error.value = data.message ?? 'Error al consultar el clima.'
        return
      }

      weather.value = mapWeatherResponse(data)
      cache.set('weather', coordKey, weather.value)
    } catch {
      error.value = 'Sin conexión a internet. Verifica tu red e inténtalo de nuevo.'
    } finally {
      loading.value = false
    }
  }

  return { weather, loading, error, fetchByCity, fetchByCoords }
}
