<template>
  <div class="admin-agent">
    <div class="agent-messages" ref="listRef">
      <div v-for="m in messages" :key="m.id" class="row" :class="m.role">
        <div class="bubble" v-html="m.html"></div>
      </div>
    </div>
    <div class="agent-input">
      <el-input v-model="input" placeholder="向 网站开发者-陈刚 智能体提问..." @keyup.enter.native="send" :disabled="loading" />
      <el-button type="primary" :loading="loading" @click="send">发送</el-button>
    </div>
    <div v-if="suggestions.length" class="agent-suggest">
      <span class="label">你可能想问：</span>
      <el-tag
        v-for="(s, i) in suggestions"
        :key="i"
        class="sug"
        effect="plain"
        @click="quickAsk(s)"
      >{{ s }}</el-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import MarkdownIt from 'markdown-it'
import { cozeChat } from '@/api/coze'

const BOT_ID = '7552422867259179059'
const md = new MarkdownIt()

interface Msg { id: number; role: 'user' | 'ai'; html: string; text: string }
const messages = ref<Msg[]>([])
const input = ref('')
const loading = ref(false)
const listRef = ref<HTMLElement>()
let id = 0
const suggestions = ref<string[]>([])

const scrollToBottom = () => {
  nextTick(() => {
    if (listRef.value) listRef.value.scrollTop = listRef.value.scrollHeight
  })
}

const send = async () => {
  if (!input.value.trim() || loading.value) return
  const content = input.value.trim()
  input.value = ''
  messages.value.push({ id: ++id, role: 'user', text: content, html: md.render(content) })
  loading.value = true
  scrollToBottom()

  // 组装上下文
  const context = messages.value.map(m => ({
    content: m.text,
    content_type: 'text',
    role: m.role === 'user' ? 'user' : 'assistant',
    type: m.role === 'user' ? 'question' : 'answer'
  }))

  // 预占位AI消息
  const aiId = ++id
  messages.value.push({ id: aiId, role: 'ai', text: '', html: '' })

  try {
    const result = await cozeChat({ messages: context, botId: BOT_ID }, (u) => {
      const ai = messages.value.find(m => m.id === aiId)
      if (ai) {
        ai.text = u.content
        ai.html = md.render(u.content)
        scrollToBottom()
      }
    })
    suggestions.value = result?.suggestions || []
  } finally {
    loading.value = false
  }
}

const quickAsk = (q: string) => {
  input.value = q
  send()
}
</script>

<style scoped>
.admin-agent {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.agent-messages {
  height: 420px;
  overflow: auto;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  background: #fff;
}
.row { display: flex; margin-bottom: 12px; }
.row.user { justify-content: flex-end; }
.row.ai { justify-content: flex-start; }
.bubble {
  max-width: 70%;
  padding: 10px 12px;
  border-radius: 12px;
  background: #f3f4f6;
}
.row.user .bubble { background: #e0e7ff; }
.agent-input { display: flex; gap: 8px; }
.agent-suggest { display:flex; align-items:center; gap:8px; flex-wrap: wrap; }
.agent-suggest .label { color:#6b7280; font-size: 13px; }
.agent-suggest .sug { cursor: pointer; }
.dark .agent-messages { background: #111827; border-color: #374151; }
.dark .bubble { background: #1f2937; color: #e5e7eb; }
.dark .row.user .bubble { background: #312e81; }
</style>


