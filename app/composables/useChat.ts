interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function useChat() {
  const config = useRuntimeConfig()
  const messages = ref<Message[]>([])
  const loading = ref(false)

  // Add initial AI greeting
  messages.value.push({
    id: 'greeting',
    role: 'assistant',
    content: '👋 Hai! Saya adalah asisten rekrutmen AI Anda. Saya di sini untuk membantu Anda menemukan kesempatan kerja yang sempurna. Posisi apa yang Anda cari?',
  })

  async function sendMessage(text: string) {
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
    }
    messages.value.push(userMsg)
    loading.value = true

    try {
      const res = await $fetch<{ reply: string }>('/api/chat', {
        method: 'POST',
        body: { message: text },
      })

      messages.value.push({
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: res.reply,
      })
    } catch {
      messages.value.push({
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: '⚠️ Maaf, terjadi gangguan teknis. Silakan coba lagi.',
      })
    } finally {
      loading.value = false
    }
  }

  return { messages, loading, sendMessage }
}
