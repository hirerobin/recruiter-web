<template>
  <button
    class="w-full text-left bg-white border border-black/10 rounded-[10px] pt-[13px] pb-px px-[17px] flex flex-col gap-1 hover:border-primary hover:bg-primary/5 transition-all"
    @click="$emit('select', title)"
  >
    <p class="text-[13px] font-medium text-[#212121] leading-[1.5]">
      {{ icon }} {{ title }}
    </p>
    <p class="text-[11px] text-[#6b7280] leading-[1.5]">{{ description }}</p>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  description: string
}>()

defineEmits<{
  select: [text: string]
}>()
</script>
