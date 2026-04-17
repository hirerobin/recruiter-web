<template>
  <div class="flex gap-3" :class="isUser ? 'flex-row-reverse' : ''">
    <!-- Avatar -->
    <div
      v-if="!isUser"
      class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary text-white text-xs font-bold"
    >
      AI
    </div>

    <div :class="isUser ? 'items-end' : 'items-start'" class="flex flex-col max-w-[80%]">
      <!-- Sender label -->
      <span v-if="!isUser" class="text-xs text-gray-400 mb-1">
        HireAI &middot; baru saja
      </span>

      <!-- Bubble -->
      <div
        class="px-4 py-3 rounded-2xl text-sm leading-relaxed"
        :class="isUser
          ? 'bg-primary text-white rounded-br-md'
          : 'bg-gray-100 text-gray-800 rounded-bl-md'"
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
