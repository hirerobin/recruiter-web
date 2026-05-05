<template>
  <div class="fixed inset-0 bg-[#f5f5f5] flex flex-col overflow-hidden">
    <ChatHeader />

    <!-- Messages area -->
    <div ref="messagesRef" class="flex-1 overflow-y-auto pt-6 md:pt-8 px-4 md:px-[87.5px]">
      <div class="flex flex-col gap-6 max-w-[896px] pb-4">
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

        <!-- Suggested prompts (only initial chat state) -->
        <div v-if="messages.length <= 1 && chatMode === 'chat'" class="flex flex-col gap-3 mt-2">
          <p class="text-[10px] font-semibold uppercase tracking-[0.8px] text-[#6b7280]">Coba tanyakan:</p>
          <div class="grid gap-[8px] w-full md:w-[448px]">
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

        <!-- FSM: Consent -->
        <ChatBubble v-if="chatMode === 'consent'">
          <ConsentCard :job-title="appliedJob" @agree="agreeConsent" @decline="declineConsent" />
        </ChatBubble>

        <!-- FSM: Data collection / file upload -->
        <ChatBubble v-if="(chatMode === 'data-collection' || chatMode === 'file-upload') && currentQuestion">
          <QuestionCard
            :key="`${questionIndex}-${uploadPage}`"
            :question="currentQuestion"
            :index="questionIndex"
            :total="totalQuestions"
            :upload-page="uploadPage"
            :disabled="loading"
            @submit="submitAnswer"
            @upload="uploadFile"
          />
        </ChatBubble>

        <!-- FSM: Scoring animation -->
        <ChatBubble v-if="chatMode === 'scoring'">
          <ScoringCard :passed="passed" :score="score" />
        </ChatBubble>

        <!-- FSM: Pass — interview link -->
        <ChatBubble v-if="chatMode === 'pass'">
          <PassCard :interview-url="interviewUrl" @restart="resetChat" />
        </ChatBubble>

        <!-- FSM: Fail — restart button -->
        <ChatBubble v-if="chatMode === 'fail'">
          <div class="flex flex-col items-center gap-3 py-2 w-full max-w-[380px]">
            <button
              @click="resetChat"
              class="bg-gray-100 text-gray-700 rounded-xl py-2.5 px-6 text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Lihat lowongan lain
            </button>
          </div>
        </ChatBubble>

        <!-- FSM: Interview completed -->
        <ChatBubble v-if="chatMode === 'interview-completed'">
          <InterviewCompleteCard @restart="resetChat" />
        </ChatBubble>
      </div>
    </div>

    <!-- Input: only in free-chat mode -->
    <ChatInput
      v-if="chatMode === 'chat'"
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
import ConsentCard from '~/components/chat/ConsentCard.vue'
import QuestionCard from '~/components/chat/QuestionCard.vue'
import ScoringCard from '~/components/chat/ScoringCard.vue'
import PassCard from '~/components/chat/PassCard.vue'
import InterviewCompleteCard from '~/components/chat/InterviewCompleteCard.vue'
import type { Prompt } from '~/types/chat'

definePageMeta({ layout: false })

const {
  messages, loading,
  chatMode, appliedJob, currentQuestion, questionIndex, totalQuestions,
  uploadPage, score, passed, interviewUrl,
  sendMessage, agreeConsent, declineConsent, submitAnswer, uploadFile, resetChat,
} = useChat()

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
    title: 'Tampilkan posisi yang tersedia',
    description: 'Saring pekerjaan berdasarkan lokasi dan peran',
  },
]

function formatMessage(content: string): string {
  if (!content) return ''
  return content
    .replaceAll('\n', '<br>')
    .replaceAll(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
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
      messagesRef.value.scrollTo({ top: messagesRef.value.scrollHeight, behavior: 'smooth' })
    }
  })
}

watch(() => messages.value.length, () => scrollToBottom())
watch(chatMode, () => scrollToBottom())
watch(passed, () => scrollToBottom())

useHead({ title: 'Chat — HireAI' })
</script>
