export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export interface Prompt {
  icon: string
  title: string
  description: string
}

export interface ChatRequestBody {
  message: string
  sessionId: string
}

export interface ChatApiResponse {
  reply: string
}
