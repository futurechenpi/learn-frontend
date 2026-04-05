<template>
  <div class="mastered-page">
    <div class="mastered-container">
      <header class="page-header">
        <div class="header-left">
          <el-button @click="router.back()" class="back-btn">
            <el-icon><ArrowLeft /></el-icon>
            <span>返回</span>
          </el-button>
          <div class="title-group">
            <h2>🎉 已掌握的题目</h2>
            <p class="subtitle">这些是你已经完全掌握的题目！继续保持！</p>
          </div>
        </div>
        <div v-if="masteredList.length > 0" class="header-right">
          <span class="count-badge success">共 {{ masteredList.length }} 道已掌握</span>
        </div>
      </header>

      <div v-if="loading" class="loading-wrap">
        <el-skeleton :rows="5" animated />
      </div>

      <div v-else-if="masteredList.length === 0" class="empty-state">
        <el-icon :size="80" color="#d1d5db"><Trophy /></el-icon>
        <h3>还没有已掌握的题目</h3>
        <p class="sub-hint">
          当你在错题重做中完全答对一道题并选择移除时<br>
          该题会自动出现在这里
        </p>
        <el-button type="primary" @click="$router.push('/wrong-questions')">
          前往错题本练习
        </el-button>
      </div>

      <div v-else class="mastered-list">
        <div v-for="(item, index) in masteredList" :key="item.id" class="mastered-card">
          <div class="card-header">
            <span class="card-index">#{{ index + 1 }}</span>
            <el-tag size="small" type="success" effect="dark">✓ 已掌握</el-tag>
            <span class="attempts-badge">
              第 {{ item.attempts || 1 }} 次尝试
              <el-icon><Medal /></el-icon>
            </span>
            <span class="time">{{ formatTime(item.masteredAt) }}</span>
          </div>

          <div class="card-body">
            <div class="question-section">
              <h4>📋 题目：</h4>
              <p>{{ getQuestionFromWrongCode(item) }}</p>
            </div>

            <div v-if="getKeyPointsFromWrongCode(item).length > 0" class="points-section">
              <h4>🔑 知识点：</h4>
              <div class="points-tags">
                <el-tag v-for="kp in getKeyPointsFromWrongCode(item)" :key="kp" size="small" type="info">
                  {{ kp }}
                </el-tag>
              </div>
            </div>

            <div v-if="item.note" class="answer-section">
              <h4>📝 作答记录：</h4>
              <div class="note-preview">{{ item.note.slice(0, 200) }}{{ item.note.length > 200 ? '...' : '' }}</div>
            </div>

            <details v-if="item.wrongCode" class="code-section">
              <summary>💻 查看完整笔记</summary>
              <pre class="note-full"><code>{{ item.note }}</code></pre>
            </details>
          </div>

          <div class="card-footer">
            <span class="stats">
              掌握于：{{ formatFullTime(item.masteredAt) }}
            </span>
            <el-button size="small" type="danger" text @click="handleRemove(item, index)">
              从历史中移除
            </el-button>
          </div>
        </div>
      </div>

      <div v-if="masteredList.length > 0" class="footer-actions">
        <el-button type="danger" plain @click="clearAllHistory">
          🗑️ 清空所有历史记录
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Trophy, Medal, CircleCheckFilled } from '@element-plus/icons-vue'
import { getMasteredQuestions, deleteMasteredQuestion, clearAllMastered, type WrongQuestionItem } from '@/api/wrongQuestion'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const masteredList = ref<WrongQuestionItem[]>([])

onMounted(() => {
  loadMasteredHistory()
})

async function loadMasteredHistory() {
  if (!userStore.userInfo?.userId) return
  loading.value = true
  try {
    const res: any = await getMasteredQuestions(userStore.userInfo.userId)
    masteredList.value = res.data || []
  } catch (e) {
    console.error('加载已掌握历史失败', e)
    masteredList.value = []
  } finally {
    loading.value = false
  }
}

