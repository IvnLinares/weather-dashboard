<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { Heart, Sun, Moon, Palette } from 'lucide-vue-next'

const settings = useSettingsStore()
onMounted(() => settings.init())
</script>

<template>
  <main
    class="min-h-screen relative overflow-hidden text-gray-900 dark:text-gray-100 transition-colors duration-500"
    :class="settings.bgStyle === 'solid'
      ? 'bg-gray-50 dark:bg-black'
      : 'bg-gradient-to-br from-sky-200 via-blue-100 to-indigo-200 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900'"
  >
    <!-- Animated gradient orbs for depth (only in gradient mode) -->
    <div v-if="settings.bgStyle === 'gradient'" class="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div class="absolute -top-40 -left-40 w-96 h-96 rounded-full
                  bg-sky-300/40 dark:bg-sky-500/10 blur-3xl animate-float" />
      <div class="absolute top-1/3 -right-32 w-80 h-80 rounded-full
                  bg-indigo-300/30 dark:bg-indigo-500/10 blur-3xl animate-float-delay" />
      <div class="absolute -bottom-32 left-1/4 w-72 h-72 rounded-full
                  bg-purple-300/25 dark:bg-purple-500/8 blur-3xl animate-float-slow" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full
                  bg-cyan-200/20 dark:bg-cyan-500/5 blur-3xl" />
    </div>

    <!-- Content -->
    <div class="relative z-10 flex flex-col min-h-screen">
      <!-- Header -->
      <header class="flex flex-col items-center gap-2 py-4 px-4 sm:px-6">
        <h1 class="text-2xl sm:text-3xl font-bold tracking-widest uppercase text-gray-400 dark:text-white/30">
          <span class="text-gray-300 dark:text-white/20">ivn</span>weather
        </h1>
        <div class="flex items-center gap-1.5">
          <button
            @click="settings.toggleUnit()"
            class="glass-btn px-2.5 py-1.5 rounded-full text-xs font-semibold"
            :aria-label="`Cambiar a ${settings.unit === 'metric' ? 'Fahrenheit' : 'Celsius'}`"
          >
            {{ settings.unitSymbol() }}
          </button>
          <button
            @click="settings.toggleBgStyle()"
            class="glass-btn p-2 rounded-full leading-none flex items-center justify-center"
            aria-label="Cambiar estilo de fondo"
          >
            <Palette :size="15" :class="settings.bgStyle === 'gradient' ? 'text-purple-400' : 'text-gray-400'" />
          </button>
          <button
            @click="settings.toggleDark()"
            class="glass-btn p-2 rounded-full leading-none flex items-center justify-center"
            :aria-label="settings.isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
          >
            <Sun v-if="settings.isDark" :size="15" class="text-amber-400" />
            <Moon v-else :size="15" class="text-indigo-400" />
          </button>
        </div>
      </header>

      <!-- Main -->
      <div class="flex-1">
        <RouterView />
      </div>

      <!-- Footer -->
      <footer class="text-center py-6 px-4">
        <p class="text-xs text-gray-400/60 dark:text-white/20 flex items-center justify-center gap-1">
          Desarrollado con <Heart :size="12" class="text-red-400 fill-red-400" /> por
          <a href="https://ivnlinares.com/" target="_blank" rel="noopener noreferrer" class="underline underline-offset-2 hover:text-gray-600 dark:hover:text-white/50 transition-colors">IvnLinares</a>
        </p>
      </footer>
    </div>
  </main>
</template>

