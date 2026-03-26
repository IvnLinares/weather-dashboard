# 🌤️ Weather Dashboard

Dashboard del clima construido con **Vue 3**, **Vite**, **TypeScript** y **Tailwind CSS**. Consume la API pública de [OpenWeatherMap](https://openweathermap.org/api) para mostrar el clima actual, pronóstico de 5 días y gráficos de temperatura.

🔗 **Live:** [https://ivnlinares.github.io/weather-dashboard/](https://ivnlinares.github.io/weather-dashboard/)

---

## ✨ Características

- 🔍 **Búsqueda por ciudad** con manejo de errores (404, 401, sin conexión)
- 📍 **Geolocalización automática** al cargar la app + botón manual
- 🌡️ **Clima actual** — temperatura, sensación térmica, humedad, viento, amanecer/atardecer
- 📅 **Pronóstico de 5 días** — icono, descripción, temp máx/mín por día
- 📈 **Gráfico de temperatura** — próximas 24h con Chart.js
- 🎨 **Animaciones CSS** según condición: sol, lluvia, nieve, nubes, tormenta, neblina
- 💾 **Caché localStorage** — TTL 10 min para reducir llamadas a la API
- 🌙 **Dark / Light mode** — persiste la preferencia del usuario
- 📱 **Diseño responsivo** — mobile first

---

## 🛠️ Stack

| Tecnología | Versión |
|---|---|
| Vue 3 | 3.5 |
| Vite | 6.4 |
| TypeScript | 5.7 |
| Tailwind CSS | 3.4 |
| Chart.js + vue-chartjs | 4.x |
| ESLint + Prettier | 9.x / 3.x |

---

## 🚀 Desarrollo local

### 1. Clonar el repositorio

```bash
git clone https://github.com/IvnLinares/weather-dashboard.git
cd weather-dashboard
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variable de entorno

Copia `.env.example` a `.env` y agrega tu API key de OpenWeatherMap:

```bash
cp .env.example .env
```

```env
VITE_OPENWEATHER_API_KEY=tu_api_key_aqui
```

Obtén una API key gratuita en [https://openweathermap.org/api](https://openweathermap.org/api).

### 4. Iniciar servidor de desarrollo

```bash
npm run dev
```

La app estará disponible en `http://localhost:5173/weather-dashboard/`.

---

## 📦 Build de producción

```bash
npm run build
```

Los archivos se generan en `dist/`.

---

## 🌐 Deploy en GitHub Pages

El deploy es automático vía **GitHub Actions** al hacer push a `main`.

### Configuración inicial (una sola vez)

1. En GitHub → **Settings → Secrets and variables → Actions**, agrega:
   - `VITE_OPENWEATHER_API_KEY` con tu API key

2. En GitHub → **Settings → Pages**, configura:
   - **Source**: `Deploy from a branch`
   - **Branch**: `gh-pages` / `/ (root)`

Cada push a `main` dispara el workflow `.github/workflows/deploy.yml` que construye y publica automáticamente.

---

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── ErrorMessage.vue       # Alerta de error accesible
│   ├── ForecastCard.vue       # Tarjeta de un día de pronóstico
│   ├── ForecastList.vue       # Grid de 5 días
│   ├── ForecastSkeleton.vue   # Skeleton loader del pronóstico
│   ├── SearchBar.vue          # Input de búsqueda
│   ├── TemperatureChart.vue   # Gráfico línea Chart.js
│   ├── WeatherAnimation.vue   # Animaciones CSS por condición
│   ├── WeatherCard.vue        # Tarjeta de clima actual
│   └── WeatherSkeleton.vue    # Skeleton loader del clima
├── composables/
│   ├── useForecast.ts         # Fetch pronóstico 5 días
│   ├── useGeolocation.ts      # Geolocalización del navegador
│   ├── useWeather.ts          # Fetch clima actual
│   └── useWeatherCache.ts     # Caché localStorage TTL 10 min
├── types/
│   └── weather.ts             # Tipos TypeScript (OWM + internos)
└── App.vue                    # Componente raíz
```

---

## 📄 Licencia

MIT
