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

export type WebFsmState =
  | 'candidate_asking'
  | 'consent'
  | 'data_collection'
  | 'file_upload'
  | 'scoring'
  | 'pass'
  | 'fail'
  | 'interview_completed'
  | 'escalated'

export interface WebQuestion {
  questionNumber: string
  text: string
  type: 'Text' | 'Number' | 'Date' | 'Boolean' | 'Upload Docs'
  choices?: string[]
  rules?: string
  uploadCount?: number
}

export interface WebApiResponse {
  state: WebFsmState
  messages: string[]
  question?: WebQuestion
  questionIndex?: number
  totalQuestions?: number
  uploadPage?: number
  uploadCount?: number
  appliedJob?: string
  appliedJobLocation?: string
  score?: number
  passed?: boolean
  interviewUrl?: string
  failReason?: string
}

export type ChatMode =
  | 'chat'
  | 'consent'
  | 'data-collection'
  | 'file-upload'
  | 'scoring'
  | 'pass'
  | 'fail'
  | 'interview-completed'
