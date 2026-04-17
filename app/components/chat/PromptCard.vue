<template>
  <button
    class="w-full text-left p-4 border border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
    @click="$emit('select', title)"
  >
    <p class="text-sm font-medium text-gray-800 group-hover:text-primary">
      {{ icon }} {{ title }}
    </p>
    <p class="text-xs text-gray-400 mt-1">{{ description }}</p>
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
