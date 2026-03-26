<script setup lang="ts"></script>

<template>
  <div class="w-full max-w-lg mx-auto">
    <div class="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse" />
    <div class="grid grid-cols-5 gap-2">
      <div
        v-for="i in 5"
        :key="i"
        class="flex flex-col items-center gap-2 bg-white dark:bg-gray-800 rounded-xl
               shadow px-3 py-4 animate-pulse"
      >
        <div class="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
        <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div class="h-3 w-10 bg-gray-200 dark:bg-gray-700 rounded" />
        <div class="h-4 w-14 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  </div>
</template>
