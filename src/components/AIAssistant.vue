<template>
  <div class="ai-assistant">
    <div v-if="isMinimized" class="minimize-button" @click="toggleMinimized">
      <el-icon><ChatDotRound /></el-icon>
    </div>
    <el-card v-else class="ai-card" :class="{ 'expanded': isExpanded }">
      <template #header>
        <div class="ai-header">
          <div class="header-left" @click="toggleExpanded">
            <el-icon class="ai-icon"><ChatDotRound /></el-icon>
            <span>AI 学习助手</span>
            <el-icon class="toggle-icon" :class="{ 'rotated': isExpanded }">
              <ArrowDown />
            </el-icon>
          </div>
          <el-icon class="close-icon" @click="toggleMinimized"><Close /></el-icon>
        </div>
      </template>
      
      <div v-if="isExpanded" class="ai-content">
        <div v-if="pageContext" class="context-bar">
          <el-icon><Reading /></el-icon>
          <span class="context-text">
            <b>{{ pageContext.pageName }}</b>
            <template v-if="pageContext.lessonTitle"> - {{ pageContext.lessonTitle }}</template>
          </span>
        </div>

        <div class="chat-messages" ref="messagesContainer">
          <div 
            v-for="message in messages" 
            :key="message.id"
            class="message"
            :class="{ 'user-message': message.type === 'user', 'ai-message': message.type === 'ai' }"
          >
            <div class="message-content">
              <div class="message-text" v-html="message.type === 'ai' ? md.render(message.content) : message.content"></div>
              <div class="message-time">{{ formatTime(message.timestamp) }}</div>
            </div>
          </div>
          
          <div v-if="isTyping" class="message ai-message">
            <div class="message-content">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 建议选项区域 -->
        <div v-if="showSuggestionsEnabled && suggestions.length > 0" class="suggestions-container">
          <h4 class="suggestions-title">您可能还想了解：</h4>
          <div class="suggestions-list">
            <el-tooltip
              v-for="(suggestion, index) in suggestions"
              :key="index"
              :content="suggestion"
              placement="top"
              :disabled="suggestion.length <= 20"
            >
              <el-button
                type="text"
                class="suggestion-item"
                @click="sendMessage(suggestion)"
              >
                {{ suggestion.length > 10 ? suggestion.substring(0, 10) + '...' : suggestion }}
              </el-button>
            </el-tooltip>
          </div>
        </div>
        
        <div class="input-area">
          <el-input
            v-model="inputMessage"
            placeholder="向AI提问..."
            @keyup.enter="sendMessage()"
            :disabled="isTyping"
            class="message-input"
          >
            <template #append>
              <el-button 
                type="primary" 
                @click="sendMessage()"
                :disabled="!inputMessage.trim() || isTyping"
                :loading="isTyping"
              >
                发送
              </el-button>
            </template>
          </el-input>
        </div>
        
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { ChatDotRound, ArrowDown, Close, Reading } from '@element-plus/icons-vue'
import { format } from 'date-fns'
import MarkdownIt from 'markdown-it'
import { cozeChat } from '@/api/coze'
import { usePageContext } from '@/composables/usePageContext'

// 初始化markdown-it
const md = new MarkdownIt()

