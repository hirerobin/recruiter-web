import type { WebApiResponse } from '~/types/chat'

export default defineEventHandler(async (event): Promise<WebApiResponse> => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const sessionId = String(query.sessionId ?? '')

  if (!sessionId) return { state: 'candidate_asking', messages: [] }

  try {
    return await $fetch<WebApiResponse>(`${config.public.apiBaseUrl}/api/web/state/${sessionId}`)
  } catch {
    return { state: 'candidate_asking', messages: [] }
  }
})
