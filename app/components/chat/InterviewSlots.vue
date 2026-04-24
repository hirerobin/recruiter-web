<template>
  <div class="flex flex-col gap-4 w-full max-w-[380px]">
    <p class="text-sm font-medium text-gray-800">Pilih jadwal wawancara:</p>

    <div v-for="group in slotGroups" :key="group.date" class="flex flex-col gap-2">
      <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">{{ group.dayLabel }}</p>
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="slot in group.slots"
          :key="slot.time"
          @click="$emit('book', slot)"
          class="border border-gray-200 rounded-xl py-2 text-xs text-gray-700 font-medium hover:border-primary hover:bg-primary/5 hover:text-primary transition-colors"
        >
          {{ slot.time }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { InterviewSlot } from '~/types/chat'

const props = defineProps<{ slots: InterviewSlot[] }>()
defineEmits<{ book: [slot: InterviewSlot] }>()

const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

const slotGroups = computed(() => {
  const groups: Record<string, { date: string; dayLabel: string; slots: InterviewSlot[] }> = {}
  for (const slot of props.slots) {
    if (!groups[slot.date]) {
      const d = new Date(slot.date + 'T00:00:00')
      groups[slot.date] = {
        date: slot.date,
        dayLabel: `${dayNames[d.getDay()]}, ${d.getDate()} ${monthNames[d.getMonth()]}`,
        slots: [],
      }
    }
    groups[slot.date]!.slots.push(slot)
  }
  return Object.values(groups)
})
</script>
