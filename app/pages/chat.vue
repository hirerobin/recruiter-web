<template>
  <div class="min-h-screen bg-white flex flex-col">
    <ChatChatHeader />

    <!-- Messages area -->
    <div ref="messagesRef" class="flex-1 overflow-y-auto px-6 py-6">
      <div class="max-w-3xl mx-auto space-y-6">
        <!-- Messages -->
        <ChatChatBubble
          v-for="msg in messages"
          :key="msg.id"
          :is-user="msg.role === 'user'"
        >
          <span v-html="formatMessage(msg.content)" />
        </ChatChatBubble>

        <!-- Typing indicator -->
        <ChatChatBubble v-if="loading">
          <span class="flex items-center gap-1">
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms" />
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms" />
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms" />
          </span>
        </ChatChatBubble>

        <!-- Suggested prompts (only if no user messages yet) -->
        <div v-if="messages.length <= 1" class="space-y-3 mt-4">
          <p class="text-xs text-gray-400">Coba tanyakan:</p>
          <ChatPromptCard
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

    <!-- Input -->
    <ChatChatInput
      ref="chatInput"
      placeholder="Ketik pesan Anda di sini..."
      :loading="loading"
      @send="handleSend"
    />
  </div>
</template>

<script setup lang="ts">
const { messages, loading, sendMessage } = useChat()
const messagesRef = ref<HTMLElement>()
const chatInput = ref()

const prompts = [
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
    title: 'Tampilkan posisi yang tersedia',
    description: 'Saring pekerjaan berdasarkan lokasi dan peran',
  },
]

function formatMessage(content: string): string {
  // Convert HTML bold tags and newlines
  return content
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
}

async function handleSend(text: string) {
  await sendMessage(text)
  scrollToBottom()
}

async function handlePrompt(text: string) {
  await sendMessage(text)
  scrollToBottom()
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  })
}

useHead({ title: 'Chat — HireAI' })
</script>
