const TTL_MS = 10 * 60 * 1000 // 10 minutes

interface CacheEntry<T> {
  data: T
  timestamp: number
}

function buildKey(prefix: string, id: string): string {
  return `wdash_${prefix}_${id.toLowerCase().trim()}`
}

export function useWeatherCache() {
  function get<T>(prefix: string, id: string): T | null {
    try {
      const raw = localStorage.getItem(buildKey(prefix, id))
      if (!raw) return null
      const entry: CacheEntry<T> = JSON.parse(raw)
      if (Date.now() - entry.timestamp > TTL_MS) {
        localStorage.removeItem(buildKey(prefix, id))
        return null
      }
      return entry.data
    } catch {
      return null
    }
  }

  function set<T>(prefix: string, id: string, data: T): void {
    try {
      const entry: CacheEntry<T> = { data, timestamp: Date.now() }
      localStorage.setItem(buildKey(prefix, id), JSON.stringify(entry))
    } catch {
      // localStorage may be unavailable (private mode, quota exceeded) — fail silently
    }
  }

  return { get, set }
}
