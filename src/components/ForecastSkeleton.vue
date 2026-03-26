<script setup lang="ts"></script>

<template>
  <div class="w-full max-w-lg mx-auto">
    <div class="h-4 w-32 bg-white/30 dark:bg-white/[0.08] rounded-lg mb-3 animate-pulse" />
    <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-none sm:grid sm:grid-cols-5 sm:overflow-visible">
      <div
        v-for="i in 5"
        :key="i"
        class="flex flex-col items-center gap-2 glass rounded-2xl
               px-3 py-4 animate-pulse min-w-[110px] sm:min-w-0"
      >
        <div class="h-3 w-12 bg-white/30 dark:bg-white/[0.08] rounded-lg" />
        <div class="w-12 h-12 bg-white/30 dark:bg-white/[0.08] rounded-full" />
        <div class="h-3 w-10 bg-white/30 dark:bg-white/[0.08] rounded-lg" />
        <div class="h-4 w-14 bg-white/30 dark:bg-white/[0.08] rounded-lg" />
      </div>
    </div>
  </div>
</template>
