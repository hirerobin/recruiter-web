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

export interface InterviewSlot {
  date: string  // YYYY-MM-DD
  time: string  // HH:MM
  label: string // "Senin, 7 Apr 09:00"
}

export type ChatMode = 'chat' | 'consent' | 'data-collection' | 'scoring' | 'interview-slots' | 'confirmed'
