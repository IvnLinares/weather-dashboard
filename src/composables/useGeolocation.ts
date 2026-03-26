import { ref } from 'vue'

export interface GeolocationResult {
  lat: number
  lon: number
}

export function useGeolocation() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  function getCurrentPosition(): Promise<GeolocationResult> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Tu navegador no soporta geolocalización.'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            reject(new Error('Permiso de ubicación denegado. Usa la búsqueda manual.'))
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            reject(new Error('No se pudo obtener la ubicación. Inténtalo de nuevo.'))
          } else {
            reject(new Error('Tiempo de espera agotado al obtener la ubicación.'))
          }
        },
        { timeout: 10000, maximumAge: 300000 },
      )
    })
  }

  async function locate(): Promise<GeolocationResult | null> {
    loading.value = true
    error.value = null
    try {
      const result = await getCurrentPosition()
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al obtener ubicación.'
      return null
    } finally {
      loading.value = false
    }
  }

  return { loading, error, locate }
}
