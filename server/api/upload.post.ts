import type { WebApiResponse } from '~/types/chat'

export default defineEventHandler(async (event): Promise<WebApiResponse> => {
  const config = useRuntimeConfig()
  const parts = await readMultipartFormData(event)

  const form = new FormData()
  for (const part of parts ?? []) {
    if (part.name === 'file' && part.filename) {
      form.append('file', new Blob([part.data], { type: part.type ?? 'application/octet-stream' }), part.filename)
    } else if (part.name) {
      form.append(part.name, new TextDecoder().decode(part.data))
    }
  }

  try {
    return await $fetch<WebApiResponse>(`${config.public.apiBaseUrl}/api/web/upload`, {
      method: 'POST',
      body: form,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Backend unavailable'
    throw createError({ statusCode: 500, statusMessage: message })
  }
})
