<script setup lang="ts">
import type { WeatherCondition } from '@/types/weather'

defineProps<{ condition: WeatherCondition; conditionId: number }>()
</script>

<template>
  <!-- Sun -->
  <div v-if="condition === 'Clear'" class="weather-anim" aria-hidden="true">
    <div class="sun">
      <div class="sun-core" />
      <div v-for="i in 8" :key="i" class="ray" :style="{ '--i': i }" />
    </div>
  </div>

  <!-- Rain / Drizzle / Thunderstorm -->
  <div v-else-if="['Rain', 'Drizzle', 'Thunderstorm'].includes(condition)" class="weather-anim" aria-hidden="true">
    <div class="cloud cloud-rain" />
    <div v-if="condition === 'Thunderstorm'" class="lightning">
      <svg width="16" height="20" viewBox="0 0 24 24" fill="#facc15" xmlns="http://www.w3.org/2000/svg"><path d="M13 2L3 14h9l-1 10 10-12h-9l1-10z"/></svg>
    </div>
    <div class="drops">
      <span v-for="i in 10" :key="i" class="drop" :style="{ '--i': i }" />
    </div>
  </div>

  <!-- Snow -->
  <div v-else-if="condition === 'Snow'" class="weather-anim" aria-hidden="true">
    <div class="cloud" />
    <div class="flakes">
      <span v-for="i in 10" :key="i" class="flake" :style="{ '--i': i }">❄</span>
    </div>
  </div>

  <!-- Clouds -->
  <div v-else-if="condition === 'Clouds'" class="weather-anim" aria-hidden="true">
    <div class="cloud cloud-back" />
    <div class="cloud cloud-front" />
  </div>

  <!-- Mist / Fog / Haze -->
  <div v-else class="weather-anim" aria-hidden="true">
    <div v-for="i in 3" :key="i" class="fog-line" :style="{ '--i': i }" />
  </div>
</template>

<style scoped>
.weather-anim {
  position: relative;
  width: 80px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ---- Sun ---- */
.sun {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sun-core {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #fbbf24;
  box-shadow: 0 0 12px 4px #fde68a;
  animation: pulse-sun 2s ease-in-out infinite;
}
.ray {
  position: absolute;
  width: 4px;
  height: 10px;
  background: #fbbf24;
  border-radius: 2px;
  transform-origin: 50% 24px;
  transform: rotate(calc(var(--i) * 45deg)) translateY(-22px);
  animation: spin-sun 8s linear infinite;
}
@keyframes pulse-sun {
  0%, 100% { box-shadow: 0 0 12px 4px #fde68a; }
  50% { box-shadow: 0 0 20px 8px #fde68a; }
}
@keyframes spin-sun {
  from { transform: rotate(calc(var(--i) * 45deg)) translateY(-22px); }
  to { transform: rotate(calc(var(--i) * 45deg + 360deg)) translateY(-22px); }
}

/* ---- Cloud ---- */
.cloud {
  width: 48px;
  height: 22px;
  background: #cbd5e1;
  border-radius: 24px;
  position: relative;
}
.cloud::before {
  content: '';
  position: absolute;
  width: 26px;
  height: 26px;
  background: #cbd5e1;
  border-radius: 50%;
  top: -12px;
  left: 10px;
}
.cloud-back {
  background: #94a3b8;
  position: absolute;
  top: 8px;
  left: 0;
  transform: scale(0.85);
  opacity: 0.7;
  animation: drift 4s ease-in-out infinite alternate;
}
.cloud-front {
  background: #cbd5e1;
  position: absolute;
  top: 16px;
  left: 10px;
  animation: drift 4s ease-in-out infinite alternate-reverse;
}
.cloud-front::before { background: #cbd5e1; }
@keyframes drift {
  from { transform: translateX(0); }
  to { transform: translateX(6px); }
}

/* ---- Rain ---- */
.cloud-rain {
  position: absolute;
  top: 4px;
  left: 16px;
}
.drops {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 32px;
}
.drop {
  position: absolute;
  width: 2px;
  height: 8px;
  background: #60a5fa;
  border-radius: 2px;
  bottom: 0;
  left: calc(var(--i) * 9% + 5%);
  animation: fall 0.8s linear infinite;
  animation-delay: calc(var(--i) * 0.08s);
  opacity: 0.8;
}
@keyframes fall {
  from { transform: translateY(-20px); opacity: 0.8; }
  to { transform: translateY(20px); opacity: 0; }
}

/* ---- Snow ---- */
.flakes {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 36px;
}
.flake {
  position: absolute;
  font-size: 11px;
  color: #bae6fd;
  left: calc(var(--i) * 9% + 4%);
  animation: snowfall 1.2s ease-in infinite;
  animation-delay: calc(var(--i) * 0.12s);
}
@keyframes snowfall {
  from { transform: translateY(-20px) rotate(0deg); opacity: 1; }
  to { transform: translateY(20px) rotate(180deg); opacity: 0; }
}

/* ---- Lightning ---- */
.lightning {
  position: absolute;
  top: 20px;
  right: 8px;
  font-size: 18px;
  animation: flash 1.5s ease-in-out infinite;
}
@keyframes flash {
  0%, 90%, 100% { opacity: 0; }
  92%, 96% { opacity: 1; }
}

/* ---- Fog ---- */
.fog-line {
  position: absolute;
  height: 4px;
  background: linear-gradient(90deg, transparent, #94a3b8, transparent);
  border-radius: 4px;
  width: 70%;
  top: calc(var(--i) * 18px + 4px);
  animation: fog-drift 3s ease-in-out infinite alternate;
  animation-delay: calc(var(--i) * 0.5s);
}
@keyframes fog-drift {
  from { transform: translateX(-6px); opacity: 0.5; }
  to { transform: translateX(6px); opacity: 1; }
}
</style>
