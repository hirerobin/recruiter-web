<template>
  <div class="flex flex-col gap-4 w-full max-w-[380px]">
    <!-- Progress -->
    <div class="flex items-center gap-2">
      <span class="text-xs text-gray-400 shrink-0">{{ index + 1 }} / {{ total }}</span>
      <div class="flex-1 bg-gray-100 rounded-full h-1.5">
        <div
          class="bg-primary h-1.5 rounded-full transition-all duration-500"
          :style="{ width: `${((index + 1) / total) * 100}%` }"
        />
      </div>
    </div>

    <p class="text-sm font-medium text-gray-800">{{ question.question }}</p>

    <!-- Select options -->
    <div v-if="question.type === 'select'" class="grid grid-cols-2 gap-2">
      <button
        v-for="choice in question.choices"
        :key="choice"
        @click="selected = choice"
        :class="[
          'border rounded-xl py-2.5 text-sm transition-colors',
          selected === choice
            ? 'border-primary bg-primary/10 text-primary font-medium'
            : 'border-gray-200 text-gray-700 hover:border-primary/40',
        ]"
      >
        {{ choice }}
      </button>
    </div>

    <!-- Text input -->
    <div v-else class="flex gap-2">
      <input
        ref="inputRef"
        v-model="inputValue"
        @keydown.enter="submit"
        :placeholder="placeholder"
        class="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
      />
      <button
        @click="submit"
        :disabled="!canSubmit"
        class="bg-primary text-white rounded-xl px-4 text-sm font-medium disabled:opacity-40 hover:bg-primary-dark transition-colors"
      >
        →
      </button>
    </div>

    <button
      v-if="question.type === 'select'"
      @click="submitSelect"
      :disabled="!selected"
      class="bg-primary text-white rounded-xl py-2.5 text-sm font-medium disabled:opacity-40 hover:bg-primary-dark transition-colors"
    >
      Lanjut →
    </button>
  </div>
</template>

<script setup lang="ts">
interface Question {
  question: string
  type: 'text' | 'select'
  choices?: string[]
}

const props = defineProps<{ question: Question; index: number; total: number }>()
const emit = defineEmits<{ submit: [answer: string] }>()

const inputRef = ref<HTMLInputElement | null>(null)
const inputValue = ref('')
const selected = ref('')

const placeholder = computed(() => {
  const q = props.question.question.toLowerCase()
  if (q.includes('telepon')) return '08xxxxxxxxxx'
  if (q.includes('lahir')) return 'DD/MM/YYYY'
  if (q.includes('nik')) return '16 digit NIK Anda'
  return 'Ketik jawaban Anda...'
})

const canSubmit = computed(() => inputValue.value.trim().length > 0)

function submit() {
  if (inputValue.value.trim()) emit('submit', inputValue.value.trim())
}

function submitSelect() {
  if (selected.value) emit('submit', selected.value)
}

watch(
  () => props.question,
  () => {
    inputValue.value = ''
    selected.value = ''
    nextTick(() => inputRef.value?.focus())
  },
)

onMounted(() => {
  if (props.question.type === 'text') nextTick(() => inputRef.value?.focus())
})
</script>
