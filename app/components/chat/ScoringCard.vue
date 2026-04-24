<template>
  <div class="flex flex-col items-center gap-4 py-3 w-full max-w-[380px]">
    <!-- Loading -->
    <template v-if="passed === null">
      <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <div class="text-center">
        <p class="text-sm font-medium text-gray-800">Menilai profil Anda...</p>
        <p class="text-xs text-gray-400 mt-1">Mohon tunggu sebentar</p>
      </div>
    </template>

    <!-- Pass -->
    <template v-else-if="passed">
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div class="text-center">
        <p class="font-semibold text-gray-900 text-base">Selamat! Anda Lulus ✨</p>
        <div class="mt-2 flex items-end justify-center gap-1">
          <span class="text-3xl font-bold text-primary">{{ score }}</span>
          <span class="text-gray-400 text-sm mb-1">/100</span>
        </div>
        <p class="text-xs text-gray-400 mt-1">Skor seleksi awal</p>
      </div>
    </template>

    <!-- Fail -->
    <template v-else>
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
        <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <div class="text-center">
        <p class="font-semibold text-gray-900">Belum Memenuhi Syarat</p>
        <p class="text-sm text-gray-500 mt-1">Skor: {{ score }}/100 (min. 50)</p>
        <p class="text-xs text-gray-400 mt-1">Coba lamar posisi lain yang lebih sesuai</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps<{ passed: boolean | null; score: number }>()
</script>
