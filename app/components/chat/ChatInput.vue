<template>
  <div class="border-t border-gray-100 px-6 py-4">
    <div class="max-w-3xl mx-auto flex items-center gap-3">
      <input
        ref="inputRef"
        v-model="message"
        type="text"
        :placeholder="placeholder"
        class="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        @keydown.enter="send"
      />
      <button
        class="w-10 h-10 bg-primary hover:bg-primary-dark rounded-xl flex items-center justify-center transition-colors disabled:opacity-40"
        :disabled="!message.trim()"
        @click="send"
      >
        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" transform="rotate(45 12 12)" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const message = ref('')
const inputRef = ref<HTMLInputElement>()

const props = defineProps<{
  placeholder?: string
  loading?: boolean
}>()

const emit = defineEmits<{
  send: [text: string]
}>()

function send() {
  const text = message.value.trim()
  if (!text || props.loading) return
  emit('send', text)
  message.value = ''
}

function focus() {
  inputRef.value?.focus()
}

defineExpose({ focus })
</script>
