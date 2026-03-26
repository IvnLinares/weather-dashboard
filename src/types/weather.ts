// Tipos TypeScript para la API de OpenWeatherMap

// --- Respuesta cruda de /weather ---
export interface OWMWeatherResponse {
  name: string
  coord: { lat: number; lon: number }
  sys: { country: string; sunrise: number; sunset: number }
  main: { temp: number; feels_like: number; temp_min: number; temp_max: number; humidity: number; pressure: number }
  wind: { speed: number; deg: number }
  weather: { id: number; main: string; description: string; icon: string }[]
  visibility: number
  dt: number
  cod: number | string
  message?: string
}

// --- Respuesta cruda de /air_pollution ---
export interface OWMAirQualityResponse {
  list: Array<{
    main: { aqi: 1 | 2 | 3 | 4 | 5 }
    components: { pm2_5: number; pm10: number; no2: number; o3: number }
    dt: number
  }>
}

export interface AirQualityData {
  aqi: 1 | 2 | 3 | 4 | 5
  label: string
  color: string
  pm25: number
  pm10: number
}

// --- Respuesta cruda de /forecast ---
export interface OWMForecastItem {
  dt: number
  main: { temp: number; feels_like: number; temp_min: number; temp_max: number; humidity: number }
  wind: { speed: number; deg: number }
  weather: { id: number; main: string; description: string; icon: string }[]
}

export interface OWMForecastResponse {
  list: OWMForecastItem[]
  city: { name: string; country: string }
  cod: string
  message?: string
}

// --- Modelos internos ---
export interface WeatherData {
  city: string
  country: string
  lat: number
  lon: number
  temp: number
  feelsLike: number
  tempMin: number
  tempMax: number
  humidity: number
  windSpeed: number
  windDeg: number
  description: string
  icon: string
  conditionMain: WeatherCondition
  conditionId: number
  sunrise: number
  sunset: number
  pressure: number
  visibility: number
  dt: number
}

export interface ForecastItem {
  dt: number
  temp: number
  tempMin: number
  tempMax: number
  feelsLike: number
  humidity: number
  windSpeed: number
  description: string
  icon: string
  conditionId: number
}

export interface ForecastDay {
  date: string
  tempMin: number
  tempMax: number
  description: string
  icon: string
  conditionId: number
  items: ForecastItem[]
}

export type WeatherCondition =
  | 'Clear'
  | 'Clouds'
  | 'Rain'
  | 'Drizzle'
  | 'Thunderstorm'
  | 'Snow'
  | 'Mist'
  | 'Fog'
  | 'Haze'
