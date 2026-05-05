<template>
  <div class="flex flex-col items-center gap-4 py-2 w-full max-w-[380px]">
    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
      <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>

    <div class="text-center">
      <p class="font-semibold text-gray-900 text-base">Selamat, Anda Lulus! 🎉</p>
      <p class="text-sm text-gray-500 mt-1">Langkah berikutnya: sesi AI Interview singkat (5–10 menit)</p>
    </div>

    <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 w-full space-y-1">
      <p class="font-medium">⚠️ Sebelum memulai:</p>
      <p>• Cari tempat yang <strong>tenang</strong> dan minim kebisingan</p>
      <p>• Pastikan koneksi internet <strong>stabil</strong></p>
      <p>• Gunakan headset/earphone jika ada</p>
    </div>

    <a
      :href="interviewUrl"
      target="_blank"
      class="w-full text-center bg-primary text-white rounded-xl py-3 text-sm font-semibold hover:bg-primary-dark transition-colors"
    >
      🎙️ Mulai AI Interview
    </a>

    <button
      @click="$emit('restart')"
      class="text-xs text-gray-400 hover:text-gray-600 transition-colors"
    >
      Kembali ke awal
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ interviewUrl: string }>()
defineEmits<{ restart: [] }>()
</script>
