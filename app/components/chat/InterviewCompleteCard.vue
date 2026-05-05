<template>
  <div class="flex flex-col items-center gap-4 py-2 w-full max-w-[380px]">
    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl">🎉</div>

    <div class="text-center">
      <p class="font-semibold text-gray-900 text-base">Wawancara Selesai!</p>
      <p class="text-sm text-gray-500 mt-1">Terima kasih telah meluangkan waktu untuk proses seleksi ini.</p>
    </div>

    <div class="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-800 w-full text-center leading-relaxed">
      Tim kami akan menghubungi Anda dalam waktu dekat untuk informasi selanjutnya. 🙏
    </div>

    <button
      @click="$emit('restart')"
      class="text-xs text-gray-400 hover:text-gray-600 transition-colors"
    >
      Kembali ke awal
    </button>
  </div>
</template>

<script setup lang="ts">
defineEmits<{ restart: [] }>()
</script>
