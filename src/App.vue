<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()
onMounted(() => settings.init())
</script>

<template>
  <main
    class="min-h-screen relative overflow-hidden
           bg-gradient-to-br from-sky-200 via-blue-100 to-indigo-200
           dark:from-gray-950 dark:via-slate-900 dark:to-gray-900
           text-gray-900 dark:text-gray-100 transition-colors duration-500"
  >
    <!-- Animated gradient orbs for depth -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
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
    <div class="relative z-10">
      <RouterView />
    </div>
  </main>
</template>

