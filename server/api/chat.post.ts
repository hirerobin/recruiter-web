export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  try {
    // Proxy to recruiter-ai backend
    const res = await $fetch(`${config.public.apiBaseUrl}/api/web/chat`, {
      method: 'POST',
      body: { message: body.message },
    })
    return res
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Backend unavailable',
    })
  }
})
