<template>
  <div class="wrong-questions-page">
    <div class="wq-container">
      <div class="wq-header">
        <el-button text @click="router.back()"><el-icon><ArrowLeft /></el-icon>返回</el-button>
        <h2>📌 我的错题本</h2>
        <span class="wq-count">共 {{ questions.length }} 道错题</span>
      </div>

      <div v-if="loading" class="loading-wrap"><el-skeleton :rows="4" animated /></div>

      <div v-else-if="questions.length === 0" class="empty-state">
        <p>还没有错题记录</p>
        <p class="sub-hint">AI出题做错后点击"加入错题本"即可收藏</p>
        <el-button type="primary" @click="$router.push('/learn')">去练习</el-button>
      </div>

      <div v-else class="wq-list">
        <div v-for="q in questions" :key="q.id" class="wq-card">
          <div class="wq-card-top">
            <el-tag size="small" :type="isAiQuestion(q) ? 'warning' : 'danger'">
              {{ isAiQuestion(q) ? '🤖 AI题目' : '💻 练习题' }}
            </el-tag>
            <el-tag size="small">{{ courseNameMap[q.courseKey] || q.courseKey }}</el-tag>
            <span v-if="q.lessonStep && !isAiQuestion(q)" class="step-label">第 {{ q.lessonStep }} 课</span>
            <span class="time">{{ formatTime(q.createdAt) }}</span>
          </div>

          <h3 v-if="q.lessonTitle" class="wq-title">{{ q.lessonTitle }}</h3>

          <!-- AI题目展开区域 -->
          <template v-if="isAiQuestion(q)">
            <el-collapse-transition>
              <div v-show="expandedId === q.id" class="ai-detail">
                <div v-if="aiData(q).question" class="ai-section">
                  <h5>📋 题目：</h5>
                  <p>{{ aiData(q).question }}</p>
                </div>
                <div v-if="aiData(q).fullCode" class="ai-section">
                  <h5>💻 代码框架：</h5>
                  <pre class="code-block"><code>{{ aiData(q).fullCode }}</code></pre>
                </div>
                <div v-if="aiData(q).keyPoints?.length" class="ai-section">
                  <h5>🔑 知识点：</h5>
                  <div class="key-points">
                    <el-tag v-for="kp in aiData(q).keyPoints" :key="kp" size="small">{{ kp }}</el-tag>
                  </div>
                </div>
              </div>
            </el-collapse-transition>
          </template>

          <!-- 笔记/答题信息 -->
          <div v-if="q.note" class="wq-note" @click="toggleExpand(q.id)">
            <span class="note-toggle">{{ expandedId === q.id ? '▼' : '▶' }} 点击{{ expandedId === q.id ? '收起' : '展开' }}详情</span>
          </div>

          <div class="wq-actions">
            <el-button size="small" type="primary" @click="goRetry(q)">
              <el-icon><RefreshRight /></el-icon> 重做
            </el-button>
            <el-button
              v-if="isAiQuestion(q)"
              size="small"
              text
              @click="toggleExpand(q.id)"
            >
              {{ expandedId === q.id ? '收起详情' : '查看详情' }}
            </el-button>
            <el-button size="small" text type="danger" @click="handleDelete(q)">删除</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { RefreshRight, ArrowLeft } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { getWrongQuestions, deleteWrongQuestion } from '@/api/wrongQuestion'
import type { WrongQuestionItem } from '@/api/wrongQuestion'

const router = useRouter()
const userStore = useUserStore()
const questions = ref<WrongQuestionItem[]>([])
const loading = ref(false)
const expandedId = ref<number | null>(null)

const courseNameMap: Record<string, string> = {
  html: 'HTML 基础', css: 'CSS 样式', javascript: 'JavaScript',
  vue3: 'Vue3 框架', react: 'React 框架', typescript: 'TypeScript', tailwindcss: 'TailwindCSS'
}

