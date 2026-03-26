<script setup lang="ts"></script>

<template>
  <div
    class="w-full max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6
           flex flex-col gap-4 animate-pulse"
    aria-busy="true"
    aria-label="Cargando clima..."
  >
    <div class="flex items-start justify-between">
      <div class="flex flex-col gap-2">
        <div class="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
        <div class="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
    </div>
    <div class="flex items-end gap-3">
      <div class="h-14 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
      <div class="flex flex-col gap-1 pb-2">
        <div class="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
        <div class="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3 border-t border-gray-100 dark:border-gray-700 pt-4">
      <div v-for="i in 4" :key="i" class="flex items-center gap-2">
        <div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div class="flex flex-col gap-1">
          <div class="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          <div class="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  </div>
</template>