interface Message {
  id: number
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

const isExpanded = ref(false)
const isMinimized = ref(false)
const inputMessage = ref('')
const isTyping = ref(false)
const messages = ref<Message[]>([])
const messagesContainer = ref<HTMLElement>()
const suggestions = ref<string[]>([])
const showSuggestionsEnabled = ref(true)
let messageId = 0

const { context: pageContext } = usePageContext()


const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

const toggleMinimized = () => {
  isMinimized.value = !isMinimized.value
}

function readAISettings(){
  try{
    const raw = localStorage.getItem('appSettings')
    const s = raw ? JSON.parse(raw) : {}
    showSuggestionsEnabled.value = s.ai?.showSuggestions !== false
  }catch{ showSuggestionsEnabled.value = true }
}

const buildContextPrompt = (): string => {
  const ctx = pageContext.value
  if (!ctx) return ''

  let prompt = `[当前学习上下文]\n`
  prompt += `- 页面：${ctx.pageName}\n`
  if (ctx.lessonTitle) prompt += `- 当前课程：${ctx.lessonTitle}\n`
  if (ctx.lessonStep != null && ctx.lessonTotalSteps != null) {
    prompt += `- 学习进度：第 ${ctx.lessonStep}/${ctx.lessonTotalSteps} 课\n`
  }
  if (ctx.contentSummary) prompt += `- 课程内容摘要：${ctx.contentSummary}\n`
  if (ctx.codeExample) prompt += `- 相关代码示例：\n\`\`\`\n${ctx.codeExample}\n\`\`\`\n`
  prompt += '\n请结合以上上下文回答用户的问题。'
  return prompt
}

const sendMessage = async (message?: string) => {
  const content = message || inputMessage.value.trim()
  if (!content || isTyping.value) return
  
  inputMessage.value = ''
  
  addMessage('user', content)
  
  isTyping.value = true
  suggestions.value = []
  
  const contextMessages: any[] = []

  const contextPrompt = buildContextPrompt()
  if (contextPrompt) {
    contextMessages.push({
      content: contextPrompt,
      content_type: "text",
      role: "user",
      type: "question",
    })
  }

  contextMessages.push(...messages.value
    .filter(m => m.type === 'user' || m.type === 'ai')
    .map((msg) => ({
      content: msg.content,
      content_type: "text",
      role: msg.type === "user" ? "user" : "assistant",
      type: msg.type === "user" ? "question" : "answer",
    }))
  )

  try {
    readAISettings()
    // 调用Coze API，处理流式响应
    const result = await cozeChat(
      {
        messages: contextMessages,
      },
      (update: { type: string; content: string }) => {
        if (update.type === "content") {
          // 更新最后一条AI消息内容，实现打字机效果
          const lastMessage = messages.value[messages.value.length - 1]
          if (lastMessage && lastMessage.type === 'ai') {
            lastMessage.content = update.content
            nextTick(() => {
              scrollToBottom()
            })
          } else {
            // 如果没有AI消息，创建一个新的
            addMessage('ai', update.content)
          }
        }
      }
    )

    // 最终处理
    const lastMessage = messages.value[messages.value.length - 1]
    if (lastMessage && lastMessage.type === 'ai') {
      lastMessage.content = result.content
    }
    suggestions.value = showSuggestionsEnabled.value ? result.suggestions : []
  } catch (error) {
    console.error("API请求失败:", error)
    ElMessage.error('AI助手暂时无法响应，请稍后再试')
    addMessage('ai', '抱歉，请求智能体服务失败，请稍后再试。')
  } finally {
    isTyping.value = false
    nextTick(() => {
      scrollToBottom()
    })
  }
}


const addMessage = (type: 'user' | 'ai', content: string) => {
  messages.value.push({
    id: messageId++,
    type,
    content,
    timestamp: new Date()
  })
  
  nextTick(() => {
    scrollToBottom()
  })
}

const formatTime = (timestamp: Date) => {
  return format(timestamp, "HH:mm:ss")
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

onMounted(() => {
  // 添加欢迎消息
  addMessage('ai', '你好！我是AI学习助手，有什么问题可以随时问我！')
  readAISettings()
  window.addEventListener('storage', (e) => { if (e.key === 'appSettings') readAISettings() })
})
</script>

<style scoped>
.ai-assistant {
  position: fixed;
  bottom: 128px;
  right: 24px;
  width: 450px;
  z-index: 1000;
  transition: all 0.3s ease;
}

.minimize-button {
  position: fixed;
  bottom: 128px;
  right: 24px;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.35);
  transition: all 0.3s ease;
  z-index: 1000;
}

.minimize-button:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 32px rgba(59, 130, 246, 0.45);
}

.minimize-button .el-icon {
  font-size: 28px;
  color: white;
}

