import { useUserStore } from '@/stores/user'

export async function cozeChat(
  params: { messages: any[]; botId?: string },
  callback: (update: { type: string; content: string }) => void
) {
  const suggestions: string[] = []

  try {
    const userStore = useUserStore()
    const token = userStore.token

    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch('/api/ai/chat/stream', {
      method: 'POST',
      headers,
      body: JSON.stringify({ messages: params.messages }),
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const reader = response.body!.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let accumulatedContent = ''
    let currentEvent = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const raw = line
        if (raw.startsWith('event:')) {
          currentEvent = raw.substring(6).trim()
        } else if (raw.startsWith('data:')) {
          let data = raw.substring(5)
          if (data.startsWith(' ')) data = data.substring(1)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)

            if (currentEvent === 'content' && parsed.content != null) {
              accumulatedContent += parsed.content
              callback({ type: 'content', content: accumulatedContent })
            } else if (currentEvent === 'suggestion' && parsed.suggestion) {
              suggestions.push(parsed.suggestion)
            } else if (currentEvent === 'error' && parsed.msg) {
              throw new Error(`Coze API错误: ${parsed.msg}`)
            }
          } catch (e) {
            if ((e as Error).message.includes('Coze')) throw e
          }
        }
      }
    }

    return { content: accumulatedContent, suggestions }
  } catch (error) {
    console.error("AI聊天请求失败:", error)
    throw error
  }
}
