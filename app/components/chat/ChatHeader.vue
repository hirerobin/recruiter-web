<template>
  <header class="h-16 w-full bg-white border-b border-black/10 flex items-center px-8 shrink-0">
    <div class="flex items-center gap-2.5">
      <div class="w-10 h-10 bg-primary rounded-[10px] flex items-center justify-center">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <span class="text-xl font-bold tracking-[-0.3px] font-syne text-[#212121]">
        Hire<span class="text-primary">AI</span>
      </span>
    </div>
    <NuxtLink
      to="/"
      class="ml-auto text-sm font-medium text-[#6b7280] hover:text-[#212121] transition-colors"
    >
      ← Back to Home
    </NuxtLink>
  </header>
</template>
