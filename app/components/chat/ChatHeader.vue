<template>
  <header class="w-full py-3 px-6 border-b border-gray-100 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <span class="text-xl font-bold text-gray-800">
        Hire<span class="text-primary">AI</span>
      </span>
    </div>
    <NuxtLink to="/" class="text-sm text-gray-500 hover:text-gray-700 transition-colors">
      &larr; Back to Home
    </NuxtLink>
  </header>
</template>
