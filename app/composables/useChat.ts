import type { Message, ChatApiResponse, InterviewSlot, ChatMode } from '~/types/chat'

interface Question {
  question: string
  type: 'text' | 'select'
  choices?: string[]
}

const MOCK_QUESTIONS: Question[] = [
  { question: 'Siapa nama lengkap Anda?', type: 'text' },
  { question: 'Nomor telepon aktif Anda?', type: 'text' },
  { question: 'Tanggal lahir Anda? (DD/MM/YYYY)', type: 'text' },
  { question: 'Pendidikan terakhir Anda?', type: 'select', choices: ['SMP', 'SMA/SMK', 'D3', 'S1', 'S2'] },
  { question: 'Domisili Anda saat ini?', type: 'text' },
  { question: 'Nomor NIK (16 digit)?', type: 'text' },
]

function generateSlots(): InterviewSlot[] {
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  const slots: InterviewSlot[] = []
  const today = new Date()
  let daysAdded = 0
  let offset = 1

  while (daysAdded < 3 && offset <= 14) {
    const d = new Date(today)
    d.setDate(today.getDate() + offset)
    const dow = d.getDay()

    if (dow >= 1 && dow <= 5) {
      const dateStr = d.toISOString().slice(0, 10)
      for (let h = 9; h < 17; h++) {
        for (const m of [0, 30]) {
          if (slots.filter(s => s.date === dateStr).length >= 6) break
          const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
          slots.push({
            date: dateStr,
            time,
            label: `${dayNames[dow]}, ${d.getDate()} ${monthNames[d.getMonth()]} ${time}`,
          })
        }
      }
      daysAdded++
    }
    offset++
  }
  return slots
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

export function useChat() {
  const messages = ref<Message[]>([
    {
      id: 'greeting',
      role: 'assistant',
      content: '👋 Hai! Saya adalah asisten rekrutmen AI Anda. Saya di sini untuk membantu Anda menemukan kesempatan kerja yang sempurna. Posisi apa yang Anda cari?',
    },
  ])

  const loading = ref(false)
  const chatMode = ref<ChatMode>('chat')
  const appliedJob = ref('')
  const answers = ref<string[]>([])
  const currentQuestionIndex = ref(0)
  const scoringPassed = ref<boolean | null>(null)
  const scoringScore = ref(0)
  const slots = ref<InterviewSlot[]>([])
  const bookedSlot = ref<InterviewSlot | null>(null)

  const currentQuestion = computed<Question | null>(() => MOCK_QUESTIONS[currentQuestionIndex.value] ?? null)
  const totalQuestions = MOCK_QUESTIONS.length
  const candidateName = computed(() => answers.value[0] || 'Anda')

  function addBot(content: string) {
    messages.value.push({ id: `ai-${Date.now()}`, role: 'assistant', content })
  }

  function addUser(content: string) {
    messages.value.push({ id: `user-${Date.now()}`, role: 'user', content })
  }

  async function sendMessage(text: string): Promise<void> {
    addUser(text)

    if (/daftar/i.test(text.trim())) {
      const lastAI = [...messages.value].reverse().find(m => m.role === 'assistant')
      const jobMatch = lastAI?.content.match(/<b>(.*?)<\/b>/)?.[1] ?? 'posisi yang Anda pilih'
      addBot(`Baik! Saya akan membantu Anda mendaftar untuk posisi <strong>${jobMatch}</strong>. Sebelum melanjutkan, harap baca dan setujui persyaratan berikut.`)
      appliedJob.value = jobMatch
      chatMode.value = 'consent'
      return
    }

    loading.value = true
    try {
      const res = await $fetch<ChatApiResponse>('/api/chat', {
        method: 'POST',
        body: { message: text, sessionId: getSessionId() },
      })
      addBot(res.reply)
    } catch {
      addBot('⚠️ Maaf, terjadi gangguan teknis. Silakan coba lagi.')
    } finally {
      loading.value = false
    }
  }

  function agreeConsent() {
    addUser('✅ Saya menyetujui persyaratan')
    answers.value = []
    currentQuestionIndex.value = 0
    chatMode.value = 'data-collection'
  }

  function declineConsent() {
    addUser('❌ Tidak, terima kasih')
    addBot('Tidak masalah! Jika ada pertanyaan lain, saya siap membantu. 😊')
    chatMode.value = 'chat'
  }

  function submitAnswer(answer: string) {
    addUser(answer)
    answers.value[currentQuestionIndex.value] = answer
    currentQuestionIndex.value++
    if (currentQuestionIndex.value >= MOCK_QUESTIONS.length) {
      scoringPassed.value = null
      chatMode.value = 'scoring'
      runScoring()
    }
  }

  async function runScoring() {
    await new Promise(r => setTimeout(r, 3000))
    const score = Math.floor(Math.random() * 20) + 75
    scoringScore.value = score
    scoringPassed.value = true
    await new Promise(r => setTimeout(r, 1800))
    addBot(`✅ Profil Anda lulus seleksi awal dengan skor <strong>${score}/100</strong>! Silakan pilih jadwal wawancara berikut.`)
    slots.value = generateSlots()
    chatMode.value = 'interview-slots'
  }

  function bookSlot(slot: InterviewSlot) {
    bookedSlot.value = slot
    chatMode.value = 'confirmed'
  }

  function reset() {
    addBot('Wawancara telah dijadwalkan! Ada yang bisa saya bantu lagi? 😊')
    chatMode.value = 'chat'
    appliedJob.value = ''
    answers.value = []
    currentQuestionIndex.value = 0
    scoringPassed.value = null
    bookedSlot.value = null
    slots.value = []
  }

  return {
    messages,
    loading,
    chatMode,
    appliedJob,
    answers,
    currentQuestionIndex,
    currentQuestion,
    totalQuestions,
    scoringPassed,
    scoringScore,
    slots,
    bookedSlot,
    candidateName,
    sendMessage,
    agreeConsent,
    declineConsent,
    submitAnswer,
    bookSlot,
    reset,
  }
}
