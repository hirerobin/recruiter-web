import type { Message, WebApiResponse, WebQuestion, WebFsmState, ChatMode } from '~/types/chat'

const STATE_TO_MODE: Record<WebFsmState, ChatMode> = {
  candidate_asking: 'chat',
  consent: 'consent',
  data_collection: 'data-collection',
  file_upload: 'file-upload',
  scoring: 'scoring',
  pass: 'pass',
  fail: 'fail',
  interview_completed: 'interview-completed',
  escalated: 'chat',
}

const SESSION_KEY = 'hireai_session_id'

function makeSessionId(): string {
  return `web-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function getSessionId(): string {
  if (!import.meta.client) return makeSessionId()
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = makeSessionId()
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}

function clearSessionId(): void {
  if (import.meta.client) localStorage.removeItem(SESSION_KEY)
}

const INITIAL_MESSAGE: Message = {
  id: 'greeting',
  role: 'assistant',
  content: '👋 Hai! Saya adalah asisten rekrutmen AI Anda. Saya di sini untuk membantu Anda menemukan kesempatan kerja yang sempurna. Posisi apa yang Anda cari?',
}

export function useChat() {
  const messages = ref<Message[]>([{ ...INITIAL_MESSAGE }])
  const loading = ref(false)
  const chatMode = ref<ChatMode>('chat')

  const appliedJob = ref('')
  const appliedJobLocation = ref('')
  const currentQuestion = ref<WebQuestion | null>(null)
  const questionIndex = ref(0)
  const totalQuestions = ref(0)
  const uploadPage = ref(1)
  const uploadCount = ref(1)
  const score = ref(0)
  const passed = ref<boolean | null>(null)
  const interviewUrl = ref('')

  function addBot(content: string) {
    messages.value.push({ id: `ai-${Date.now()}-${Math.random()}`, role: 'assistant', content })
  }

  function addUser(content: string) {
    messages.value.push({ id: `user-${Date.now()}`, role: 'user', content })
  }

  function patchRefs(res: WebApiResponse) {
    if (res.question) currentQuestion.value = res.question
    if (res.questionIndex !== undefined) questionIndex.value = res.questionIndex
    if (res.totalQuestions !== undefined) totalQuestions.value = res.totalQuestions
    if (res.uploadPage !== undefined) uploadPage.value = res.uploadPage
    if (res.uploadCount !== undefined) uploadCount.value = res.uploadCount
    if (res.appliedJob) appliedJob.value = res.appliedJob
    if (res.appliedJobLocation) appliedJobLocation.value = res.appliedJobLocation
    if (res.score !== undefined) score.value = res.score
    if (res.interviewUrl) interviewUrl.value = res.interviewUrl
  }

  function applyResponse(res: WebApiResponse, skipAnimation = false) {
    for (const msg of res.messages) addBot(msg)
    patchRefs(res)

    const isTerminal = res.state === 'pass' || res.state === 'fail'
    if (!isTerminal) {
      chatMode.value = STATE_TO_MODE[res.state] ?? 'chat'
      return
    }

    passed.value = res.passed ?? (res.state === 'pass')
    if (skipAnimation) {
      chatMode.value = STATE_TO_MODE[res.state]
    } else {
      // Brief scoring animation then land on pass/fail
      chatMode.value = 'scoring'
      setTimeout(() => { chatMode.value = STATE_TO_MODE[res.state] }, 2000)
    }
  }

  async function sendMessage(text: string): Promise<void> {
    addUser(text)
    loading.value = true
    try {
      const res = await $fetch<WebApiResponse>('/api/chat', {
        method: 'POST',
        body: { message: text, sessionId: getSessionId() },
      })
      applyResponse(res)
    } catch {
      addBot('⚠️ Maaf, terjadi gangguan teknis. Silakan coba lagi.')
    } finally {
      loading.value = false
    }
  }

  async function agreeConsent(): Promise<void> {
    addUser('✅ Saya menyetujui persyaratan')
    loading.value = true
    try {
      const res = await $fetch<WebApiResponse>('/api/consent', {
        method: 'POST',
        body: { action: 'agree', sessionId: getSessionId() },
      })
      applyResponse(res)
    } catch {
      addBot('⚠️ Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      loading.value = false
    }
  }

  async function declineConsent(): Promise<void> {
    addUser('❌ Tidak, terima kasih')
    chatMode.value = 'chat'
    try {
      const res = await $fetch<WebApiResponse>('/api/consent', {
        method: 'POST',
        body: { action: 'decline', sessionId: getSessionId() },
      })
      for (const msg of res.messages) addBot(msg)
    } catch {
      addBot('Tidak masalah! Jika ada pertanyaan lain, saya siap membantu. 😊')
    }
  }

  async function submitAnswer(answer: string): Promise<void> {
    addUser(answer)
    loading.value = true
    try {
      const res = await $fetch<WebApiResponse>('/api/chat', {
        method: 'POST',
        body: { message: answer, sessionId: getSessionId() },
      })
      applyResponse(res)
    } catch {
      addBot('⚠️ Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      loading.value = false
    }
  }

  async function uploadFile(file: File): Promise<void> {
    addUser(`📎 ${file.name}`)
    loading.value = true
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('sessionId', getSessionId())
      const res = await $fetch<WebApiResponse>('/api/upload', {
        method: 'POST',
        body: form,
      })
      applyResponse(res)
    } catch {
      addBot('⚠️ Upload gagal. Silakan coba lagi.')
    } finally {
      loading.value = false
    }
  }

  async function restoreSession(): Promise<void> {
    const sessionId = getSessionId()
    try {
      const res = await $fetch<WebApiResponse>(`/api/state?sessionId=${sessionId}`)
      if (!res || res.state === 'candidate_asking' || res.state === 'escalated') return
      addBot('💬 Melanjutkan sesi sebelumnya...')
      applyResponse(res, true)
    } catch {
      // Session expired or network error — start fresh silently
    }
  }

  function resetChat(): void {
    clearSessionId()
    messages.value = [{ ...INITIAL_MESSAGE }]
    chatMode.value = 'chat'
    appliedJob.value = ''
    appliedJobLocation.value = ''
    currentQuestion.value = null
    questionIndex.value = 0
    totalQuestions.value = 0
    uploadPage.value = 1
    uploadCount.value = 1
    score.value = 0
    passed.value = null
    interviewUrl.value = ''
  }

  onMounted(() => {
    restoreSession()

    if (import.meta.client && 'BroadcastChannel' in globalThis) {
      const bc = new BroadcastChannel('hireai_interview')
      bc.onmessage = (e) => {
        if (e.data?.type === 'interview_complete' && e.data?.sessionId === getSessionId()) {
          chatMode.value = 'interview-completed'
        }
      }
      onUnmounted(() => bc.close())
    }
  })

  return {
    messages,
    loading,
    chatMode,
    appliedJob,
    appliedJobLocation,
    currentQuestion,
    questionIndex,
    totalQuestions,
    uploadPage,
    uploadCount,
    score,
    passed,
    interviewUrl,
    sendMessage,
    agreeConsent,
    declineConsent,
    submitAnswer,
    uploadFile,
    resetChat,
  }
}
