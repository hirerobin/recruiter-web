<template>
  <div class="flex flex-col gap-4 w-full max-w-[380px]">
    <div>
      <p class="text-xs text-gray-400 mb-1">Pendaftaran untuk</p>
      <p class="font-semibold text-gray-900">{{ jobTitle }}</p>
    </div>

    <div class="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 leading-relaxed">
      <p class="font-medium text-gray-800 mb-2">Syarat & Ketentuan</p>
      <ul class="list-disc list-inside space-y-1.5 text-sm">
        <li>Data yang Anda berikan akan digunakan untuk proses rekrutmen</li>
        <li>Informasi Anda dijaga kerahasiaannya sesuai kebijakan privasi</li>
        <li>Proses pendaftaran memerlukan beberapa data pribadi</li>
        <li>Anda dapat membatalkan proses ini kapan saja</li>
      </ul>
    </div>

    <div class="flex gap-2">
      <button
        @click="$emit('agree')"
        class="flex-1 bg-primary text-white rounded-xl py-2.5 text-sm font-medium hover:bg-primary-dark transition-colors"
      >
        ✅ Saya Setuju
      </button>
      <button
        @click="$emit('decline')"
        class="flex-1 bg-gray-100 text-gray-700 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-200 transition-colors"
      >
        Batalkan
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ jobTitle: string }>()
defineEmits<{ agree: []; decline: [] }>()
</script>
