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

    <p class="text-sm font-medium text-gray-800">{{ question.text }}</p>

    <!-- Multi-page upload indicator -->
    <p v-if="question.type === 'Upload Docs' && (question.uploadCount ?? 1) > 1" class="text-xs text-gray-500">
      Halaman {{ uploadPage }} dari {{ question.uploadCount }}
    </p>

    <!-- Upload Docs -->
    <template v-if="question.type === 'Upload Docs'">
      <div
        class="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center gap-3 transition-colors"
        :class="[
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary/40',
          dragOver && !disabled ? 'border-primary/60 bg-primary/5' : '',
        ]"
        @click="!disabled && fileInputRef?.click()"
        @dragover.prevent="!disabled && (dragOver = true)"
        @dragleave="dragOver = false"
        @drop.prevent="!disabled && onDrop($event)"
      >
        <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">📎</div>
        <div class="text-center">
          <p class="text-sm font-medium text-gray-700">Klik atau seret file ke sini</p>
          <p class="text-xs text-gray-400 mt-0.5">Gambar atau PDF, maks 20MB</p>
        </div>
        <p v-if="selectedFile" class="text-xs text-primary font-medium truncate max-w-full px-2">
          ✅ {{ selectedFile.name }}
        </p>
      </div>
      <input ref="fileInputRef" type="file" class="hidden" accept="image/*,.pdf" :disabled="disabled" @change="onFileChange" />
      <p v-if="sizeError" class="text-xs text-red-500">{{ sizeError }}</p>
      <button
        @click="submitFile"
        :disabled="!selectedFile || disabled"
        class="bg-primary text-white rounded-xl py-2.5 text-sm font-medium disabled:opacity-40 hover:bg-primary-dark transition-colors"
      >
        <span v-if="disabled" class="flex items-center justify-center gap-2">
          <span class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Mengirim...
        </span>
        <span v-else>Kirim File →</span>
      </button>
    </template>

    <!-- Boolean / select choices -->
    <template v-else-if="hasChoices">
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="choice in question.choices"
          :key="choice"
          :disabled="disabled"
          @click="!disabled && (selected = choice)"
          :class="[
            'border rounded-xl py-2.5 text-sm transition-colors',
            selected === choice
              ? 'border-primary bg-primary/10 text-primary font-medium'
              : 'border-gray-200 text-gray-700 hover:border-primary/40',
            disabled ? 'opacity-50 cursor-not-allowed' : '',
          ]"
        >
          {{ choice }}
        </button>
      </div>
      <button
        @click="submitSelect"
        :disabled="!selected || disabled"
        class="bg-primary text-white rounded-xl py-2.5 text-sm font-medium disabled:opacity-40 hover:bg-primary-dark transition-colors"
      >
        Lanjut →
      </button>
    </template>

    <!-- Text / Number / Date input -->
    <template v-else>
      <div class="flex gap-2">
        <input
          ref="inputRef"
          v-model="inputValue"
          @keydown.enter="!disabled && submit()"
          :type="inputType"
          :inputmode="inputMode"
          :placeholder="placeholder"
          :disabled="disabled"
          class="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          @click="submit"
          :disabled="!canSubmit || disabled"
          class="bg-primary text-white rounded-xl px-4 text-sm font-medium disabled:opacity-40 hover:bg-primary-dark transition-colors"
        >
          →
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { WebQuestion } from '~/types/chat'

const props = defineProps<{
  question: WebQuestion
  index: number
  total: number
  uploadPage?: number
  disabled?: boolean
}>()

const emit = defineEmits<{
  submit: [answer: string]
  upload: [file: File]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const inputValue = ref('')
const selected = ref('')
const selectedFile = ref<File | null>(null)
const dragOver = ref(false)
const sizeError = ref('')

const hasChoices = computed(() => (props.question.choices?.length ?? 0) > 0)

// Always text — Number fields use inputmode="numeric" to preserve leading zeros (e.g. NIK)
const inputType = 'text'

const inputMode = computed<'text' | 'numeric'>(() =>
  props.question.type === 'Number' ? 'numeric' : 'text'
)

const placeholder = computed(() => {
  const t = props.question.text.toLowerCase()
  if (t.includes('telepon') || t.includes('hp') || t.includes('phone')) return '08xxxxxxxxxx'
  if (t.includes('lahir') || t.includes('tanggal')) return 'DD/MM/YYYY'
  if (t.includes('nik') || t.includes('ktp')) return '16 digit NIK/KTP Anda'
  if (t.includes('umur') || t.includes('usia')) return 'Contoh: 25'
  return 'Ketik jawaban Anda...'
})

const canSubmit = computed(() => inputValue.value.trim().length > 0)

function submit() {
  if (inputValue.value.trim()) emit('submit', inputValue.value.trim())
}

function submitSelect() {
  if (selected.value) emit('submit', selected.value)
}

function validateFile(file: File): boolean {
  sizeError.value = ''
  if (file.size > 20 * 1024 * 1024) {
    sizeError.value = 'Ukuran file maksimal 20MB'
    return false
  }
  return true
}

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file && validateFile(file)) selectedFile.value = file
}

function onDrop(e: DragEvent) {
  dragOver.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file && validateFile(file)) selectedFile.value = file
}

function submitFile() {
  if (selectedFile.value) emit('upload', selectedFile.value)
}

watch(
  () => props.question,
  () => {
    inputValue.value = ''
    selected.value = ''
    selectedFile.value = null
    sizeError.value = ''
    nextTick(() => inputRef.value?.focus())
  },
)

onMounted(() => {
  if (props.question.type !== 'Upload Docs' && !hasChoices.value) {
    nextTick(() => inputRef.value?.focus())
  }
})
</script>
