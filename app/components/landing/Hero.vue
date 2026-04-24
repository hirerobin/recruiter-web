<template>
  <section class="flex flex-col items-center text-center px-[32px] md:px-6 py-10 md:py-16">
    <!-- Badge -->
    <div class="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 md:mb-8">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      <span>Rekrutmen Berbasis AI</span>
    </div>

    <!-- Illustration (mobile only) -->
    <div class="md:hidden mb-6">
      <img src="/images/mascot.svg" alt="AI Recruitment Mascot" class="w-[193px] h-[194px] mx-auto object-contain" />
    </div>

    <!-- Heading -->
    <h1 class="text-[28px] md:text-[40px] font-bold text-gray-900 leading-tight mb-4 md:mb-6 max-w-2xl">
      Temukan Pekerjaan Impian Anda
    </h1>

    <!-- Description -->
    <p class="text-gray-500 text-sm md:text-lg leading-relaxed max-w-xl mb-8 md:mb-10">
      Biarkan asisten cerdas kami membantu Anda menemukan peluang yang sesuai
      dengan keterampilan, pengalaman, dan tujuan karir Anda. Mulailah perjalanan
      Anda menuju kesuksesan hari ini.
    </p>

    <!-- CTA Button -->
    <NuxtLink
      to="/chat"
      class="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-4 rounded-[14px] md:rounded-full text-base transition-all hover:shadow-lg w-full md:w-auto justify-center"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <span class="md:hidden">Mulai Mengobrol</span>
      <span class="hidden md:inline">Mulai Percakapan dengan AI</span>
    </NuxtLink>
  </section>
</template>
