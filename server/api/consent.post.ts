import type { WebApiResponse } from '~/types/chat'

export default defineEventHandler(async (event): Promise<WebApiResponse> => {
  const config = useRuntimeConfig()
  const body = await readBody<{ action: 'agree' | 'decline'; sessionId: string }>(event)

  try {
    return await $fetch<WebApiResponse>(`${config.public.apiBaseUrl}/api/web/consent`, {
      method: 'POST',
      body,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Backend unavailable'
    throw createError({ statusCode: 500, statusMessage: message })
  }
})
