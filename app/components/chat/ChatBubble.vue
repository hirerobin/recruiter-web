<template>
  <div class="flex gap-2.5" :class="isUser ? 'flex-row-reverse' : ''">
    <!-- AI Avatar -->
    <div
      v-if="!isUser"
      class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-[2px]"
    >
      <span class="text-[11px] font-bold text-white leading-none">AI</span>
    </div>

    <div class="flex flex-col gap-1.5" :class="isUser ? 'items-end' : 'items-start'" style="max-width: 630px">
      <!-- Sender label -->
      <span v-if="!isUser" class="text-[11px] font-medium text-[#6b7280] leading-none">
        HireAI · baru saja
      </span>

      <!-- Bubble -->
      <div
        class="px-4 py-3 text-sm leading-[1.6] text-[#212121]"
        :class="isUser
          ? 'bg-primary text-white rounded-tl-[16px] rounded-tr-[4px] rounded-bl-[16px] rounded-br-[16px]'
          : 'bg-white border border-black/10 rounded-tl-[4px] rounded-tr-[16px] rounded-bl-[16px] rounded-br-[16px]'"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isUser?: boolean
}>()
</script>