function isAnswerCorrect(item: WrongQuestionItem, index: number): boolean {
  try {
    const codeData = typeof item.wrongCode === 'string' ? JSON.parse(item.wrongCode) : item.wrongCode
    if (!codeData.answer || !Array.isArray(codeData.answer)) return false
    
    const noteMatch = item.note.match(/答案 \d+：([^\n✓✗]+)/g)
    if (noteMatch && noteMatch[index]) {
      const userAns = noteMatch[index].replace(/答案 \d+：/, '').trim().toLowerCase()
      const correctAns = codeData.answer[index]?.trim().toLowerCase()
      return userAns === correctAns
    }
    return false
  } catch {
    return false
  }
}

function formatTime(isoString: string | null): string {
  if (!isoString) return ''
  const d = new Date(isoString)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function formatFullTime(isoString: string | null): string {
  if (!isoString) return ''
  return new Date(isoString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getQuestionFromWrongCode(item: WrongQuestionItem): string {
  try {
    const codeData = typeof item.wrongCode === 'string' ? JSON.parse(item.wrongCode) : item.wrongCode
    return codeData.question || item.lessonTitle || '未知题目'
  } catch {
    return item.lessonTitle || '未知题目'
  }
}

function getKeyPointsFromWrongCode(item: WrongQuestionItem): string[] {
  try {
    const codeData = typeof item.wrongCode === 'string' ? JSON.parse(item.wrongCode) : item.wrongCode
    return Array.isArray(codeData.keyPoints) ? codeData.keyPoints : []
  } catch {
    return []
  }
}

function getUserAnswersFromNote(note: string): string[] {
  const answers: string[] = []
  const matches = note.match(/答案 \d+：([^\n✓✗]+)/g)
  if (matches) {
    matches.forEach(m => {
      answers.push(m.replace(/答案 \d+：/, '').trim())
    })
  }
  return answers.length > 0 ? answers : ['(详见笔记)']
}

async function handleRemove(item: WrongQuestionItem, index: number) {
  try {
    await ElMessageBox.confirm(
      `确定要从已掌握历史中移除这道题吗？\n\n"${getQuestionFromWrongCode(item).slice(0, 50)}..."`,
      '确认移除',
      { type: 'warning', confirmButtonText: '确定移除', cancelButtonText: '保留' }
    )
  } catch {
    return
  }

  try {
    await deleteMasteredQuestion(item.id)
    masteredList.value.splice(index, 1)
    ElMessage.success('已从历史中移除')
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message || '移除失败，请重试')
  }
}

async function clearAllHistory() {
  try {
    await ElMessageBox.confirm(
      '确定要清空所有已掌握的历史记录吗？\n此操作不可恢复！',
      '确认清空',
      { type: 'warning', confirmButtonText: '确定清空', cancelButtonText: '取消' }
    )
  } catch {
    return
  }

  try {
    await clearAllMastered()
    masteredList.value = []
    ElMessage.success('已清空所有历史记录')
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message || '清空失败，请重试')
  }
}
</script>

<style scoped>
.mastered-page {
  height: 100%;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  overflow-y: auto;
}
.dark .mastered-page { background: linear-gradient(135deg, #064e3b 0%, #065f46 100%); }

.mastered-container {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px;
  min-height: calc(100vh - 64px);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(22, 163, 74, 0.15);
  margin-bottom: 28px;
}
.dark .page-header { background: #064e3b; border: 1px solid #047857; }

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}
.back-btn:hover {
  background: #f0fdf4;
  color: #16a34a;
  transform: translateX(-2px);
}
.dark .back-btn:hover { background: #047857; }

.title-group h2 {
  margin: 0;
  font-size: 24px;
  color: #166534;
}
.dark .title-group h2 { color: #86efac; }

.subtitle {
  color: #15803d;
  font-size: 0.875rem;
  margin: 4px 0 0 0;
}
.dark .subtitle { color: #a7f3d0; }

.header-right {
  display: flex;
  align-items: center;
}

.count-badge.success {
  padding: 8px 18px;
  background: linear-gradient(135deg, #bbf7d0, #86efac);
  color: #166534;
  border-radius: 20px;
  font-size: 0.95rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(22, 163, 74, 0.25);
}
.dark .count-badge.success { background: rgba(74, 222, 128, 0.2); color: #4ade80; }

.loading-wrap { padding: 40px 0; }

.empty-state {
  text-align: center;
  padding: 80px 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.dark .empty-state { background: #064e3b; }

.empty-state h3 {
  color: #374151;
  margin: 20px 0 12px 0;
  font-size: 1.3rem;
}
.dark .empty-state h3 { color: #d1d5db; }

.sub-hint {
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 24px;
}
.dark .sub-hint { color: #9ca3af; }

.mastered-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.mastered-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(22, 163, 74, 0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}
.dark .mastered-card { background: #064e3b; }
.mastered-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(22, 163, 74, 0.2);
  border-color: #86efac;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  border-bottom: 1px solid #bbf7d0;
}
.dark .card-header { background: #047857; border-color: #059669; }

.card-index {
  font-size: 16px;
  font-weight: 800;
  color: #16a34a;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.attempts-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #15803d;
  background: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 600;
}
.dark .attempts-badge { background: #065f46; color: #86efac; }

.time {
  font-size: 11px;
  color: #9ca3af;
  margin-left: auto;
}

.card-body {
  padding: 20px;
}

.question-section,
.points-section,
.answer-section {
  margin-bottom: 16px;
}

.question-section h4,
.points-section h4,
.answer-section h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #166534;
}
.dark .question-section h4,
.dark .points-section h4,
.dark .answer-section h4 { color: #86efac; }

.question-section p {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: #374151;
}
.dark .question-section p { color: #d1d5db; }

.points-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.answers-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.answer-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: #f0fdf4;
  border-radius: 8px;
  border-left: 3px solid #22c55e;
}
.dark .answer-item { background: #047857; border-color: #10b981; }

.answer-label {
  font-size: 13px;
  font-weight: 600;
  color: #166534;
  min-width: 70px;
}
.dark .answer-label { color: #86efac; }

.answer-content {
  flex: 1;
  font-size: 13px;
  color: #374151;
  font-family: monospace;
}
.dark .answer-content { color: #d1d5db; }

.correct-icon {
  color: #22c55e;
  font-size: 18px;
}

.code-section {
  margin-top: 12px;
}
.code-section summary {
  cursor: pointer;
  font-size: 13px;
  color: #0369a1;
  font-weight: 500;
  padding: 8px 12px;
  background: #f0f9ff;
  border-radius: 6px;
  transition: background 0.2s;
}
.dark .code-section summary { background: #1e3a5f; color: #60a5fa; }
.code-section summary:hover { background: #e0f2fe; }
.dark .code-section summary:hover { background: #172554; }

.code-block {
  margin: 12px 0 0 0;
  padding: 14px;
  background: #1e1e1e;
  color: #d4d4d4;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.5;
  overflow-x: auto;
}

.note-preview {
  padding: 12px 14px;
  background: #f9fafb;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.7;
  color: #4b5563;
  white-space: pre-wrap;
  word-break: break-word;
}
.dark .note-preview { background: #1f2937; color: #d1d5db; }

.note-full {
  margin: 12px 0 0 0;
  padding: 14px;
  background: #1e1e1e;
  color: #d4d4d4;
  border-radius: 8px;
  font-size: 11px;
  line-height: 1.6;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: #fafafa;
  border-top: 1px solid #e5e7eb;
}
.dark .card-footer { background: #042f2e; border-color: #047857; }

.stats {
  font-size: 12px;
  color: #9ca3af;
}

.footer-actions {
  margin-top: 28px;
  text-align: center;
  padding: 20px;
}
</style>
