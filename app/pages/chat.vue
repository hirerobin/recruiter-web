<template>
  <div class="fixed inset-0 bg-[#f5f5f5] flex flex-col overflow-hidden">
    <ChatHeader />

    <!-- Messages area -->
    <div ref="messagesRef" class="flex-1 overflow-y-auto pt-8 px-[87.5px]">
      <div class="flex flex-col gap-6 max-w-[896px]">
        <!-- Messages -->
        <ChatBubble
          v-for="msg in messages"
          :key="msg.id"
          :is-user="msg.role === 'user'"
        >
          <span v-html="formatMessage(msg.content)" />
        </ChatBubble>

        <!-- Typing indicator -->
        <ChatBubble v-if="loading">
          <span class="flex items-center gap-1">
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms" />
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms" />
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms" />
          </span>
        </ChatBubble>

        <!-- Suggested prompts (only if no user messages yet) -->
        <div v-if="messages.length <= 1" class="flex flex-col gap-3 mt-2">
          <p class="text-[10px] font-semibold uppercase tracking-[0.8px] text-[#6b7280]">Coba tanyakan:</p>
          <div class="grid gap-[8px] w-[448px]">
            <PromptCard
              v-for="prompt in prompts"
              :key="prompt.title"
              :icon="prompt.icon"
              :title="prompt.title"
              :description="prompt.description"
              @select="handlePrompt"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Input -->
    <ChatInput
      :loading="loading"
      @send="handleSend"
    />
  </div>
</template>

<script setup lang="ts">
import ChatHeader from '~/components/chat/ChatHeader.vue'
import ChatBubble from '~/components/chat/ChatBubble.vue'
import ChatInput from '~/components/chat/ChatInput.vue'
import PromptCard from '~/components/chat/PromptCard.vue'
import type { Prompt } from '~/types/chat'

definePageMeta({ layout: false })

const { messages, loading, sendMessage } = useChat()
const messagesRef = ref<HTMLElement | null>(null)

const prompts: Prompt[] = [
  {
    icon: '🔍',
    title: 'Temukan pekerjaan yang sesuai dengan keterampilan saya',
    description: 'Dapatkan rekomendasi pekerjaan yang dipersonalisasi',
  },
  {
    icon: '🎯',
    title: 'Bantu saya mempersiapkan wawancara',
    description: 'Latihan menjawab pertanyaan wawancara umum',
  },
  {
    icon: '📄',
    title: 'Tinjau resume saya',
    description: 'Dapatkan umpan balik dan saran berbasis AI',
  },
  {
    icon: '💼',
    title: 'Tampilkan posisi UX jarak jauh untuk saya',
    description: 'Saring pekerjaan berdasarkan lokasi dan peran',
  },
]

function formatMessage(content: string): string {
  return content
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
}

async function handleSend(text: string): Promise<void> {
  await sendMessage(text)
  scrollToBottom()
}

async function handlePrompt(text: string): Promise<void> {
  await sendMessage(text)
  scrollToBottom()
}

function scrollToBottom(): void {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  })
}

useHead({ title: 'Chat — HireAI' })
</script>