.ai-card {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  color: white;
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.25);
  transition: all 0.3s ease;
}

.ai-card.expanded {
  height: 600px;
}

.ai-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-weight: 600;
  user-select: none;
  font-size: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  flex: 1;
}

.close-icon {
  cursor: pointer;
  font-size: 18px;
  transition: transform 0.2s ease;
}

.close-icon:hover {
  transform: scale(1.2);
}

.ai-icon {
  font-size: 20px;
}

.toggle-icon {
  margin-left: auto;
  transition: transform 0.3s ease;
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}

.ai-content {
  height: 500px;
  display: flex;
  flex-direction: column;
}

.context-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  font-size: 12px;
  flex-shrink: 0;
}

.context-text {
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.context-text b {
  color: #fff;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
  max-height: 380px;
}

.message {
  margin-bottom: 16px;
  display: flex;
}

.user-message {
  justify-content: flex-end;
}

.ai-message {
  justify-content: flex-start;
}

.message-content {
  max-width: 85%;
  padding: 14px 18px;
  border-radius: 18px;
  position: relative;
}

.user-message .message-content {
  background: rgba(255, 255, 255, 0.2);
  border-bottom-right-radius: 4px;
}

.ai-message .message-content {
  background: rgba(255, 255, 255, 0.1);
  border-bottom-left-radius: 4px;
}

.message-text {
  line-height: 1.5;
  margin-bottom: 6px;
  font-size: 14px;
}

.message-time {
  font-size: 12px;
  opacity: 0.7;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  align-items: center;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.input-area {
  padding: 20px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.message-input {
  background: rgba(255, 255, 255, 0.1);
  border: none;
}

:deep(.message-input .el-input__wrapper) {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: none;
}

:deep(.message-input .el-input__inner) {
  color: white;
}

:deep(.message-input .el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.7);
}


:deep(.el-card__body) {
  padding: 20px;
}

/* 建议选项样式 */
.suggestions-container {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 18px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.suggestions-title {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 14px;
  font-weight: 600;
}

.suggestions-list {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.suggestion-item {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 8px 18px;
  font-size: 14px;
  white-space: nowrap;
  transition: all 0.2s ease;
  flex-shrink: 0;
  min-width: 0;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.suggestion-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

/* Markdown渲染样式 */
:deep(.message-text) {
  h1, h2, h3, h4, h5, h6 {
    margin: 10px 0;
    font-weight: bold;
    color: white;
  }

  h1 { font-size: 20px; }
  h2 { font-size: 18px; }
  h3 { font-size: 16px; }
  h4 { font-size: 14px; }
  h5 { font-size: 13px; }
  h6 { font-size: 12px; }

  p {
    margin: 8px 0;
    line-height: 1.6;
    color: white;
  }

  ul, ol {
    padding-left: 20px;
    margin: 8px 0;
  }

  li {
    margin: 4px 0;
    color: white;
  }

  pre {
    background: rgba(0, 0, 0, 0.3);
    color: #d4d4d4;
    padding: 12px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 12px 0;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  code {
    background: rgba(0, 0, 0, 0.2);
    color: #f0f0f0;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: "Courier New", monospace;
    font-size: 13px;
  }

  pre code {
    background: transparent;
    padding: 0;
  }

  blockquote {
    border-left: 4px solid rgba(255, 255, 255, 0.3);
    padding-left: 16px;
    margin: 12px 0;
    color: rgba(255, 255, 255, 0.8);
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin: 12px 0;
  }

  table, th, td {
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  th, td {
    padding: 8px;
    text-align: left;
    color: white;
  }

  th {
    background: rgba(255, 255, 255, 0.1);
  }

  a {
    color: #60a5fa;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  hr {
    border: 0;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px 0;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }
}

/* 滚动条样式 */
.chat-messages::-webkit-scrollbar {
  width: 4px;
}

.chat-messages::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 建议选项滚动条样式 */
.suggestions-list::-webkit-scrollbar {
  height: 4px;
}

.suggestions-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.suggestions-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.suggestions-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
