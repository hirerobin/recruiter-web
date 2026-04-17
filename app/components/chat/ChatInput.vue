<template>
  <div class="bg-white border-t border-black/10 h-[100px] shrink-0 flex items-start pt-[17px] px-[87.5px]">
    <div class="w-full bg-[#f5f5f5] border-[1.5px] border-black/10 rounded-[14px] h-[67px] flex items-center gap-2 px-[17.5px] py-[13.5px]">
      <input
        ref="inputRef"
        v-model="message"
        type="text"
        :placeholder="placeholder || 'Type your message here...'"
        :disabled="loading"
        class="flex-1 bg-transparent text-sm text-[#212121] placeholder-[#aaa] focus:outline-none disabled:opacity-50"
        @keydown.enter="send"
      />
      <button
        class="w-10 h-10 bg-primary hover:bg-primary-dark rounded-[10px] flex items-center justify-center shrink-0 transition-colors disabled:opacity-40"
        :disabled="!message.trim() || loading"
        @click="send"
      >
        <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
