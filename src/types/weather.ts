// Tipos TypeScript para la API de OpenWeatherMap
// Se implementarán en la Fase 2

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
