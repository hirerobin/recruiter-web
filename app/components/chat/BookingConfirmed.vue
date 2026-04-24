<template>
  <div class="flex flex-col items-center gap-4 py-2 w-full max-w-[380px]">
    <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
      <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>

    <div class="text-center">
      <p class="font-semibold text-gray-900 text-base">Wawancara Terjadwal! 🎉</p>
      <p class="text-sm text-gray-500 mt-1">{{ slot.label }}</p>
    </div>

    <div class="w-full bg-gray-50 rounded-xl p-4 text-sm space-y-2.5">
      <div class="flex justify-between">
        <span class="text-gray-400">Posisi</span>
        <span class="font-medium text-gray-800 text-right max-w-[200px]">{{ jobTitle }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Nama</span>
        <span class="font-medium text-gray-800">{{ candidateName }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Jadwal</span>
        <span class="font-medium text-gray-800">{{ slot.label }}</span>
      </div>
    </div>

    <button
      @click="$emit('done')"
      class="w-full bg-primary text-white rounded-xl py-2.5 text-sm font-medium hover:bg-primary-dark transition-colors"
    >
      Kembali ke Chat
    </button>
  </div>
</template>

<script setup lang="ts">
import type { InterviewSlot } from '~/types/chat'

defineProps<{ slot: InterviewSlot; jobTitle: string; candidateName: string }>()
defineEmits<{ done: [] }>()
</script>
