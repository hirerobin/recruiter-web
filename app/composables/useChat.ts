import type { Message, ChatApiResponse } from '~/types/chat'

interface UseChatReturn {
  messages: Ref<Message[]>
  loading: Ref<boolean>
  sendMessage: (text: string) => Promise<void>
}

function getSessionId(): string {
  const key = 'hireai_session_id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = `web-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    localStorage.setItem(key, id)
  }
  return id
}

export function useChat(): UseChatReturn {
  const messages = ref<Message[]>([
    {
      id: 'greeting',
      role: 'assistant',
      content: '👋 Hai! Saya adalah asisten rekrutmen AI Anda. Saya di sini untuk membantu Anda menemukan kesempatan kerja yang sempurna. Posisi apa yang Anda cari?',
    },
  ])

  const loading = ref<boolean>(false)

  async function sendMessage(text: string): Promise<void> {
    messages.value.push({
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
    })

    loading.value = true

    try {
      const res = await $fetch<ChatApiResponse>('/api/chat', {
        method: 'POST',
        body: { message: text, sessionId: getSessionId() },
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
