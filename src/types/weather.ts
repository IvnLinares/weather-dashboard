// Tipos TypeScript para la API de OpenWeatherMap

// --- Respuesta cruda de /weather ---
export interface OWMWeatherResponse {
  name: string
  sys: { country: string; sunrise: number; sunset: number }
  main: { temp: number; feels_like: number; temp_min: number; temp_max: number; humidity: number }
  wind: { speed: number; deg: number }
  weather: { id: number; main: string; description: string; icon: string }[]
  dt: number
  cod: number | string
  message?: string
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