function formatTime(time: string) {
  const d = new Date(time)
  return `${d.getMonth() + 1}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function isAiQuestion(q: WrongQuestionItem): boolean {
  if (!q.wrongCode) return false
  try {
    const parsed = JSON.parse(q.wrongCode)
    return !!parsed.question || !!parsed.fullCode
  } catch {
    return false
  }
}

function aiData(q: WrongQuestionItem): Record<string, any> {
  try {
    return JSON.parse(q.wrongCode)
  } catch {
    return {}
  }
}

function toggleExpand(id: number) {
  expandedId.value = expandedId.value === id ? null : id
}

async function load() {
  if (!userStore.userInfo?.userId) return
  loading.value = true
  try {
    const res: any = await getWrongQuestions(userStore.userInfo.userId)
    questions.value = res?.data || []
  } finally {
    loading.value = false
  }
}

function goRetry(q: WrongQuestionItem) {
  if (isAiQuestion(q)) {
    const payload = btoa(encodeURIComponent(JSON.stringify({
      wrongCode: q.wrongCode,
      note: q.note,
      lessonTitle: q.lessonTitle
    })))
    router.push({
      name: 'wrong-question-practice',
      query: { data: payload }
    })
  } else {
    const routeMap: Record<string, string> = {
      html: 'exercise-html', css: 'exercise-css', javascript: 'exercise-js'
    }
    const name = routeMap[q.courseKey] || 'exercise-html'
    const step = q.lessonStep || 1
    router.push({
      name,
      params: { step },
      query: { title: q.lessonTitle || '' }
    })
  }
}

async function handleDelete(q: WrongQuestionItem) {
  await ElMessageBox.confirm('确定删除这条错题记录吗？', '提示', { type: 'warning' })
  try {
    await deleteWrongQuestion(q.id)
    ElMessage.success('已删除')
    load()
  } catch {}
}

onMounted(load)
</script>

<style scoped>
.wrong-questions-page { min-height: 0; height: 100%; background: #f5f7fa; padding: 24px; overflow-y: auto; }
.dark .wrong-questions-page { background: #111827; }
.wq-container { max-width: 960px; margin: 0 auto; }

.wq-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}
.wq-header h2 { margin: 0; font-size: 24px; color: #1f2937; }
.dark .wq-header h2 { color: #e5e7eb; }
.wq-count { font-size: 14px; color: #9ca3af; }

.loading-wrap, .empty-state { text-align: center; padding: 60px 20px; color: #9ca3af; }
.empty-state p { font-size: 16px; margin-bottom: 8px; }
.sub-hint { font-size: 13px; color: #b0b8c4; margin-bottom: 20px !important; }

.wq-list { display: flex; flex-direction: column; gap: 14px; }

.wq-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 18px 20px;
}
.dark .wq-card { background: #1f2937; border-color: #374151; }

.wq-card-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}
.step-label { font-size: 13px; color: #6b7280; font-weight: 500; }
.time { font-size: 12px; color: #9ca3af; margin-left: auto; }

.wq-title {
  font-size: 15px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 10px 0;
}
.dark .wq-title { color: #e5e7eb; }

.ai-detail {
  background: #fefce8;
  border-radius: 8px;
  padding: 16px;
  margin: 10px 0;
}
.dark .ai-detail { background: rgba(254, 252, 232, 0.08); }
.ai-section { margin-bottom: 12px; }
.ai-section:last-child { margin-bottom: 0; }
.ai-section h5 {
  margin: 0 0 6px 0;
  font-size: 13px;
  color: #92400e;
}
.dark .ai-section h5 { color: #d97706; }
.ai-section p {
  margin: 0;
  font-size: 13px;
  color: #78350f;
  line-height: 1.6;
  white-space: pre-wrap;
}
.dark .ai-section p { color: #d1d5db; }

.code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 12px 14px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.5;
  overflow-x: auto;
  margin: 0;
}
.key-points { display: flex; flex-wrap: wrap; gap: 6px; }

.wq-note {
  cursor: pointer;
  padding: 8px 12px;
  background: #fef3c7;
  border-radius: 6px;
  border-left: 3px solid #f59e0b;
  margin: 10px 0;
}
.dark .wq-note { background: rgba(251, 191, 36, 0.15); }
.note-toggle {
  font-size: 13px;
  color: #92400e;
  font-weight: 500;
}
.dark .note-toggle { color: #d97706; }

.wq-actions { display: flex; gap: 4px; justify-content: flex-end; margin-top: 10px; }
</style>
