<script setup lang="ts"></script>

<template>
  <div
    class="w-full max-w-lg mx-auto glass-strong rounded-3xl p-6
           flex flex-col gap-4 animate-pulse"
    aria-busy="true"
    aria-label="Cargando clima..."
  >
    <div class="flex items-start justify-between">
      <div class="flex flex-col gap-2">
        <div class="h-6 w-40 bg-white/30 dark:bg-white/[0.08] rounded-xl" />
        <div class="h-4 w-28 bg-white/30 dark:bg-white/[0.08] rounded-xl" />
      </div>
      <div class="w-16 h-16 bg-white/30 dark:bg-white/[0.08] rounded-full" />
    </div>
    <div class="flex items-end gap-3">
      <div class="h-14 w-32 bg-white/30 dark:bg-white/[0.08] rounded-xl" />
      <div class="flex flex-col gap-1 pb-2">
        <div class="h-4 w-28 bg-white/30 dark:bg-white/[0.08] rounded-xl" />
        <div class="h-4 w-24 bg-white/30 dark:bg-white/[0.08] rounded-xl" />
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3 border-t border-white/20 dark:border-white/[0.06] pt-4">
      <div v-for="i in 4" :key="i" class="flex items-center gap-2">
        <div class="w-8 h-8 bg-white/30 dark:bg-white/[0.08] rounded-full" />
        <div class="flex flex-col gap-1">
          <div class="h-3 w-16 bg-white/30 dark:bg-white/[0.08] rounded-lg" />
          <div class="h-4 w-20 bg-white/30 dark:bg-white/[0.08] rounded-lg" />
        </div>
      </div>
    </div>
  </div>
</template>
