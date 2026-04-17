interface ChatRequestBody {
  message: string
  sessionId: string
}

interface ChatApiResponse {
  reply: string
}

export default defineEventHandler(async (event): Promise<ChatApiResponse> => {
  const config = useRuntimeConfig()
  const body = await readBody<ChatRequestBody>(event)

  try {
    const res = await $fetch<ChatApiResponse>(`${config.public.apiBaseUrl}/api/web/chat`, {
      method: 'POST',
      body: { message: body.message, sessionId: body.sessionId },
    })
    return res
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Backend unavailable'
    throw createError({ statusCode: 500, statusMessage: message })
  }
})
