<script setup lang="ts"></script>

<template>
  <div class="w-full max-w-lg mx-auto">
    <div class="h-4 w-32 bg-white/30 dark:bg-white/[0.08] rounded-lg mb-3 animate-pulse" />
    <div class="grid grid-cols-5 gap-2">
      <div
        v-for="i in 5"
        :key="i"
        class="flex flex-col items-center gap-2 glass rounded-2xl
               px-3 py-4 animate-pulse"
      >
        <div class="h-3 w-12 bg-white/30 dark:bg-white/[0.08] rounded-lg" />
        <div class="w-12 h-12 bg-white/30 dark:bg-white/[0.08] rounded-full" />
        <div class="h-3 w-10 bg-white/30 dark:bg-white/[0.08] rounded-lg" />
        <div class="h-4 w-14 bg-white/30 dark:bg-white/[0.08] rounded-lg" />
      </div>
    </div>
  </div>
</template>
